import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Brain, LayoutDashboard, ClipboardList, Plus, Settings, LogOut } from 'lucide-react';
import AIChat from '../ui/AIChat';
import HeaderActions from '../ui/HeaderActions';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/surveys', icon: ClipboardList, label: 'Surveys' },
    { to: '/admin/surveys/create', icon: Plus, label: 'Create Survey' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const getPageTitle = () => {
    const match = navLinks.find(link => location.pathname.includes(link.to));
    return match ? match.label : 'Admin';
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-navy text-white flex flex-col z-10">
        <div className="p-6 flex items-center space-x-3">
          <Brain className="w-8 h-8 text-brandLight" />
          <span className="text-xl font-bold tracking-tight">WorkMind</span>
          <span className="ml-2 bg-brand/30 text-brandLight text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            Admin
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate text-sm font-medium">{user?.name}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
          <h1 className="text-xl font-bold text-navy dark:text-white">{getPageTitle()}</h1>
          <HeaderActions />
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <AIChat />
    </div>
  );
};

export default AdminLayout;
