'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  Bars3Icon, 
  HomeIcon, 
  UserGroupIcon, 
  CogIcon, 
  ChartBarIcon, 
  BellIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronDownIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

interface AdminSettings {
  siteName: string;
  adminEmail: string;
  notificationsEnabled: boolean;
  autoSaveEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    siteName: 'Admin Dashboard',
    adminEmail: 'admin@example.com',
    notificationsEnabled: true,
    autoSaveEnabled: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    loadSettings();
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

  const loadSettings = () => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage for now (in a real app, this would go to the backend)
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
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
                <Link href="/settings" className="nav-link active">
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
          {/* Success Notification */}
          {success && (
            <div className="alert alert-success mb-4">
              Settings saved successfully!
            </div>
          )}

          {/* Page Header */}
          <div className="page-header">
            <div className="page-header-content">
              <div className="page-title-section">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your admin dashboard preferences</p>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="settings-container">
            {/* General Settings */}
            <div className="settings-section">
              <div className="section-header">
                <div className="section-icon">
                  <GlobeAltIcon className="nav-icon" />
                </div>
                <div>
                  <h3 className="section-title">General Settings</h3>
                  <p className="section-description">Configure basic dashboard settings</p>
                </div>
              </div>

              <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Site Name</label>
                    <p className="setting-description">The name displayed in the dashboard header</p>
                  </div>
                  <div className="setting-control">
                    <input
                      type="text"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      className="setting-input"
                      placeholder="Enter site name"
                    />
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Admin Email</label>
                    <p className="setting-description">Primary contact email for the admin</p>
                  </div>
                  <div className="setting-control">
                    <input
                      type="email"
                      name="adminEmail"
                      value={settings.adminEmail}
                      onChange={handleInputChange}
                      className="setting-input"
                      placeholder="Enter admin email"
                    />
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Theme</label>
                    <p className="setting-description">Choose your preferred theme</p>
                  </div>
                  <div className="setting-control">
                    <select
                      name="theme"
                      value={settings.theme}
                      onChange={handleInputChange}
                      className="setting-select"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Language</label>
                    <p className="setting-description">Select your preferred language</p>
                  </div>
                  <div className="setting-control">
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleInputChange}
                      className="setting-select"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Timezone</label>
                    <p className="setting-description">Set your local timezone</p>
                  </div>
                  <div className="setting-control">
                    <select
                      name="timezone"
                      value={settings.timezone}
                      onChange={handleInputChange}
                      className="setting-select"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Preferences */}
            <div className="settings-section" style={{ marginTop: '3rem' }}>
              <div className="section-header">
                <div className="section-icon">
                  <Cog6ToothIcon className="nav-icon" />
                </div>
                <div>
                  <h3 className="section-title">Preferences</h3>
                  <p className="section-description">Customize your dashboard experience</p>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Enable Notifications</label>
                  <p className="setting-description">Receive notifications for important events</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="notificationsEnabled"
                      checked={settings.notificationsEnabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Auto Save</label>
                  <p className="setting-description">Automatically save changes while editing</p>
                </div>
                <div className="setting-control">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="autoSaveEnabled"
                      checked={settings.autoSaveEnabled}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="settings-actions">
              <button 
                type="submit"
                onClick={handleSaveSettings}
                disabled={saving}
                className="btn-primary"
                style={{ minWidth: '120px' }}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
} 