import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/navbar'; // Matches your working older version
import { HomePage } from './pages/home'; // Matches your older version
import { CoursesPage } from './pages/courses'; // Matches your older version
import { CourseDetailPage } from './pages/courses/[id]'; // Matches your older version
import { DashboardPage } from './pages/dashboard'; // Matches your older version
import { PricingPage } from './pages/pricing'; // Matches your older version
import { LearningPathsPage } from './pages/LearningPathsPage'; // Assumes this file exists
import { LearningPathDetailPage } from './pages/LearningPathDetailPage'; // New page from enhancements
import { ProtectedRoute } from './components/ProtectedRoute';
import { supabase } from './lib/supabase';
import { useAuthStore } from './lib/store';

function App() {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('Error fetching session:', error);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/learning-paths" element={<LearningPathsPage />} />
          <Route path="/learning-paths/:id" element={<LearningPathDetailPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
export default App;