'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job } from './types/job';

export default function HomePage() {
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchJobs = async () => {
    try {
      let url = `http://localhost:5050/api/jobs`;
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [categoryFilter, statusFilter]);

  // Get icon based on category (like Moscow design)
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'Plumbing': return '🔧';
      case 'Electrical': return '⚡';
      case 'Painting': return '🎨';
      case 'Joinery': return '🪑';
      default: return '🔨';
    }
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Open' };
      case 'In Progress': return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'In Progress' };
      case 'Closed': return { bg: 'bg-gray-50', text: 'text-gray-500', label: 'Closed' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-500', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header - Moscow style */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-500 mt-1">Find and post service requests in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters - Clean like Moscow design */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Categories</option>
                <option value="Plumbing">🔧 Plumbing</option>
                <option value="Electrical">⚡ Electrical</option>
                <option value="Painting">🎨 Painting</option>
                <option value="Joinery">🪑 Joinery</option>
                <option value="Other">🔨 Other</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex items-end">
              <Link
                href="/jobs/new"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm"
              >
                + Post New Request
              </Link>
            </div>
          </div>
        </div>

        {/* Cards Grid - Moscow Gorod Style */}
        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-gray-500 text-lg">No service requests found</p>
            <Link href="/jobs/new" className="text-blue-600 hover:underline mt-3 inline-block">
              Create the first request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job: Job) => {
              const statusBadge = getStatusBadge(job.status);
              
              return (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                    {/* Card Header - with icon and status */}
                    <div className="p-5 pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-3xl">{getCategoryIcon(job.category)}</div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    
                    {/* Card Footer - like Moscow design with percentage/category */}
                    <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">📍</span>
                          <span className="text-gray-600">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 text-xs">📂</span>
                          <span className="text-gray-600 text-sm">{job.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}