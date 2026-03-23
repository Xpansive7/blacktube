from typing import Dict

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.api_settings import APISettings
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.api_settings import (
    APISettingsResponse,
    APISettingsUpsert,
    APITestResponse,
)

router = APIRouter(prefix="/settings", tags=["settings"])

SUPPORTED_SERVICES = {
    "tmdb": "tmdb_api_key",
    "youtube": "youtube_api_key",
    "pexels": "pexels_api_key",
    "openai": "openai_api_key",
    "elevenlabs": "elevenlabs_api_key",
}


def _validate_service(service: str) -> str:
    service_key = service.lower().strip()
    if service_key not in SUPPORTED_SERVICES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Servico de API nao suportado",
        )
    return service_key


def _get_env_value(service: str, settings) -> str:
    return getattr(settings, SUPPORTED_SERVICES[service], "") or ""


def _serialize_setting(service: str, db_setting: APISettings | None, settings) -> APISettingsResponse:
    env_value = _get_env_value(service, settings)
    stored_value = db_setting.api_key if db_setting else ""
    value = stored_value or env_value
    source = "user" if stored_value else ("env" if env_value else "unset")

    return APISettingsResponse(
        service=service,
        api_key=value,
        is_active=db_setting.is_active if db_setting else bool(value),
        configured=bool(value),
        source=source,
        updated_at=db_setting.updated_at if db_setting else None,
    )


@router.get("/apis")
def list_api_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings=Depends(get_settings),
) -> Dict[str, APISettingsResponse]:
    records = (
        db.query(APISettings)
        .filter(APISettings.user_id == current_user.id)
        .all()
    )
    by_service = {record.service: record for record in records}

    return {
        service: _serialize_setting(service, by_service.get(service), settings)
        for service in SUPPORTED_SERVICES
    }


@router.put("/apis/{service}", response_model=APISettingsResponse)
def upsert_api_setting(
    service: str,
    payload: APISettingsUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings=Depends(get_settings),
):
    service = _validate_service(service)

    record = (
        db.query(APISettings)
        .filter(
            APISettings.user_id == current_user.id,
            APISettings.service == service,
        )
        .first()
    )

    if record is None:
        record = APISettings(
            user_id=current_user.id,
            service=service,
            api_key=payload.api_key.strip(),
            is_active=payload.is_active,
        )
        db.add(record)
    else:
        record.api_key = payload.api_key.strip()
        record.is_active = payload.is_active

    db.commit()
    db.refresh(record)
    return _serialize_setting(service, record, settings)


@router.post("/apis/{service}/test", response_model=APITestResponse)
async def test_api_setting(
    service: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    settings=Depends(get_settings),
):
    service = _validate_service(service)

    record = (
        db.query(APISettings)
        .filter(
            APISettings.user_id == current_user.id,
            APISettings.service == service,
        )
        .first()
    )

    api_key = (record.api_key if record else "") or _get_env_value(service, settings)
    if not api_key:
        return APITestResponse(
            service=service,
            ok=False,
            message="API key nao configurada",
        )

    if service != "pexels":
        return APITestResponse(
            service=service,
            ok=True,
            message="API key salva. Teste remoto ainda nao implementado para este servico.",
        )

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                "https://api.pexels.com/v1/search",
                headers={"Authorization": api_key},
                params={"query": "cinematic", "per_page": 1},
            )

        if response.status_code != 200:
            return APITestResponse(
                service=service,
                ok=False,
                message=f"Pexels retornou status {response.status_code}",
            )

        data = response.json()
        total_results = data.get("total_results", 0)
        return APITestResponse(
            service=service,
            ok=True,
            message=f"Conexao com Pexels OK. {total_results} resultados encontrados.",
        )
    except Exception as exc:
        return APITestResponse(
            service=service,
            ok=False,
            message=f"Falha ao testar Pexels: {exc}",
        )

