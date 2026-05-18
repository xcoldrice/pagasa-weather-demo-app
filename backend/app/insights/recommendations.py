# Weather recommendations
def generate_recommendations(result: dict) -> list[dict]:
    product_type = result["product_type"]
    max_value = result["summary"]["max_value"]
    mean_value = result["summary"]["mean_value"]

    recommendations = []

    if product_type == "rainfall":
        if max_value >= 100:
            recommendations.append({
                "level": "high",
                "title": "Flood preparedness",
                "message": "Review low-lying and flood-prone areas and increase monitoring."
            })
        if mean_value >= 50:
            recommendations.append({
                "level": "medium",
                "title": "Area-wide monitoring",
                "message": "Consider issuing readiness notices for affected local operations teams."
            })

    if product_type == "temperature":
        if max_value >= 35:
            recommendations.append({
                "level": "high",
                "title": "Heat stress advisory",
                "message": "Advise caution for prolonged outdoor exposure, especially at peak daytime hours."
            })
        if mean_value >= 32:
            recommendations.append({
                "level": "medium",
                "title": "Operational scheduling review",
                "message": "Consider adjusting field schedules or work-rest intervals in hotter zones."
            })

    if not recommendations:
        recommendations.append({
            "level": "low",
            "title": "Normal monitoring",
            "message": "No major immediate concern inferred from the extracted data."
        })

    return recommendations