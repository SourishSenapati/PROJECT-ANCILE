"""
TBO Holidays API Wrapper
------------------------
Provides a robust client for interacting with the TBO Hotel API, handling
authentication token caching and request timeouts.
"""

import logging
import time

import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TBOClient:
    """
    Wrapper for TBO Holidays Hotel API with token caching.
    """
    # Updated Base URLs based on Staging Credentials provided by User
    # Authentication often happens on SharedData.svc
    # Hotels API is on TBOHolidays_HotelAPI
    BASE_URL = "http://api.tbotechnology.in/SharedServices/SharedData.svc/rest"
    HOTEL_API_URL = "http://api.tbotechnology.in/TBOHolidays_HotelAPI"

    def __init__(self):
        # Credentials Updated from User Input
        self.username = "hackathontest"
        self.password = "Hac@98147521"
        self.client_id = "tboprod"
        self.token = None
        self.token_expiry = 0

    def _authenticate(self):
        """
        Authenticates with TBO API and caches the token.
        Avoids login if a valid token exists.
        """
        if self.token and time.time() < self.token_expiry:
            return self.token

        url = f"{self.BASE_URL}/Authenticate"

        payload = {
            "ClientId": self.client_id,
            "UserName": self.username,
            "Password": self.password,
            "EndUserIp": "127.0.0.1"  # Local IP
        }

        try:
            # Set timeout to avoid hanging indefinitely
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()

            if data.get("Status") == 1:  # 1 usually means Success in TBO
                self.token = data.get("TokenId")
                # Cache for strictly less than 24h or provided expiry
                self.token_expiry = time.time() + (23 * 3600)
                logger.info("TBO Authentication Successful. Token Cached.")
                return self.token
            else:
                error_msg = data.get('Error', {}).get('ErrorMessage')
                logger.error("TBO Auth Failed: %s", error_msg)
                raise ConnectionError(
                    f"Authentication Failed: {error_msg}") from None

        except requests.RequestException as e:
            logger.error("Network error during TBO Authentication: %s", e)
            raise
        except Exception as e:  # pylint: disable=broad-except
            logger.error("Error during TBO Authentication: %s", e)
            raise

    def search_hotels(self, result_count: int = 10, room_count: int = 1):
        """
        Performs a hotel search with specified result and room counts.
        """
        token = self._authenticate()
        url = f"{self.HOTEL_API_URL}/GetHotelResult"

        # Example Payload Structure (Simplified)
        payload = {
            "ResultCount": result_count,
            "RoomCount": room_count,
            "TokenId": token,
            # Additional required parameters (CheckIn, etc) would go here
        }

        try:
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error("Network error searching hotels: %s", e)
            raise
        except Exception as e:
            logger.error("Error searching hotels: %s", e)
            raise

    def check_availability(self, session_id: str, result_index: int, hotel_code: str):
        """
        Pre-Book check: HotelRoomAvailability.
        """
        token = self._authenticate()
        url = f"{self.HOTEL_API_URL}/GetHotelRoomAvailability"

        payload = {
            "SessionId": session_id,
            "ResultIndex": result_index,
            "HotelCode": hotel_code,
            "TokenId": token
        }

        try:
            response = requests.post(url, json=payload, timeout=30)
            return response.json()
        except requests.RequestException as e:
            logger.error("Network error checking availability: %s", e)
            raise
        except Exception as e:
            logger.error("Error checking availability: %s", e)
            raise
