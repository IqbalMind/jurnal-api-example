import Foundation
import CryptoKit

public class JurnalApi {
    public let username: String
    public let secret: String
    public let apiUrl: String
    private let session: URLSession

    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "EEE, dd MMM yyyy HH:mm:ss 'GMT'"
        return formatter
    }()

    public struct SignatureResult {
        public let date: String
        public let requestLine: String
        public let signature: String
        public let authorizationHeader: String
    }

    public init(username: String, secret: String, environment: String = "sandbox", session: URLSession = .shared) {
        self.username = username
        self.secret = secret
        self.apiUrl = environment.lowercased() == "production"
            ? "https://api.mekari.com"
            : "https://sandbox-api.mekari.com"
        self.session = session
    }

    public func generateSignature(method: String, path: String) -> SignatureResult {
        let dateString = dateFormatter.string(from: Date())
        let upperMethod = method.uppercased()
        let requestLine = "\(upperMethod) \(path) HTTP/1.1"
        let stringToSign = "date: \(dateString)\n\(requestLine)"

        let key = SymmetricKey(data: Data(secret.utf8))
        let mac = HMAC<SHA256>.authenticationCode(for: Data(stringToSign.utf8), using: key)
        let signature = Data(mac).base64EncodedString()

        let authHeader = "hmac username=\"\(username)\", algorithm=\"hmac-sha256\", headers=\"date request-line\", signature=\"\(signature)\""

        return SignatureResult(
            date: dateString,
            requestLine: requestLine,
            signature: signature,
            authorizationHeader: authHeader
        )
    }

    public func request(
        method: String,
        path: String,
        body: Data? = nil
    ) async throws -> (Data, HTTPURLResponse) {
        guard let url = URL(string: "\(apiUrl)\(path)") else {
            throw URLError(.badURL)
        }

        let upperMethod = method.uppercased()
        let sig = generateSignature(method: upperMethod, path: path)

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = upperMethod
        urlRequest.setValue(sig.authorizationHeader, forHTTPHeaderField: "Authorization")
        urlRequest.setValue(sig.date, forHTTPHeaderField: "Date")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")

        if let body = body, upperMethod != "GET" && upperMethod != "DELETE" {
            urlRequest.httpBody = body
            urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }

        let (data, response) = try await session.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }

        return (data, httpResponse)
    }

    public func get(path: String) async throws -> (Data, HTTPURLResponse) {
        return try await request(method: "GET", path: path)
    }

    public func post(path: String, body: Data) async throws -> (Data, HTTPURLResponse) {
        return try await request(method: "POST", path: path, body: body)
    }
}
