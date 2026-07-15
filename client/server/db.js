import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize the database file with empty arrays if it doesn't exist
async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    const initialData = {
      documents: [],
      users: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log('✅ Local file-based database initialized at server/db.json');
  }
}

// Read database contents
async function readDb() {
  await initDb();
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write database contents
async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Database Operation to Save Uploaded PDF files
export async function saveDocument(doc) {
  const db = await readDb();
  const newDoc = {
    _id: 'doc_' + Date.now(),
    documentName: doc.documentName,
    summary: doc.summary,
    extractedText: doc.extractedText,
    uploadedAt: new Date().toISOString()
  };
  db.documents.push(newDoc);
  await writeDb(db);
  return newDoc;
}

// Database Operation to Save Portal Logins
export async function savePortalUser(user) {
  const db = await readDb();
  const newUser = {
    _id: 'user_' + Date.now(),
    name: user.name,
    phoneNumber: user.phoneNumber,
    role: user.role,
    loggedInAt: new Date().toISOString()
  };
  db.users.push(newUser);
  await writeDb(db);
  return newUser;
}

export async function connectDatabase() {
  await initDb();
  console.log('✅ Local File database connection established.');
}