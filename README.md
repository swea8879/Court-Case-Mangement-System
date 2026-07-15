Implementation Plan: Court Case Management System (Restructured)
We will restructure the Court Case Management System into the clean, professional, modular directory structure specified (separate backend/ and frontend/ folders) using the local file-based database (db.json) for authentication and case storage.

Proposed Folder Layout
text

/
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   └── db.js                # Local file-based database connector
│   ├── models/
│   │   ├── Case.js              # Case data model
│   │   └── User.js              # User authorization model
│   ├── routes/
│   │   ├── authRoutes.js        # POST /api/auth/login
│   │   ├── caseRoutes.js        # Case CRUD endpoints
│   │   └── documentRoutes.js    # PDF upload & parser
│   ├── controllers/
│   │   ├── authController.js    # Login logic
│   │   ├── caseController.js    # Case CRUD business logic
│   │   └── documentController.js# Document summary logic
│   └── middleware/
│       ├── authMiddleware.js    # JWT/session validation
│       └── errorHandler.js      # Error handler
├── frontend/
│   ├── index.html               # Main landing page (already designed)
│   ├── login.html               # Login page form
│   ├── admin.html               # Main dashboards (Admin, Judge, Lawyer, Client)
│   ├── app.js                   # API integration script
│   └── styles.css               # Premium CSS styles
├── package.json                 # Project configuration
└── server.js                    # Compatibility root server (forwards to backend)
Refactoring Strategy
1. Database Configuration (backend/config/db.js)
Reads and writes case and login records to backend/db.json asynchronously.
2. Backend API Route Implementation
Auth Controller: Validates username and phone number, saves user to database.
Document Controller: Handles PDF upload, processes file via pdf-parse, generates text summaries, and records it to database.
Case Controller: Supports full CRUD (Create, Read, Update, Delete) operations for cases.
3. Frontend Separation (frontend/)
Move index.html contents into the frontend workspace folder.
Update navigation links to load login.html and admin.html with clean fetch wrappers in app.js.
Verification Plan
Automated Verification
Boot the root server: npm start and run sanity checks on /api/health.
Manual Verification
Test PDF uploading and verify text parsing pop-up notification.
Test portal authentication inputs and inspect db.json persistence.
