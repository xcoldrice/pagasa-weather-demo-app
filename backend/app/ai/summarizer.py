# AI summarizer for weather insights
def summarize_result_with_ai(result: dict) -> dict:
    risk = result.get("risk_score", {}).get("level", "unknown")
    product_type = result["product_type"]

    if product_type == "rainfall":
        return {
            "executive_summary": f"{risk.title()} rainfall conditions detected based on extracted map values.",
            "key_risks": [
                "Localized flooding in vulnerable zones",
                "Transport disruption in heavily affected areas"
            ],
            "recommended_actions": [
                "Increase local monitoring frequency",
                "Prepare contingency communication",
                "Review flood response readiness"
            ],
            "plain_language_summary": "Rainfall conditions may affect some areas, so local teams should stay alert."
        }

    return {
        "executive_summary": f"{risk.title()} temperature conditions detected based on extracted map values.",
        "key_risks": [
            "Heat stress in exposed populations",
            "Operational discomfort for field activities"
        ],
        "recommended_actions": [
            "Encourage hydration and heat precautions",
            "Review schedules for outdoor work",
            "Continue weather monitoring"
        ],
        "plain_language_summary": "Warmer conditions were detected, so precautions may be needed in affected areas."
    }