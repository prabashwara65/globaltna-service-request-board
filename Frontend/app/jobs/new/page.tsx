'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Zap, Paintbrush, Hammer, MoreHorizontal } from 'lucide-react';

interface CreateJobInput {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<CreateJobInput>({
    title: '',
    description: '',
    category: 'Plumbing',
    location: '',
    contactName: '',
    contactEmail: '',
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
    switch (category) {
      case 'Plumbing': return Wrench;
      case 'Electrical': return Zap;
      case 'Painting': return Paintbrush;
      case 'Joinery': return Hammer;
      default: return MoreHorizontal;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      setLoading(false);
      return;
    }
    if (!formData.contactName.trim()) {
      setError('Contact name is required');
      setLoading(false);
      return;
    }
    if (!formData.contactEmail.match(/^\S+@\S+\.\S+$/)) {
      setError('Valid email is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5050/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create job');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = getCategoryColor(formData.category);
  const IconComponent = getCategoryIcon(formData.category);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#151517' }}>
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <span>←</span> Back to Home
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
                <IconComponent 
                  className="w-6 h-6" 
                  stroke="white" 
                  fill="white" 
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Post New Service Request
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white px-4 py-2.5 text-sm font-medium transition disabled:opacity-50"
                  style={{ backgroundColor: '#027FDB' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0268B5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#027FDB'}
                >
                  {loading ? 'Creating...' : 'Post Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}