package com.mekari.jurnal

fun main() {
    val clientId = System.getenv("JURNAL_CLIENT_ID") ?: "your-client-id"
    val clientSecret = System.getenv("JURNAL_CLIENT_SECRET") ?: "your-client-secret"
    val env = System.getenv("JURNAL_ENV") ?: "sandbox"

    println("Initializing Kotlin Mekari Jurnal client [$env]...")
    val client = JurnalApi(clientId, clientSecret, env)

    val path = "/public/jurnal/api/v1/sales_invoices/2963983"
    println("Sending GET request to $path...")

    try {
        val response = client.get(path)
        println("Status Code: ${response.statusCode()}")
        println("Response Body:\n${response.body()}")
    } catch (e: Exception) {
        println("Error: ${e.message}")
    }
}
