"""
NARRATIVE ENGINE - O CORAÇÃO DO BLACKTUBE

Implementa estruturas narrativas baseadas em:
- Schwartz Awareness Levels (consciência do público)
- Kahneman (emoção antes de lógica)
- Estrutura Universal de Retenção
- Regras de Linguagem (tensão, contraste, identidade)
- Controle de Frame (revela, não explica)
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum


@dataclass
class NarrativeChapter:
    """Capítulo da narrativa gerada"""

    title: str
    content: str
    chapter_type: str
    emotional_intensity: int  # 1-10
    duration_seconds: int
    retention_notes: str


@dataclass
class NarrativeOutput:
    """Output completo da narrativa"""

    hook: str
    intro: str
    chapters: List[NarrativeChapter]
    conclusion: str
    cta: str
    metadata: Dict[str, Any]


class NarrativeMode(str, Enum):
    """9 modos narrativos diferentes"""

    PADRAO = "padrao"  # Equilibrado, educativo
    RETENCAO_MAXIMA = "retencao_maxima"  # Máxima retenção, gancho a cada 30s
    INVESTIGATIVO = "investigativo"  # Mistério, investigação, revelação
    PSICOLOGICO = "psicologico"  # Exploração psicológica, compreensão interna
    FILOSOFICO = "filosofico"  # Questões existenciais, reflexão profunda
    ANALISE_PODER = "analise_poder"  # Dinâmica de poder, estruturas sociais
    TEORIA = "teoria"  # Construção de framework, lógica sistemática
    EXPLICADO_SIMPLES = "explicado_simples"  # Simplificação, accessibility
    AUTORIDADE = "autoridade"  # Posicionamento de especialista


class AwarenessLevel(str, Enum):
    """Schwartz Awareness Levels"""

    UNAWARE = "unaware"  # Não sabe que tem um problema
    PROBLEM_AWARE = "problem_aware"  # Sabe do problema
    SOLUTION_AWARE = "solution_aware"  # Conhece soluções genéricas
    PRODUCT_AWARE = "product_aware"  # Conhece alternativas


class NarrativeEngine:
    """Motor narrativo central do BlackTube"""

    # Templates base para cada modo
    NARRATIVE_CONFIGS = {
        NarrativeMode.PADRAO: {
            "hook_style": "curiosidade moderada",
            "hook_length": 15,
            "intro_agitation": "média",
            "chapters_count": 5,
            "rhythm": "equilibrado",
            "emotional_curve": [2, 4, 6, 8, 9],
            "tone": "educativo, respeitoso",
            "contrasts": 3,
        },
        NarrativeMode.RETENCAO_MAXIMA: {
            "hook_style": "choque emocional",
            "hook_length": 10,
            "intro_agitation": "alta",
            "chapters_count": 7,
            "rhythm": "rapido, pulsos de tensão a cada 30s",
            "emotional_curve": [3, 5, 7, 9, 10, 8, 6],
            "tone": "urgente, visceral",
            "contrasts": 7,
            "pattern": "problema -> agitação extrema -> revelação -> solução -> nova tensão",
        },
        NarrativeMode.INVESTIGATIVO: {
            "hook_style": "mistério, pista inicial",
            "hook_length": 20,
            "intro_agitation": "construção lenta",
            "chapters_count": 6,
            "rhythm": "mistério -> pistas -> crescendo -> revelação",
            "emotional_curve": [3, 4, 5, 7, 9, 10],
            "tone": "investigativo, suspeita",
            "contrasts": 5,
            "pattern": "pergunta -> evidências -> conexões ocultas -> verdade",
        },
        NarrativeMode.PSICOLOGICO: {
            "hook_style": "intriga psicológica",
            "hook_length": 25,
            "intro_agitation": "exploração interna",
            "chapters_count": 5,
            "rhythm": "profundo, reflexivo",
            "emotional_curve": [4, 6, 7, 8, 9],
            "tone": "introspectivo, vulnerável",
            "contrasts": 4,
            "pattern": "motivação -> conflito interno -> compreensão -> transformação",
        },
        NarrativeMode.FILOSOFICO: {
            "hook_style": "questão existencial",
            "hook_length": 20,
            "intro_agitation": "intelectual",
            "chapters_count": 5,
            "rhythm": "meditativo",
            "emotional_curve": [2, 4, 5, 6, 7],
            "tone": "contemplativo, profundo",
            "contrasts": 3,
            "pattern": "pergunta fundamental -> exploração de perspectivas -> síntese",
        },
        NarrativeMode.ANALISE_PODER: {
            "hook_style": "dinamica de poder exposta",
            "hook_length": 15,
            "intro_agitation": "alta (indignação)",
            "chapters_count": 6,
            "rhythm": "estruturado, lógico",
            "emotional_curve": [5, 6, 7, 8, 9, 9],
            "tone": "analítico, crítico",
            "contrasts": 6,
            "pattern": "estrutura visível -> dinâmica oculta -> consequências -> alternativas",
        },
        NarrativeMode.TEORIA: {
            "hook_style": "framework intrigante",
            "hook_length": 20,
            "intro_agitation": "construção intelectual",
            "chapters_count": 5,
            "rhythm": "lógico, progressivo",
            "emotional_curve": [2, 4, 6, 7, 8],
            "tone": "acadêmico, sistemático",
            "contrasts": 4,
            "pattern": "fundação -> construção -> aplicação -> implicações",
        },
        NarrativeMode.EXPLICADO_SIMPLES: {
            "hook_style": "simplicidade reveladora",
            "hook_length": 15,
            "intro_agitation": "claridade",
            "chapters_count": 4,
            "rhythm": "direto, progressivo",
            "emotional_curve": [2, 4, 6, 8],
            "tone": "acessível, amigável",
            "contrasts": 2,
            "pattern": "o que é -> por que importa -> como funciona -> conclusão",
        },
        NarrativeMode.AUTORIDADE: {
            "hook_style": "afirmação de expertise",
            "hook_length": 15,
            "intro_agitation": "confiança",
            "chapters_count": 5,
            "rhythm": "assertivo",
            "emotional_curve": [3, 5, 7, 8, 9],
            "tone": "confiante, especialista",
            "contrasts": 4,
            "pattern": "problema comum -> verdade não dita -> solução especialista -> validação",
        },
    }

    # Templates por nível de consciência (Schwartz)
    AWARENESS_HOOKS = {
        AwarenessLevel.UNAWARE: {
            "pattern": "Estado normal > Incômodo silencioso > Revelação > Agitação",
            "example_start": "Você faz isso toda vez sem perceber...",
            "tactic": "Identificar o problema como óbvio uma vez revelado",
        },
        AwarenessLevel.PROBLEM_AWARE: {
            "pattern": "Reconhecer frustraçõs conhecidas > Aprofundar > Causa Real > Solução",
            "example_start": "Você já sentiu isso... agora vamos entender por quê.",
            "tactic": "Validar, aprofundar, achar causa raiz",
        },
        AwarenessLevel.SOLUTION_AWARE: {
            "pattern": "Problema > Soluções genéricas fracassaram > Por quê > Nossa abordagem",
            "example_start": "Você provavelmente tentou X e Y... mas aqui está o que realmente funciona.",
            "tactic": "Descredibilizar alternativas, posicionar diferença",
        },
        AwarenessLevel.PRODUCT_AWARE: {
            "pattern": "Comparação direta > Vantagens específicas > Proof > Call to action",
            "example_start": "Você conhece A, B, e C... mas ninguém faz assim.",
            "tactic": "Diferenciação clara, authority, social proof",
        },
    }

    def generate_narrative(
        self,
        theme: str,
        narrative_mode: NarrativeMode,
        awareness_level: AwarenessLevel,
        target_duration_minutes: int,
    ) -> NarrativeOutput:
        """
        Gera narrativa completa baseada em parâmetros.

        Args:
            theme: Tema/título (ex: "The Psychology of Manipulation")
            narrative_mode: Modo narrativo (9 variações)
            awareness_level: Nível de consciência do público (Schwartz)
            target_duration_minutes: Duração alvo em minutos

        Returns:
            NarrativeOutput com hook, intro, chapters, conclusão e CTA
        """
        config = self.NARRATIVE_CONFIGS[narrative_mode]
        awareness_config = self.AWARENESS_HOOKS[awareness_level]

        # 1. GERAR HOOK
        hook = self._generate_hook(
            theme, narrative_mode, awareness_level, awareness_config
        )

        # 2. GERAR INTRO
        intro = self._generate_intro(
            theme, narrative_mode, awareness_level, awareness_config, config
        )

        # 3. GERAR CHAPTERS
        chapters_count = config["chapters_count"]
        target_duration_seconds = target_duration_minutes * 60
        seconds_per_chapter = (target_duration_seconds - 60) // chapters_count

        chapters = self._generate_chapters(
            theme, chapters_count, narrative_mode, config, seconds_per_chapter
        )

        # 4. GERAR CONCLUSÃO
        conclusion = self._generate_conclusion(theme, narrative_mode, config)

        # 5. GERAR CTA
        cta = self._generate_cta(theme, awareness_level)

        # 6. COMPILAR METADATA
        total_duration = 60 + (seconds_per_chapter * chapters_count)
        word_count = (
            len(hook.split())
            + len(intro.split())
            + sum(len(c.content.split()) for c in chapters)
            + len(conclusion.split())
            + len(cta.split())
        )

        metadata = {
            "theme": theme,
            "narrative_mode": narrative_mode.value,
            "awareness_level": awareness_level.value,
            "total_duration_seconds": total_duration,
            "word_count": word_count,
            "chapters_count": len(chapters),
            "retention_pattern": config.get("pattern", ""),
            "emotional_curve": config["emotional_curve"],
        }

        return NarrativeOutput(
            hook=hook,
            intro=intro,
            chapters=chapters,
            conclusion=conclusion,
            cta=cta,
            metadata=metadata,
        )

    def _generate_hook(
        self,
        theme: str,
        narrative_mode: NarrativeMode,
        awareness_level: AwarenessLevel,
        awareness_config: Dict[str, Any],
    ) -> str:
        """Gera hook inicial (primeiros 10-25 segundos)"""
        config = self.NARRATIVE_CONFIGS[narrative_mode]

        # Mapear modo para tom específico
        mode_hooks = {
            NarrativeMode.PADRAO: f"Há um padrão em '{theme}' que você provavelmente não percebeu. E uma vez que você vê, muda tudo.",
            NarrativeMode.RETENCAO_MAXIMA: f"Tudo que você sabe sobre '{theme}' está errado. E vou provar em 60 segundos.",
            NarrativeMode.INVESTIGATIVO: f"A verdade sobre '{theme}' foi enterrada. Aqui está o que descobri.",
            NarrativeMode.PSICOLOGICO: f"'{theme}' revela algo profundo sobre quem você é. Vamos explorar isso junto.",
            NarrativeMode.FILOSOFICO: f"Existe uma questão fundamental em '{theme}' que poucos fazem: e se estivéssemos errados?",
            NarrativeMode.ANALISE_PODER: f"'{theme}' é controlado por dinâmicas de poder que ninguém fala. Vou mostrar como.",
            NarrativeMode.TEORIA: f"Existe um framework que explica '{theme}' completamente. É elegante e mudará sua perspectiva.",
            NarrativeMode.EXPLICADO_SIMPLES: f"'{theme}' parece complexo, mas aqui está a verdade simples.",
            NarrativeMode.AUTORIDADE: f"Sobre '{theme}': a maioria das pessoas está fazendo errado. Eu vou mostrar o caminho correto.",
        }

        hook = mode_hooks.get(
            narrative_mode,
            f"Você pensava que entendia '{theme}'. Você não entende.",
        )

        return hook

    def _generate_intro(
        self,
        theme: str,
        narrative_mode: NarrativeMode,
        awareness_level: AwarenessLevel,
        awareness_config: Dict[str, Any],
        config: Dict[str, Any],
    ) -> str:
        """Gera introdução (agitação + setup)"""

        # Estrutura universal: problema > agitação > causa real
        problem_statement = f"O problema com '{theme}' é que a maioria das pessoas o vê de forma superficial."

        agitation_level = config["intro_agitation"]

        if agitation_level == "alta":
            agitation = "E isso custa caro. Em tempo, em oportunidade, em confiança."
        elif agitation_level == "média":
            agitation = "Isso limita sua compreensão e suas opções."
        elif agitation_level == "construção lenta":
            agitation = "Vamos desvendar as camadas juntos."
        else:
            agitation = "Mas há mais a descobrir aqui."

        real_cause = f"A causa raiz? A maioria não foi exposta à verdadeira estrutura de '{theme}'."

        intro = f"{problem_statement} {agitation} {real_cause}"

        return intro

    def _generate_chapters(
        self,
        theme: str,
        count: int,
        narrative_mode: NarrativeMode,
        config: Dict[str, Any],
        duration_per_chapter: int,
    ) -> List[NarrativeChapter]:
        """Gera sequência de capítulos estruturados"""

        chapters = []
        emotional_curve = config["emotional_curve"]

        chapter_types = ["development", "development", "climax", "resolution"]
        if count > 4:
            chapter_types.extend(["climax"] * (count - 4))

        templates = {
            NarrativeMode.RETENCAO_MAXIMA: [
                {
                    "title": "A Superfície",
                    "content": f"O que todos sabem sobre '{theme}'...",
                    "retention": "Iniciar com consenso falso para descredibilizar",
                },
                {
                    "title": "A Fissura",
                    "content": "Aqui é onde a narrativa convencional quebra.",
                    "retention": "Introduzir anomalia, contradição",
                },
                {
                    "title": "A Investigação",
                    "content": f"Quando você aprofunda em '{theme}', encontra...",
                    "retention": "Revelar evidências, construir casos",
                },
                {
                    "title": "O Padrão",
                    "content": "Todos os dados apontam para uma estrutura única.",
                    "retention": "Síntese, framework emergente",
                },
                {
                    "title": "As Implicações",
                    "content": "Se isso é verdade, então tudo muda.",
                    "retention": "Expandir significado além do tema",
                },
                {
                    "title": "A Comprovação",
                    "content": "Aqui estão os casos que provam isso.",
                    "retention": "Social proof, exemplos reais",
                },
                {
                    "title": "O Próximo Passo",
                    "content": "Agora que você sabe, pode agir diferentemente.",
                    "retention": "Agency, call to action embrionário",
                },
            ],
            NarrativeMode.INVESTIGATIVO: [
                {
                    "title": "A Pergunta",
                    "content": f"Por que '{theme}' é como é?",
                    "retention": "Criar curiosidade, propor enigma",
                },
                {
                    "title": "Pista 1",
                    "content": "O primeiro indício aponta para...",
                    "retention": "Desenvolver mistério",
                },
                {
                    "title": "Pista 2",
                    "content": "Mas isso contradiz com...",
                    "retention": "Aumentar tensão, complexidade",
                },
                {
                    "title": "A Conexão",
                    "content": "Quando conectamos os pontos...",
                    "retention": "Convergência, crescendo",
                },
                {
                    "title": "A Verdade",
                    "content": "A resposta foi sempre essa.",
                    "retention": "Revelação, catarse",
                },
                {
                    "title": "A Significância",
                    "content": "E isso significa que...",
                    "retention": "Aplicação, impacto",
                },
            ],
        }

        # Usar template apropriado ou criar dinâmico
        if narrative_mode in templates and len(templates[narrative_mode]) >= count:
            template_chapters = templates[narrative_mode][:count]
        else:
            template_chapters = self._create_generic_chapters(theme, count)

        for i, template in enumerate(template_chapters):
            emotional_intensity = (
                emotional_curve[i] if i < len(emotional_curve) else emotional_curve[-1]
            )
            chapter = NarrativeChapter(
                title=template["title"],
                content=template["content"],
                chapter_type=chapter_types[i] if i < len(chapter_types) else "development",
                emotional_intensity=emotional_intensity,
                duration_seconds=duration_per_chapter,
                retention_notes=template.get("retention", ""),
            )
            chapters.append(chapter)

        return chapters

    def _create_generic_chapters(self, theme: str, count: int) -> List[Dict[str, str]]:
        """Cria capítulos genéricos se template não existir"""
        chapters = []
        for i in range(count):
            chapter = {
                "title": f"Capítulo {i + 1}: {theme}",
                "content": f"Exploração do aspecto {i + 1} de '{theme}'.",
                "retention": "Desenvolver tema principal",
            }
            chapters.append(chapter)
        return chapters

    def _generate_conclusion(
        self, theme: str, narrative_mode: NarrativeMode, config: Dict[str, Any]
    ) -> str:
        """Gera conclusão que amarra tudo"""
        conclusions = {
            NarrativeMode.RETENCAO_MAXIMA: f"'{theme}' não é o que parecia. Agora você sabe. O que faz com isso?",
            NarrativeMode.INVESTIGATIVO: f"Essa é a verdade sobre '{theme}'. Não pode ser ignorada.",
            NarrativeMode.PSICOLOGICO: f"'{theme}' revela quem somos. E isso é libertador.",
            NarrativeMode.FILOSOFICO: f"Talvez a questão sobre '{theme}' seja mais importante que a resposta.",
            NarrativeMode.ANALISE_PODER: f"As estruturas de poder em '{theme}' podem ser questionadas e mudadas.",
            NarrativeMode.TEORIA: f"Esse framework muda como você entende '{theme}'.",
            NarrativeMode.EXPLICADO_SIMPLES: f"'{theme}' é mais simples do que parecia. E mais importante.",
            NarrativeMode.AUTORIDADE: f"A verdade sobre '{theme}' é clara para quem sabe onde procurar.",
            NarrativeMode.PADRAO: f"'{theme}' agora faz sentido. Um sentido diferente do que você pensava.",
        }
        return conclusions.get(
            narrative_mode, f"Essa é a verdade sobre '{theme}'. O resto é contexto."
        )

    def _generate_cta(
        self, theme: str, awareness_level: AwarenessLevel
    ) -> str:
        """Gera Call-to-Action apropriado ao nível de consciência"""
        ctas = {
            AwarenessLevel.UNAWARE: "Compartilhe isso com alguém que precisa ver isso.",
            AwarenessLevel.PROBLEM_AWARE: "Agora que você entende, qual é seu próximo passo?",
            AwarenessLevel.SOLUTION_AWARE: "Você já sabe o que precisa fazer. A questão é: vai fazer?",
            AwarenessLevel.PRODUCT_AWARE: "Esse é o caminho. Vamos começar?",
        }
        return ctas.get(
            awareness_level,
            "Você já sabe o que fazer. A questão é quando.",
        )
