"""
Privacy Shield Engine
---------------------
Handles local, edge-based processing of sensitive Guest PII using Ollama (Llama-3).
Crucial for "Celebrity Shield" feature where names never leave the laptop.
"""

import requests
import json
import logging
from typing import Dict, Any

# Configure logging
logger = logging.getLogger(__name__)

# OLLAMA CONFIG
# We assume Ollama is running on localhost:11434
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3:8b-instruct-q4_0"  # Or just 'llama3' depending on pull


class PrivacyShield:
    def __init__(self):
        self.is_active = self._check_connection()

    def _check_connection(self) -> bool:
        """
        Verifies if local Ollama instance is running.
        """
        try:
            # Simple check to tags endpoint usually works to verify service
            # or just assume active if user says so, but let's try a mild ping
            requests.get("http://localhost:11434/", timeout=2)
            return True
        except requests.RequestException:
            logger.warning(
                "Local Ollama instance NOT found. Privacy Shield inactive.")
            return False

    def sanitize_guest_list(self, raw_text: str) -> Dict[str, Any]:
        """
        Uses Local LLM to extract metadata (Diet, VIP Status) while masking Names.
        Returns:
            {
                "sanitized_data": [...],
                "stats": { "vip_count": X, "vegan_count": Y }
            }
        """
        if not self.is_active:
            return {"error": "Privacy Shield Offline. Please run 'ollama serve'."}

        # Prompt Engineering for Sanitization
        prompt = f"""
        You are a Privacy Officer. Analyze this guest list snippet.
        
        Rules:
        1. Extract the 'Role' (Bride Side, Groom Side, VIP) and 'Dietary Preference'.
        2. DO NOT output the specific Names. Replace names with "Guest_ID".
        3. Output ONLY valid JSON in this format:
        [
            {{ "id": "Guest_1", "role": "...", "diet": "..." }},
            ...
        ]

        Guest List:
        {raw_text}
        """

        payload = {
            # Defaulting to generic tag, user mentioned llama3:8b...
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }

        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=60)
            response.raise_for_status()
            result = response.json()

            # Parse the LLM's 'response' field
            sanitized_json = json.loads(result.get("response", "[]"))

            # Calculate Metadata (The logic that can go to cloud)
            vip_count = sum(
                1 for g in sanitized_json if "VIP" in g.get("role", "").upper())
            veg_count = sum(
                1 for g in sanitized_json if "VEG" in g.get("diet", "").upper())

            return {
                "status": "secure",
                "sanitized_data": sanitized_json,
                "metadata": {
                    "total_guests": len(sanitized_json),
                    "vip_count": vip_count,
                    "dietary_stats": {"vegan_vegetarian": veg_count}
                }
            }

        except Exception as e:
            logger.error(f"Privacy Shield Analysis Failed: {e}")
            return {"error": str(e)}


# Test Logic
if __name__ == "__main__":
    shield = PrivacyShield()
    dummy_text = "John Doe (VIP, Vegan), Jane Smith (Bride Side, GF), Elon Musk (Ultra VIP, Paleo)"
    print(shield.sanitize_guest_list(dummy_text))
