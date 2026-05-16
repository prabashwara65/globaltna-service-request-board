const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Job = require('../model/Job');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here_change_in_production';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Please log in to update job status.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// GET /api/jobs - Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (status && status !== 'all') filter.status = status;
    
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jobs - Create new job
router.post('/', async (req, res) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;
    
    // Validation
    if (!title || !description || !category || !location || !contactName || !contactEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/jobs/:id - Update status only
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Open', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }
    
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    job.status = status;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
