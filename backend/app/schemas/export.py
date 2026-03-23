from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from enum import Enum


class ExportTypeEnum(str, Enum):
    json = "json"
    txt = "txt"
    render_plan = "render_plan"


class ExportStatusEnum(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class ExportJobCreate(BaseModel):
    """Schema para criar job de exportação"""

    export_type: ExportTypeEnum


class ExportJobResponse(BaseModel):
    """Schema para resposta de job de exportação"""

    id: UUID
    project_id: UUID
    export_type: str
    status: str
    output_path: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
