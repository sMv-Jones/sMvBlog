# sMv | Blog

Welcome to the **sMv | Blog** repository. This is a full-stack blogging application built using the **MERN Stack**, featuring rich-text content creation with **TinyMCE Editor**, secure image hosting with **Azure Blob Storage**, and automated email notifications using **Nodemailer**.

---

## 🚀 Tech Stack

### Frontend

* React.js
* TinyMCE Rich Text Editor
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Cloud Storage

* Azure Blob Storage (for blog images and attachments)

### Email Service

* Nodemailer

---

## 📁 Repository Structure

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

---

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

> 💡 **Tip:** Open two terminal windows or tabs—one for the frontend and one for the backend—and run `npm run dev` in both directories for local development.

---

## 🔑 Environment Variables

Proper configuration of environment variables is required before running the application.

### 📝 Backend Configuration

Create a `.env` file inside the `backEnd/` directory.

**Path:** `backEnd/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development # development or production
FRONTEND_URL=http://localhost:5173 # Change according to your deployment

# Database
MONGODB_URI=your_mongodb_connection_string

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_CONTAINER_NAME=your_container_name

# Nodemailer Configuration
MAIL=your_email@gmail.com
MAIL_PASS=your_app_specific_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
```

### 📝 Frontend Configuration

Create a `.env` file inside the `frontEnd/` directory.

**Path:** `frontEnd/.env`

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# TinyMCE API Key
VITE_TINY_MCE_API_KEY=your_tinymce_api_key
```

### TinyMCE Setup

This project uses TinyMCE as the rich-text editor for creating and editing blog content.

1. Create a free TinyMCE account.
2. Generate an API key from the TinyMCE dashboard.
3. Add the API key to your frontend `.env` file:

```env
VITE_TINY_MCE_API_KEY=your_tinymce_api_key
```

4. Restart the frontend development server after updating environment variables.

Without a valid TinyMCE API key, the editor may not load correctly in development or production.

---

## ✨ Features

* 📝 Create, edit, and publish blog posts
* ✍️ Rich-text content editing with TinyMCE Editor
* 🖼️ Upload and manage blog images through Azure Blob Storage
* 📧 Automated email notifications using Nodemailer
* ⚡ Full MERN Stack architecture
* 🔒 Secure environment-based configuration
* 🌐 RESTful API backend
* 📱 Responsive user interface

---

## 🛡️ Troubleshooting & Tips

### TinyMCE Editor Not Loading

* Verify that `VITE_TINY_MCE_API_KEY` is set correctly.
* Ensure the API key is active in your TinyMCE account.
* Restart the frontend server after updating the `.env` file.

### Azure Storage Issues

Ensure your Azure Blob Storage container access level is configured as either:

* **Blob** – Public read access for blobs only.
* **Container** – Public read access for the entire container.

This is required if blog images should be publicly accessible.

### Nodemailer Issues

If using Gmail as the SMTP provider:

* Do not use your regular Gmail password.
* Generate and use an App Password from your Google Account Security settings.

### CORS Errors

If requests from the frontend are being blocked:

* Verify that your backend CORS configuration allows requests from your frontend URL.
* Example:

```text
http://localhost:5173
```

or whichever port your frontend application is running on.

---

## 📜 License

This project is intended for educational and personal use. Add an appropriate license if you plan to distribute or open-source the project.

---

## 👨‍💻 Author

Developed as part of the **sMv | Blog** project using the MERN Stack, TinyMCE Editor, Azure Blob Storage, and Nodemailer.
