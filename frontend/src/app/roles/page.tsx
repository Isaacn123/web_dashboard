"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  Bars3Icon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";

interface Role {
  id: number;
  name: string;
  description: string;
}

interface UserProfile {
  id: number;
  role: Role | null;
  user: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export default function RolesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Add search and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Update fetchRoles to support pagination
  const fetchRoles = useCallback(async (url?: string) => {
    setLoading(true);
    try {
      
      const endpoint = url || `http://45.56.120.65:8000/api/roles/?page=${page}`;
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setRoles(data.results || data);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setCount(data.count || (data.results ? data.results.length : data.length));
      }
    } catch {
      setError('Failed to fetch roles.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    fetchRoles();
    fetchProfiles();
    fetchUsers();
  }, [isAuthenticated, router, fetchRoles]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://45.56.120.65:8000/api/profiles/');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.results || data);
      }
    } catch {
      // ignore
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://45.56.120.65:8000/api/users/');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.results || data);
      }
    } catch {
      // ignore
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    try {
      const response = await fetch("http://45.56.120.65:8000/api/roles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) throw new Error("Failed to add role");
      setShowAddModal(false);
      setMessage("Role added successfully.");
      fetchRoles();
    } catch {
      setError("Failed to add role.");
    }
  };

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRole) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    try {
      const response = await fetch(`http://45.56.120.65:8000/api/roles/${editRole.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) throw new Error("Failed to update role");
      setShowEditModal(false);
      setEditRole(null);
      setMessage("Role updated successfully.");
      fetchRoles();
    } catch {
      setError("Failed to update role.");
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      const response = await fetch(`http://45.56.120.65:8000/api/roles/${roleId}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete role");
      setMessage("Role deleted successfully.");
      fetchRoles();
    } catch {
      setError("Failed to delete role.");
    }
  };

  // Helper to get users for a role
  const handleShowUsersForRole = (role: Role) => {
    setSelectedRole(role);
    setShowUsersModal(true);
  };

  // Add filteredRoles for search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <CheckCircleIcon className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">Admin</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
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
                <Link href="/roles" className="nav-link active">
                  <ShieldCheckIcon className="nav-icon" />
                  <span>Roles</span>
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
                <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <h1 className="page-title ml-4">Roles</h1>
              </div>
              <div className="header-right">
                <button className="header-btn">
                  <BellIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="main-content">
          <div className="page-header">
            <div className="page-header-content">
              <div className="page-title-section">
                <h2 className="page-title">Role Management</h2>
                <p className="page-subtitle">Add, edit, or remove user roles</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Role
              </button>
            </div>
          </div>
          {/* Search Bar */}
          <div className="filters-section mb-4">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ maxWidth: 300 }}
            />
            {count !== null && (
              <span className="ml-4 text-gray-500">{count} roles</span>
            )}
          </div>
          {message && (
            <div className="alert alert-success">
              <CheckCircleIcon className="w-5 h-5 mr-2" /> {message}
              <button className="alert-close" onClick={() => setMessage(null)}>&times;</button>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <XCircleIcon className="w-5 h-5 mr-2" /> {error}
              <button className="alert-close" onClick={() => setError(null)}>&times;</button>
            </div>
          )}
          <div className="roles-table-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Loading roles...
                </div>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="empty-container">
                <ShieldCheckIcon className="empty-icon" />
                <h3 className="empty-title">No roles found</h3>
                <p className="empty-text">Get started by adding your first role.</p>
                <div className="empty-action">
                  <button onClick={() => setShowAddModal(true)} className="btn-primary">
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Role
                  </button>
                </div>
              </div>
            ) : (
              <>
                <table className="roles-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.name}</td>
                        <td>{role.description}</td>
                        <td>
                          <button
                            className="user-count-btn"
                            onClick={() => handleShowUsersForRole(role)}
                            title="View users with this role"
                          >
                            {profiles.filter(p => p.role && p.role.id === role.id).length}
                          </button>
                        </td>
                        <td>
                          <button
                            className="action-btn"
                            title="Edit"
                            onClick={() => {
                              setEditRole(role);
                              setShowEditModal(true);
                            }}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="pagination-controls mt-4 flex gap-2 items-center">
                  <button
                    className="btn-secondary"
                    disabled={!prevPage}
                    onClick={() => {
                      if (prevPage) {
                        setPage(page - 1);
                        fetchRoles(prevPage);
                      }
                    }}
                  >
                    Previous
                  </button>
                  <span>Page {page}</span>
                  <button
                    className="btn-secondary"
                    disabled={!nextPage}
                    onClick={() => {
                      if (nextPage) {
                        setPage(page + 1);
                        fetchRoles(nextPage);
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
          {/* Add Role Modal */}
          {showAddModal && (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Add Role</h2>
                  <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
                </div>
                <form className="modal-body" onSubmit={handleAddRole}>
                  <div className="form-group">
                    <label>Name</label>
                    <input name="name" required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input name="description" className="form-input" />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Role
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Edit Role Modal */}
          {showEditModal && editRole && (
            <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Edit Role</h2>
                  <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
                </div>
                <form className="modal-body" onSubmit={handleEditRole}>
                  <div className="form-group">
                    <label>Name</label>
                    <input name="name" defaultValue={editRole.name} required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input name="description" defaultValue={editRole.description} className="form-input" />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Users Modal */}
          {showUsersModal && (
            <div className="modal-overlay" onClick={() => setShowUsersModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>Users with role: {selectedRole?.name}</h3>
                {profiles.filter(p => p.role && p.role.id === selectedRole?.id).length === 0 ? (
                  <p>No users assigned to this role.</p>
                ) : (
                  <ul>
                    {profiles.filter(p => p.role && p.role.id === selectedRole?.id).map(profile => (
                      <li key={profile.id}>
                        <strong>{users.find(u => u.id === profile.user)?.username}</strong> <span>({users.find(u => u.id === profile.user)?.email})</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button className="close-btn" onClick={() => setShowUsersModal(false)}>Close</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 