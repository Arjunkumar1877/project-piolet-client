'use client';

import { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Building2,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  User,
  Flag,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CheckCircle,
  CircleDot,
  Circle,
  Users,
  UserPlus,
  X,
  Search,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Define types
interface Member {
  name: string;
  role: string;
  email: string;
}

interface Project {
  id: string;
  projectName: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'on-hold';
  tasks: {
    total: number;
    completed: number;
  };
  members: Member[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'todo';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}


// Mock projects data
const mockProjects: Project[] = [
  // ... (keeping all your original mockProjects data)
  {
    id: '1',
    projectName: 'E-commerce Platform Redesign',
    description: 'Modernize the existing e-commerce platform with improved UX and new features',
    clientName: 'TechCorp Inc.',
    clientEmail: 'contact@techcorp.com',
    clientPhone: '+1 (555) 123-4567',
    clientAddress: '123 Tech Street, Silicon Valley, CA 94025',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    tasks: {
      total: 12,
      completed: 5
    },
    members: [
      {
        name: 'John Doe',
        role: 'Project Manager',
        email: 'john@example.com'
      },
      {
        name: 'Jane Smith',
        role: 'UI Designer',
        email: 'jane@example.com'
      },
      {
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike@example.com'
      },
      {
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike@example.com'
      },
      {
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike@example.com'
      }
    ]
  },
  {
    id: '2',
    projectName: 'Mobile Banking App',
    description: 'Develop a secure and user-friendly mobile banking application',
    clientName: 'SecureBank',
    clientEmail: 'projects@securebank.com',
    clientPhone: '+1 (555) 987-6543',
    clientAddress: '456 Finance Ave, New York, NY 10001',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-08-15'),
    status: 'active',
    tasks: {
      total: 8,
      completed: 2
    },
    members: [
      {
        name: 'John Doe',
        role: 'Project Manager',
        email: 'john@example.com'
      },
      {
        name: 'Jane Smith',
        role: 'UI Designer',
        email: 'jane@example.com'
      },
      {
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike@example.com'
      },
      {
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike@example.com'
      },
      {
        name: 'Mike Johnson',
        role: 'Frontend Developer',
        email: 'mike@example.com'
      }
    ]
  },
  {
    id: '3',
    projectName: 'Healthcare Management System',
    description: 'Create a comprehensive healthcare management system for hospitals',
    clientName: 'HealthCare Plus',
    clientEmail: 'it@healthcareplus.com',
    clientPhone: '+1 (555) 456-7890',
    clientAddress: '789 Medical Center Blvd, Chicago, IL 60601',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    tasks: {
      total: 15,
      completed: 7
    },
    members: [
      {
        name: 'Alex Davis',
        role: 'System Architect',
        email: 'alex@example.com'
      },
      {
        name: 'Emma Wilson',
        role: 'UI/UX Designer',
        email: 'emma@example.com'
      }
    ]
  }
];

// Mock tasks data
const mockTasks: Record<string, Task[]> = {
  // ... (keeping all your original mockTasks data)
  '1': [
    {
      id: '1-1',
      title: 'Design User Interface',
      description: 'Create wireframes and mockups for the e-commerce platform',
      status: 'completed',
      priority: 'high',
      dueDate: new Date('2024-03-15'),
      assignedTo: 'Jane Smith',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: '1-2',
      title: 'Implement Authentication',
      description: 'Set up user authentication and authorization system',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2024-03-25'),
      assignedTo: 'Mike Johnson',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-18')
    },
    {
      id: '1-3',
      title: 'Product Catalog',
      description: 'Create product listing and detail pages',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date('2024-04-05'),
      assignedTo: 'Mike Johnson',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    }
  ],
  '2': [
    {
      id: '2-1',
      title: 'Security Implementation',
      description: 'Implement bank-grade security measures',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2024-04-15'),
      assignedTo: 'Sarah Wilson',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-03-18')
    },
    {
      id: '2-2',
      title: 'API Development',
      description: 'Develop RESTful APIs for mobile app',
      status: 'todo',
      priority: 'high',
      dueDate: new Date('2024-05-01'),
      assignedTo: 'Tom Brown',
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-02-25')
    }
  ],
  '3': [
    {
      id: '3-1',
      title: 'Database Schema',
      description: 'Design and implement healthcare database schema',
      status: 'completed',
      priority: 'high',
      dueDate: new Date('2024-02-15'),
      assignedTo: 'Alex Davis',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: '3-2',
      title: 'Patient Portal',
      description: 'Create patient portal interface',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date('2024-04-30'),
      assignedTo: 'Emma Wilson',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-01')
    }
  ]
};


export default function ProjectDetailsPage() {
  
  const { id } = useParams();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const project = mockProjects.find((p: Project) => p.id === id);
  const tasks = mockTasks[id as string] || [];


  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
          <Link href="/projects" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <CircleDot className="w-4 h-4" />;
      case 'todo':
        return <Circle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your member addition logic here
    setShowAddMember(false);
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your task addition logic here
    setShowAddTask(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link 
          href="/projects" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(project.status)} shadow-sm`}>
                  {getStatusIcon(project.status)}
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{project.projectName}</h1>
              <p className="text-gray-600 mt-2 text-lg">{project.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddMember(true)}
                className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add Member
              </button>
              <button 
                onClick={() => setShowAddTask(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium text-gray-900">{project.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{project.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{project.clientPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900 line-clamp-1">{project.clientAddress}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-gray-500">Start Date</p>
                <p className="font-medium text-gray-900">1234567</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-gray-500">End Date</p>
                <p className="font-medium text-gray-900">1234567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                <p className="text-sm text-gray-500">{project.members.length} members in the team</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.members.map((member, index) => (
              <motion.div
                key={member.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">{member.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                <p className="text-sm text-gray-500">
                  {tasks.filter(t => t.status === 'completed').length} / {tasks.length} completed
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="todo">To Do</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-100 rounded-lg p-6 hover:border-gray-200 transition-all duration-200 hover:shadow-md bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900 text-lg">{task.title}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(task.status)} shadow-sm`}>
                        {getStatusIcon(task.status)}
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className={`w-5 h-5 ${getPriorityColor(task.priority)}`} />
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Due: 1234567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>Updated: 1234567</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">Add a new task to get started</p>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add Team Member</h2>
                <button 
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Enter member name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Enter member role"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Enter member email"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Add New Task</h2>
                <button 
                  onClick={() => setShowAddTask(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  >
                    {project.members.map(member => (
                      <option key={member.email} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}