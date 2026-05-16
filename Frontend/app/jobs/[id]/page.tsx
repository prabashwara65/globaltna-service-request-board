'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
}

export default function JobDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchJob = async () => {
      try {
        console.log('Fetching job with ID:', id);
        const res = await fetch(`http://localhost:5050/api/jobs/${id}`);
        
        if (!res.ok) {
          throw new Error('Job not found');
        }
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5050/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update status');
      
      const updated = await res.json();
      setJob(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
      const res = await fetch(`http://localhost:5050/api/jobs/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      router.push('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Job not found'}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Description</h2>
            <p className="text-gray-900 mt-1">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Category</h2>
              <p className="text-gray-900 mt-1">{job.category}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Location</h2>
              <p className="text-gray-900 mt-1">{job.location}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Contact Name</h2>
              <p className="text-gray-900 mt-1">{job.contactName}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Contact Email</h2>
              <p className="text-gray-900 mt-1">{job.contactEmail}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Posted Date</h2>
              <p className="text-gray-900 mt-1">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            {updating && <span className="ml-3 text-sm text-gray-500">Updating...</span>}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <Link
              href={`/jobs/edit/${job._id}`}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
            >
              Edit Request
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}