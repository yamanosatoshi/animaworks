"""Self-AI diagnostic engine.

Three-layer architecture:
1. Questions → Raw answers (1-5 Likert scale)
2. Answers → Axis scores (6 axes, normalized 0-100)
3. Axis scores → Behavioral profile (actionable AI parameters)
"""

from __future__ import annotations

QUESTION_SET_VERSION = "1.0"

# Six behavioral axes
AXES = [
    {
        "id": "decision_speed",
        "name_ja": "判断速度",
        "name_en": "Decision Speed",
        "low_label": "慎重",
        "high_label": "即断",
        "low_label_en": "Deliberate",
        "high_label_en": "Quick",
    },
    {
        "id": "detail_level",
        "name_ja": "詳細度",
        "name_en": "Detail Level",
        "low_label": "俯瞰",
        "high_label": "詳細",
        "low_label_en": "Big Picture",
        "high_label_en": "Detailed",
    },
    {
        "id": "risk_tolerance",
        "name_ja": "リスク許容",
        "name_en": "Risk Tolerance",
        "low_label": "慎重",
        "high_label": "挑戦的",
        "low_label_en": "Cautious",
        "high_label_en": "Adventurous",
    },
    {
        "id": "communication_style",
        "name_ja": "コミュニケーション",
        "name_en": "Communication Style",
        "low_label": "フォーマル",
        "high_label": "カジュアル",
        "low_label_en": "Formal",
        "high_label_en": "Casual",
    },
    {
        "id": "work_approach",
        "name_ja": "作業アプローチ",
        "name_en": "Work Approach",
        "low_label": "計画的",
        "high_label": "柔軟",
        "low_label_en": "Structured",
        "high_label_en": "Flexible",
    },
    {
        "id": "leadership_style",
        "name_ja": "リーダーシップ",
        "name_en": "Leadership Style",
        "low_label": "指示型",
        "high_label": "協調型",
        "low_label_en": "Directive",
        "high_label_en": "Collaborative",
    },
]

