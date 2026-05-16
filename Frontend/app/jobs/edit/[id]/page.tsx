'use client';

import { createElement, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Zap, Paintbrush, Hammer, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Plumbing: Wrench,
  Electrical: Zap,
  Painting: Paintbrush,
  Joinery: Hammer,
  Other: MoreHorizontal,
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Something went wrong';
};

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

export default function EditJobPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    location: '',
    contactName: '',
    contactEmail: '',
    status: 'Open' as 'Open' | 'In Progress' | 'Closed',
  });

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Plumbing': return '#9C38A8';
      case 'Electrical': return '#027FDB';
      case 'Painting': return '#40D774';
      case 'Joinery': return '#F84738';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || MoreHorizontal;
  };

  // Fetch job data on load
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/jobs/${id}`);
        if (!res.ok) throw new Error('Job not found');
        const data: Job = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          status: data.status,
        });
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setError('Please log in to update job status.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Change from PUT to PATCH
      const res = await fetch(`http://localhost:5050/api/jobs/${id}`, {
        method: 'PATCH',  // Changed from PUT to PATCH
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: formData.status }), // Only send status
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update job');
      }

      router.push(`/jobs/${id}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const categoryColor = getCategoryColor(formData.category);
  const icon = createElement(getCategoryIcon(formData.category), {
    className: 'w-6 h-6',
    stroke: 'white',
    fill: 'white',
    strokeWidth: 1.5,
  });

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#151517' }}>
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <Link 
          href={`/jobs/${id}`} 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <span>←</span> Back to Job Details
        </Link>

        {/* Main Card */}
        <div style={{ backgroundColor: '#212023', border: '1px solid #2A2A2E' }}>
          <div className="h-1" style={{ backgroundColor: categoryColor }}></div>
          
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 flex items-center justify-center"
                style={{ backgroundColor: categoryColor }}
              >
                {icon}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Edit Service Request
              </h1>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-3" style={{ backgroundColor: '#F84738', color: 'white' }}>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                    style={{ backgroundColor: '#1A1A1E' }}
                    placeholder="e.g., Need a plumber for leaking tap"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white resize-none"
                    style={{ backgroundColor: '#1A1A1E' }}
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                {/* Category and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                      style={{ backgroundColor: '#1A1A1E' }}
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Painting">Painting</option>
                      <option value="Joinery">Joinery</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                      style={{ backgroundColor: '#1A1A1E' }}
                      placeholder="e.g., Glasgow"
                    />
                  </div>
                </div>

                {/* Contact Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                      style={{ backgroundColor: '#1A1A1E' }}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      required
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                      style={{ backgroundColor: '#1A1A1E' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                    style={{ backgroundColor: '#1A1A1E' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Action Buttons */}
                {!isAuthenticated && (
                  <Link href="/login" className="text-sm hover:underline" style={{ color: '#FF495F' }}>
                    Log in to update status
                  </Link>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving || !isAuthenticated}
                    className="flex-1 text-white px-4 py-2.5 text-sm font-medium transition disabled:opacity-50"
                    style={{ backgroundColor: '#027FDB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0268B5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#027FDB'}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link
                    href={`/jobs/${id}`}
                    className="flex-1 text-gray-400 px-4 py-2.5 text-sm font-medium text-center transition hover:text-white"
                    style={{ backgroundColor: '#1A1A1E' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#25252B'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1E'}
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
