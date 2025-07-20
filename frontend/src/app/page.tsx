'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  FunnelIcon,
  Bars3Icon,
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author: {
    author_name: string;
  };
  created_at: string;
  published: boolean;
  slug: string;
}

export default function AdminDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    fetchArticles();
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

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://45.56.120.65:8000/api/articles/');
      if (response.ok) {
        const data = await response.json();
        const articlesData = data.results || data;
        setArticles(articlesData);
        
        // Calculate stats
        setStats({
          total: articlesData.length,
          published: articlesData.filter((a: Article) => a.published).length,
          drafts: articlesData.filter((a: Article) => !a.published).length
        });
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
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

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`http://45.56.120.65:8000/api/articles/${articleToDelete.id}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setArticles(articles.filter(article => article.id !== articleToDelete.id));
        setDeleteModalOpen(false);
        setArticleToDelete(null);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
        
        // Update stats
        const updatedArticles = articles.filter(article => article.id !== articleToDelete.id);
        setStats({
          total: updatedArticles.length,
          published: updatedArticles.filter((a: Article) => a.published).length,
          drafts: updatedArticles.filter((a: Article) => !a.published).length
        });
      } else {
        console.error('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
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
            {/* <CheckCircleIcon className="sidebar-logo-icon" /> */}
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
                <Link href="/" className="nav-link active">
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
                <Link href="/programs" className="nav-link">
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
                    placeholder="Search articles..." 
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
                        setUserDropdownOpen(false); // close dropdown if needed
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
              Article deleted successfully!
            </div>
          )}



          {/* Stats Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-flex">
                <div className="stat-icon blue">
                  <DocumentTextIcon />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Articles</div>
                  <div className="stat-value">{stats.total}</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-flex">
                <div className="stat-icon green">
                  <CheckCircleIcon />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Published</div>
                  <div className="stat-value">{stats.published}</div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-flex">
                <div className="stat-icon yellow">
                  <ClockIcon />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Drafts</div>
                  <div className="stat-value">{stats.drafts}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="table-container">
            <div className="table-header">
              <h2 className="table-title">Recent Articles</h2>
              <div className="table-actions">
                <Link href="/create-article" className="btn-primary">
                  <PlusIcon className="nav-icon mr-2" />
                  Add New Article
                </Link>
                <button className="btn-secondary">
                  <FunnelIcon />
                  Filter
                </button>
                <button className="btn-secondary">
                  <Bars3Icon />
                  Sort
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Loading articles...
                </div>
              </div>
            ) : articles.length === 0 ? (
              <div className="empty-container">
                <DocumentTextIcon className="empty-icon" />
                <h3 className="empty-title">No articles</h3>
                <p className="empty-text">Get started by creating your first article.</p>
                <div className="empty-action">
                  <Link href="/create-article" className="btn-primary">
                    <PlusIcon className="nav-icon mr-2" />
                    Create Article
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Article
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Author
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Date
                      </th>
                      <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#ffffff' }}>
                    {articles.map((article) => (
                      <tr key={article.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                              <DocumentTextIcon style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{article.title}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{article.content.substring(0, 100)}...</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827' }}>
                          {article.author_name || 'Anonymous'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: article.published ? '#dcfce7' : '#fef3c7',
                            color: article.published ? '#166534' : '#92400e'
                          }}>
                            {article.published ? (
                              <>
                                <CheckCircleIcon style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                Published
                              </>
                            ) : (
                              <>
                                <ClockIcon style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                Draft
                              </>
                            )}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link 
                              href={`/edit-article/${article.id}`}
                              style={{ color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <PencilIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteClick(article)}
                              style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <TrashIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                              Delete
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
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Article</h3>
              <button 
                className="modal-close"
                onClick={handleDeleteCancel}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete &quot;<strong>{articleToDelete?.title}</strong>&quot;?</p>
              <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
