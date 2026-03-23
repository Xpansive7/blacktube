from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class APISettingsUpsert(BaseModel):
    api_key: str
    is_active: bool = True


class APISettingsResponse(BaseModel):
    service: str
    api_key: str
    is_active: bool
    configured: bool
    source: str
    updated_at: Optional[datetime] = None


class APITestResponse(BaseModel):
    service: str
    ok: bool
    message: str

