import json
import os
from datetime import datetime
from typing import List, Dict, Any

class PregnancyMemory:
    """Handles storing and retrieving pregnancy logs for context-aware responses"""
    
    def __init__(self, data_dir: str = "pregnancy_data"):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
    
    def get_user_file(self, user_id: str) -> str:
        """Get the file path for a user's pregnancy logs"""
        return os.path.join(self.data_dir, f"user_{user_id}.json")
    
    def save_log(self, user_id: str, week: int, daily_log: Dict, user_profile: Dict = None):
        """Save a new pregnancy log entry"""
        file_path = self.get_user_file(user_id)
        
        # Load existing data
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {
                "user_profile": user_profile or {},
                "logs": []
            }
        
        # Add new log entry
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "week": week,
            "daily_log": daily_log
        }
        data["logs"].append(log_entry)
        
        # Update user profile if provided
        if user_profile:
            data["user_profile"].update(user_profile)
        
        # Save back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def get_recent_logs(self, user_id: str, limit: int = 5) -> List[Dict]:
        """Get recent logs for context"""
        file_path = self.get_user_file(user_id)
        
        if not os.path.exists(file_path):
            return []
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Return the most recent logs
        return data["logs"][-limit:] if data["logs"] else []
    
    def get_user_profile(self, user_id: str) -> Dict:
        """Get user profile information"""
        file_path = self.get_user_file(user_id)
        
        if not os.path.exists(file_path):
            return {}
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data.get("user_profile", {})
    
    def get_pregnancy_journey_summary(self, user_id: str) -> str:
        """Generate a summary of the pregnancy journey for AI context"""
        logs = self.get_recent_logs(user_id, limit=10)
        profile = self.get_user_profile(user_id)
        
        if not logs:
            return "This is the user's first log entry."
        
        summary = f"User Profile: {profile}\n\nRecent Pregnancy Journey:\n"
        
        for log in logs:
            week = log["week"]
            daily_log = log["daily_log"]
            timestamp = log["timestamp"][:10]  # Just the date
            
            summary += f"Week {week} ({timestamp}): "
            summary += f"Mood: {daily_log.get('mood', 'N/A')}, "
            summary += f"Energy: {daily_log.get('energy_level', 'N/A')}, "
            summary += f"Symptoms: {daily_log.get('symptoms', [])}, "
            summary += f"Concerns: {daily_log.get('concerns', [])}\n"
        
        return summary
