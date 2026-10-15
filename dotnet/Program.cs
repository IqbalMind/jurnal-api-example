using System;
using System.Threading.Tasks;
using Mekari.Jurnal;

class Program
{
    static async Task Main(string[] args)
    {
        string clientId = Environment.GetEnvironmentVariable("JURNAL_CLIENT_ID") ?? "your-client-id";
        string clientSecret = Environment.GetEnvironmentVariable("JURNAL_CLIENT_SECRET") ?? "your-client-secret";
        string env = Environment.GetEnvironmentVariable("JURNAL_ENV") ?? "sandbox";

        Console.WriteLine($"Initializing .NET Mekari Jurnal client [{env}]...");
        var client = new JurnalApi(clientId, clientSecret, env);

        string path = "/public/jurnal/api/v1/sales_invoices/2963983";
        Console.WriteLine($"Sending GET {path}...");

        try
        {
            var response = await client.GetAsync(path);
            string body = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Status Code: {(int)response.StatusCode} {response.StatusCode}");
            Console.WriteLine("Response Body:");
            Console.WriteLine(body);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
