import { Bars3Icon, BellIcon, MagnifyingGlassIcon, UserGroupIcon, ChevronDownIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username?: string;
}

interface HeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
  handleLogout: () => void;
  router: ReturnType<typeof useRouter>;
}

const Header: React.FC<HeaderProps> = ({ user, setSidebarOpen, userDropdownOpen, setUserDropdownOpen, handleLogout, router }) => {
  return (
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
                placeholder="Search programs..." 
                className="search-input"
              />
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <BellIcon className="nav-icon" />
            </button>
            <div className="user-menu" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <div className="user-avatar">
                <UserGroupIcon className="nav-icon" />
              </div>
              <span className="user-name">{user?.username || 'Admin User'}</span>
              <ChevronDownIcon className="nav-icon" />
              {/* User Dropdown */}
              <div className={`user-dropdown ${userDropdownOpen ? 'open' : ''}`}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    router.push('/profile');
                  }}
                >
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
  );
};

export default Header; 