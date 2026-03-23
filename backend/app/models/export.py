from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.models.base import Base, GUID


class ExportTypeEnum(str, enum.Enum):
    """Tipos de exportação"""

    json = "json"
    txt = "txt"
    render_plan = "render_plan"


class ExportStatusEnum(str, enum.Enum):
    """Status da exportação"""

    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class ExportJob(Base):
    """Modelo de job de exportação"""

    __tablename__ = "export_jobs"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"), nullable=False)
    export_type = Column(Enum(ExportTypeEnum), nullable=False)
    status = Column(Enum(ExportStatusEnum), default=ExportStatusEnum.pending)
    output_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="export_jobs")

    def __repr__(self):
        return f"<ExportJob(id={self.id}, type={self.export_type}, status={self.status})>"
