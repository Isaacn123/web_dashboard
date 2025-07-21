'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface ProgramForm {
  title: string;
  description: string;
  category: string;
  order: number;
  active: boolean;
}

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

export default function EditProgramPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<ProgramForm>({
    title: '',
    description: '',
    category: '',
    order: 1,
    active: true
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Fetch program data
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`http://45.56.120.65:8000/api/programs/${programId}/`);
        if (response.ok) {
          const program: Program = await response.json();
          setFormData({
            title: program.title,
            description: program.description,
            category: program.category,
            order: program.order,
            active: program.active
          });
        } else {
          setError('Failed to load program');
        }
      } catch (error) {
        console.error('Error fetching program:', error);
        setError('Failed to load program');
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgram();
    }
  }, [programId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch(`http://45.56.120.65:8000/api/programs/${programId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/programs');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      setError('Failed to update program');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="mt-4 text-gray-600">Loading program...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="programs" />
      {/* Main Content */}
      <div className="main-wrapper">
        {/* Header */}
        <Header
          user={user}
          setSidebarOpen={setSidebarOpen}
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          handleLogout={handleLogout}
          router={router}
        />
        {/* Main Content Area */}
        <main className="main-content">
          <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/programs"
                    className="btn btn-secondary"
                  >
                    <ArrowLeftIcon className="btn-icon" />
                    Back to Programs
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
                    <p className="text-gray-600 mt-1">Update program details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error mb-6">
                <AcademicCapIcon className="alert-icon" style={{width: '1rem', height: '1rem'}} />
                <div>
                  <h3 className="alert-title">Error</h3>
                  <p className="alert-description">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="alert alert-success mb-6">
                <AcademicCapIcon className="alert-icon" style={{width: '1rem', height: '1rem'}} />
                <div>
                  <h3 className="alert-title">Program updated successfully!</h3>
                  <p className="alert-description">Redirecting to programs list...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="form-label">
                      Program Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., BASKETBALL TRAINING PROGRAMS"
                      required
                    />
                    <p className="form-help">Enter the program title in uppercase for consistency</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="form-label">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea form-input"
                      rows={12}
                      placeholder="Enter a detailed description of the program..."
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="form-label">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Training">Training</option>
                      <option value="Inclusive">Inclusive</option>
                      <option value="Development">Development</option>
                      <option value="Personal">Personal</option>
                      <option value="Competition">Competition</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label htmlFor="order" className="form-label">
                      Display Order *
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      max="10"
                      required
                    />
                    <p className="form-help">Order in which this program appears (1-10)</p>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="active" className="form-checkbox-label">
                      Active Program
                    </label>
                    <p className="form-help ml-2">Only active programs are displayed on the website</p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Link 
                      href="/programs"
                      className="btn btn-secondary"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="spinner spinner-sm"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <PencilIcon className="btn-icon" style={{width: '1rem', height: '1rem'}} />
                          Update Program
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 