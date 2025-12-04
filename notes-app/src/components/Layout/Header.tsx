import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Notes
          </h1>
        </div>
        
        {/* User Info */}
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-900">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
