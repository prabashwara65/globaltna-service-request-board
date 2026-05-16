'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Zap, Paintbrush, Hammer, MoreHorizontal } from 'lucide-react';

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plumbing': return Wrench;
      case 'Electrical': return Zap;
      case 'Painting': return Paintbrush;
      case 'Joinery': return Hammer;
      default: return MoreHorizontal;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Plumbing': return '#9C38A8';
      case 'Electrical': return '#027FDB';
      case 'Painting': return '#40D774';
      case 'Joinery': return '#F84738';
      default: return '#6B7280';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Open': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Open' };
      case 'In Progress': return { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'In Progress' };
      case 'Closed': return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Closed' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96" style={{ backgroundColor: '#151517' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center" style={{ backgroundColor: '#151517' }}>
        <p className="text-red-500 mb-4">{error || 'Job not found'}</p>
        <Link href="/" className="text-gray-400 hover:text-white transition inline-flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
      </div>
    );
  }

  const statusStyle = getStatusStyle(job.status);
  const categoryColor = getCategoryColor(job.category);
  const IconComponent = getCategoryIcon(job.category);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#151517' }}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <span>←</span> Back to all requests
        </Link>

        {/* Main Card */}
        <div style={{ backgroundColor: '#212023', border: '1px solid #2A2A2E' }}>
          <div className="h-1" style={{ backgroundColor: categoryColor }}></div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-14 h-14 flex items-center justify-center"
                style={{ backgroundColor: categoryColor }}
              >
                <IconComponent 
                  className="w-7 h-7" 
                  stroke="white" 
                  fill="white" 
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {job.title}
                </h1>
                <div className={`inline-flex items-center px-3 py-1 ${statusStyle.bg} ${statusStyle.text} text-sm font-medium`}>
                  {statusStyle.label}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Description
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3" style={{ backgroundColor: '#1A1A1E' }}>
                <div className="text-xs text-gray-500 mb-1">Category</div>
                <div className="text-white text-sm font-medium">{job.category}</div>
              </div>
              <div className="p-3" style={{ backgroundColor: '#1A1A1E' }}>
                <div className="text-xs text-gray-500 mb-1">Location</div>
                <div className="text-white text-sm font-medium">{job.location}</div>
              </div>
              <div className="p-3" style={{ backgroundColor: '#1A1A1E' }}>
                <div className="text-xs text-gray-500 mb-1">Contact Name</div>
                <div className="text-white text-sm font-medium">{job.contactName}</div>
              </div>
              <div className="p-3" style={{ backgroundColor: '#1A1A1E' }}>
                <div className="text-xs text-gray-500 mb-1">Contact Email</div>
                <div className="text-white text-sm font-medium">{job.contactEmail}</div>
              </div>
              <div className="p-3" style={{ backgroundColor: '#1A1A1E' }}>
                <div className="text-xs text-gray-500 mb-1">Posted Date</div>
                <div className="text-white text-sm font-medium">
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="mb-6 pt-4 border-t border-gray-800">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Update Status
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="border-0 px-4 py-2 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                  style={{ backgroundColor: '#1A1A1E' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
                {updating && <span className="text-sm text-gray-500">Updating...</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <Link
                href={`/jobs/edit/${job._id}`}
                className="flex-1 text-white px-4 py-2 text-center text-sm font-medium transition"
                style={{ backgroundColor: '#027FDB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0268B5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#027FDB'}
              >
                Edit Request
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-center text-sm font-medium transition"
                style={{ backgroundColor: '#F84738' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D63A2C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F84738'}
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}