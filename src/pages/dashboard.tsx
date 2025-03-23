import { useEffect, useState } from 'react';
import { Clock, BookOpen, Activity, FileText, User as UserIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Course } from '@/types';
import { mockCourses } from '@/lib/mock-data';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

interface UserProfile {
  full_name: string;
  age: number;
  profile_photo: string;
  skills: string[];
  projects: { title: string; description: string }[];
  resume_url?: string;
  modification_count: number;
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [chartType, setChartType] = useState('line');
  const [formData, setFormData] = useState({
    age: '',
    profile_photo: '',
    skills: '',
    projectTitle: '',
    projectDescription: '',
    resume_url: '',
  });
  const [projects, setProjects] = useState<{ title: string; description: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);

        if (enrollmentError) throw enrollmentError;

        const courseIds = enrollmentData.map((enrollment) => enrollment.course_id);
        const courses = mockCourses.filter((course) => courseIds.includes(course.id));
        setEnrolledCourses(courses);

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('full_name, email, age, profile_photo, skills, projects, resume_url, modification_count')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const skillsArray = profileData.skills
          ? profileData.skills.split(',').map((skill: string) => skill.trim())
          : [];

        setUserProfile({
          full_name: profileData.full_name || user.email?.split('@')[0] || 'User',
          age: profileData.age || 0,
          profile_photo: profileData.profile_photo || 'https://via.placeholder.com/150',
          skills: skillsArray,
          projects: profileData.projects || [],
          resume_url: profileData.resume_url || undefined,
          modification_count: profileData.modification_count || 0,
        });

