# Jurnal API - Google Apps Script (Google Sheets Integration)

This script allows you to connect **Google Sheets** directly to the Mekari Jurnal Open API using HMAC-SHA256 authentication without running or hosting any server!

## Why This is Useful
- Finance and operational teams can sync transaction records from Google Sheets straight into Mekari Jurnal.
- Pull live invoice statuses, payment records, or balance data into a spreadsheet with one click.
- Zero server hosting costs (runs on Google Cloud's free Apps Script infrastructure).

## Setup Instructions

### 1. Open Google Sheets Script Editor
1. Open any Google Spreadsheet (e.g. at [sheets.new](https://sheets.new)).
2. In the top menu, click **Extensions** > **Apps Script**.

### 2. Copy the Script
1. Delete any boilerplate code in `Code.gs`.
2. Copy the code from `Code.gs` in this directory and paste it into the editor.

### 3. Configure Credentials Securely
1. In the Apps Script editor, click on the **Project Settings** (gear icon) on the left sidebar.
2. Scroll down to **Script Properties** and click **Edit script properties** > **Add script property**:
   - `JURNAL_CLIENT_ID`: Your Mekari Client ID
   - `JURNAL_CLIENT_SECRET`: Your Mekari Client Secret
   - `JURNAL_ENV`: `sandbox` (for testing) or `production`
3. Click **Save script properties**.

> Need credentials? Follow the [Credentials Guide Slide](https://docs.google.com/presentation/d/1Oc5Z_2BoQX6cm6wQ_l1nkScWfSORv_rpT-d-c4WE8xM/edit?usp=sharing).

### 4. Run & Authorize
1. Select the `testJurnalConnection` function in the dropdown at the top and click **Run**.
2. Grant the one-time Google permission prompt to allow the script to connect to external URLs (`UrlFetchApp`).
3. Reload your Google Sheet — a new menu called **📊 Mekari Jurnal** will appear on the toolbar!
