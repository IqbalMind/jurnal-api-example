# Mekari Jurnal Open API Examples
This repository contains example integrations with the Mekari Jurnal Open API using various programming languages and frameworks. Each implementation demonstrates best practices and common patterns for integrating with the Jurnal API.

## Available Implementations

### PHP Ecosystem
- **PHP**: Native PHP implementation with a reusable `JurnalApi` class
- **CodeIgniter**: Example integration as a framework library
- **Laravel 11**: Service-based implementation with dependency injection

## Requirements

Each implementation has its own specific requirements. Please refer to the README in each directory for detailed requirements and setup instructions.

### General Requirements
- Valid Mekari Jurnal API credentials (HMAC username and secret)
- Basic understanding of REST APIs and HTTP requests
- Familiarity with your chosen programming language/framework

## Getting Started

1. Clone this repository
2. Choose your preferred implementation from the available directories
3. Follow the specific setup instructions in each directory's README
4. Configure your API credentials as specified in the implementation

## Implementation Requests & Status

Want to see an implementation in your preferred language or framework? [Submit your request here](https://forms.gle/FVvMKwrpmUzZx2fs9)

### Current Implementation Requests Status

| Language/Framework | Status | Total Requests | Target Date |
|-------------------|---------|----------------|-------------|
| Vue.js | 🔵 Planned | 1 | End of Q4 2024 |
| React.js | 🔵 Planned | 1 | End of Q4 2024 |

**Status Legend:**
- 🟢 Completed: Implementation is available
- 🟡 In Progress: Currently being worked on
- 🔵 Planned: Scheduled for implementation
- 🔴 Open: Not yet assigned/scheduled

## Contributing New Implementations

We welcome contributions for additional language implementations and frameworks! Here's how you can contribute:

### Contribution Guidelines

1. **Directory Structure**
   Create a new directory with your implementation following this structure:
```bash
/{language-or-framework}/
├── README.md           # Setup and usage instructions
├── example.{ext}       # Basic usage example
└── tests/             # Test cases (optional)
```

2. **Implementation Requirements**
- Include basic error handling
- Provide clear documentation
- Add example usage code
- Follow the language/framework's best practices
- Include necessary dependency management files (package.json, composer.json, etc.)

3. **Documentation**
Your implementation's README should include:
- Prerequisites and requirements
- Installation instructions
- Basic usage example
- Available methods/functions
- Error handling approach
- Any framework-specific considerations

4. **Submit a Pull Request**
- Fork this repository
- Create your implementation in a new branch
- Submit a pull request with a clear description of your implementation
- Ensure all code is well-documented and tested

## Documentation

For detailed API information and more usage examples, visit the [Mekari Jurnal Open API Documentation](https://api-doc.jurnal.id/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

We appreciate all contributors who help make this repository a valuable resource for the Mekari Jurnal developer community. See [CONTRIBUTORS.md](CONTRIBUTORS.md) for a list of contributors.
