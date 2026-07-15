Court Case Management System - Justice Flow

A production-ready SaaS platform for digital courtroom workflow automation, case docket tracking, and AI-powered document analysis.

---

## ✨ Features
* **📊 Multi-Role Analytical Dashboards**: Dedicated workspaces for **Admin, Judge, Lawyer, and Client** rendering real-time statistics and historical case trends using **Chart.js**.
* **📄 AI Document Summarizer**: Parses actual uploaded PDF files using `pdf-parse`, extracts text contents, and generates immediate previews.
* **🔐 Portal Authentication**: High-contrast login interface requiring User Name and Contact Number.
* **💾 Local File Persistence**: Logins and parsed document summaries are written instantly to `server/db.json` for zero-install database configuration.
* **💬 AI Research Sandbox**: Chat assistant supporting contextual queries (e.g. pending hearings, missing files, case lookups).

---

## 🛠️ Technology Stack
* **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (CDN), Lucide Icons, Chart.js.
* **Backend**: Node.js, Express.js, Multer (file handling), pdf-parse.
* **Database**: Local JSON file storage (`db.json`) for lightweight portable execution.

---

## 📁 Project Structure
```text
/
├── backend/
│   ├── server.js                 # Express application entry point
│   ├── config/
│   │   └── db.js                # Local database read/write helpers
│   ├── models/
│   │   ├── Case.js              # Case structure schemas
│   │   └── User.js              # Login credentials schemas
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── caseRoutes.js        # Case CRUD endpoints
│   │   └── documentRoutes.js    # PDF uploading & parsing endpoints
│   ├── controllers/
│   │   ├── authController.js    # Login session logic
│   │   ├── caseController.js    # CRUD handlers
│   │   └── documentController.js# Document parser logic
│   └── middleware/
│       ├── authMiddleware.js    # Session token validation
│       └── errorHandler.js      # Centralized error handler
├── frontend/
│   ├── index.html               # Main application and dashboards
│   ├── login.html               # Portal credentials form
│   ├── admin.html               # Multi-role analytics workspace
│   ├── app.js                   # Client-side API caller
│   └── styles.css               # Premium CSS styles
├── package.json                 # Dependencies and execution scripts
├── README.md                    # This documentation file
└── .gitignore                   # Excludes node_modules and logs
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
* **Node.js 18+** installed on your machine.
* **Git** (optional, for version control).

### 2. Installation
Open your VS Code terminal and navigate to the project directory:
```bash
cd server
npm install
```

### 3. Start the Server
Run the startup script:
```bash
npm start
```

*Terminal Output:*
```text
🚀 Node Server running at http://localhost:5001/
✅ Local file-based database initialized at server/db.json
✅ Local File database connection established.
```

### 4. Access the Application
Open your browser and navigate to:
## **`http://localhost:5001/`**

---

## 📡 API Endpoints

### 🔐 Authentication
* **`POST /api/auth/portal-login`**
  * **Body:** `{ name, phoneNumber, role }`
  * **Response:** `{ message: "Login successful", user: { name, phoneNumber, role } }`

### 📄 Documents
* **`POST /api/documents/upload`**
  * **Body:** Multipart FormData containing `file`
  * **Response:** `{ message: "PDF successfully parsed", documentName, extractedText, summary }`

### 💬 Chat Sandbox
* **`POST /api/ai/chat`**
  * **Body:** `{ query }`
  * **Response:** `{ response: "AI text reply..." }`

---

## ⚖️ License
This project is licensed under the MIT License.
