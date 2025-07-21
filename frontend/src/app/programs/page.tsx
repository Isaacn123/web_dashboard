'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Program[];
}

export default function ProgramsPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // API state
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('order');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchPrograms = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        ordering: ordering,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`http://45.56.120.65:8000/api/programs/?${params}`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setPrograms(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / pageSize));
        
        // Calculate stats
        setStats({
          total: data.count,
          active: data.results.filter((p: Program) => p.active).length,
          inactive: data.results.filter((p: Program) => !p.active).length
        });
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, ordering, searchTerm]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    fetchPrograms();
  }, [isAuthenticated, router, fetchPrograms]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`http://45.56.120.65:8000/api/programs/${programToDelete.id}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDeleteModalOpen(false);
        setProgramToDelete(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
        
        // Refresh the programs list
        fetchPrograms();
      } else {
        console.error('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProgramToDelete(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPrograms();
  };

  const handleOrderingChange = (newOrdering: string) => {
    setOrdering(newOrdering);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading screen while checking authentication
  if (loading || authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Loading programs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="programs" />
      {/* Main Content */}
      <div className="main-wrapper">
        {/* Header */}
        <Header
          user={user}
          setSidebarOpen={setSidebarOpen}
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          handleLogout={handleLogout}
          router={router}
        />
        {/* Main Content Area */}
        <main className="main-content">
          {/* Success Notification */}
          {deleteSuccess && (
            <div className="alert alert-success mb-4">
              Program deleted successfully!
            </div>
          )}

          {/* Page Header */}
          <div className="page-header">
            <div className="page-header-content">
              <h1 className="page-title">Programs</h1>
              <p className="page-subtitle">Manage ongoing programs content</p>
            </div>
            <div className="page-header-actions">
              <Link href="/create-program" className="btn btn-primary">
                <PlusIcon className="btn-icon" />
                Add Program
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-flex">
                <div className="stat-icon blue">
                  <AcademicCapIcon style={{width: '1rem', height: '1rem'}} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Programs</div>
                  <div className="stat-value">{stats.total}</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-flex">
                <div className="stat-icon green">
                  <CheckCircleIcon style={{width: '1rem', height: '1rem'}} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Active</div>
                  <div className="stat-value">{stats.active}</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-flex">
                <div className="stat-icon orange">
                  <ClockIcon style={{width: '1rem', height: '1rem'}} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Inactive</div>
                  <div className="stat-value">{stats.inactive}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="content-card mb-6">
            <div className="card-header">
              <h2 className="card-title">Filters</h2>
            </div>
            <div className="card-content">
              <div className="filters-grid">
                {/* Search */}
                <form onSubmit={handleSearch} className="search-form">
                  <div className="search-input-group">
                    <MagnifyingGlassIcon className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search programs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                  </div>
                </form>

                {/* Ordering */}
                <div className="ordering-controls">
                  <label className="form-label">Sort by:</label>
                  <select
                    value={ordering}
                    onChange={(e) => handleOrderingChange(e.target.value)}
                    className="form-select"
                  >
                    <option value="order">Display Order</option>
                    <option value="title">Title</option>
                    <option value="created_at">Date Created</option>
                    <option value="-created_at">Date Created (Newest)</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Programs List */}
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Programs List</h2>
              <div className="card-header-actions">
                <span className="text-sm text-gray-600">
                  Showing {programs.length} of {totalCount} programs
                </span>
              </div>
            </div>
            <div className="card-content">
              {programs.length === 0 ? (
                <div className="empty-state">
                  <AcademicCapIcon className="empty-icon" style={{width: '1rem', height: '1rem'}} />
                  <h3 className="empty-title">No programs found</h3>
                  <p className="empty-description">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first program.'}
                  </p>
                  {!searchTerm && (
                    <Link href="/create-program" className="btn btn-primary">
                      <PlusIcon className="btn-icon" />
                      Create Program
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="programs-grid">
                    {programs.map((program, index) => (
                      <div key={program.id} className="program-card">
                        <div className="program-card-header">
                          <div className="program-card-title">
                            <h3 className="program-title">{program.title}</h3>
                            <div className="program-meta">
                              <span className="program-order">
                                Order: {program.order || index + 1}
                              </span>
                              <span className={`program-status ${program.active ? 'active' : 'inactive'}`}>
                                {program.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="program-card-actions">
                            <Link 
                              href={`/edit-program/${program.id}`}
                              className="btn btn-sm btn-secondary"
                              title="Edit Program"
                            >
                              <PencilIcon className="btn-icon" style={{width: '1rem', height: '1rem'}} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(program)}
                              className="btn btn-sm btn-danger"
                              title="Delete Program"
                            >
                              <TrashIcon className="btn-icon" style={{width: '1rem', height: '1rem'}} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="program-card-content">
                          <p className="program-description">{program.description}</p>
                          
                          <div className="program-card-footer">
                            <div className="program-category">
                              <span className="badge badge-secondary">{program.category}</span>
                            </div>
                            <div className="program-date">
                              Created: {new Date(program.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <div className="pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="pagination-btn"
                        >
                          <ChevronLeftIcon className="pagination-icon" />
                          Previous
                        </button>
                        
                        <div className="pagination-pages">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="pagination-btn"
                        >
                          Next
                          <ChevronRightIcon className="pagination-icon" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Delete Program</h3>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete &quot;{programToDelete?.title}&quot;?</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleDeleteCancel}
                className="btn btn-secondary"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 