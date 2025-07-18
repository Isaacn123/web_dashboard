"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CreateTeamMember() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY as string);
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://45.56.120.65:8000/api/team-members/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Team member added successfully!');
        router.push('/teams');
      } else {
        const errorData = await response.text();
        alert(`Error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      alert(`Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin:'0 auto'}}>
      <div className="table-container">
        <h2 className="form-title">
          <PlusIcon style={{height: '1rem', width:'1rem'}} className="mr-2" /> Add Team Member
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-input"
            />
            {imageLoading && <div className="spinner" style={{ width: 16, height: 16 }}></div>}
            {formData.photo && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0' }}>
                <Image 
                  src={formData.photo} 
                  alt="Uploaded photo"
                  width={100}
                  height={100}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Facebook URL</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Twitter URL</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="form-input"
            />
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="form-input"
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
            <label className="form-label" style={{ margin: 0 }}>
              Active (visible on website)
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.push('/teams')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 