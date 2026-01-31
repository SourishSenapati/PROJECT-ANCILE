"""
Verify TBO
----------
Script to verify connectivity to the TBO Holidays API Staging Environment.
"""
import requests

# --- CONFIGURATION ---
BASE_URL = "http://api.tbotechnology.in/TBOHolidays_HotelAPI"
AUTH_URL = "http://api.tbotechnology.in/SharedServices/SharedData.svc/rest/Authenticate"

USER_NAME = "hackathontest"
PASSWORD = "Hac@98147521"
IP_ADDRESS = "127.0.0.1"


def test_connection():
    """
    Authenticates with TBO and performs a basic hotel search to verify the connection.
    """
    print(f"[*] Testing Connection to TBO Staging: {BASE_URL}")

    # 1. AUTHENTICATE
    print("\n[1] Attempting Authentication...")
    auth_payload = {
        "ClientId": "tboprod",
        "UserName": USER_NAME,
        "Password": PASSWORD,
        "EndUserIp": IP_ADDRESS
    }

    token = None
    try:
        response = requests.post(AUTH_URL, json=auth_payload, timeout=10)

        if response.status_code == 200:
            data = response.json()
            if data.get('Status') == 1:  # 1 = Success
                token = data.get('TokenId')
                print(f"SUCCESS! Token Acquired: {token[:15]}...")
            else:
                print(
                    f"AUTH FAILED: {data.get('Error', {}).get('ErrorMessage')}")
                return None
        else:
            print(f"HTTP ERROR: {response.status_code} - {response.text}")
            return None

    except requests.RequestException as e:
        print(f"NETWORK EXCEPTION during Auth: {e}")
        return None
    except Exception as e:  # pylint: disable=broad-except
        print(f"EXCEPTION during Auth: {e}")
        return None

    # 2. HOTEL SEARCH (Dubai - Country Code AE)
    print("\n[2] Attempting Hotel Search (Dubai)...")
    search_payload = {
        "CheckInDate": "2026-05-01",
        "CheckOutDate": "2026-05-02",
        "CountryName": "United Arab Emirates",
        "CityName": "Dubai",
        "CityId": "115936",
        "IsNearBySearchAllowed": False,
        "NoOfRooms": 1,
        "GuestNationality": "AE",
        "RoomGuests": [{"NoOfAdults": 1, "NoOfChild": 0}],
        "ResultCount": 1,
        "TokenId": token,
        "EndUserIp": IP_ADDRESS
    }

    search_url = f"{BASE_URL}/GetHotelResult"

    try:
        search_res = requests.post(search_url, json=search_payload, timeout=30)
        if search_res.status_code == 200:
            search_data = search_res.json()
            if search_data.get('Status') == 1:
                if search_data.get('HotelResult'):
                    hotel = search_data['HotelResult'][0]
                    print(
                        f"SEARCH SUCCESS! Found Hotel: {hotel.get('HotelName')}")
                    print(
                        f"   Price: {hotel.get('Price', {}).get('PublishedPrice')} "
                        f"{hotel.get('Price', {}).get('CurrencyCode')}"
                    )
                    return True
                print("SEARCH SUCCESS but No Hotels Found (Empty List).")
                return True

            print(
                f"SEARCH API ERROR: {search_data.get('Error', {}).get('ErrorMessage')}")
        else:
            print(f"SEARCH HTTP ERROR: {search_res.status_code}")
            print(search_res.text)

    except requests.RequestException as e:
        print(f"NETWORK EXCEPTION during Search: {e}")
    except Exception as e:  # pylint: disable=broad-except
        print(f"EXCEPTION during Search: {e}")
    return None


if __name__ == "__main__":
    test_connection()
