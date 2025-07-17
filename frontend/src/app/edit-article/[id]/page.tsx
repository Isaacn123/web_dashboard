'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  Bars3Icon,
  HomeIcon,
  DocumentTextIcon,
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  image_url?: string;
  published: boolean;
  slug: string;
}

export default function EditArticlePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date:'',
    author_name: user?.username || '',
    published: false,
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const fetchArticle = useCallback(async () => {
    try {
      // 127.0.0.1;
       const response = await fetch(`http://45.56.120.65:8000/api/articles/${articleId}/`);
      if (response.ok) {
        const articleData = await response.json();
        setArticle(articleData);
        setFormData({
          title: articleData.title,
          content: articleData.content,
          date:articleData.date,
          author_name: articleData.author_name,
          published: articleData.published,
          image_url: articleData.image_url || ''
        });
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    fetchArticle();
  }, [isAuthenticated, router, articleId, fetchArticle]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setSaving(true);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          image_url: data.data.url
        }));
        setSuccess('Image uploaded successfully!');
      } else {
        setError('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://45.56.120.65:8000/api/articles/${articleId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Article updated successfully!');
        setTimeout(() => {
          router.push('/articles');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      setError('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/articles" className="btn-primary">
                  <ArrowLeftIcon className="nav-icon mr-2" />
            Back to Articles
          </Link>
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
                <Link href="/articles" className="back-link">
                  <ArrowLeftIcon className="nav-icon mr-2" />
                  Back to Articles
                </Link>
                <h1 className="page-title">Edit Article</h1>
                <p className="page-subtitle">Update your article content and settings</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="form-container">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="article-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter article title"
                  required
                />
              </div>

           <div className="form-group">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter article date"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Write your article content here..."
                  rows={15}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">Article Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                  />
                  <label htmlFor="image" className="image-upload-label">
                    <PhotoIcon className="nav-icon" />
                    <span>Choose Image</span>
                  </label>
                </div>
                {formData.image_url && (
                  <div className="image-preview">
                    <Image 
                      src={formData.image_url} 
                      alt="Preview" 
                      width={200}
                      height={150}
                      className="preview-image"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Publish article</span>
                </label>
              </div>

              <div className="form-actions">
                <Link href="/articles" className="btn-secondary">
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Update Article'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 