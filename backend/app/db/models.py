# Database models
from sqlalchemy import String, Float, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base

class ProcessingRun(Base):
    __tablename__ = "processing_runs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    product_type: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)

    input_url: Mapped[str] = mapped_column(String, nullable=False)
    overlay_url: Mapped[str] = mapped_column(String, nullable=False)
    result_url: Mapped[str] = mapped_column(String, nullable=False)

    min_value: Mapped[float] = mapped_column(Float, nullable=False)
    max_value: Mapped[float] = mapped_column(Float, nullable=False)
    mean_value: Mapped[float] = mapped_column(Float, nullable=False)

    risk_score_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_level: Mapped[str | None] = mapped_column(String, nullable=True)

    insights: Mapped[list | None] = mapped_column(JSON, nullable=True)
    ai_summary: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    processing_version: Mapped[str | None] = mapped_column(String, nullable=True)
    git_sha: Mapped[str | None] = mapped_column(String, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)