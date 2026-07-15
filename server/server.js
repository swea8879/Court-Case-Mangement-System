import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { connectDatabase, saveDocument, savePortalUser } from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize File-based database (saves to server/db.json)
connectDatabase();

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Serve the standalone index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// PDF Upload & Reading API Endpoint (Day 4 Document Upload + Day 6 Summarizer + File Database Save)
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = '';
    
    // Parse PDF content
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } else {
      extractedText = req.file.buffer.toString('utf-8');
    }

    // Generate summary preview
    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
    const summary = `📄 PDF File: "${req.file.originalname}"\n` +
                    `📝 Extracted: ${wordCount} words.\n` +
                    `🔍 Summary Preview:\n${extractedText.substring(0, 250).replace(/\n/g, ' ')}...`;

    // Save parsed content to local json database (db.json)
    const savedDoc = await saveDocument({
      documentName: req.file.originalname,
      summary: summary,
      extractedText: extractedText
    });

    return res.json({
      message: 'PDF successfully parsed and saved to local database!',
      documentName: savedDoc.documentName,
      extractedText: savedDoc.extractedText,
      summary: savedDoc.summary
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to read and parse the PDF file' });
  }
});

// Portal login session endpoint (saves user login to local json database)
app.post('/api/auth/portal-login', async (req, res) => {
  const { name, phoneNumber, role } = req.body;
  if (!name || !phoneNumber || !role) {
    return res.status(400).json({ error: 'Name, phone number and role are required' });
  }

  try {
    const savedUser = await savePortalUser({ name, phoneNumber, role });
    return res.json({
      message: `Login successful for ${role}!`,
      user: savedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to record portal login in database' });
  }
});

// API Endpoint for AI Chat Sandbox
app.post('/api/ai/chat', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const q = query.toLowerCase();
  let response = "I couldn't find specific details for that in the backend. Try asking: 'Show all pending hearings', 'Summarize Case 105', or 'What documents are missing?'.";

  if (q.includes('case 105') || q.includes('105')) {
    response = "📄 **Case 105 Summary (Property Dispute):**\n- **Plaintiff:** LandTech Corp vs. Land Zoning Authority.\n- **Core Issue:** Validity of structural license issued in 2024.\n- **Status:** Active. Next hearing: July 28th, 2026.\n- **AI Warning:** Missing document: Approved structural site blueprint file.";
  } else if (q.includes('hearing') || q.includes('pending')) {
    response = "📅 **Pending Hearings Docket (3 Cases found):**\n1. **Case CIV-2026-1023** (Zoning Appeal) - July 15th, 10:30 AM (Chambers 4)\n2. **Case CIV-2026-1089** (Contract Dispute) - July 22nd, 02:00 PM (Court 2)";
  } else if (q.includes('simple') || q.includes('explain')) {
    response = "⚖️ **Judgment Explanation in Simple Terms:**\n- The court decided that the city had no legal authority to stop construction because the owner had already gotten valid permits and spent money. Therefore, the city's halt order is canceled.";
  } else if (q.includes('missing')) {
    response = "⚠️ **Missing Case Documents:**\n- **Case CIV-2026-1023:** Missing the certified FIR translation dossier.";
  }

  return res.json({ response });
});

// Fallback wildcard routing to server root index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Node Server running at http://localhost:${PORT}/`);
});
