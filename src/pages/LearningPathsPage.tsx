import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // Added for smooth animations

// Mock data for learning paths (move to src/lib/mock-data.ts if preferred)
const mockLearningPaths = [
  {
    id: 'lp1',
    title: 'Web Development Mastery',
    description:
      'Master the art of building modern web applications from scratch, covering HTML, CSS, JavaScript, React, and backend technologies.',
    courses: 8,
    duration: '40 hours',
    rating: 4.8,
    level: 'Beginner to Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1516321310766-779c93437f14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lp2',
    title: 'Data Science Essentials',
    description:
      'Dive into data analysis, machine learning, and visualization with Python, Pandas, and TensorFlow.',
    courses: 6,
    duration: '30 hours',
    rating: 4.9,
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bbfda7849d72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lp3',
    title: 'Graphic Design Fundamentals',
    description:
      'Learn design principles, Adobe Photoshop, and Illustrator to create stunning visuals for any medium.',
    courses: 5,
    duration: '25 hours',
    rating: 4.7,
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

// Animation variants for smooth transitions
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.03, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function LearningPathsPage() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Discover Your <span className="text-blue-600">Learning Path</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Embark on expertly curated journeys to master new skills and elevate your career with confidence.
          </p>
        </motion.div>

        {/* Learning Paths Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {mockLearningPaths.map((path) => (
            <motion.div
              key={path.id}
              variants={cardVariants}
              whileHover="hover"
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <Link to={`/learning-paths/${path.id}`}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <div className="relative">
                    <img
                      src={path.thumbnail}
                      alt={path.title}
                      className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {path.level}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-1">{path.title}</h2>
                    <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{path.description}</p>
                    <div className="space-y-4 text-gray-700">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">{path.courses} Courses</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">{path.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-2 fill-current" />
                        <span className="font-medium">{path.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Button
                      className={`w-full mt-6 rounded-full py-3 font-semibold transition-all duration-300 ${
                        hoveredPath === path.id
                          ? 'bg-blue-600 text-white hover:bg-blue-700 scale-105'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      Start Path
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Learning Paths Section */}
        <motion.div
          className="mt-20 bg-white rounded-3xl shadow-xl p-10"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center tracking-tight">
            Why Choose a Learning Path?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10 text-blue-600" />,
                title: 'Structured Learning',
                desc: 'Follow a clear, step-by-step roadmap designed by experts to build your skills progressively.',
                bg: 'bg-blue-50',
              },
              {
                icon: <Clock className="h-10 w-10 text-green-600" />,
                title: 'Time Efficient',
                desc: 'Focus on what matters most with curated content, saving you time and effort.',
                bg: 'bg-green-50',
              },
              {
                icon: <Star className="h-10 w-10 text-yellow-600" />,
                title: 'Proven Results',
                desc: 'Achieve your goals with paths proven to deliver high ratings and career success.',
                bg: 'bg-yellow-50',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-opacity-50 rounded-xl"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          className="mt-20 py-14 px-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center rounded-3xl shadow-2xl"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Choose a learning path and unlock your potential with expert guidance today.
          </p>
          <Button
            className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-10 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}