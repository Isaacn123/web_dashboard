'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  image_url?: string;
  author: {
    author_name: string;
  };
  created_at: string;
  published: boolean;
  slug: string;
}

export default function ArticlesPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'drafts'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.author_name && article.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && article.published) ||
                         (filterStatus === 'drafts' && !article.published);
    
    return matchesSearch && matchesFilter;
  });

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

  const togglePublishStatus = async (articleId: number, currentStatus: boolean) => {
    try {
      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      const response = await fetch(`http://45.56.120.65:8000/api/articles/${articleId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...article,
          published: !currentStatus
        }),
      });
      
      if (response.ok) {
        setArticles(articles.map(article => 
          article.id === articleId 
            ? { ...article, published: !currentStatus }
            : article
        ));
      }
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Show loading screen while checking authentication
  if (authChecking) {
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
            <CheckCircleIcon className="sidebar-logo-icon" />
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
                <Link href="/articles" className="nav-link active">
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
                    <button className="dropdown-item">
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
          {/* Header */}
          <div className="page-header">
            <div className="page-header-content">
              <div className="page-title-section">
                <h1 className="page-title">Articles</h1>
                <p className="page-subtitle">Manage all your articles and content</p>
              </div>
              <Link href="/create-article" className="btn-primary">
                <PlusIcon className="nav-icon mr-2" />
                Create Article
              </Link>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-container">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All ({articles.length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'published' ? 'active' : ''}`}
                onClick={() => setFilterStatus('published')}
              >
                Published ({articles.filter(a => a.published).length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'drafts' ? 'active' : ''}`}
                onClick={() => setFilterStatus('drafts')}
              >
                Drafts ({articles.filter(a => !a.published).length})
              </button>
            </div>
          </div>

          {/* Success Notification */}
          {deleteSuccess && (
            <div className="alert alert-success mb-4">
              Article deleted successfully!
            </div>
          )}

          {/* Articles List */}
          <div className="articles-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Loading articles...
                </div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="empty-container">
                <DocumentTextIcon className="empty-icon" />
                <h3 className="empty-title">
                  {searchTerm || filterStatus !== 'all' ? 'No articles found' : 'No articles yet'}
                </h3>
                <p className="empty-text">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by creating your first article.'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <div className="empty-action">
                    <Link href="/create-article" className="btn-primary">
                      <PlusIcon className="nav-icon mr-2" />
                      Create Article
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="articles-grid">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="article-card">
                    {article.image_url && (
                      <div className="article-image">
                        <Image 
                          src={article.image_url} 
                          alt={article.title}
                          width={300}
                          height={200}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '0.5rem 0.5rem 0 0'
                          }}
                        />
                      </div>
                    )}
                    <div className="article-header">
                      <div className="article-status">
                        <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="article-actions">
                        <button
                          onClick={() => togglePublishStatus(article.id, article.published)}
                          className="action-btn"
                          title={article.published ? 'Unpublish' : 'Publish'}
                        >
                          {article.published ? (
                            <EyeSlashIcon className="nav-icon" />
                          ) : (
                            <EyeIcon className="nav-icon" />
                          )}
                        </button>
                        <Link href={`/edit-article/${article.id}`} className="action-btn">
                          <PencilIcon className="nav-icon" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(article)}
                          className="action-btn delete"
                        >
                          <TrashIcon className="nav-icon" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="article-content">
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-excerpt">
                        {article.content.length > 150 
                          ? `${article.content.substring(0, 150)}...` 
                          : article.content}
                      </p>
                    </div>
                    
                    <div className="article-footer">
                      <div className="article-meta">
                        <span className="article-author">
                          By {article.author_name || 'Anonymous'}
                        </span>
                        <span className="article-date">
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <Link href={`/articles/${article.slug}`} className="view-link">
                        View Article →
                      </Link>
                    </div>
                  </div>
                ))}
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