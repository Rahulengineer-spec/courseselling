import { useParams } from 'react-router-dom';
import { Play, Clock, BarChart, Download, Star, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockCourses } from '@/lib/mock-data';
import { useState } from 'react';

export function CourseDetailPage() {
  const { id } = useParams();
  const course = mockCourses.find(c => c.id === id);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{course.title}</h1>
              <p className="text-lg text-gray-200 mb-6 max-w-2xl">{course.description}</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                  <span className="font-medium text-lg">{course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-300 mr-1" />
                  <span>{course.enrolledStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-300 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-full border-2 border-white"
                />
                <div>
                  <p className="font-semibold text-lg">{course.instructor.name}</p>
                  <p className="text-sm text-gray-300">Course Instructor</p>
                </div>
              </div>
            </div>
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-56 object-cover rounded-lg mb-6"
                />
                <div className="text-3xl font-extrabold text-gray-900 mb-6">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
                <Button className="w-full rounded-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 mb-4">
                  <Play className="mr-2 h-5 w-5" /> Start Learning Now
                </Button>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{course.duration} of content</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{course.level} level</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Downloadable resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Course Content */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Course Content</h2>
            <div className="space-y-4">
              {course.chapters.map((chapter) => (
                <div key={chapter.id} className="bg-white rounded-xl border shadow-sm">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                  >
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{chapter.title}</h3>
                      <p className="text-sm text-gray-600">{chapter.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Play className="h-4 w-4" />
                      </Button>
                      {expandedChapter === chapter.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {expandedChapter === chapter.id && (
                    <div className="px-4 pb-4 text-gray-700 animate-fade-in">
                      <p>
                        This chapter covers key concepts and practical exercises to help you master{' '}
                        {chapter.title.toLowerCase()}.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Instructor Bio */}
            <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">About the Instructor</h2>
            <div className="bg-white rounded-xl border shadow-sm p-6 flex items-start gap-6">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-xl text-gray-800 mb-2">{course.instructor.name}</h3>
                <p className="text-gray-600">
                  {course.instructor.name} is an industry expert with over 10 years of experience in{' '}
                  {course.category.toLowerCase()}. They’ve trained thousands of students and are passionate about
                  sharing practical, real-world knowledge.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What You'll Learn</h2>
            <ul className="bg-white rounded-xl border shadow-sm p-6 space-y-4 text-gray-700">
              {course.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-600 rounded-full mr-3" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Testimonials */}
            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Student Reviews</h2>
            <div className="space-y-6">
              {[
                { name: 'Alex P.', rating: 4.8, comment: 'Amazing course! The instructor explains everything clearly.' },
                { name: 'Maria S.', rating: 5.0, comment: 'Worth every penny. I’ve already applied what I learned!' },
              ].map((review, index) => (
                <div key={index} className="bg-white rounded-xl border shadow-sm p-6">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                    <span className="font-medium text-gray-800">{review.rating}</span>
                  </div>
                  <p className="text-gray-600 italic">"{review.comment}"</p>
                  <p className="text-sm text-gray-500 mt-2">- {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 py-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Master {course.title}?</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Enroll now and start learning from the best in the industry.
          </p>
          <Button
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Enroll Now
            <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}