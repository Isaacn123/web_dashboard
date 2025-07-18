'use client';

import { useState, useEffect } from 'react';
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
  PhotoIcon
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
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // ImgBB API Key
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setAuthChecking(false);
    fetchTeamMembers();
  }, [isAuthenticated, router]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://45.56.120.65:8000/api/team-members/');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      } else {
        console.error('Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingMember 
        ? `http://45.56.120.65:8000/api/team-members/${editingMember.id}/`
        : 'http://45.56.120.65:8000/api/team-members/';
      
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
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
      } else {
        const errorData = await response.text();
        console.error('Error:', response.status, errorData);
        alert(`Error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Network error: ${error}`);
    } finally {
      setLoading(false);
    }
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

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout min-h-screen flex flex-col">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>{/* unchanged */}</aside>
      {/* Main Content */}
      <div className="main-wrapper flex-1 flex flex-col">
        <header className="header"> {/* unchanged */} </header>
        <main className="main-content flex-1 w-full p-6">
          <div className="page-header"> {/* unchanged */} </div>
          <div className="table-container">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner" />
                <span className="ml-2">Loading team members...</span>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="w-full flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first team member.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Team Member
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {/* unchanged content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
      {/* Add/Edit Modal - moved here to be a direct child of the page, not inside flex/grid */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
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
              {/* form fields unchanged */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}