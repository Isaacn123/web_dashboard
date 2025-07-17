"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
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
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface HeaderSettings {
  site_title: string;
  site_subtitle: string;
  header_logo_url: string;
  header_background_color: string;
  header_text_color: string;
  show_header: boolean;
}

export default function HeaderSettingsPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<HeaderSettings>({
    site_title: "Your Site Title",
    site_subtitle: "",
    header_logo_url: "",
    header_background_color: "#ffffff",
    header_text_color: "#000000",
    show_header: true,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setAuthChecking(false);
    fetchSettings();
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".user-menu")) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/header-settings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        setSettings(data[0]);
      }
    } catch (error) {
      console.error("Error fetching header settings:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      // PATCH the first (and only) settings object
      const res = await fetch(`/api/header-settings/1/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving header settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
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
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GlobeAltIcon className="sidebar-logo-icon" />
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
              <li className="nav-item">
                <Link href="/header-settings" className="nav-link active">
                  <GlobeAltIcon className="nav-icon" />
                  <span>Header Settings</span>
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
                  <span className="user-name">{user?.username || "Admin User"}</span>
                  <ChevronDownIcon className="nav-icon" />
                  {/* User Dropdown */}
                  <div className={`user-dropdown ${userDropdownOpen ? "open" : ""}`}>
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
            <div className="alert alert-success mb-4">Header settings saved!</div>
          )}
          <div className="settings-form-wrapper">
            <h2 className="settings-title mb-6">Header Settings</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSettings();
              }}
              className="settings-form"
            >
              <div className="form-group">
                <label htmlFor="site_title">Site Title</label>
                <input
                  type="text"
                  id="site_title"
                  name="site_title"
                  value={settings.site_title}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="site_subtitle">Site Subtitle</label>
                <input
                  type="text"
                  id="site_subtitle"
                  name="site_subtitle"
                  value={settings.site_subtitle}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="header_logo_url">Header Logo URL</label>
                <input
                  type="text"
                  id="header_logo_url"
                  name="header_logo_url"
                  value={settings.header_logo_url}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="header_background_color">Header Background Color</label>
                <input
                  type="color"
                  id="header_background_color"
                  name="header_background_color"
                  value={settings.header_background_color}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="header_text_color">Header Text Color</label>
                <input
                  type="color"
                  id="header_text_color"
                  name="header_text_color"
                  value={settings.header_text_color}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="show_header">Show Header</label>
                <input
                  type="checkbox"
                  id="show_header"
                  name="show_header"
                  checked={settings.show_header}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-4"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 