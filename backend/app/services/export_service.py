"""
EXPORT SERVICE - Exportação de projetos

Formatos suportados:
- JSON: Estrutura completa do projeto (para importação/colaboração)
- TXT: Script formatado para leitura (sem dados técnicos)
- RENDER_PLAN: Plano de renderização com timing (para DaVinci Resolve, Premiere, etc)
"""

import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from dataclasses import asdict


class ExportService:
    """Serviço de exportação de projetos"""

    def export_to_json(self, project_data: Dict[str, Any]) -> str:
        """
        Exporta projeto como JSON estruturado.

        Args:
            project_data: Dict com todos os dados do projeto

        Returns:
            String JSON formatada
        """
        export_data = {
            "metadata": {
                "exported_at": datetime.now().isoformat(),
                "blacktube_version": "0.1.0",
                "export_format": "application/json",
            },
            "project": project_data,
        }

        # Usar indent para legibilidade
        return json.dumps(export_data, indent=2, ensure_ascii=False, default=str)

    def export_to_txt(
        self, project_title: str, script_chapters: List[Dict[str, Any]]
    ) -> str:
        """
        Exporta script como TXT formatado para leitura.

        Args:
            project_title: Título do projeto
            script_chapters: Lista de capítulos com título e conteúdo

        Returns:
            String formatada em TXT
        """
        lines = []

        # Header
        lines.append("=" * 80)
        lines.append(project_title.upper())
        lines.append("=" * 80)
        lines.append(f"\nExportado em: {datetime.now().strftime('%d/%m/%Y às %H:%M')}")
        lines.append("\n")

        # Chapters
        for i, chapter in enumerate(script_chapters, 1):
            lines.append(f"\n{'─' * 80}")
            lines.append(
                f"CAPÍTULO {i}: {chapter.get('title', 'Sem Título').upper()}"
            )
            lines.append(f"{'─' * 80}")

            if chapter.get("chapter_type"):
                lines.append(f"Tipo: {chapter['chapter_type']}")

            if chapter.get("duration_seconds"):
                duration = chapter["duration_seconds"]
                minutes = duration // 60
                seconds = duration % 60
                lines.append(f"Duração: {int(minutes)}m{int(seconds):02d}s")

            if chapter.get("emotional_intensity"):
                lines.append(f"Intensidade Emocional: {chapter['emotional_intensity']}/10")

            lines.append("\n")
            lines.append(chapter.get("content", ""))

            if chapter.get("retention_notes"):
                lines.append(f"\n[Nota de Retenção: {chapter['retention_notes']}]")

        # Footer
        lines.append(f"\n\n{'=' * 80}")
        lines.append("FIM DO SCRIPT")
        lines.append(f"{'=' * 80}")

        return "\n".join(lines)

    def export_to_render_plan(
        self,
        project_title: str,
        chapters: List[Dict[str, Any]],
        assets: Optional[List[Dict[str, Any]]] = None,
        voice_segments: Optional[List[Dict[str, Any]]] = None,
    ) -> str:
        """
        Exporta plano de renderização (timeline + timing).

        Formato compatível com:
        - Adobe Premiere Pro (EDL/XML)
        - DaVinci Resolve
        - Final Cut Pro

        Args:
            project_title: Título do projeto
            chapters: Capítulos com duração
            assets: Assets (vídeos, imagens)
            voice_segments: Segmentos de voz com duração

        Returns:
            String com plano de renderização estruturado
        """
        lines = []

        # Header
        lines.append("RENDER PLAN - " + project_title.upper())
        lines.append("=" * 80)
        lines.append(f"Gerado em: {datetime.now().isoformat()}")
        lines.append(f"Formato: Adobe EDL / DaVinci Resolve")
        lines.append("\n")

        # Timeline
        lines.append("TIMELINE:")
        lines.append("─" * 80)
        lines.append(
            f"{'TC In':<12} {'TC Out':<12} {'Duration':<12} {'Type':<20} {'Reference':<24}"
        )
        lines.append("─" * 80)

        current_time = 0.0
        segment_id = 1

        for chapter in chapters:
            duration = chapter.get("duration_seconds", 0)
            title = chapter.get("title", "Capítulo")
            chapter_type = chapter.get("chapter_type", "segment")

            tc_in = self._seconds_to_timecode(current_time)
            tc_out = self._seconds_to_timecode(current_time + duration)

            lines.append(
                f"{tc_in:<12} {tc_out:<12} {duration:<12.1f} "
                f"{chapter_type:<20} {title[:24]:<24}"
            )

            # Assets neste capítulo
            if assets:
                chapter_assets = [a for a in assets if a.get("chapter_id") == chapter.get("id")]
                for asset in chapter_assets:
                    asset_duration = asset.get("duration_seconds", duration * 0.5)
                    asset_tc_in = self._seconds_to_timecode(current_time)
                    asset_tc_out = self._seconds_to_timecode(current_time + asset_duration)
                    asset_type = asset.get("asset_type", "image")

                    lines.append(
                        f"{asset_tc_in:<12} {asset_tc_out:<12} "
                        f"{asset_duration:<12.1f} {asset_type:<20} "
                        f"[ASSET {segment_id}]"
                    )
                    segment_id += 1

            current_time += duration

        # Voice track
        if voice_segments:
            lines.append("\n")
            lines.append("VOICE TRACK:")
            lines.append("─" * 80)

            for voice in voice_segments:
                voice_duration = voice.get("duration_seconds", 5.0)
                chapter_id = voice.get("chapter_id")
                chapter_title = next(
                    (c.get("title", "?") for c in chapters if c.get("id") == chapter_id),
                    "?",
                )

                lines.append(
                    f"VOICE: '{chapter_title}' ({voice_duration:.1f}s) - "
                    f"Model: {voice.get('voice_model', 'mock')}"
                )

        # Summary
        total_duration = sum(c.get("duration_seconds", 0) for c in chapters)
        lines.append("\n")
        lines.append("SUMMARY:")
        lines.append("─" * 80)
        lines.append(f"Total Duration: {self._seconds_to_timecode(total_duration)}")
        lines.append(f"Total Chapters: {len(chapters)}")
        if assets:
            lines.append(f"Total Assets: {len(assets)}")
        if voice_segments:
            lines.append(f"Voice Segments: {len(voice_segments)}")

        return "\n".join(lines)

    def _seconds_to_timecode(self, seconds: float, fps: int = 30) -> str:
        """
        Converte segundos para timecode HH:MM:SS:FF (frames).

        Args:
            seconds: Tempo em segundos
            fps: Frames per second (default 30)

        Returns:
            String de timecode
        """
        total_frames = int(seconds * fps)
        frames = total_frames % fps
        total_seconds = total_frames // fps

        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        secs = total_seconds % 60

        return f"{int(hours):02d}:{int(minutes):02d}:{int(secs):02d}:{int(frames):02d}"

    def get_export_stats(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calcula estatísticas do projeto para exibição.

        Args:
            project_data: Dict com dados do projeto

        Returns:
            Dict com estatísticas
        """
        chapters = project_data.get("chapters", [])
        assets = project_data.get("assets", [])
        voice_segments = project_data.get("voice_segments", [])

        total_duration = sum(c.get("duration_seconds", 0) for c in chapters)
        total_words = sum(len(c.get("content", "").split()) for c in chapters)

        return {
            "chapter_count": len(chapters),
            "asset_count": len(assets),
            "voice_segment_count": len(voice_segments),
            "total_duration_seconds": total_duration,
            "total_duration_minutes": total_duration / 60,
            "word_count": total_words,
            "avg_words_per_chapter": (
                total_words // len(chapters) if chapters else 0
            ),
            "estimated_reading_time_minutes": total_words / 200,  # ~200 wpm reading
        }
