package com.mekari.jurnal;

import java.net.http.HttpResponse;

public class Example {
    public static void main(String[] args) {
        String clientId = System.getenv("JURNAL_CLIENT_ID") != null
                ? System.getenv("JURNAL_CLIENT_ID")
                : "your-client-id";
        String clientSecret = System.getenv("JURNAL_CLIENT_SECRET") != null
                ? System.getenv("JURNAL_CLIENT_SECRET")
                : "your-client-secret";
        String env = System.getenv("JURNAL_ENV") != null
                ? System.getenv("JURNAL_ENV")
                : "sandbox";

        JurnalApi client = new JurnalApi(clientId, clientSecret, env);

        try {
            System.out.println("Connecting to Mekari Jurnal [" + env + "]...");
            String path = "/public/jurnal/api/v1/sales_invoices/2963983";
            HttpResponse<String> response = client.get(path);

            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response Body:\n" + response.body());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