        setFormData({
          age: profileData.age?.toString() || '',
          profile_photo: profileData.profile_photo || '',
          skills: profileData.skills || '',
          projectTitle: '',
          projectDescription: '',
          resume_url: profileData.resume_url || '',
        });
        setProjects(profileData.projects || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUserProfile({
          full_name: user.email?.split('@')[0] || 'User',
          age: 0,
          profile_photo: 'https://via.placeholder.com/150',
          skills: [],
          projects: [],
          resume_url: undefined,
          modification_count: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addProject = () => {
    if (formData.projectTitle && formData.projectDescription) {
      setProjects((prev) => [
        ...prev,
        { title: formData.projectTitle, description: formData.projectDescription },
      ]);
      setFormData((prev) => ({ ...prev, projectTitle: '', projectDescription: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile || userProfile.modification_count >= 5) return;

    try {
      const updatedCount = userProfile.modification_count + 1;
      const { error } = await supabase
        .from('users')
        .update({
          age: parseInt(formData.age) || 0,
          profile_photo: formData.profile_photo || 'https://via.placeholder.com/150',
          skills: formData.skills, // Stored as comma-separated string
          projects: projects,
          resume_url: formData.resume_url || null,
          modification_count: updatedCount,
        })
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile({
        ...userProfile,
        age: parseInt(formData.age) || 0,
        profile_photo: formData.profile_photo || 'https://via.placeholder.com/150',
        skills: formData.skills.split(',').map((s) => s.trim()),
        projects,
        resume_url: formData.resume_url || undefined,
        modification_count: updatedCount,
      });
      setError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400 text-lg">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  // Chart Data Configurations (unchanged)
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Progress',
      data: [10, 30, 60, 80],
      borderColor: '#4B5EFA',
      backgroundColor: 'rgba(75, 94, 250, 0.2)',
      tension: 0.4,
    }],
  };

  const barData = {
    labels: enrolledCourses.map(course => course.title),
    datasets: [{
      label: 'Completion %',
      data: enrolledCourses.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    }],
  };

  const pieData = {
    labels: enrolledCourses.map(course => course.title),
    datasets: [{
      data: enrolledCourses.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const completedLessonsData = {
    labels: enrolledCourses.map(course => course.title),
    datasets: [{
      label: 'Completed Lessons',
      data: enrolledCourses.map(course => Math.floor(Math.random() * course.chapters.length)),
      backgroundColor: '#4B5EFA',
    }],
  };

  const enrolledCoursesData = {
    labels: ['Enrolled', 'Not Enrolled'],
    datasets: [{
      data: [enrolledCourses.length, mockCourses.length - enrolledCourses.length],
      backgroundColor: ['#45B7D1', '#D3D3D3'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const topicsCoveredData = {
    labels: enrolledCourses.map(course => course.title),
    datasets: [{
      label: 'Topics Covered (%)',
      data: enrolledCourses.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: '#96CEB4',
      borderColor: '#ffffff',
      borderWidth: 1,
    }],
  };

  const overallProgressData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [75, 25],
      backgroundColor: ['#4ECDC4', '#E5E7EB'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { font: { size: 12 }, color: '#ffffff' } },
      title: { display: true, text: `${timeFilter} Progress Overview`, font: { size: 16 }, color: '#ffffff' },
    },
    scales: {
      y: { ticks: { font: { size: 12 }, color: '#ffffff' } },
      x: { ticks: { font: { size: 12 }, color: '#ffffff' } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { font: { size: 12 }, color: '#ffffff' } },
      title: { display: true, text: 'Distribution', font: { size: 16 }, color: '#ffffff' },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* User Profile Header */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
          <img
            src={userProfile?.profile_photo}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{userProfile?.full_name}'s Dashboard</h1>
            <p className="text-gray-400 mt-1">Age: {userProfile?.age || 'Not set'}</p>
            <p className="text-gray-400">Email: {user?.email}</p>
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-white">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {userProfile?.skills && userProfile.skills.length > 0 ? (
                  userProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Update Your Profile</h2>
          {(userProfile?.modification_count || 0) >= 5 ? (
            <p className="text-red-400">You’ve reached the maximum of 5 updates.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Profile Photo URL</label>
                <input
                  type="text"
                  name="profile_photo"
                  value={formData.profile_photo}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter photo URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., React, TypeScript"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Add Project</label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Project title"
                />
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Project description"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Project
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Resume URL</label>
                <input
                  type="text"
                  name="resume_url"
                  value={formData.resume_url}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter resume URL"
                />
              </div>
              {error && <p className="text-red-400">{error}</p>}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-600"
                disabled={(userProfile?.modification_count || 0) >= 5}
              >
                Save Changes ({5 - (userProfile?.modification_count || 0)} attempts left)
              </button>
            </form>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-semibold text-white">Learning Overview</h2>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
              onClick={() => setTimeFilter('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
              onClick={() => setTimeFilter('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
              onClick={() => setTimeFilter('yearly')}
            >
              Yearly
            </button>
            <select
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-indigo-500" />
                    {course.chapters.length} chapters
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: '25%' }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">25% completed</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No courses enrolled yet.</p>
          )}
        </div>

        {/* Charts and Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-4 rounded-xl shadow-md" style={{ height: '300px' }}>
            {chartType === 'line' && <Line data={lineData} options={chartOptions} />}
            {chartType === 'bar' && <Bar data={barData} options={chartOptions} />}
            {chartType === 'pie' && <Pie data={pieData} options={chartOptions} />}
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow-md" style={{ height: '300px' }}>
            <Bar
              data={completedLessonsData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: 'Completed Lessons' } },
              }}
            />
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow-md" style={{ height: '300px' }}>
            <Pie
              data={enrolledCoursesData}
              options={{
                ...pieOptions,
                plugins: { ...pieOptions.plugins, title: { display: true, text: 'Enrolled Courses' } },
              }}
            />
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow-md" style={{ height: '300px' }}>
            <Bar
              data={topicsCoveredData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: 'Topics Covered (%)' } },
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow-md" style={{ height: '300px' }}>
            <Pie
              data={overallProgressData}
              options={{
                ...pieOptions,
                plugins: { ...pieOptions.plugins, title: { display: true, text: 'Overall Progress' } },
              }}
            />
          </div>

          <div className="bg-gray-900 p-4 rounded-xl shadow-md" style={{ height: '300px' }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-indigo-500" />
              Recent Activity
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Activity className="h-4 w-4 mr-2 text-blue-500" />
                <p>Completed "React Basics" Ch. 1</p>
              </div>
              <div className="flex items-center text-gray-400">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                <p>Started "Node.js Fundamentals"</p>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-gray-900 p-4 rounded-xl shadow-md col-span-1 md:col-span-2" style={{ minHeight: '300px' }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-indigo-500" />
              My Projects
            </h2>
            <div className="space-y-4">
              {userProfile?.projects && userProfile.projects.length > 0 ? (
                userProfile.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="text-md font-medium text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No projects added yet.</p>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-gray-900 p-4 rounded-xl shadow-md col-span-1 md:col-span-2" style={{ minHeight: '300px' }}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-500" />
              Resume
            </h2>
            {userProfile?.resume_url ? (
              <div>
                <p className="text-sm text-gray-400 mb-2">Your resume is ready to download.</p>
                <a
                  href={userProfile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Download Resume
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Upload your resume URL above to showcase your skills!</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore Courses</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Data Science</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Graphic Design</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Business & Marketing</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Programming</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Learning Paths</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Beginner to Pro</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Career Switch</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Skill Booster</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Certification Prep</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
          <p className="mt-2">Master new skills with our expert-led courses in technology, design, business, and more.</p>
        </div>
      </footer>
    </div>
  );
}