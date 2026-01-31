import requests

urls = [
    # Variations of Authentication
    "http://api.tbotechnology.in/SharedServices/SharedData.svc/rest/Authenticate",
    "http://api.tbotechnology.in/SharedServices/SharedData.svc/Authenticate",
    "http://api.tbotechnology.in/SharedData.svc/rest/Authenticate",
    "http://api.tbotechnology.in/SharedData.svc/Authenticate",
    "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Authenticate",
    # SOAP Endpoint just to check existence
    "http://api.tbotechnology.in/TBOHolidays_HotelAPI/HotelService.svc",
    "http://api.tbotechnology.in/SharedServices/SharedData.svc"
]

payload = {
    "ClientId": "tboprod",
    "UserName": "hackathontest",
    "Password": "Hac@98147521",
    "EndUserIp": "127.0.0.1"
}

print("Scanning TBO Endpoints for Liveness...")
for url in urls:
    try:
        # POST for Auth, GET for Service check
        if ".svc" in url and "Authenticate" not in url:
            resp = requests.get(url, timeout=5)
        else:
            resp = requests.post(url, json=payload, timeout=5)

        print(f"[{resp.status_code}] {url}")
        if resp.status_code == 200 and "Authenticate" in url:
            print(f"   >>> SUCCESS! Body: {resp.text[:50]}...")
    except Exception as e:
        print(f"[ERR] {url} : {e}")
