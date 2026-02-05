import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  const getDashboardLink = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'ROLE_DOCTOR':
        return '/doctor_dashboard';
      case 'ROLE_PATIENT':
        return '/patient_dashboard';
      case 'ROLE_ADMIN':
        return '/admin_dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-blue-600">MedBook</Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Αρχική</Link>
            {user?.role !== 'ROLE_ADMIN' && (
              <Link to="/doctors" className="text-gray-700 hover:text-blue-600">Ιατροί</Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user.username}
                </span>
                {getDashboardLink() && (
                  <Link 
                    to={getDashboardLink()} 
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {user.role === 'ROLE_ADMIN' ? 'Διαχείριση' : 'Dashboard'}
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Αποσύνδεση
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Σύνδεση
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Εγγραφή
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-600 py-2">Αρχική</Link>
              {user?.role !== 'ROLE_ADMIN' && (
                <Link to="/doctors" className="block text-gray-700 hover:text-blue-600 py-2">Ιατροί</Link>
              )}
              
              {user ? (
                <>
                  {getDashboardLink() && (
                    <Link 
                      to={getDashboardLink()} 
                      className="block text-gray-700 hover:text-blue-600 py-2"
                    >
                      {user.role === 'ROLE_ADMIN' ? 'Διαχείριση' : 'Dashboard'}
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    Αποσύνδεση
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-gray-700 hover:text-blue-600 py-2"
                  >
                    Σύνδεση
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-gray-700 hover:text-blue-600 py-2"
                  >
                    Εγγραφή
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;