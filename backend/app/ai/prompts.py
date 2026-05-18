# AI prompts for weather data analysis
def build_summary_prompt(result: dict) -> str:
    return f"""
You are a weather decision-support assistant.

Summarize this processed weather result:
- Product type: {result["product_type"]}
- Min value: {result["summary"]["min_value"]}
- Max value: {result["summary"]["max_value"]}
- Mean value: {result["summary"]["mean_value"]}
- Risk score: {result.get("risk_score", {})}
- Insights: {result.get("insights", [])}

Return:
1. executive_summary
2. key_risks
3. recommended_actions
4. plain_language_summary
"""