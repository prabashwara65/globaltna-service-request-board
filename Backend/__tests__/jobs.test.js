const request = require('supertest');
const express = require('express');

// Mock the Job model
jest.mock('../model/Job', () => {
  let jobsStore = [
    {
      _id: '507f1f77bcf86cd799439011',
      title: 'Test Job',
      description: 'This is a test job description',
      category: 'Plumbing',
      location: 'Glasgow',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      status: 'Open',
      createdAt: new Date(),
    },
  ];

  const JobMock = function(data) {
    Object.assign(this, data);
    this._id = '507f1f77bcf86cd799439015';
    this.save = jest.fn().mockResolvedValue(this);
    jobsStore.push(this);
    return this;
  };

  JobMock.find = jest.fn().mockImplementation((filter = {}) => {
    let results = [...jobsStore];
    if (filter.category) {
      results = results.filter(j => j.category === filter.category);
    }
    if (filter.status) {
      results = results.filter(j => j.status === filter.status);
    }
    return {
      sort: jest.fn().mockResolvedValue(results),
    };
  });

  JobMock.findById = jest.fn().mockImplementation((id) => {
    const job = jobsStore.find(j => j._id === id);
    return Promise.resolve(job || null);
  });

  JobMock.findByIdAndDelete = jest.fn().mockImplementation((id) => {
    const index = jobsStore.findIndex(j => j._id === id);
    if (index !== -1) {
      const deleted = jobsStore[index];
      jobsStore.splice(index, 1);
      return Promise.resolve(deleted);
    }
    return Promise.resolve(null);
  });

  return JobMock;
});

// Create a test app with jobs routes
const jobRoutes = require('../routes/jobs');
const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes);

describe('Jobs API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/jobs', () => {
    it('should return all jobs', async () => {
      const response = await request(app).get('/api/jobs');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle category filter', async () => {
      const response = await request(app).get('/api/jobs?category=Plumbing');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle status filter', async () => {
      const response = await request(app).get('/api/jobs?status=Open');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should return a single job by ID', async () => {
      const jobId = '507f1f77bcf86cd799439011';
      const response = await request(app).get(`/api/jobs/${jobId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Job');
    });

    it('should return 404 for non-existent job', async () => {
      const jobId = '000000000000000000000000';
      const response = await request(app).get(`/api/jobs/${jobId}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job with valid data', async () => {
      const newJob = {
        title: 'New Test Job',
        description: 'This is a new test job description',
        category: 'Electrical',
        location: 'Edinburgh',
        contactName: 'Jane Smith',
        contactEmail: 'jane@example.com',
      };

      const response = await request(app).post('/api/jobs').send(newJob);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'New Test Job');
    });

    it('should return 400 if title is missing', async () => {
      const invalidJob = {
        description: 'Missing title',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
      };

      const response = await request(app).post('/api/jobs').send(invalidJob);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if description is missing', async () => {
      const invalidJob = {
        title: 'No Description',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'John Doe',
        contactEmail: 'john@example.com',
      };

      const response = await request(app).post('/api/jobs').send(invalidJob);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('should delete a job', async () => {
      const jobId = '507f1f77bcf86cd799439011';
      const response = await request(app).delete(`/api/jobs/${jobId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Job deleted successfully');
    });

    it('should return 404 for non-existent job', async () => {
      const jobId = '000000000000000000000000';
      const response = await request(app).delete(`/api/jobs/${jobId}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});