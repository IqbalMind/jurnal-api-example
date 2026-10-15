import hmac
import hashlib
import base64
from datetime import datetime, timezone
from urllib.parse import urlencode
import requests


class JurnalApi:
    """
    Mekari Jurnal Open API client with HMAC-SHA256 authentication.
    """

    def __init__(self, username: str, secret: str, environment: str = "sandbox"):
        """
        Initialize JurnalApi instance.

        :param username: Mekari Client ID (hmac_username)
        :param secret: Mekari Client Secret (hmac_secret)
        :param environment: 'sandbox' or 'production' (default: 'sandbox')
        """
        self.username = username
        self.secret = secret
        self.environment = environment.lower()
        self.api_url = (
            "https://api.mekari.com"
            if self.environment == "production"
            else "https://sandbox-api.mekari.com"
        )

    def generate_signature(self, method: str, path: str):
        """
        Generate HMAC-SHA256 signature and RFC 7231 Date header.
        
        :param method: HTTP method (GET, POST, etc.)
        :param path: Request path including query parameters (e.g. /public/jurnal/api/v1/sales_invoices)
        :return: dict with 'signature', 'date', and 'authorization' header
        """
        # Format date as RFC 7231 / HTTP-date (e.g. Thu, 15 Oct 2026 04:09:20 GMT)
        date_string = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
        request_line = f"{method.upper()} {path} HTTP/1.1"
        data_to_sign = f"date: {date_string}\n{request_line}"

        digest = hmac.new(
            self.secret.encode("utf-8"),
            data_to_sign.encode("utf-8"),
            hashlib.sha256
        ).digest()
        signature = base64.b64encode(digest).decode("utf-8")

        hmac_header = (
            f'hmac username="{self.username}", '
            f'algorithm="hmac-sha256", '
            f'headers="date request-line", '
            f'signature="{signature}"'
        )

        return {
            "signature": signature,
            "date": date_string,
            "authorization": hmac_header,
        }

    def request(self, method: str, path: str, data: dict = None, params: dict = None):
        """
        Send an authenticated HTTP request to Mekari Jurnal API.

        :param method: HTTP method (GET, POST, PUT, DELETE)
        :param path: API endpoint path (e.g. /public/jurnal/api/v1/sales_invoices)
        :param data: JSON body dictionary (for POST/PUT/PATCH)
        :param params: URL query parameters dictionary
        :return: requests.Response
        """
        method = method.upper()

        # Build full path with query string for the signature if params are provided
        if params:
            query_string = urlencode(params)
            path_with_query = f"{path}{'&' if '?' in path else '?'}{query_string}"
        else:
            path_with_query = path

        sig_data = self.generate_signature(method, path_with_query)

        headers = {
            "Authorization": sig_data["authorization"],
            "Date": sig_data["date"],
            "Accept": "application/json",
        }

        url = f"{self.api_url}{path_with_query}"

        if data is not None and method not in ["GET", "DELETE"]:
            headers["Content-Type"] = "application/json"
            response = requests.request(method, url, json=data, headers=headers)
        else:
            response = requests.request(method, url, headers=headers)

        return response

    def get(self, path: str, params: dict = None):
        return self.request("GET", path, params=params)

    def post(self, path: str, data: dict = None, params: dict = None):
        return self.request("POST", path, data=data, params=params)

    def put(self, path: str, data: dict = None, params: dict = None):
        return self.request("PUT", path, data=data, params=params)

    def delete(self, path: str, params: dict = None):
        return self.request("DELETE", path, params=params)