# Question definitions: each maps to an axis with a weight.
# answer 5 = strongly agree (high on axis), 1 = strongly disagree (low on axis)
# reverse=True means answer 5 maps to LOW on the axis.
_QUESTIONS = [
    # --- decision_speed (8 questions) ---
    {"id": "ds01", "axis": "decision_speed", "weight": 1.0, "reverse": False,
     "text_ja": "重要な決定を迫られたとき、直感に従ってすぐ判断する方だ",
     "text_en": "When facing important decisions, I tend to follow my intuition and decide quickly"},
    {"id": "ds02", "axis": "decision_speed", "weight": 1.0, "reverse": True,
     "text_ja": "大事な判断の前には、十分な情報を集めてから結論を出したい",
     "text_en": "Before important decisions, I prefer to gather sufficient information first"},
    {"id": "ds03", "axis": "decision_speed", "weight": 0.8, "reverse": False,
     "text_ja": "会議では、議論が長引く前に結論を出したい",
     "text_en": "In meetings, I prefer to reach conclusions before discussions drag on"},
    {"id": "ds04", "axis": "decision_speed", "weight": 0.8, "reverse": True,
     "text_ja": "一度決めたことでも、新しい情報が入れば再検討する",
     "text_en": "Even after deciding, I reconsider when new information comes in"},
    {"id": "ds05", "axis": "decision_speed", "weight": 0.7, "reverse": False,
     "text_ja": "完璧な計画より、まず動いて修正する方が好きだ",
     "text_en": "I prefer acting first and correcting later over perfect planning"},
    {"id": "ds06", "axis": "decision_speed", "weight": 0.7, "reverse": True,
     "text_ja": "選択肢を比較検討する時間は、たとえ長くなっても必要だ",
     "text_en": "Time spent comparing options is necessary, even if it takes long"},
    {"id": "ds07", "axis": "decision_speed", "weight": 0.6, "reverse": False,
     "text_ja": "60%の確信があれば実行に移す",
     "text_en": "I move forward with 60% confidence"},
    {"id": "ds08", "axis": "decision_speed", "weight": 0.6, "reverse": True,
     "text_ja": "重要な決断は一晩寝かせてから行うことが多い",
     "text_en": "I often sleep on important decisions before acting"},

    # --- detail_level (8 questions) ---
    {"id": "dl01", "axis": "detail_level", "weight": 1.0, "reverse": False,
     "text_ja": "報告書では、具体的な数値やデータを盛り込みたい",
     "text_en": "In reports, I like to include specific numbers and data"},
    {"id": "dl02", "axis": "detail_level", "weight": 1.0, "reverse": True,
     "text_ja": "全体像を把握することが、細部を追うより重要だ",
     "text_en": "Understanding the big picture is more important than tracking details"},
    {"id": "dl03", "axis": "detail_level", "weight": 0.8, "reverse": False,
     "text_ja": "チェックリストや手順書を細かく作る方だ",
     "text_en": "I tend to create detailed checklists and procedures"},
    {"id": "dl04", "axis": "detail_level", "weight": 0.8, "reverse": True,
     "text_ja": "要点だけ伝えれば、あとは相手に任せたい",
     "text_en": "I prefer to convey key points and leave the rest to others"},
    {"id": "dl05", "axis": "detail_level", "weight": 0.7, "reverse": False,
     "text_ja": "プロジェクトの進捗は、タスク単位で細かく管理したい",
     "text_en": "I want to manage project progress at a granular task level"},
    {"id": "dl06", "axis": "detail_level", "weight": 0.7, "reverse": True,
     "text_ja": "概要レベルのマイルストーンで進捗管理すれば十分だ",
     "text_en": "Milestone-level progress tracking is sufficient"},
    {"id": "dl07", "axis": "detail_level", "weight": 0.6, "reverse": False,
     "text_ja": "メールやメッセージは、背景情報も含めて丁寧に書く",
     "text_en": "I write messages thoroughly, including background context"},
    {"id": "dl08", "axis": "detail_level", "weight": 0.6, "reverse": True,
     "text_ja": "コミュニケーションは短く簡潔であるほど良い",
     "text_en": "Communication is better when short and concise"},

    # --- risk_tolerance (8 questions) ---
    {"id": "rt01", "axis": "risk_tolerance", "weight": 1.0, "reverse": False,
     "text_ja": "新しい技術やツールは、実績が少なくても積極的に試したい",
     "text_en": "I actively try new technologies even with limited track records"},
    {"id": "rt02", "axis": "risk_tolerance", "weight": 1.0, "reverse": True,
     "text_ja": "実績のある安定した方法を選ぶことが多い",
     "text_en": "I usually choose proven, stable methods"},
    {"id": "rt03", "axis": "risk_tolerance", "weight": 0.8, "reverse": False,
     "text_ja": "失敗してもそこから学べるなら、挑戦する価値がある",
     "text_en": "Even failure is worthwhile if you can learn from it"},
    {"id": "rt04", "axis": "risk_tolerance", "weight": 0.8, "reverse": True,
     "text_ja": "リスクを最小化する計画を立ててから行動に移す",
     "text_en": "I plan to minimize risks before taking action"},
    {"id": "rt05", "axis": "risk_tolerance", "weight": 0.7, "reverse": False,
     "text_ja": "前例のないプロジェクトにワクワクする",
     "text_en": "I get excited about unprecedented projects"},
    {"id": "rt06", "axis": "risk_tolerance", "weight": 0.7, "reverse": True,
     "text_ja": "不確実性が高い状況では、慎重にステップを踏みたい",
     "text_en": "In uncertain situations, I prefer cautious step-by-step approach"},
    {"id": "rt07", "axis": "risk_tolerance", "weight": 0.6, "reverse": False,
     "text_ja": "「まずやってみよう」が口癖だ",
     "text_en": "'Let's just try it' is my motto"},
    {"id": "rt08", "axis": "risk_tolerance", "weight": 0.6, "reverse": True,
     "text_ja": "大きな変更は、小さなテストで検証してから本番に適用する",
     "text_en": "I validate big changes with small tests before production"},

    # --- communication_style (9 questions) ---
    {"id": "cs01", "axis": "communication_style", "weight": 1.0, "reverse": False,
     "text_ja": "同僚とはフランクに話す方が仕事がはかどる",
     "text_en": "Work goes better when I speak casually with colleagues"},
    {"id": "cs02", "axis": "communication_style", "weight": 1.0, "reverse": True,
     "text_ja": "ビジネスの場では、丁寧な言葉遣いを心がけている",
     "text_en": "I maintain polite language in business settings"},
    {"id": "cs03", "axis": "communication_style", "weight": 0.8, "reverse": False,
     "text_ja": "冗談やユーモアを交えた方が、チームの雰囲気が良くなる",
     "text_en": "Humor improves team atmosphere"},
    {"id": "cs04", "axis": "communication_style", "weight": 0.8, "reverse": True,
     "text_ja": "仕事の連絡は、事実と要件だけを伝えるべきだ",
     "text_en": "Work communications should convey only facts and requirements"},
    {"id": "cs05", "axis": "communication_style", "weight": 0.7, "reverse": False,
     "text_ja": "上司にも率直に意見を言える関係が理想だ",
     "text_en": "I prefer a relationship where I can speak frankly to superiors"},
    {"id": "cs06", "axis": "communication_style", "weight": 0.7, "reverse": True,
     "text_ja": "相手の立場や状況に合わせて、話し方を変える方だ",
     "text_en": "I adjust my communication style based on the other person"},
    {"id": "cs07", "axis": "communication_style", "weight": 0.6, "reverse": False,
     "text_ja": "メッセージでは絵文字や感嘆符を使うことが多い",
     "text_en": "I often use emojis and exclamation marks in messages"},
    {"id": "cs08", "axis": "communication_style", "weight": 0.6, "reverse": True,
     "text_ja": "文書は格式を守って書くことを重視している",
     "text_en": "I value following formal conventions in documents"},
    {"id": "cs09", "axis": "communication_style", "weight": 0.5, "reverse": False,
     "text_ja": "雑談から生まれるアイデアを大切にしている",
     "text_en": "I value ideas that emerge from casual conversations"},

    # --- work_approach (9 questions) ---
    {"id": "wa01", "axis": "work_approach", "weight": 1.0, "reverse": False,
     "text_ja": "状況に応じて計画を柔軟に変更する方だ",
     "text_en": "I flexibly change plans according to the situation"},
    {"id": "wa02", "axis": "work_approach", "weight": 1.0, "reverse": True,
     "text_ja": "一度立てた計画は、できるだけ守りたい",
     "text_en": "I prefer to stick to plans once they are made"},
    {"id": "wa03", "axis": "work_approach", "weight": 0.8, "reverse": False,
     "text_ja": "複数のタスクを同時並行で進めるのが得意だ",
     "text_en": "I'm good at handling multiple tasks simultaneously"},
    {"id": "wa04", "axis": "work_approach", "weight": 0.8, "reverse": True,
     "text_ja": "一つのタスクに集中して完了させてから次に進みたい",
     "text_en": "I prefer completing one task before moving to the next"},
    {"id": "wa05", "axis": "work_approach", "weight": 0.7, "reverse": False,
     "text_ja": "予定外の割り込みにも柔軟に対応できる",
     "text_en": "I can flexibly handle unexpected interruptions"},
    {"id": "wa06", "axis": "work_approach", "weight": 0.7, "reverse": True,
     "text_ja": "毎日のルーティンを決めて、それに従って仕事をする",
     "text_en": "I set daily routines and work according to them"},
    {"id": "wa07", "axis": "work_approach", "weight": 0.6, "reverse": False,
     "text_ja": "締め切りは目安で、品質を優先する",
     "text_en": "Deadlines are guidelines; I prioritize quality"},
    {"id": "wa08", "axis": "work_approach", "weight": 0.6, "reverse": True,
     "text_ja": "スケジュール管理ツールを毎日活用している",
     "text_en": "I use scheduling tools every day"},
    {"id": "wa09", "axis": "work_approach", "weight": 0.5, "reverse": False,
     "text_ja": "プロセスより結果が重要だと思う",
     "text_en": "Results matter more than processes"},

    # --- leadership_style (8 questions) ---
    {"id": "ls01", "axis": "leadership_style", "weight": 1.0, "reverse": False,
     "text_ja": "チームの意見を聞いてから方針を決めたい",
     "text_en": "I want to hear the team's opinions before setting direction"},
    {"id": "ls02", "axis": "leadership_style", "weight": 1.0, "reverse": True,
     "text_ja": "明確な方向性を自分が示すことで、チームが動きやすくなる",
     "text_en": "The team works better when I set a clear direction"},
    {"id": "ls03", "axis": "leadership_style", "weight": 0.8, "reverse": False,
     "text_ja": "メンバーの自主性を尊重し、細かく指示しない",
     "text_en": "I respect members' autonomy and avoid micromanaging"},
    {"id": "ls04", "axis": "leadership_style", "weight": 0.8, "reverse": True,
     "text_ja": "タスクの進め方を具体的に指示する方が成果が出る",
     "text_en": "Giving specific instructions leads to better outcomes"},
    {"id": "ls05", "axis": "leadership_style", "weight": 0.7, "reverse": False,
     "text_ja": "合意形成を大切にし、全員が納得する結論を目指す",
     "text_en": "I value consensus and aim for conclusions everyone agrees with"},
    {"id": "ls06", "axis": "leadership_style", "weight": 0.7, "reverse": True,
     "text_ja": "時にはトップダウンで素早く決断する必要がある",
     "text_en": "Sometimes top-down quick decisions are necessary"},
    {"id": "ls07", "axis": "leadership_style", "weight": 0.6, "reverse": False,
     "text_ja": "1on1ミーティングで個人の意見を丁寧に聞くことが大切だ",
     "text_en": "It's important to carefully listen in 1-on-1 meetings"},
    {"id": "ls08", "axis": "leadership_style", "weight": 0.6, "reverse": True,
     "text_ja": "効率のためには、議論を省略して決定を伝えることもある",
     "text_en": "For efficiency, I sometimes skip discussion and just communicate decisions"},
]

