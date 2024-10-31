# Mekari Jurnal API Example with Vue.js

This example demonstrates how to integrate the Mekari Jurnal API with a Vue.js frontend, using a Node.js backend to securely handle HMAC authentication. 

## Overview

This setup includes:
1. **Vue.js** frontend to display data.
2. **Node.js** backend (with Express) to securely generate HMAC signatures and interact with the Jurnal API.

Since HMAC signatures require sensitive credentials, it’s recommended to handle the signing process on the server and then call this server from the Vue frontend.

## Prerequisites

- [Node.js](https://nodejs.org/) and npm installed.
- Basic knowledge of Vue.js and Node.js.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/jurnal-api-example.git
cd jurnal-api-example
```

### 2. Backend Setup
Navigate to the backend folder (e.g., jurnal-backend) and install dependencies:
```bash
cd jurnal-backend
npm install
```

**Configuration**
1. Open index.js in the jurnal-backend folder.
2. Set your HMAC credentials:
  - Replace your-username and your-secret with your actual Mekari Jurnal API HMAC username and secret.
  - 
**Running the Backend**
Start the backend server:
```bash
node index.js
```

This will start the server on http://localhost:3000, which will handle requests from the Vue.js frontend.

### 3. Vue.js Frontend Setup
Navigate to the Vue.js project folder (e.g., jurnal-api-vue) and install dependencies:
```bash
cd jurnal-api-vue
npm install
```
**Running the Frontend**
Start the Vue development server:

```bash
npm run serve
The Vue app will run at http://localhost:8080 (or the port shown in your terminal).
```

## Usage
1. Open the Vue app in your browser.
2. Enter an Invoice ID in the input field.
3. Click "Get Sales Invoice" to fetch and display invoice data from the Jurnal API.

```bash
jurnal-api-example/
├── jurnal-backend/          # Node.js backend to generate HMAC signature
│   ├── index.js             # Main server file with HMAC generation and Jurnal API call
│   └── package.json         # Backend dependencies
└── jurnal-api-vue/          # Vue.js frontend to interact with backend
    ├── src/
    │   ├── App.vue          # Main Vue component with invoice fetching
    │   └── ...
    └── package.json         # Frontend dependencies
```

## Configuration
### Environment:
The backend uses sandbox-api.mekari.com for testing (staging). For production, replace with api.mekari.com.

### Dependencies:
**Backend**: Express, Axios, Crypto.
**Frontend**: Axios for API calls.
