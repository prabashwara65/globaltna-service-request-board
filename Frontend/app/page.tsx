'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job } from './types/job';
import { Wrench, Zap, Paintbrush, Hammer, MoreHorizontal } from 'lucide-react';

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
      case 'Open': return { 
        bg: 'bg-emerald-500/10', 
        text: 'text-emerald-400', 
        label: 'Open',
      };
      case 'In Progress': return { 
        bg: 'bg-amber-500/10', 
        text: 'text-amber-400', 
        label: 'In Progress',
      };
      case 'Closed': return { 
        bg: 'bg-gray-500/10', 
        text: 'text-gray-400', 
        label: 'Closed',
      };
      default: return { 
        bg: 'bg-gray-500/10', 
        text: 'text-gray-400', 
        label: status,
      };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96" style={{ backgroundColor: '#151517' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-4 font-poppins">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#151517' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#151517' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight font-poppins">
              Service Requests
            </h1>
            <p className="text-gray-400 mt-2 text-lg font-poppins">
              Find and post service requests in your area
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div style={{ backgroundColor: '#151517' }} className="mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-poppins">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border-0 rounded-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 bg-gray-900 text-white font-poppins"
                style={{ backgroundColor: '#1F1F23' }}
              >
                <option value="all">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Painting">Painting</option>
                <option value="Joinery">Joinery</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-poppins">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-0 rounded-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 bg-gray-900 text-white font-poppins"
                style={{ backgroundColor: '#1F1F23' }}
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
                className="text-white px-6 py-2.5 text-sm font-medium transition font-poppins"
                style={{ backgroundColor: '#027FDB' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0268B5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#027FDB'}
              >
                + Post New Request
              </Link>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-20" style={{ backgroundColor: '#212023' }}>
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1F1F23' }}>
              <Wrench className="w-10 h-10" stroke="#6B7280" fill="#6B7280" />
            </div>
            <p className="text-gray-500 text-lg font-poppins">No service requests found</p>
            <Link href="/jobs/new" className="text-blue-400 hover:text-blue-300 underline mt-3 inline-block font-poppins">
              Create the first request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job: Job) => {
              const statusStyle = getStatusStyle(job.status);
              const categoryColor = getCategoryColor(job.category);
              const IconComponent = getCategoryIcon(job.category);
              
              return (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <div 
                    className="group transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-0.5 relative"
                    style={{ 
                      backgroundColor: '#212023',
                      width: '100%',
                      height: '320px',
                    }}
                  >
                    {/* NO TOP ACCENT LINE - REMOVED */}
                    
                    <div className="p-5 flex flex-col h-full">
                      {/* Top row: Icon and Status + Date */}
                      <div className="flex justify-between items-start mb-3">
                        {/* ORIGINAL ICON - Colored square with WHITE icon */}
                        <div 
                          className="w-10 h-10 flex items-center justify-center"
                          style={{ backgroundColor: categoryColor }}
                        >
                          <IconComponent 
                            className="w-5 h-5" 
                            stroke="white" 
                            fill="white" 
                            strokeWidth={1.5}
                          />
                        </div>
                        
                        {/* Status and Date container */}
                        <div className="flex flex-col items-end gap-1">
                          <div className={`flex items-center px-2.5 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs font-medium font-poppins`}>
                            <span>{statusStyle.label}</span>
                          </div>
                          <div className="text-gray-500 text-xs font-poppins">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-gray-300 transition line-clamp-1 font-poppins">
                        {job.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1 font-poppins">
                        {job.description}
                      </p>
                      
                      {/* Border line at 75% width from left */}
                      <div className="pt-3 mt-auto">
                        <div 
                          className="border-t border-gray-700"
                          style={{ width: '75%' }}
                        ></div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500 text-xs">Location</span>
                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wide font-poppins">
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DUPLICATE ICON - Absolute positioned at bottom right, gray transparent */}
                    <div 
                      className="absolute flex items-center justify-center"
                      style={{ 
                        bottom: '0',
                        right: '0',
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'rgba(128, 128, 128, 0.15)',
                      }}
                    >
                      <IconComponent 
                        className="w-12 h-12" 
                        stroke="rgba(255, 255, 255, 0.2)" 
                        fill="rgba(255, 255, 255, 0.05)" 
                        strokeWidth={1.5}
                      />
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