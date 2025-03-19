import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Users, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockCourses } from '@/lib/mock-data';

export function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false); // New state for sort dropdown
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'duration' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = ['all', ...new Set(mockCourses.map(course => course.category))];

  // Filter and sort courses
  const filteredCourses = mockCourses
    .filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || course.category === selectedCategory)
    )
    .sort((a, b) => {
      if (!sortBy) return 0; // No sorting if sortBy is null
      switch (sortBy) {
        case 'price':
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        case 'rating':
          return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        case 'duration':
          const aDuration = parseInt(a.duration.split(' ')[0]) || 0; // Handle invalid duration
          const bDuration = parseInt(b.duration.split(' ')[0]) || 0;
          return sortOrder === 'asc' ? aDuration - bDuration : bDuration - aDuration;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of expert-led courses tailored to your learning goals.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-12 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto justify-center">
              {/* Category Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full md:w-40 rounded-full py-3 flex justify-between items-center"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>{selectedCategory === 'all' ? 'Category' : selectedCategory}</span>
                  {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {isCategoryOpen && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-20 border">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                          selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryOpen(false);
                        }}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Sort Options */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full md:w-40 rounded-full py-3 flex justify-between items-center"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <span className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    {sortBy ? `${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} (${sortOrder})` : 'Sort By'}
                  </span>
                  {isSortOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {isSortOpen && (
                  <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border">
                    {[
                      { label: 'Price', value: 'price' },
                      { label: 'Rating', value: 'rating' },
                      { label: 'Duration', value: 'duration' },
                    ].map(option => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex justify-between items-center ${
                          sortBy === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          if (sortBy === option.value) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy(option.value as any);
                            setSortOrder('asc');
                          }
                          setIsSortOpen(false); // Close dropdown after selection
                        }}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    ))}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-gray-700"
                      onClick={() => {
                        setSortBy(null);
                        setSortOrder('asc');
                        setIsSortOpen(false);
                      }}
                    >
                      Reset Sort
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid (unchanged for brevity) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No courses found matching your criteria.</p>
          ) : (
            filteredCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {course.category}
                      </span>
                      <span className="text-sm font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-1">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          <span className="font-medium">{course.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{course.enrolledStudents}</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="mt-16 py-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Browse our curated learning paths to find the perfect course for you.
          </p>
          <Link to="/learning-paths">
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Explore Learning Paths
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}