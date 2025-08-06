def check_symptoms(symptoms):
    risky_symptoms = ['heavy bleeding', 'blurred vision', 'severe abdominal pain', 'high fever']
    alerts = [sym for sym in symptoms if sym.lower() in risky_symptoms]
    
    if alerts:
        return {
            "status": "alert",
            "message": "Potentially dangerous symptoms detected.",
            "symptoms": alerts
        }
    return {
        "status": "normal",
        "message": "No risky symptoms detected.",
        "symptoms": symptoms
    }
