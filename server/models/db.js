import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

export let isDbConnected = false;

// In-Memory Database Fallbacks
export const mockDb = {
  users: [],
  cases: [
    {
      _id: "case_mock_1",
      caseId: "CIV2026-1023",
      title: "Property Boundary Zoning Dispute",
      caseType: "Civil",
      status: "active",
      judgeId: "judge_mock_1",
      lawyerId: "lawyer_mock_1",
      clientId: "client_mock_1",
      laws: ["Section 226 - Construction Appeals", "Article 19(1)(g) - Right to Trade"],
      precedents: ["State vs. Municipal Authority (2021)", "Re zoning boundaries case #102"]
    },
    {
      _id: "case_mock_2",
      caseId: "CIV2026-1089",
      title: "Land Reclamation Breach of Contract",
      caseType: "Civil",
      status: "active",
      judgeId: "judge_mock_1",
      lawyerId: "lawyer_mock_1",
      clientId: "client_mock_2",
      laws: ["Section 73 - Indian Contract Act"],
      precedents: ["Land Development Corp vs. Builders Ltd (2018)"]
    }
  ],
  documents: [
    {
      _id: "doc_mock_1",
      caseId: "CIV2026-1023",
      documentName: "Petition_Draft_Zoning.pdf",
      documentType: "Petition",
      fileURL: "http://example.com/files/Petition_Draft_Zoning.pdf",
      summary: "Zoning commission issued illegal cease-and-desist construction order. Petitioner holds permit #2025-A.",
      ocrText: "PETITION UNDER ARTICLE 226 OF THE CONSTITUTION...",
      isSigned: true,
      signedBy: "Attorney Sarah Jenkins"
    }
  ],
  hearings: [
    {
      _id: "hearing_mock_1",
      caseId: "CIV2026-1023",
      date: new Date("2026-08-15T10:30:00.000Z"),
      status: "scheduled",
      notes: "Arguments completed. Pending final submissions of environmental clearance.",
      summary: "Today's Hearing: Arguments completed. Next Hearing: 15 August. Pending: Evidence submission.",
      videoLink: "https://meet.google.com/abc-defg-hij"
    }
  ],
  auditLogs: []
};

// Seed initial mock users (passwords are 'password123')
const hash = bcryptjs.hashSync('password123', 10);
mockDb.users.push(
  { _id: "admin_mock_1", name: "System Admin", email: "admin@court.gov", password: hash, role: "admin" },
  { _id: "judge_mock_1", name: "Justice ABC", email: "judge@court.gov", password: hash, role: "judge" },
  { _id: "lawyer_mock_1", name: "Sarah Jenkins, Esq.", email: "lawyer@court.gov", password: hash, role: "lawyer" },
  { _id: "client_mock_1", name: "John Doe", email: "client@court.gov", password: hash, role: "client" },
  { _id: "client_mock_2", name: "Jane Smith", email: "jane@court.gov", password: hash, role: "client" }
);

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/case_management';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isDbConnected = true;
    console.log('✅ Successfully connected to MongoDB database.');
  } catch (error) {
    console.log('⚠️ MongoDB connection timed out or failed. Falling back to the in-memory fallback database.');
    isDbConnected = false;
  }
}
