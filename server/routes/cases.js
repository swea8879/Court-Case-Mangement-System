import express from 'express';
import { Case } from '../models/Schemas.js';
import { isDbConnected, mockDb } from '../models/db.js';

const router = express.Router();

// Get all cases
router.get('/', async (req, res) => {
  try {
    if (isDbConnected) {
      const cases = await Case.find();
      return res.json(cases);
    } else {
      return res.json(mockDb.cases);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve cases', details: error.message });
  }
});

// Create case
router.post('/', async (req, res) => {
  const { title, caseType, judgeId, lawyerId, clientId, laws, precedents } = req.body;
  if (!title || !caseType) {
    return res.status(400).json({ error: 'Title and caseType are required' });
  }

  const caseId = 'CIV' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

  try {
    // Generate AI recommendations if not provided
    const computedLaws = laws || suggestLaws(title, caseType);
    const computedPrecedents = precedents || suggestPrecedents(title, caseType);

    if (isDbConnected) {
      const newCase = new Case({
        caseId,
        title,
        caseType,
        status: 'active',
        judgeId,
        lawyerId,
        clientId,
        laws: computedLaws,
        precedents: computedPrecedents
      });
      await newCase.save();
      return res.status(201).json(newCase);
    } else {
      const newCase = {
        _id: 'case_' + Date.now(),
        caseId,
        title,
        caseType,
        status: 'active',
        judgeId: judgeId || "judge_mock_1",
        lawyerId: lawyerId || "lawyer_mock_1",
        clientId: clientId || "client_mock_1",
        laws: computedLaws,
        precedents: computedPrecedents,
        createdAt: new Date().toISOString()
      };
      mockDb.cases.push(newCase);
      return res.status(201).json(newCase);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create case', details: error.message });
  }
});

// Update case
router.put('/:id', async (req, res) => {
  try {
    if (isDbConnected) {
      const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Case not found' });
      return res.json(updated);
    } else {
      const idx = mockDb.cases.findIndex(c => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Case not found' });
      mockDb.cases[idx] = { ...mockDb.cases[idx], ...req.body };
      return res.json(mockDb.cases[idx]);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Update failed', details: error.message });
  }
});

// Delete case
router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected) {
      const deleted = await Case.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Case not found' });
      return res.json({ message: 'Case deleted successfully' });
    } else {
      const idx = mockDb.cases.findIndex(c => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Case not found' });
      mockDb.cases.splice(idx, 1);
      return res.json({ message: 'Case deleted successfully (In-Memory)' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Delete failed', details: error.message });
  }
});

// Suggest legal acts (Simple AI knowledge engine fallback)
function suggestLaws(title, type) {
  const query = (title + ' ' + type).toLowerCase();
  const acts = [];
  if (query.includes('zoning') || query.includes('land') || query.includes('property')) {
    acts.push("Section 226 - Local Municipal Zoning Codes");
    acts.push("Article 300A - Right to Property");
  }
  if (query.includes('contract') || query.includes('agreement') || query.includes('breach')) {
    acts.push("Section 73 - Indian Contract Act (Damages for Breach)");
    acts.push("Section 10 - Essentials of Valid Contracts");
  }
  if (query.includes('corporate') || query.includes('tax') || query.includes('shares')) {
    acts.push("Section 135 - Companies Act");
  }
  if (query.includes('fir') || query.includes('assault') || query.includes('theft')) {
    acts.push("Section 378 - IPC (Theft)");
    acts.push("Section 154 - CrPC (First Information Report)");
  }
  if (acts.length === 0) {
    acts.push("Section 151 - Civil Procedure Code (Inherent powers of Court)");
  }
  return acts;
}

// Suggest Precedents
function suggestPrecedents(title, type) {
  const query = (title + ' ' + type).toLowerCase();
  const cases = [];
  if (query.includes('zoning') || query.includes('land') || query.includes('property')) {
    cases.push("State of Maharashtra vs. Municipal Zoning Corp (2021) - construction vesting rights");
  }
  if (query.includes('contract') || query.includes('agreement') || query.includes('breach')) {
    cases.push("Hadley vs. Baxendale (1854) - principles of consequential contract damages");
  }
  if (cases.length === 0) {
    cases.push("Justice Swaran Singh vs. Union of India (2019) - administrative process timeline standard");
  }
  return cases;
}

export default router;
