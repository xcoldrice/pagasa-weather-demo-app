# Weather trends analysis
from sqlalchemy.orm import Session
from app.db.models import ProcessingRun

def summarize_trends(db: Session) -> dict:
    runs = (
        db.query(ProcessingRun)
        .order_by(ProcessingRun.created_at.desc())
        .limit(20)
        .all()
    )

    if not runs:
        return {
            "count": 0,
            "avg_max_value": None,
            "avg_mean_value": None,
            "high_risk_runs": 0,
        }

    avg_max = sum(r.max_value for r in runs) / len(runs)
    avg_mean = sum(r.mean_value for r in runs) / len(runs)
    high_risk = sum(1 for r in runs if r.risk_level in {"high", "critical"})

    return {
        "count": len(runs),
        "avg_max_value": round(avg_max, 2),
        "avg_mean_value": round(avg_mean, 2),
        "high_risk_runs": high_risk,
    }