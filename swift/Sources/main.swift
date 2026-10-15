import Foundation

@main
struct App {
    static func main() async {
        let env = ProcessInfo.processInfo.environment
        let clientId = env["JURNAL_CLIENT_ID"] ?? "your-client-id"
        let clientSecret = env["JURNAL_CLIENT_SECRET"] ?? "your-client-secret"
        let environment = env["JURNAL_ENV"] ?? "sandbox"

        print("Initializing Swift Mekari Jurnal Client [\(environment)]...")
        let client = JurnalApi(username: clientId, secret: clientSecret, environment: environment)

        let path = "/public/jurnal/api/v1/sales_invoices/2963983"
        print("Sending GET request to \(path)...")

        do {
            let (data, response) = try await client.get(path: path)
            print("Status Code: \(response.statusCode)")
            if let str = String(data: data, encoding: .utf8) {
                print("Response Body:\n\(str)")
            }
        } catch {
            print("Error: \(error.localizedDescription)")
        }
    }
}