# Total: 8+8+8+9+9+8 = 50 questions


def get_questions() -> list[dict]:
    """Return question list (without internal fields like weight/reverse)."""
    return [
        {
            "id": q["id"],
            "axis": q["axis"],
            "text_ja": q["text_ja"],
            "text_en": q["text_en"],
        }
        for q in _QUESTIONS
    ]


def compute_axis_scores(answers: dict[str, int]) -> dict[str, float]:
    """Compute axis scores (0-100) from raw answers.

    For each axis, weighted average of answers (1-5 Likert, reverse-coded if needed)
    is normalized to 0-100 scale.
    """
    axis_sums: dict[str, float] = {}
    axis_weights: dict[str, float] = {}

    for q in _QUESTIONS:
        qid = q["id"]
        if qid not in answers:
            continue
        raw = answers[qid]
        # Reverse code: 1↔5, 2↔4, 3↔3
        value = (6 - raw) if q["reverse"] else raw
        w = q["weight"]
        axis_sums.setdefault(q["axis"], 0.0)
        axis_weights.setdefault(q["axis"], 0.0)
        axis_sums[q["axis"]] += value * w
        axis_weights[q["axis"]] += w

    scores = {}
    for axis_info in AXES:
        axis_id = axis_info["id"]
        if axis_id in axis_sums and axis_weights[axis_id] > 0:
            # Weighted average (1-5) → normalize to 0-100
            avg = axis_sums[axis_id] / axis_weights[axis_id]
            scores[axis_id] = round((avg - 1) / 4 * 100, 1)
        else:
            scores[axis_id] = 50.0  # default neutral
    return scores


