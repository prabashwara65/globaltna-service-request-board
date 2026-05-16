'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Job } from './types/job';
import { Wrench, Zap, Paintbrush, Hammer, MoreHorizontal, LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchJobs = async () => {
    try {
      let url = `http://localhost:5050/api/jobs`;
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Filter by search term
      let filteredData = data;
      if (searchTerm) {
        filteredData = data.filter((job: Job) => 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setJobs(filteredData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [categoryFilter, statusFilter, searchTerm]);

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
          <p className="text-gray-400 mt-4">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#151517' }}>
      {/* Header with Auth Buttons */}
      <div style={{ backgroundColor: '#151517' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#027FDB' }}>
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">ServiceBoard</span>
            </div>
            
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300 text-sm">Welcome, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-white text-sm transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-400 hover:text-white text-sm transition">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="text-white px-3 py-1.5 text-sm transition"
                    style={{ backgroundColor: '#027FDB' }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* <div className="max-w-7xl mx-auto px-6 py-8 md:px-8 md:py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Service Requests
            </h1>
            <p className="text-gray-400 mt-3 text-base md:text-lg max-w-2xl mx-auto">
              Find and post service requests in your area
            </p>
          </div>
        </div> */}
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Filters Section */}
          <div style={{ backgroundColor: '#151517' }} className="mb-10">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                  style={{ backgroundColor: '#1F1F23' }}
                />
              </div>
              
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
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
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border-0 px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-500 text-white"
                  style={{ backgroundColor: '#1F1F23' }}
                >
                  <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-end">
                {isAuthenticated ? (
                  <Link
                    href="/jobs/new"
                    className="text-white px-6 py-2.5 text-sm font-medium transition"
                    style={{ backgroundColor: '#027FDB' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0268B5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#027FDB'}
                  >
                    + Post New Request
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-white px-6 py-2.5 text-sm font-medium transition flex items-center gap-2"
                    style={{ backgroundColor: '#6B7280' }}
                  >
                    <LogIn className="w-4 h-4" />
                    Login to Post
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-4">
            <p className="text-gray-500 text-sm">
              Showing <span className="text-white font-semibold">{jobs.length}</span> requests
            </p>
          </div>

          {/* Scrollable Cards Container */}
          <div className="overflow-y-auto" style={{ maxHeight: '60vh', scrollbarWidth: 'thin' }}>
            {jobs.length === 0 ? (
              <div className="text-center py-20 px-6" style={{ backgroundColor: '#212023' }}>
                <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1F1F23' }}>
                  <Wrench className="w-10 h-10" stroke="#6B7280" fill="#6B7280" />
                </div>
                <p className="text-gray-500 text-lg">No service requests found</p>
                {isAuthenticated ? (
                  <Link href="/jobs/new" className="text-blue-400 hover:text-blue-300 underline mt-3 inline-block">
                    Create the first request
                  </Link>
                ) : (
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 underline mt-3 inline-block">
                    Login to create a request
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {jobs.map((job: Job) => {
                  const statusStyle = getStatusStyle(job.status);
                  const categoryColor = getCategoryColor(job.category);
                  const IconComponent = getCategoryIcon(job.category);
                  
                  return (
                    <Link key={job._id} href={`/jobs/${job._id}`}>
                      <div 
                        className="group transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-0.5 relative"
                        style={{ backgroundColor: '#212023', width: '100%', height: '260px' }}
                      >
                        <div className="p-4 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: categoryColor }}>
                              <IconComponent className="w-4 h-4" stroke="white" fill="white" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              <div className={`flex items-center px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text} text-xs font-medium`}>
                                <span>{statusStyle.label}</span>
                              </div>
                              <div className="text-gray-500 text-xs">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ width: '75%' }}>
                            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-gray-300 transition line-clamp-1">
                              {job.title}
                            </h3>
                          </div>
                          
                          <div style={{ width: '75%' }}>
                            <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
                              {job.description}
                            </p>
                          </div>
                          
                          <div className="pt-2 mt-auto">
                            <div className="border-t border-gray-700" style={{ width: '75%' }}></div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500 text-xs">Location</span>
                                <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                                  {job.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Duplicate Icon */}
                        <div className="absolute flex flex-col items-center justify-center" style={{ bottom: '8px', right: '5px', width: '80px', height: 'auto' }}>
                          <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(128, 128, 128, 0.15)', marginBottom: '4px' }}>
                            <IconComponent className="w-5 h-5" stroke="rgba(255, 255, 255, 0.3)" fill="rgba(255, 255, 255, 0.05)" strokeWidth={1.5} />
                          </div>
                          <span className="text-gray-500 text-xs text-center" style={{ fontSize: '9px', letterSpacing: '0.3px' }}>
                            {job.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto" style={{ backgroundColor: '#1A1A1E', borderTop: '1px solid #2A2A2E' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Service Board. All rights reserved. | Developed By Priyanka Prabashwara
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}