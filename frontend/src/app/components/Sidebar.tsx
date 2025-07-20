import Link from 'next/link';
import {
  Bars3Icon,
  HomeIcon,
  DocumentTextIcon,
  PlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePage: string;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, activePage }: SidebarProps) {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
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
              <Link href="/" className={`nav-link${activePage === 'dashboard' ? ' active' : ''}`}>
                <HomeIcon className="nav-icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/articles" className={`nav-link${activePage === 'articles' ? ' active' : ''}`}>
                <DocumentTextIcon className="nav-icon" />
                <span>Articles</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/create-article" className={`nav-link${activePage === 'create-article' ? ' active' : ''}`}>
                <PlusIcon className="nav-icon" />
                <span>Create Article</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/teams" className={`nav-link${activePage === 'teams' ? ' active' : ''}`}>
                <UserGroupIcon className="nav-icon" />
                <span>Teams</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/programs" className={`nav-link${activePage === 'programs' ? ' active' : ''}`}>
                <AcademicCapIcon className="nav-icon" style={{width: '1rem', height: '1rem'}} />
                <span>Programs</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-section">
          <h3 className="nav-section-title">Management</h3>
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/users" className={`nav-link${activePage === 'users' ? ' active' : ''}`}>
                <UserGroupIcon className="nav-icon" />
                <span>Users</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/analytics" className={`nav-link${activePage === 'analytics' ? ' active' : ''}`}>
                <ChartBarIcon className="nav-icon" />
                <span>Analytics</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/settings" className={`nav-link${activePage === 'settings' ? ' active' : ''}`}>
                <CogIcon className="nav-icon" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
} 