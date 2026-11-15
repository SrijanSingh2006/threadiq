from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class CopilotPromptRequest(BaseModel):
    prompt: str
    workflow_type: Optional[str] = "general_chat" 
    # Workflow types:
    # 1. feedback_summarisation
    # 2. customer_pain_point_extraction
    # 3. sentiment_and_theme_analysis
    # 4. research_synthesis
    # 5. problem_statement_generation
    # 6. product_hypothesis_suggestions
    # 7. product_solution_comparison
    # 8. user_story_generation
    # 9. acceptance_criteria_suggestions
    # 10. kpi_recommendation
    # 11. experiment_plan_generation
    # 12. experiment_report_summarisation
    # 13. rice_prioritisation_suggestions
    # 14. release_note_generation
    # 15. business_language_friction_explanation
    # 16. product_opportunity_recommendations
    record_id: Optional[str] = None
    context_data: Optional[Dict[str, Any]] = None

class CopilotResponse(BaseModel):
    workflow_type: str
    title: str
    summary_markdown: str
    actionable_items: List[str] = []
    source_records_cited: List[str] = []
    engine_mode: str # "Google Gemini API (Live)" or "Deterministic Domain Intelligence (Demo Fallback)"
    model_name: str
    confidence_note: str
