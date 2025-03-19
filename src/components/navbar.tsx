import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { AuthModal } from './auth/AuthModal';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export function Navbar() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, setUser } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 container mx-auto max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="font-extrabold text-2xl text-gray-800">TechArdent</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 ml-10">
            <Link to="/courses">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-base">
                Browse Courses
              </Button>
            </Link>
            <Link to="/learning-paths">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-base">
                Learning Paths
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>
          </div>

          {/* User Actions (Desktop) */}
          <div className="ml-auto flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 animate-fade-in">
                    <Link to="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>


          //add wonderful footer
          

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            className="md:hidden ml-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-6 animate-fade-in">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              <Link to="/courses">
                <Button variant="ghost" className="w-full text-left text-gray-700 hover:text-blue-600">
                  Browse Courses
                </Button>
              </Link>
              <Link to="/learning-paths">
                <Button variant="ghost" className="w-full text-left text-gray-700 hover:text-blue-600">
                  Learning Paths
                </Button>
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full text-left text-gray-700 hover:text-blue-600">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full text-left text-gray-700 hover:text-blue-600">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full text-left text-gray-700 hover:text-blue-600"
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    onClick={() => {
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}