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
    youtube_video_id: Optional[str] = None
    youtube_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    channel_title: Optional[str] = None
    channel_id: Optional[str] = None
    channel_subscribers: Optional[int] = None
    published_at: Optional[str] = None
    duration_seconds: Optional[int] = None
    like_count: Optional[int] = None
    comment_count: Optional[int] = None
    views_per_day: Optional[float] = None
    engagement_rate: Optional[float] = None
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
            video_map = self._fetch_video_details(client=client, api_key=api_key, video_ids=video_ids)
            channel_ids = list(
                {
                    item.get("snippet", {}).get("channelId")
                    for item in items
                    if item.get("snippet", {}).get("channelId")
                }
            )
            channel_map = self._fetch_channel_details(client=client, api_key=api_key, channel_ids=channel_ids)

        results: List[MiningResultData] = []
        for item in items:
            video_id = item.get("id", {}).get("videoId")
            snippet = item.get("snippet", {})
            if not video_id or not snippet:
                continue

            video_data = video_map.get(video_id, {})
            stats = video_data.get("statistics", {})
            content_details = video_data.get("contentDetails", {})
            title = snippet.get("title", "Sem titulo")
            description = snippet.get("description") or "Sem descricao fornecida pelo YouTube."
            published_at = snippet.get("publishedAt")
            year = self._extract_year(published_at)
            views = self._safe_int(stats.get("viewCount"))
            comments = self._safe_int(stats.get("commentCount"))
            likes = self._safe_int(stats.get("likeCount"))
            channel_id = snippet.get("channelId")
            channel_data = channel_map.get(channel_id or "", {})
            duration_seconds = self._parse_iso8601_duration_to_seconds(content_details.get("duration"))
            views_per_day = self._calculate_views_per_day(views, published_at)
            engagement_rate = self._calculate_engagement_rate(views, likes, comments)
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = (
                thumbnails.get("high", {}).get("url")
                or thumbnails.get("medium", {}).get("url")
                or thumbnails.get("default", {}).get("url")
            )

            result = MiningResultData(
                title=title,
                year=year,
                synopsis=description[:800],
                tmdb_id=video_id,
                tmdb_rating=None,
                yt_video_count=total_results,
                yt_avg_views=float(views),
                yt_avg_comments=float(comments),
                youtube_video_id=video_id,
                youtube_url=f"https://www.youtube.com/watch?v={video_id}",
                thumbnail_url=thumbnail_url,
                channel_title=snippet.get("channelTitle"),
                channel_id=channel_id,
                channel_subscribers=self._safe_int(channel_data.get("statistics", {}).get("subscriberCount")),
                published_at=published_at,
                duration_seconds=duration_seconds,
                like_count=likes,
                comment_count=comments,
                views_per_day=views_per_day,
                engagement_rate=engagement_rate,
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

    def _fetch_video_details(
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
            stats_map[item["id"]] = item
        return stats_map

    def _fetch_channel_details(
        self,
        client: httpx.Client,
        api_key: str,
        channel_ids: List[str],
    ) -> Dict[str, Dict[str, Any]]:
        if not channel_ids:
            return {}

        params = {
            "key": api_key,
            "id": ",".join(channel_ids),
            "part": "snippet,statistics",
            "maxResults": len(channel_ids),
        }
        response = client.get(f"{self.YOUTUBE_API_BASE}/channels", params=params)
        response.raise_for_status()
        payload = response.json()
        return {item["id"]: item for item in payload.get("items", [])}

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

    @staticmethod
    def _parse_iso8601_duration_to_seconds(duration: Optional[str]) -> int:
        if not duration:
            return 0

        hours = minutes = seconds = 0
        current = ""
        time_part = duration.replace("PT", "")
        for char in time_part:
            if char.isdigit():
                current += char
                continue
            if char == "H":
                hours = int(current or 0)
            elif char == "M":
                minutes = int(current or 0)
            elif char == "S":
                seconds = int(current or 0)
            current = ""
        return hours * 3600 + minutes * 60 + seconds

    @staticmethod
    def _calculate_views_per_day(views: int, published_at: Optional[str]) -> float:
        if not published_at:
            return float(views)
        try:
            published = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            age_days = max((datetime.now(timezone.utc) - published).days, 1)
            return round(views / age_days, 2)
        except ValueError:
            return float(views)

    @staticmethod
    def _calculate_engagement_rate(views: int, likes: int, comments: int) -> float:
        if views <= 0:
            return 0.0
        return round(((likes + comments) / views) * 100, 2)
