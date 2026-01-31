"""
GROWTH ENGINE: The Viral Loop
-----------------------------
Manages the 'Agent Referral' system to create network effects.
"""

import logging
import uuid
from typing import Optional, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock database connection for growth metrics
# In production, this would update the 'agents' table
MOCK_AGENT_DB = {}


class ViralLoopEngine:
    def __init__(self):
        self.REFERRAL_OVERRIDE_PERCENT = 0.5  # 0.5% Commission Override

    def generate_referral_footer(self, agent_id: str, agent_name: str) -> str:
        """
        Generates the standard HTML footer for Guest Vouchers.
        """
        referral_link = f"https://ancile.app/become-agent?ref={agent_id}"

        footer_html = f"""
        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-family: sans-serif; color: #666;">
            <p>Your trip is managed by <strong>{agent_name}</strong> using Project Ancile.</p>
            <p style="font-size: 12px;">
                Planning your own group trip? 
                <a href="{referral_link}" style="color: #007bff; text-decoration: none;">Launch your business with Ancile.</a>
            </p>
        </div>
        """
        return footer_html

    def track_conversion(self, new_agent_id: str, referrer_agent_id: str):
        """
        Links a new agent to their referrer for the override commission.
        """
        # Logic:
        # 1. Update New Agent's profile with 'referred_by = referrer_agent_id'
        # 2. Add 'network_volume' tracking for Referrer

        logger.info("VIRAL GROWTH: Agent %s successfully referred Agent %s",
                    referrer_agent_id, new_agent_id)

        # SQL equivalent:
        # UPDATE agents SET referred_by = referrer_agent_id WHERE id = new_agent_id;
        return True

    def calculate_override(self, referrer_id: str, new_agent_volume: float) -> float:
        """
        Calculates the passive income for the referrer based on the sub-agent's volume.
        """
        override_amount = (new_agent_volume *
                           self.REFERRAL_OVERRIDE_PERCENT) / 100
        logger.info("Commission Override: Agent %s earned $%0.2f from downstream volume.",
                    referrer_id, override_amount)
        return override_amount


# Example Usage logic
if __name__ == "__main__":
    growth = ViralLoopEngine()

    # 1. Generate Footer
    aid = str(uuid.uuid4())
    print("\n--- Email Footer ---")
    print(growth.generate_referral_footer(aid, "Sarah Smith Travel"))

    # 2. Track Conversion
    new_aid = str(uuid.uuid4())
    growth.track_conversion(new_aid, aid)

    # 3. Calc Revenue
    # $50k volume -> $250 passive income
    growth.calculate_override(aid, 50000.00)
