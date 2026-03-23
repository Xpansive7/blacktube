"""
MINING SERVICE - Busca real de conteúdo no YouTube.

Esta versão abandona o mock de títulos fixos e usa a YouTube Data API v3
para pesquisar vídeos reais, trazendo título, descrição, data, views e
comentários. O resultado continua no formato esperado pelo frontend.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import httpx

from app.config import get_settings


@dataclass
class MiningResultData:
    """Resultado de mineração estruturado para persistência no banco."""

    title: str
    year: int
    synopsis: str
    tmdb_id: Optional[str] = None
    tmdb_rating: Optional[float] = None
    yt_video_count: Optional[int] = None
    yt_avg_views: Optional[float] = None
    yt_avg_comments: Optional[float] = None
    opportunity_score: float = 0.0
    content_type: str = "youtube"


class MiningService:
    """Busca oportunidades reais no YouTube."""

    YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

    def __init__(self) -> None:
        self.settings = get_settings()

    def search(
        self,
        query: str,
        genre: Optional[str] = None,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
        content_type: Optional[str] = None,
    ) -> List[MiningResultData]:
        """
        Busca vídeos reais no YouTube e converte para o formato do app.

        O filtro `content_type` é mantido por compatibilidade de schema, mas
        a busca agora é orientada por YouTube e não por um catálogo fixo.
        """
        api_key = self.settings.youtube_api_key
        if not api_key:
            raise ValueError(
                "YOUTUBE_API_KEY nao configurada no backend. Adicione a chave para usar a mineracao real."
            )

        search_query = " ".join(
            part.strip()
            for part in [query, genre]
            if part and part.strip()
        )

        with httpx.Client(timeout=20.0) as client:
            search_payload = self._search_youtube(
                client=client,
                query=search_query,
                api_key=api_key,
                year_from=year_from,
                year_to=year_to,
            )
            items = search_payload.get("items", [])
            if not items:
                return []

            total_results = int(search_payload.get("pageInfo", {}).get("totalResults", len(items)))
            video_ids = [
                item.get("id", {}).get("videoId")
                for item in items
                if item.get("id", {}).get("videoId")
            ]
            stats_map = self._fetch_video_statistics(client=client, api_key=api_key, video_ids=video_ids)

        results: List[MiningResultData] = []
        for item in items:
            video_id = item.get("id", {}).get("videoId")
            snippet = item.get("snippet", {})
            if not video_id or not snippet:
                continue

            stats = stats_map.get(video_id, {})
            title = snippet.get("title", "Sem titulo")
            description = snippet.get("description") or "Sem descricao fornecida pelo YouTube."
            published_at = snippet.get("publishedAt")
            year = self._extract_year(published_at)
            views = self._safe_int(stats.get("viewCount"))
            comments = self._safe_int(stats.get("commentCount"))

            result = MiningResultData(
                title=title,
                year=year,
                synopsis=description[:800],
                tmdb_id=video_id,
                tmdb_rating=None,
                yt_video_count=total_results,
                yt_avg_views=float(views),
                yt_avg_comments=float(comments),
                content_type="youtube",
            )
            result.opportunity_score = self.calculate_opportunity_score(
                yt_video_count=total_results,
                yt_avg_views=float(views),
                yt_avg_comments=float(comments),
                published_at=published_at,
            )
            results.append(result)

        results.sort(key=lambda item: item.opportunity_score, reverse=True)
        return results

    def calculate_opportunity_score(
        self,
        tmdb_rating: Optional[float] = None,
        yt_video_count: Optional[int] = None,
        yt_avg_views: Optional[float] = None,
        yt_avg_comments: Optional[float] = None,
        published_at: Optional[str] = None,
    ) -> float:
        """
        Score 0-100 orientado a YouTube.

        Critérios:
        - views: 45%
        - comments: 20%
        - demanda da busca (total de resultados): 20%
        - recência: 15%
        """
        score = 0.0

        views = yt_avg_views or 0.0
        comments = yt_avg_comments or 0.0
        total_results = yt_video_count or 0

        views_score = min((views / 500_000.0) * 100.0, 100.0)
        comments_score = min((comments / 5_000.0) * 100.0, 100.0)
        demand_score = min((total_results / 1_000_000.0) * 100.0, 100.0)

        score += views_score * 0.45
        score += comments_score * 0.20
        score += demand_score * 0.20

        recency_score = 50.0
        if published_at:
            try:
                published = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
                age_days = max((datetime.now(timezone.utc) - published).days, 0)
                if age_days <= 30:
                    recency_score = 100.0
                elif age_days <= 180:
                    recency_score = 80.0
                elif age_days <= 365:
                    recency_score = 65.0
                elif age_days <= 730:
                    recency_score = 50.0
                else:
                    recency_score = 35.0
            except ValueError:
                recency_score = 50.0

        score += recency_score * 0.15
        return min(round(score, 2), 100.0)

    def _search_youtube(
        self,
        client: httpx.Client,
        query: str,
        api_key: str,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
    ) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "key": api_key,
            "q": query,
            "part": "snippet",
            "type": "video",
            "order": "viewCount",
            "maxResults": 12,
            "regionCode": "BR",
            "relevanceLanguage": "pt",
            "safeSearch": "none",
        }

        if year_from:
            params["publishedAfter"] = f"{year_from}-01-01T00:00:00Z"
        if year_to:
            params["publishedBefore"] = f"{year_to}-12-31T23:59:59Z"

        response = client.get(f"{self.YOUTUBE_API_BASE}/search", params=params)
        response.raise_for_status()
        return response.json()

    def _fetch_video_statistics(
        self,
        client: httpx.Client,
        api_key: str,
        video_ids: List[str],
    ) -> Dict[str, Dict[str, Any]]:
        if not video_ids:
            return {}

        params = {
            "key": api_key,
            "id": ",".join(video_ids),
            "part": "statistics,contentDetails,snippet",
            "maxResults": len(video_ids),
        }
        response = client.get(f"{self.YOUTUBE_API_BASE}/videos", params=params)
        response.raise_for_status()
        payload = response.json()

        stats_map: Dict[str, Dict[str, Any]] = {}
        for item in payload.get("items", []):
            stats_map[item["id"]] = item.get("statistics", {})
        return stats_map

    @staticmethod
    def _extract_year(published_at: Optional[str]) -> int:
        if not published_at:
            return datetime.now().year
        try:
            return datetime.fromisoformat(published_at.replace("Z", "+00:00")).year
        except ValueError:
            return datetime.now().year

    @staticmethod
    def _safe_int(value: Any) -> int:
        try:
            return int(value or 0)
        except (TypeError, ValueError):
            return 0
