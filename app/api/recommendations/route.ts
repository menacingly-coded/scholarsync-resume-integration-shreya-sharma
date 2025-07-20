import { NextRequest, NextResponse } from 'next/server';

const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Research Paper Summarizer',
    description:
      'Build a web application that uses natural language processing to automatically generate concise summaries of academic papers. Perfect for researchers who need to quickly review literature.',
    matchingTags: ['Machine Learning', 'Natural Language Processing', 'Python', 'React'],
    difficulty: 'Advanced',
    estimatedTime: '6-8 weeks',
    collaborators: 3,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 95,
  },
  {
    id: '2',
    title: 'Interactive Data Visualization Dashboard',
    description:
      'Create a responsive dashboard for visualizing complex datasets with interactive charts and real-time updates. Great for showcasing data analysis skills.',
    matchingTags: ['JavaScript', 'React', 'Node.js', 'SQL'],
    difficulty: 'Intermediate',
    estimatedTime: '4-5 weeks',
    collaborators: 2,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 88,
  },
  {
    id: '3',
    title: 'Computer Vision Object Detection App',
    description:
      'Develop a mobile-friendly web app that can detect and classify objects in real-time using your device\'s camera. Implement using modern computer vision techniques.',
    matchingTags: ['Computer Vision', 'Python', 'Deep Learning', 'JavaScript'],
    difficulty: 'Advanced',
    estimatedTime: '5-7 weeks',
    collaborators: 4,
    githubUrl: '#',
    matchScore: 92,
  },
  {
    id: '4',
    title: 'Collaborative Code Review Platform',
    description:
      'Build a platform where developers can submit code for peer review, with features like syntax highlighting, commenting, and automated code quality checks.',
    matchingTags: ['Node.js', 'React', 'Git', 'Docker'],
    difficulty: 'Intermediate',
    estimatedTime: '3-4 weeks',
    collaborators: 2,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 85,
  },
  {
    id: '5',
    title: 'Neural Network Visualization Tool',
    description:
      'Create an educational tool that visualizes how neural networks learn and make decisions. Include interactive elements to adjust parameters and see real-time changes.',
    matchingTags: ['Neural Networks', 'JavaScript', 'Machine Learning', 'Python'],
    difficulty: 'Advanced',
    estimatedTime: '4-6 weeks',
    collaborators: 1,
    githubUrl: '#',
    matchScore: 90,
  },
  {
    id: '6',
    title: 'Personal Finance Tracker App',
    description:
      'Develop a mobile app to help users track expenses, set budgets, and visualize spending habits with charts.',
    matchingTags: ['React Native', 'TypeScript', 'Firebase', 'Charts'],
    difficulty: 'Intermediate',
    estimatedTime: '3-5 weeks',
    collaborators: 2,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 80,
  },
  {
    id: '7',
    title: 'IoT Smart Home Controller',
    description:
      'Create a dashboard to control and monitor smart home devices using IoT protocols and real-time data.',
    matchingTags: ['IoT', 'Raspberry Pi', 'Node.js', 'WebSockets'],
    difficulty: 'Advanced',
    estimatedTime: '6 weeks',
    collaborators: 3,
    githubUrl: '#',
    matchScore: 87,
  },
  {
    id: '8',
    title: 'E-Learning Platform for Kids',
    description:
      'Build an interactive e-learning platform with gamified lessons, quizzes, and progress tracking for children.',
    matchingTags: ['React', 'Firebase', 'Gamification', 'Education'],
    difficulty: 'Intermediate',
    estimatedTime: '5 weeks',
    collaborators: 4,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 83,
  },
  {
    id: '9',
    title: 'Real-Time Language Translation Chatbot',
    description:
      'Develop a chatbot that translates messages in real-time using NLP and third-party translation APIs.',
    matchingTags: ['NLP', 'Chatbot', 'APIs', 'Python'],
    difficulty: 'Advanced',
    estimatedTime: '4-6 weeks',
    collaborators: 2,
    githubUrl: '#',
    matchScore: 89,
  },
  {
    id: '10',
    title: 'Fitness Progress Tracker',
    description:
      'Create a web app for users to log workouts, set goals, and visualize fitness progress over time.',
    matchingTags: ['React', 'Node.js', 'MongoDB', 'Charts'],
    difficulty: 'Beginner',
    estimatedTime: '2-3 weeks',
    collaborators: 1,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 75,
  },
  {
    id: '11',
    title: 'Remote Team Collaboration Tool',
    description:
      'Build a platform for remote teams to chat, share files, and manage tasks in real-time.',
    matchingTags: ['React', 'WebSockets', 'Node.js', 'Task Management'],
    difficulty: 'Intermediate',
    estimatedTime: '4 weeks',
    collaborators: 3,
    githubUrl: '#',
    matchScore: 82,
  },
  {
    id: '12',
    title: 'Blockchain-Based Voting System',
    description:
      'Design a secure and transparent voting system using blockchain technology.',
    matchingTags: ['Blockchain', 'Solidity', 'Web3', 'Security'],
    difficulty: 'Advanced',
    estimatedTime: '8 weeks',
    collaborators: 2,
    githubUrl: '#',
    matchScore: 91,
  },
  {
    id: '13',
    title: 'Recipe Recommendation Engine',
    description:
      'Develop a web app that recommends recipes based on available ingredients and dietary preferences.',
    matchingTags: ['React', 'APIs', 'Machine Learning', 'Food'],
    difficulty: 'Beginner',
    estimatedTime: '2 weeks',
    collaborators: 1,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 73,
  },
  {
    id: '14',
    title: 'Augmented Reality Interior Designer',
    description:
      'Create an AR app that lets users visualize furniture and decor in their own space using their phone camera.',
    matchingTags: ['AR', 'Unity', 'Mobile', '3D'],
    difficulty: 'Advanced',
    estimatedTime: '7 weeks',
    collaborators: 2,
    githubUrl: '#',
    matchScore: 86,
  },
  {
    id: '15',
    title: 'Mental Health Support Chatbot',
    description:
      'Build a supportive chatbot that provides mental health resources and tracks user mood over time.',
    matchingTags: ['Chatbot', 'NLP', 'React', 'APIs'],
    difficulty: 'Intermediate',
    estimatedTime: '3-4 weeks',
    collaborators: 2,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 84,
  },
  {
    id: '16',
    title: 'Automated Resume Screening Tool',
    description:
      'Develop a tool that screens resumes and ranks candidates based on job requirements using ML.',
    matchingTags: ['Machine Learning', 'Python', 'NLP', 'Recruitment'],
    difficulty: 'Advanced',
    estimatedTime: '5 weeks',
    collaborators: 3,
    githubUrl: '#',
    matchScore: 90,
  },
  {
    id: '17',
    title: 'Sustainable Shopping Assistant',
    description:
      'Create a browser extension that suggests eco-friendly alternatives while shopping online.',
    matchingTags: ['Browser Extension', 'JavaScript', 'APIs', 'Sustainability'],
    difficulty: 'Intermediate',
    estimatedTime: '3 weeks',
    collaborators: 1,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 78,
  },
  {
    id: '18',
    title: 'Smart Plant Monitoring System',
    description:
      'Build an IoT system to monitor plant health and send alerts for watering and sunlight needs.',
    matchingTags: ['IoT', 'Sensors', 'Python', 'Raspberry Pi'],
    difficulty: 'Intermediate',
    estimatedTime: '4 weeks',
    collaborators: 2,
    githubUrl: '#',
    matchScore: 81,
  },
  {
    id: '19',
    title: 'Virtual Event Platform',
    description:
      'Develop a platform for hosting virtual conferences with live streaming, chat, and networking features.',
    matchingTags: ['React', 'Node.js', 'WebRTC', 'Streaming'],
    difficulty: 'Advanced',
    estimatedTime: '6 weeks',
    collaborators: 4,
    githubUrl: '#',
    demoUrl: '#',
    matchScore: 88,
  },
  {
    id: '20',
    title: 'AI-Based Handwriting Recognition',
    description:
      'Create a web app that recognizes and digitizes handwritten notes using deep learning.',
    matchingTags: ['AI', 'Deep Learning', 'Python', 'OCR'],
    difficulty: 'Advanced',
    estimatedTime: '5 weeks',
    collaborators: 2,
    githubUrl: '#',
    matchScore: 93,
  },
];

export async function POST(req: NextRequest) {
  const { skills = [], interests = [] } = await req.json();
  // Only use resume skills for matching
  const resumeSkills = skills || [];
  console.log('Resume skills received:', resumeSkills);

  const relevantProjects = mockProjects.filter((project) =>
    project.matchingTags.some((tag) =>
      resumeSkills.some((skill: string) =>
        skill.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(skill.toLowerCase())
      )
    )
  );

  const sortedProjects = relevantProjects.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json({ projects: sortedProjects });
} 