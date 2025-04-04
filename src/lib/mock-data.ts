import { Course } from '@/types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn web development from scratch. Master HTML, CSS, JavaScript, React, and Node.js through hands-on projects and real-world applications.',
    instructor: {
      id: 'inst1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Senior Web Developer with 10+ years of experience',
    },
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    price: 99.99,
    duration: '32 hours',
    level: 'Beginner',
    category: 'Web Development',
    rating: 4.8,
    enrolledStudents: 15420,
    chapters: [
      {
        id: 'ch1',
        title: 'Introduction to Web Development',
        duration: '2 hours',
        resources: [],
      },
      {
        id: 'ch2',
        title: 'HTML Fundamentals',
        duration: '4 hours',
        resources: [],
      },
      {
        id: 'ch3',
        title: 'CSS Styling and Layout',
        duration: '6 hours',
        resources: [],
      },
    ],
    features: [
      'Build responsive websites from scratch',
      'Master modern JavaScript ES6+',
      'Create full-stack applications',
      'Deploy websites to production',
      'Implement authentication and databases',
    ],
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    title: 'Advanced Machine Learning Specialization',
    description: 'Deep dive into machine learning algorithms, neural networks, and AI applications. Perfect for data scientists and engineers.',
    instructor: {
      id: 'inst2',
      name: 'Dr. Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'AI Researcher and Professor',
    },
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
    price: 149.99,
    duration: '40 hours',
    level: 'Advanced',
    category: 'Data Science',
    rating: 4.9,
    enrolledStudents: 8750,
    chapters: [
      {
        id: 'ch1',
        title: 'Introduction to Machine Learning',
        duration: '3 hours',
        resources: [],
      },
      {
        id: 'ch2',
        title: 'Supervised Learning Algorithms',
        duration: '8 hours',
        resources: [],
      },
      {
        id: 'ch3',
        title: 'Neural Networks and Deep Learning',
        duration: '10 hours',
        resources: [],
      },
    ],
    features: [
      'Implement advanced ML algorithms',
      'Build neural networks from scratch',
      'Work with real-world datasets',
      'Deploy ML models to production',
      'Master TensorFlow and PyTorch',
    ],
    updatedAt: '2024-03-10',
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description: 'Master the art of user interface and experience design. Learn industry-standard tools and design principles.',
    instructor: {
      id: 'inst3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      bio: 'Senior Product Designer',
    },
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    price: 79.99,
    duration: '28 hours',
    level: 'Intermediate',
    category: 'Design',
    rating: 4.7,
    enrolledStudents: 12300,
    chapters: [
      {
        id: 'ch1',
        title: 'Design Principles and Theory',
        duration: '4 hours',
        resources: [],
      },
      {
        id: 'ch2',
        title: 'User Research and Personas',
        duration: '6 hours',
        resources: [],
      },
      {
        id: 'ch3',
        title: 'Prototyping and Testing',
        duration: '8 hours',
        resources: [],
      },
    ],
    features: [
      'Create user-centered designs',
      'Master Figma and design tools',
      'Conduct user research',
      'Build interactive prototypes',
      'Design responsive interfaces',
    ],
    updatedAt: '2024-03-12',
  },
]
// Add more sample courses
export const mockCourse = mockCourses[0];
export const mockCourseChapters = mockCourses[0].chapters;
export const mockCourseFeatures = mockCourses[0].features;
export const mockInstructor = mockCourses[0].instructor;
export const mockCourseResources = [
  {
    id: 'res1',
    title: 'HTML Cheat Sheet',
    type: 'PDF',
    url: 'https://example.com/html-cheat-sheet.pdf',
  },
  {
    id: 'res2',
    title: 'CSS Flexbox Guide',
    type: 'Video',
    url: 'https://example.com/css-flexbox-guide.mp4',
  },
  {
    id: 'res3',
    title: 'JavaScript ES6 Features',
    type: 'Article',
    url: 'https://example.com/javascript-es6-features.html',
  },
];
export const mockCourseReviews = [
  {
    id: 'rev1',
    user: {
      id: 'user1',
      name: 'Alice Smith',
      avatar: 'https://images.unsplash.com/photo-1502685104226-e9b3c1f0e4a5?w=400',
    },
    rating: 5,
    comment: 'This course was amazing! I learned so much and the projects were really fun.',
    date: '2024-03-01',
  },
  {
    id: 'rev2',
    user: {
      id: 'user2',
      name: 'Bob Johnson',
      avatar: 'https://images.unsplash.com/photo-1502767085884-e9b3c1f0e4a5?w=400',
    },
    rating: 4,
    comment: 'Great course, but I wish there were more hands-on projects.',
    date: '2024-03-05',
  },
  {
    id: 'rev3',
    user: {
      id: 'user3',
      name: 'Charlie Brown',
      avatar: 'https://images.unsplash.com/photo-1502767085884-e9b3c1f0e4a5?w=400',
    },
    rating: 4.5,
    comment: 'The instructor was very knowledgeable and the content was well-structured.',
    date: '2024-03-10',
  },
  {
    id: 'rev4',
    user: {
      id: 'user4',
      name: 'David Wilson',
      avatar: 'https://images.unsplash.com/photo-1502767085884-e9b3c1f0e4a5?w=400',
    },
    rating: 5,
    comment: 'I loved the course! The projects were challenging but rewarding.',
    date: '2024-03-12',
    },
  ];