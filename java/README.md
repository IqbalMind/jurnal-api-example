# Jurnal API - Java Example

This package provides a native Java implementation for connecting to the Mekari Jurnal Open API using HMAC-SHA256 authentication.

## Features
- **Zero External Dependencies**: Built with Java 11+ standard library (`java.net.http.HttpClient`, `javax.crypto.Mac`, `java.time.format.DateTimeFormatter`).
- Correct RFC 7231 / HTTP-date formatting in UTC (`EEE, dd MMM yyyy HH:mm:ss 'GMT'`).
- Fully thread-safe and reusable in Spring Boot, Quarkus, Micronaut, or standalone enterprise services.
- Supports `GET`, `POST`, `PUT`, `DELETE`.

## Prerequisites
- JDK 11 or higher (Tested with JDK 11, 17, 21).
- Mekari Jurnal HMAC credentials (`CLIENT_ID` and `CLIENT_SECRET`). See the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

## Quick Start

### Compile and Run with Standard `javac` (No Maven needed):
```bash
cd java/src/main/java
javac com/mekari/jurnal/*.java
java com.mekari.jurnal.Example
```

### Or Build with Maven:
```bash
cd java
mvn compile exec:java -Dexec.mainClass="com.mekari.jurnal.Example"
```

## Usage Example

```java
import com.mekari.jurnal.JurnalApi;
import java.net.http.HttpResponse;

public class Demo {
    public static void main(String[] args) throws Exception {
        JurnalApi client = new JurnalApi("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", "sandbox");

        // 1. GET Request
        HttpResponse<String> response = client.get("/public/jurnal/api/v1/sales_invoices/2963983");
        System.out.println("Status: " + response.statusCode());
        System.out.println("Body: " + response.body());

        // 2. POST Request
        String jsonPayload = "{\"sales_invoice\": {\"transaction_date\": \"2026-10-15\"}}";
        HttpResponse<String> createResponse = client.post("/public/jurnal/api/v1/sales_invoices", jsonPayload);
        System.out.println("Status: " + createResponse.statusCode());
    }
}
```
