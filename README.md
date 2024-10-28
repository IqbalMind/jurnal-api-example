# Mekari Jurnal Open API Example

This repository contains example integrations with the Mekari Jurnal Open API using different PHP frameworks and environments. Each folder includes a README with detailed instructions for setting up and using the Jurnal API integration for the respective framework.

## Directory Structure

- **PHP**: Contains a native PHP implementation with a reusable `JurnalApi` class.
- **codeigniter**: Provides an example integration using CodeIgniter, demonstrating how to implement the API as a library within the framework.
- **laravel-11**: Includes an example for integrating with Laravel 11, using a service class that can be injected into controllers.

## Requirements

- **PHP**: 7.4 or higher
- **cURL**: Ensure PHP cURL extension is enabled
- **Composer**: Required for the Laravel example

## Getting Started

Each folder contains its own setup instructions. Please refer to the `README.md` file in each directory for specific details on how to use the examples.

### Example Setup for PHP Native

1. Go to the `PHP` directory and open `JurnalApi.php`.
2. Add your HMAC credentials (`username` and `secret`).
3. Run the example using the following command:

    ```bash
    php example.php
    ```

### Example Setup for CodeIgniter

1. Copy the `JurnalApi.php` library file to your CodeIgniter application.
2. Load the library in your controller and configure it with your credentials.

### Example Setup for Laravel 11

1. Place the `JurnalApi.php` file in `app/Services/`.
2. Add your credentials to `.env` and configure the service in `config/services.php`.

## Documentation

For detailed API information and more usage examples, visit the [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).

## License

This project is open source and available under the MIT License. Feel free to modify and use it for your own applications.
