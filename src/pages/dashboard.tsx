import { useEffect, useState } from 'react';
import { Clock, BookOpen, Activity } from 'lucide-react';
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

export function DashboardPage() {
  const { user } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    async function fetchEnrolledCourses() {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user?.id);

        if (error) throw error;

        const courseIds = data.map((enrollment) => enrollment.course_id);
        const courses = mockCourses.filter((course) =>
          courseIds.includes(course.id)
        );
        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Chart Data Configurations
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
    maintainAspectRatio: false, // Allow charts to fit container height
    plugins: {
      legend: { position: 'top' as const, labels: { font: { size: 10 } } },
      title: { display: true, text: `${timeFilter} Progress Overview`, font: { size: 14 } },
    },
    scales: {
      y: { ticks: { font: { size: 10 } } },
      x: { ticks: { font: { size: 10 } } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { font: { size: 10 } } },
      title: { display: true, text: 'Distribution', font: { size: 14 } },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeFilter === 'weekly' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
              onClick={() => setTimeFilter('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeFilter === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
              onClick={() => setTimeFilter('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeFilter === 'yearly' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
              onClick={() => setTimeFilter('yearly')}
            >
              Yearly
            </button>
            <select
              className="px-4 py-2 rounded-md border bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.chapters.length} chapters
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: '25%' }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">25% completed</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '250px' }}>
            {chartType === 'line' && <Line data={lineData} options={chartOptions} />}
            {chartType === 'bar' && <Bar data={barData} options={chartOptions} />}
            {chartType === 'pie' && <Pie data={pieData} options={chartOptions} />}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '250px' }}>
            <Bar 
              data={completedLessonsData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: 'Completed Lessons' } }
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '250px' }}>
            <Pie 
              data={enrolledCoursesData}
              options={{
                ...pieOptions,
                plugins: { ...pieOptions.plugins, title: { display: true, text: 'Enrolled Courses' } }
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '250px' }}>
            <Bar 
              data={topicsCoveredData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: 'Topics Covered (%)' } },
                scales: { y: { beginAtZero: true, max: 100 } }
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '250px' }}>
            <Pie 
              data={overallProgressData}
              options={{
                ...pieOptions,
                plugins: { ...pieOptions.plugins, title: { display: true, text: 'Overall Progress' } }
              }}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '250px' }}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-700">
                <Activity className="h-3 w-3 mr-2 text-blue-500" />
                <p>Completed "React Basics" Ch. 1</p>
              </div>
              <div className="flex items-center text-gray-700">
                <Activity className="h-3 w-3 mr-2 text-green-500" />
                <p>Started "Node.js Fundamentals"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore Courses</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Data Science</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Graphic Design</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Business & Marketing</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Programming</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Learning Paths</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Beginner to Pro</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Career Switch</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Skill Booster</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Certification Prep</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-300 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Terms & Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} LearnSphere. All rights reserved.</p>
          <p className="mt-2">Master new skills with our expert-led courses in technology, design, business, and more.</p>
        </div>
      </footer>
    </div>
  );
}