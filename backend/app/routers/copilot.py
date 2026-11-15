from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.schemas.copilot import CopilotPromptRequest, CopilotResponse
from backend.app.services.copilot_service import execute_copilot_workflow

router = APIRouter(prefix="/copilot", tags=["GenAI Product Copilot"])

@router.post("/generate", response_model=CopilotResponse)
def generate_copilot_insight(req: CopilotPromptRequest, db: Session = Depends(get_db)):
    """
    Executes AI Product Copilot workflows grounded in active platform database records.
    Calls Google Gemini API when GEMINI_API_KEY is present; uses domain intelligence fallback otherwise.
    """
    result = execute_copilot_workflow(
        db=db,
        workflow_type=req.workflow_type or "general_chat",
        prompt=req.prompt,
        record_id=req.record_id,
        context_data=req.context_data
    )
    return result