def _score_to_level(score: float) -> str:
    """Map 0-100 score to a qualitative level."""
    if score < 25:
        return "very_low"
    elif score < 40:
        return "low"
    elif score < 60:
        return "moderate"
    elif score < 75:
        return "high"
    else:
        return "very_high"


def generate_behavioral_profile(axis_scores: dict[str, float]) -> dict:
    """Generate behavioral profile from axis scores.

    Maps axis scores to actionable AI behavior parameters.
    """
    ds = axis_scores.get("decision_speed", 50)
    dl = axis_scores.get("detail_level", 50)
    rt = axis_scores.get("risk_tolerance", 50)
    cs = axis_scores.get("communication_style", 50)
    wa = axis_scores.get("work_approach", 50)
    ls = axis_scores.get("leadership_style", 50)

    return {
        # How quickly AI should propose conclusions
        "conclusion_first": ds >= 60,
        # How much detail in explanations
        "explanation_depth": _score_to_level(dl),
        # How many alternatives/risks to present
        "risk_presentation": "proactive" if rt >= 60 else "conservative",
        # Tone of communication
        "tone": "casual" if cs >= 60 else "formal",
        # How structured responses should be
        "response_structure": "flexible" if wa >= 60 else "structured",
        # How much to ask for input vs propose directly
        "proposal_style": "collaborative" if ls >= 60 else "directive",
        # Derived compound parameters
        "suggestion_granularity": _score_to_level(dl),
        "challenge_willingness": _score_to_level(rt),
        "formality_level": _score_to_level(100 - cs),  # inverted
        "planning_emphasis": _score_to_level(100 - wa),  # inverted
        # Raw scores for reference
        "axis_scores": axis_scores,
    }
