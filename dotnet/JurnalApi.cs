using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Mekari.Jurnal
{
    public class JurnalApi
    {
        private readonly string _username;
        private readonly string _secret;
        private readonly string _apiUrl;
        private readonly HttpClient _httpClient;

        public record SignatureResult(string Date, string RequestLine, string Signature, string AuthorizationHeader);

        public JurnalApi(string username, string secret, string environment = "sandbox", HttpClient? httpClient = null)
        {
            _username = username ?? throw new ArgumentNullException(nameof(username));
            _secret = secret ?? throw new ArgumentNullException(nameof(secret));
            _apiUrl = string.Equals(environment, "production", StringComparison.OrdinalIgnoreCase)
                ? "https://api.mekari.com"
                : "https://sandbox-api.mekari.com";
            _httpClient = httpClient ?? new HttpClient();
        }

        public SignatureResult GenerateSignature(string method, string path)
        {
            // RFC 1123 / HTTP-date GMT format (e.g. Thu, 15 Oct 2026 04:09:20 GMT)
            string dateString = DateTimeOffset.UtcNow.ToString("r");
            string requestLine = $"{method.ToUpperInvariant()} {path} HTTP/1.1";
            string stringToSign = $"date: {dateString}\n{requestLine}";

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secret));
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign));
            string signature = Convert.ToBase64String(hash);

            string authHeader = $"hmac username=\"{_username}\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"{signature}\"";

            return new SignatureResult(dateString, requestLine, signature, authHeader);
        }

        public async Task<HttpResponseMessage> RequestAsync(string method, string path, string? jsonBody = null)
        {
            var upperMethod = method.ToUpperInvariant();
            var sig = GenerateSignature(upperMethod, path);

            var request = new HttpRequestMessage(new HttpMethod(upperMethod), $"{_apiUrl}{path}");
            request.Headers.TryAddWithoutValidation("Authorization", sig.AuthorizationHeader);
            request.Headers.TryAddWithoutValidation("Date", sig.Date);
            request.Headers.TryAddWithoutValidation("Accept", "application/json");

            if (!string.IsNullOrEmpty(jsonBody) && upperMethod != "GET" && upperMethod != "DELETE")
            {
                request.Content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
            }

            return await _httpClient.SendAsync(request);
        }

        public Task<HttpResponseMessage> GetAsync(string path) => RequestAsync("GET", path);
        public Task<HttpResponseMessage> PostAsync(string path, string jsonBody) => RequestAsync("POST", path, jsonBody);
        public Task<HttpResponseMessage> PutAsync(string path, string jsonBody) => RequestAsync("PUT", path, jsonBody);
        public Task<HttpResponseMessage> DeleteAsync(string path) => RequestAsync("DELETE", path);
    }
}
