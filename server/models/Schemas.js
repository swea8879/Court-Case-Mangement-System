import mongoose from 'mongoose';

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'judge', 'lawyer', 'client'] }
}, { timestamps: true });

// Case Schema
const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  caseType: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  laws: [String],        // Associated sections/acts
  precedents: [String]   // Similar past judgments
}, { timestamps: true });

// Document Schema
const DocumentSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  documentName: { type: String, required: true },
  documentType: { type: String, required: true },
  fileURL: { type: String, required: true },
  summary: { type: String },
  ocrText: { type: String },
  isSigned: { type: Boolean, default: false },
  signedBy: { type: String }
}, { timestamps: true });

// Hearing Schema
const HearingSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true, default: 'scheduled' },
  notes: { type: String },
  summary: { type: String },
  videoLink: { type: String }
}, { timestamps: true });

// Audit Log Schema
const AuditLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
export const Case = mongoose.model('Case', CaseSchema);
export const Document = mongoose.model('Document', DocumentSchema);
export const Hearing = mongoose.model('Hearing', HearingSchema);
export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
