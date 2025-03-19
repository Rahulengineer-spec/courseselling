import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, Clock, Star, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Mock data with updated image URLs
const mockLearningPaths = [
  {
    id: 'lp1',
    title: 'Web Development Mastery',
    description:
      'Master the art of building modern web applications from scratch, covering HTML, CSS, JavaScript, React, and backend technologies like Node.js and Express. This path takes you from basic HTML to deploying full-stack applications.',
    courses: 8,
    duration: '40 hours',
    rating: 4.8,
    level: 'Beginner to Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e5250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Updated URL
    syllabus: [
      'Introduction to HTML & CSS',
      'JavaScript Fundamentals',
      'Advanced React Techniques',
      'Backend with Node.js',
      'Database Integration',
      'API Development',
      'Deployment Strategies',
      'Project Capstone',
    ],
  },
  {
    id: 'lp2',
    title: 'Data Science Essentials',
    description:
      'Dive into data analysis, machine learning, and visualization with Python, Pandas, and TensorFlow. Learn to process data, build models, and present insights effectively.',
    courses: 6,
    duration: '30 hours',
    rating: 4.9,
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Updated URL
    syllabus: [
      'Python for Data Science',
      'Data Wrangling with Pandas',
      'Visualization with Matplotlib',
      'Intro to Machine Learning',
      'TensorFlow Basics',
      'Capstone Project',
    ],
  },
  {
    id: 'lp3',
    title: 'Graphic Design Fundamentals',
    description:
      'Learn design principles, Adobe Photoshop, and Illustrator to create stunning visuals for any medium. Perfect for beginners looking to break into creative fields.',
    courses: 5,
    duration: '25 hours',
    rating: 4.7,
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Still works
    syllabus: [
      'Design Principles',
      'Photoshop Basics',
      'Illustrator Essentials',
      'Typography & Color Theory',
      'Final Portfolio Project',
    ],
  },
];

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const imageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeIn' } },
};

export function LearningPathDetailPage() {
  const { id } = useParams<{ id: string }>();
  const path = mockLearningPaths.find((p) => p.id === id);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Fallback image with descriptive text
  const fallbackImage = 'https://via.placeholder.com/800x400.png?text=Image+Failed+to+Load+-+Check+URL+or+Network';

  if (!path) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Path Not Found</h1>
          <Link to="/learning-paths">
            <Button className="bg-blue-600 text-white rounded-full px-6 py-2">
              Back to Learning Paths
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-16"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Link to="/learning-paths">
            <Button variant="ghost" className="mr-4 hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {path.title}
          </h1>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-12">
          <motion.div
            className="relative w-full h-80"
            initial="hidden"
            animate={isImageLoaded ? 'visible' : 'hidden'}
            variants={imageVariants}
          >
            <img
              src={path.thumbnail}
              alt={path.title}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
              onLoad={() => {
                console.log(`Image loaded for ${path.title}: ${path.thumbnail}`);
                setIsImageLoaded(true);
              }}
              onError={(e) => {
                console.error(`Image failed to load for ${path.title}: ${path.thumbnail}`);
                e.currentTarget.src = fallbackImage;
                setIsImageLoaded(true);
              }}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse blur-sm flex items-center justify-center">
                <span className="text-gray-500 text-lg">Loading Image...</span>
              </div>
            )}
          </motion.div>
          <div className="p-8">
            {/* Enhanced Brief Description */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 relative inline-block">
                Overview
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-600 rounded-full"></span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold italic text-gray-900">{path.title}</span> is your gateway to
                <span className="font-bold text-blue-600"> mastering cutting-edge skills</span>. {path.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-blue-500 mr-3" />
                <span className="font-medium">{path.courses} Courses</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-green-500 mr-3" />
                <span className="font-medium">{path.duration}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-6 w-6 text-yellow-400 mr-3 fill-current" />
                <span className="font-medium">{path.rating.toFixed(1)}</span>
              </div>
            </div>
            <Button
              className="mt-8 w-full md:w-auto bg-blue-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Enroll Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Syllabus */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Syllabus</h2>
          <ul className="space-y-4">
            {path.syllabus.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 font-semibold">
                  {index + 1}
                </div>
                <span className="text-gray-700 text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}