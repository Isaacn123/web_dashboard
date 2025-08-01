'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckIcon,
  DocumentTextIcon, 
  PlusIcon, 
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  photo: string;
  email: string;
  phone: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  order: number;
  active: boolean;
}

export default function Teams() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    role: '',
    photo: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    order: 0,
    active: true
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ImgBB API Key
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const fetchTeamMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://45.56.120.65:8000/api/team-members/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(Array.isArray(data) ? data : (data.results || []));
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
        router.push('/login');
        return;
      } else {
        console.error('Failed to fetch team members:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  }, [logout, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setAuthChecking(false);
    fetchTeamMembers();
  }, [isAuthenticated, router, fetchTeamMembers]);

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

  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY as string);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      alert('Image size must be less than 32MB');
      return;
    }

    setImageLoading(true);
    try {
      const imageUrl = await uploadImageToImgBB(file);
      setFormData(prev => ({ ...prev, photo: imageUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const url = editingMember 
        ? `http://45.56.120.65:8000/api/team-members/${editingMember.id}/`
        : 'http://45.56.120.65:8000/api/team-members/';
      
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingMember(null);
        resetForm();
        fetchTeamMembers();
        alert(editingMember ? 'Team member updated successfully!' : 'Team member added successfully!');
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
        router.push('/login');
        return;
      } else {
        const errorData = await response.text();
        console.error('Error:', response.status, response.statusText, errorData);
        alert(`Error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://45.56.120.65:8000/api/team-members/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTeamMembers();
        alert('Team member deleted successfully!');
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
        router.push('/login');
        return;
      } else {
        alert('Failed to delete team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Error deleting team member');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      photo: '',
      email: '',
      phone: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      order: 0,
      active: true
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <CheckIcon className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">Admin</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <Bars3Icon className="w-5 h-5" />
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
                <Link href="/teams" className="nav-link active">
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
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <div className="header-search">
                  <MagnifyingGlassIcon className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="search-input"
                  />
                </div>
              </div>
              <div className="header-right">
                <button className="header-btn">
                  <BellIcon className="w-5 h-5" />
                </button>
                <div className="user-menu" onClick={toggleUserDropdown}>
                  <div className="user-avatar">
                    <UserGroupIcon className="w-5 h-5" />
                  </div>
                  <span className="user-name">{user?.username || 'Admin User'}</span>
                  <ChevronDownIcon className="w-5 h-5" />
                  
                  {/* User Dropdown */}
                  <div className={`user-dropdown ${userDropdownOpen ? 'open' : ''}`}>
                    <button className="dropdown-item">
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="dropdown-item">
                      <Cog6ToothIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
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
                <h1 className="page-title">Team Management</h1>
                <p className="page-subtitle">Manage your team members and their information</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                <PlusIcon style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                Add Team Member
              </button>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="table-container">
            {showCreateForm ? (
              <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                    <PlusIcon style={{height: '1rem', width:'1rem', marginRight: '0.5rem'}} /> Add Team Member
                  </h2>
                  <div>
                    <label className="form-label">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Role *</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} required className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Photo</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                    {imageLoading && <div className="spinner" style={{ width: 16, height: 16 }}></div>}
                    {formData.photo && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
                        <Image src={formData.photo} alt="Uploaded photo" width={100} height={100} className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Facebook URL</label>
                    <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Twitter URL</label>
                    <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">LinkedIn URL</label>
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Display Order</label>
                    <input type="number" name="order" value={formData.order} onChange={handleChange} min="0" className="form-input" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="form-input" style={{ width: 18, height: 18, marginRight: 8 }} />
                    <label className="form-label" style={{ margin: 0 }}>Active (visible on website)</label>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Add'}</button>
                  </div>
                </form>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner"></div>
                <span className="ml-2">Loading team members...</span>
              </div>
            ) : !Array.isArray(teamMembers) || teamMembers.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <UserGroupIcon style={{ width: '1rem', height: '1rem'}} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first team member.</p>
                  <button onClick={() => setShowCreateForm(true)} className="btn-primary">
                    <PlusIcon style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Add Team Member
                  </button>
                </div>
              </div>
            ) : (
              <div className="team-grid">
                {(teamMembers || []).map((member) => (
                  <div key={member.id} className="team-card">
                    <div className="relative">
                      {member.photo ? (
                        <Image 
                          src={member.photo} 
                          alt={member.name}
                          width={250}
                          height={192}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <PhotoIcon style={{width: '1rem', height: '1rem'}} className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <PencilIcon style={{width: '1rem', height: '1rem'}} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => member.id && handleDelete(member.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                      {member.email && (
                        <p className="text-xs text-gray-500 mb-1">{member.email}</p>
                      )}
                      {member.phone && (
                        <p className="text-xs text-gray-500 mb-3">{member.phone}</p>
                      )}
                      <div className="flex space-x-2">
                        {member.facebook && (
                          <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal - always render here, outside of main-wrapper and sidebar */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">
                {showEditModal ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingMember(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="modal-form-label">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="modal-form-input"
                />
              </div>

              {/* Role */}
              <div>
                <label className="modal-form-label">
                  Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="modal-form-input"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="modal-form-label">
                  Photo
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="modal-form-input"
                  />
                  {imageLoading && <div className="spinner w-4 h-4"></div>}
                </div>
                {formData.photo && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-2">
                      <PhotoIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">Photo uploaded!</span>
                    </div>
                    <div className="mt-2">
                      <Image 
                        src={formData.photo} 
                        alt="Uploaded photo"
                        width={100}
                        height={100}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="modal-form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="modal-form-input"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="modal-form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="modal-form-input"
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="modal-form-label">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="modal-form-input"
                  />
                </div>
                <div>
                  <label className="modal-form-label">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="modal-form-input"
                  />
                </div>
                <div>
                  <label className="modal-form-label">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="modal-form-input"
                  />
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="modal-form-label">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="modal-form-input"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="modal-form-input"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              {/* Submit Button */}
              <div className="modal-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingMember(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : (showEditModal ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
} 