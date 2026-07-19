# sMv | Blog

Welcome to the **sMv | Blog** repository. This is a full-stack blogging application built using the **MERN Stack**, featuring rich-text content creation with **TinyMCE Editor**, secure image hosting with **Azure Blob Storage**, and a serverless email notification microservice built with **Google Apps Script**.

---

## Tech Stack

### Frontend

* React.js
* TinyMCE Rich Text Editor
* Vite

### Backend

* Node.js
* Express.js (Native `fetch` API)

### Database

* MongoDB

### Cloud Storage

* Azure Blob Storage (for blog images and attachments)

### Email Service

* Google Apps Script (Serverless Mail Gateway)

---

## Repository Structure

```text
sMv-Blog/
├── frontEnd/     # React client application
└── backEnd/      # Node/Express API server
```

---

## 🛠️ Getting Started

To run the application locally, install dependencies and start both the frontend and backend servers.

### 1. Install Dependencies

Navigate into each directory and install the required packages:

```bash
# Install frontend dependencies
cd frontEnd
npm install

# Install backend dependencies
cd ../backEnd
npm install
```

### 2. Run the Application

Both frontend and backend share the same script structure.

#### Development Mode (Hot Reloading)

```bash
npm run dev
```

#### Production Mode

```bash
npm run start
```

> **Tip:** Open two terminal windows or tabs—one for the frontend and one for the backend—and run `npm run dev` in both directories for local development.

---

# Google Apps Script Email Setup

Instead of a heavy third-party dependency like Nodemailer, this project routes email notifications through a custom, authenticated Google Apps Script Web App.

## 1. Create the Script

1. Go to `https://script.google.com` and log into your Google account.
2. Click **New Project**.
3. Remove the default code and paste the following:

```javascript
// 1. CHOOSE A SECURE, RANDOM TOKEN HERE
const AUTH_TOKEN = "YOUR_SUPER_SECRET_GENERATED_TOKEN_HERE";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const token = data.token;
    const recipient = data.to;
    const subject = data.subject;
    const body = data.body;
    const fromName = data.fromName || "sMv|Blog";

    // Verify the auth token matches
    if (!token || token !== AUTH_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Unauthorized: Invalid or missing token."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!recipient || !subject || !body) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Missing required fields (to, subject, body)"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Deliver email with custom display naming properties
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: body,
      name: fromName
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Email sent successfully!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 2. Deploy as a Web App

1. Click **Save**.
2. Select **Deploy → New Deployment**.
3. Click the **Gear Icon** and choose **Web App**.
4. Configure the deployment:

| Setting        | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Description    | sMv Blog Email Service                                   |
| Execute As     | Me ([your-email@gmail.com](mailto:your-email@gmail.com)) |
| Who Has Access | Anyone                                                   |

> This allows your backend to access the Google Apps Script endpoint. Security is maintained through the `AUTH_TOKEN`.

5. Click **Deploy** and complete the authorization process.
6. Copy the generated Web App URL. It should look like:

```text
https://script.google.com/macros/s/AKfyc...SOME_ID.../exec
```

### Important

Whenever you update the Apps Script code:

```text
Deploy → Manage Deployments → Edit (Pencil Icon)
→ Version: New Version
→ Deploy
```

Changes will not go live until a new deployment version is published.

---

# Environment Variables

Proper configuration of environment variables is required before running the application.

---

## Backend Configuration

Create a `.env` file inside:

```text
backEnd/.env
```

```env
# Server Configuration
PORT=5000
NODE_ENV=development or production 
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_CONTAINER_NAME=your_container_name

# Google Apps Script Mailer Configuration
GAS_WEB_APP_URL=https://script.google.com/macros/s/AKfyc...YOUR_ID.../exec
GAS_AUTH_TOKEN=YOUR_SUPER_SECRET_GENERATED_TOKEN_HERE

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
```

> Do not wrap values in quotation marks inside `.env` files.

---

## Frontend Configuration

Create a `.env` file inside:

```text
frontEnd/.env
```

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# TinyMCE API Key
VITE_TINY_MCE_API_KEY=your_tinymce_api_key
```

---

# TinyMCE Setup

This project uses TinyMCE as the rich-text editor for creating and editing blog content.

1. Create a free TinyMCE account.
2. Generate an API key from the TinyMCE dashboard.
3. Add the key to your frontend `.env` file.
4. Restart the frontend development server.

> Without a valid TinyMCE API key, the editor may not load correctly in development or production.

---

# Features

* Create, edit, and publish blog posts
* Rich-text content editing with TinyMCE Editor
* Upload and manage blog images through Azure Blob Storage
* Automated email and OTP notifications using an authenticated Google Apps Script microservice
* Full MERN Stack architecture
* Secure environment-based configuration
* RESTful API backend
* Responsive user interface

---

# Troubleshooting & Tips

## TinyMCE Editor Not Loading

* Verify that `VITE_TINY_MCE_API_KEY` is configured correctly.
* Ensure the API key is active in your TinyMCE account.
* Restart the frontend server after updating the `.env` file.

---

## Azure Storage Issues

Ensure your Azure Blob Storage container access level is configured as either:

### Blob

Public read access for blobs only.

### Container

Public read access for the entire container.

This is required if blog images should be publicly accessible.

---

## Email Service Returns `<!DOCTYPE html>` or Page Not Found

If your backend logs a JSON parsing error containing HTML code, Google is likely intercepting or blocking the request.

### Check the URL

Ensure `GAS_WEB_APP_URL` ends with:

```text
/exec
```

If it contains `/edit` or `/d/`, you copied the editor URL instead of the deployment URL.

### Remove Quotes

Do not surround URLs or tokens with quotation marks in `.env`.

### Verify Access Rules

Confirm that:

* The deployment is set to **Anyone**
* You deployed a **New Version** after making changes

### Workspace Restrictions

If you're using a company or school Google Workspace account, sharing restrictions may block access.

Use a personal Gmail account instead.

---

## CORS Errors

If requests from the frontend are being blocked:

Verify your backend CORS configuration allows requests from your frontend URL.

Example:

```text
http://localhost:5173
```

---
