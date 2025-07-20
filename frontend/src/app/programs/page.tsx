'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  Bars3Icon,
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    fetchPrograms();
  }, [isAuthenticated, router]);

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

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://45.56.120.65:8000/api/programs/');
      if (response.ok) {
        const data = await response.json();
        const programsData = data.results || data;
        setPrograms(programsData);
        
        // Calculate stats
        setStats({
          total: programsData.length,
          active: programsData.filter((p: Program) => p.active).length,
          inactive: programsData.filter((p: Program) => !p.active).length
        });
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      // For now, use mock data until backend is ready
      const mockPrograms = [
        {
          id: 1,
          title: "BASKETBALL TRAINING PROGRAMS",
          description: "Off the Bench Basketball Academy provides a range of programs, including skills training for youth, prep and skills camps, all-girls camps, youth leagues, 3X3 challenges, performance fitness, and an adult basketball program.",
          category: "Training",
          order: 1,
          active: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        {
          id: 2,
          title: "INCLUSIVE BASKETBALL PROGRAMS",
          description: "Tailored training for children with special needs, creating an adaptive environment that fosters social interaction and athletic engagement.",
          category: "Inclusive",
          order: 2,
          active: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        {
          id: 3,
          title: "CAMPS & CLINICS",
          description: "Beyond sports skills, the academy integrates life skills training, including leadership, discipline, and teamwork, ensuring the holistic development of young athletes.",
          category: "Development",
          order: 3,
          active: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        {
          id: 4,
          title: "PERSONAL DEVELOPMENT PROGRAMS",
          description: "Seasonal camps during school holidays offering intensive basketball training, mentorship, and team-building activities",
          category: "Personal",
          order: 4,
          active: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        },
        {
          id: 5,
          title: "TOURNAMENTS & COMPETITIONS",
          description: "Regular tournaments and competitive events to showcase skills and foster healthy competition among participants.",
          category: "Competition",
          order: 5,
          active: true,
          created_at: "2024-01-01",
          updated_at: "2024-01-01"
        }
      ];
      setPrograms(mockPrograms);
      setStats({
        total: mockPrograms.length,
        active: mockPrograms.filter(p => p.active).length,
        inactive: mockPrograms.filter(p => !p.active).length
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
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
        setPrograms(programs.filter(program => program.id !== programToDelete.id));
        setDeleteModalOpen(false);
        setProgramToDelete(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
        
        // Update stats
        const updatedPrograms = programs.filter(program => program.id !== programToDelete.id);
        setStats({
          total: updatedPrograms.length,
          active: updatedPrograms.filter((p: Program) => p.active).length,
          inactive: updatedPrograms.filter((p: Program) => !p.active).length
        });
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

  // Show loading screen while checking authentication
  if (loading || authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-text">Admin</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <Bars3Icon className="nav-icon" />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Main</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  <HomeIcon className="nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/articles" className="nav-link">
                  <DocumentTextIcon className="nav-icon" />
                  <span>Articles</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/create-article" className="nav-link">
                  <PlusIcon className="nav-icon" />
                  <span>Create Article</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/teams" className="nav-link">
                  <UserGroupIcon className="nav-icon" />
                  <span>Teams</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/programs" className="nav-link active">
                  <AcademicCapIcon className="nav-icon" style={{width: '1rem', height: '1rem'}} />
                  <span>Programs</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h3 className="nav-section-title">Management</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/users" className="nav-link">
                  <UserGroupIcon className="nav-icon" />
                  <span>Users</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/analytics" className="nav-link">
                  <ChartBarIcon className="nav-icon" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/settings" className="nav-link">
                  <CogIcon className="nav-icon" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-flex">
              <div className="header-left">
                <button 
                  className="sidebar-toggle"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="nav-icon" />
                </button>
                <div className="header-search">
                  <MagnifyingGlassIcon className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search programs..." 
                    className="search-input"
                  />
                </div>
              </div>
              <div className="header-right">
                <button className="header-btn">
                  <BellIcon className="nav-icon" />
                </button>
                <div className="user-menu" onClick={toggleUserDropdown}>
                  <div className="user-avatar">
                    <UserGroupIcon className="nav-icon" />
                  </div>
                  <span className="user-name">{user?.username || 'Admin User'}</span>
                  <ChevronDownIcon className="nav-icon" />
                  
                  {/* User Dropdown */}
                  <div className={`user-dropdown ${userDropdownOpen ? 'open' : ''}`}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        router.push('/profile');
                      }}
                    >
                      <UserIcon className="nav-icon" />
                      Profile
                    </button>
                    <button className="dropdown-item">
                      <Cog6ToothIcon className="nav-icon" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout"
                    >
                      <ArrowRightOnRectangleIcon className="nav-icon" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
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

          {/* Programs List */}
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Programs List</h2>
            </div>
            <div className="card-content">
              {programs.length === 0 ? (
                <div className="empty-state">
                  <AcademicCapIcon className="empty-icon" style={{width: '1rem', height: '1rem'}} />
                  <h3 className="empty-title">No programs yet</h3>
                  <p className="empty-description">
                    Get started by creating your first program.
                  </p>
                  <Link href="/create-program" className="btn btn-primary">
                    <PlusIcon className="btn-icon" />
                    Create Program
                  </Link>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program.id}>
                          <td>{program.order}</td>
                          <td>
                            <div className="program-title">
                              <strong>{program.title}</strong>
                              <p className="program-description">{program.description}</p>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-secondary">{program.category}</span>
                          </td>
                          <td>
                            <span className={`badge ${program.active ? 'badge-success' : 'badge-warning'}`}>
                              {program.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(program.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <Link 
                                href={`/edit-program/${program.id}`}
                                className="btn btn-sm btn-secondary"
                              >
                                <PencilIcon className="btn-icon" style={{width: '1rem', height: '1rem'}} />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(program)}
                                className="btn btn-sm btn-danger"
                              >
                                <TrashIcon className="btn-icon" style={{width: '1rem', height: '1rem'}} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
              <p>Are you sure you want to delete "{programToDelete?.title}"?</p>
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