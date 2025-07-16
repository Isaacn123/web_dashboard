'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  CheckCircleIcon as CheckCircleIcon2,
  HomeIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
}

// 1. Add Role and UserProfile interfaces
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

export default function UsersPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // 2. Add state for roles and profiles
  const [roles, setRoles] = useState<Role[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [editRoleId, setEditRoleId] = useState<number | null>(null);

  // 3. Fetch roles and profiles on mount
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setAuthChecking(false);
    fetchUsers();
    fetchRoles();
    fetchProfiles();
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/');
      if (response.ok) {
        const data = await response.json();
        const usersData = data.results || data;
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // For demo purposes, create mock data
      setUsers([
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          is_active: true,
          is_staff: true,
          date_joined: '2024-01-15T10:00:00Z',
          last_login: '2024-01-20T14:30:00Z'
        },
        {
          id: 2,
          username: 'john_doe',
          email: 'john@example.com',
          first_name: 'John',
          last_name: 'Doe',
          is_active: true,
          is_staff: false,
          date_joined: '2024-01-10T09:00:00Z',
          last_login: '2024-01-19T16:45:00Z'
        },
        {
          id: 3,
          username: 'jane_smith',
          email: 'jane@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          is_active: false,
          is_staff: false,
          date_joined: '2024-01-05T11:30:00Z',
          last_login: '2024-01-15T13:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/roles/');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/profiles/');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || 
                         (filterRole === 'admin' && user.is_staff) ||
                         (filterRole === 'user' && !user.is_staff);
    
    return matchesSearch && matchesFilter;
  });

  // 4. Helper to get user role from profile
  const getUserRole = (userId: number) => {
    const profile = profiles.find(p => p.user === userId);
    return profile && profile.role ? profile.role.name : 'No Role';
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          is_active: !currentStatus
        }),
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, is_active: !currentStatus }
            : user
        ));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Open edit modal and set user/profile
  const handleEdit = (user: User) => {
    setEditUser(user);
    const profile = profiles.find((p) => p.user === user.id) || null;
    setEditProfile(profile);
    setEditRoleId(profile?.role?.id ?? null);
    setShowEditModal(true);
  };

  // Save edits
  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUser) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const is_active = formData.get('is_active') === 'on';
    // 1. Update user
    const userRes = await fetch(`http://localhost:8000/api/users/${editUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, first_name, last_name, is_active })
    });
    if (!userRes.ok) return alert('Failed to update user');
    // 2. Update role/profile
    if (editProfile && editRoleId) {
      const profileRes = await fetch(`http://localhost:8000/api/profiles/${editProfile.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: editRoleId })
      });
      if (!profileRes.ok) return alert('Failed to update role');
    }
    setShowEditModal(false);
    setEditUser(null);
    setEditProfile(null);
    setEditRoleId(null);
    fetchUsers();
    fetchProfiles();
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
            <CheckCircleIcon2 className="sidebar-logo-icon" />
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
            </ul>
          </div>
          
          <div className="nav-section">
            <h3 className="nav-section-title">Management</h3>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/users" className="nav-link active">
                  <UserGroupIcon className="nav-icon" />
                  <span>Users</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/roles" className="nav-link">
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
                    placeholder="Search users..." 
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
                  <ChevronDownIcon className="w-4 h-4" />
                  
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
                <h1 className="page-title">Users</h1>
                <p className="page-subtitle">Manage user accounts and permissions</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-container">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                onClick={() => setFilterRole('all')}
              >
                All ({users.length})
              </button>
              <button
                className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
                onClick={() => setFilterRole('admin')}
              >
                Admins ({users.filter(u => u.is_staff).length})
              </button>
              <button
                className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
                onClick={() => setFilterRole('user')}
              >
                Users ({users.filter(u => !u.is_staff).length})
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="users-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  Loading users...
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-container">
                <UserGroupIcon className="empty-icon" />
                <h3 className="empty-title">
                  {searchTerm || filterRole !== 'all' ? 'No users found' : 'No users yet'}
                </h3>
                <p className="empty-text">
                  {searchTerm || filterRole !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by adding your first user.'}
                </p>
                {!searchTerm && filterRole === 'all' && (
                  <div className="empty-action">
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="btn-primary"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add User
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              <UserGroupIcon className="w-5 h-5" />
                            </div>
                            <div className="user-details">
                              <div className="user-name">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="user-username">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="user-email">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td>
                          <span className="role-badge">{getUserRole(user.id)}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                            {user.is_active ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="w-4 h-4 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td>
                          <div className="date-info">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {new Date(user.date_joined).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="date-info">
                            {user.last_login ? (
                              <>
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {new Date(user.last_login).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </>
                            ) : (
                              <span className="text-gray-400">Never</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="user-actions">
                            <button
                              onClick={() => toggleUserStatus(user.id, user.is_active)}
                              className="action-btn"
                              title={user.is_active ? 'Deactivate' : 'Activate'}
                            >
                                {user.is_active ? "❌" : "✅"}
                            </button>
                            <button
                              className="action-btn"
                              style={{ color:'green'  }}
                              onClick={() => handleEdit(user)}
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                                style={{ color:'red', }}
                              className="action-btn delete"
                            >
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

          {/* Create User Modal */}
          {showCreateModal && (
            <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Add New User</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="modal-close"
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  {/* 6. Update Add User modal to include role selection and API integration */}
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const username = formData.get('username') as string;
                    const email = formData.get('email') as string;
                    const password = formData.get('password') as string;
                    const first_name = formData.get('first_name') as string;
                    const last_name = formData.get('last_name') as string;
                    if (!selectedRoleId) return alert('Please select a role');
                    // 1. Create user
                    const userRes = await fetch('http://localhost:8000/api/users/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username, email, password, first_name, last_name })
                    });
                    if (!userRes.ok) return alert('Failed to create user');
                    const user = await userRes.json();
                    // 2. Assign role
                    const profileRes = await fetch('http://localhost:8000/api/profiles/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ user_id: user.id, role_id: selectedRoleId })
                    });
                    if (!profileRes.ok) return alert('Failed to assign role');
                    setShowCreateModal(false);
                    fetchUsers();
                    fetchProfiles();
                  }}>
                    <div className="form-group">
                      <label>Username</label>
                      <input name="username" required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input name="email" type="email" required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input name="password" type="password" required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>First Name</label>
                      <input name="first_name" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input name="last_name" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select value={selectedRoleId ?? ''} onChange={e => setSelectedRoleId(Number(e.target.value))} required className="form-input">
                        <option value="" disabled>Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Create User</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditModal && editUser && (
            <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Edit User</h2>
                  <button onClick={() => setShowEditModal(false)} className="modal-close">×</button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditSave}>
                    <div className="form-group">
                      <label>Username</label>
                      <input name="username" defaultValue={editUser.username} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input name="email" type="email" defaultValue={editUser.email} required className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>First Name</label>
                      <input name="first_name" defaultValue={editUser.first_name} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input name="last_name" defaultValue={editUser.last_name} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select value={editRoleId ?? ''} onChange={e => setEditRoleId(Number(e.target.value))} required className="form-input">
                        <option value="" disabled>Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <input type="checkbox" name="is_active" defaultChecked={editUser.is_active} /> Active
                      </label>
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
                      <button type="submit" className="btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
} 