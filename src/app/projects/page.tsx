'use client';

import { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Search,
  Filter
} from 'lucide-react';
import { Project } from '@/src/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    projectName: 'E-commerce Website Development',
    description: 'Building a modern e-commerce platform with React and Node.js',
    clientName: 'Tech Retail Co.',
    clientEmail: 'contact@techretail.com',
    clientPhone: '+1 (555) 123-4567',
    clientAddress: '123 Business Ave, Suite 100, San Francisco, CA 94105',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    tasks: {
      total: 25,
      completed: 12,
    },
  },
  {
    id: '2',
    projectName: 'Mobile Banking App',
    description: 'Developing a secure mobile banking application for iOS and Android',
    clientName: 'FinTech Solutions',
    clientEmail: 'projects@fintechsolutions.com',
    clientPhone: '+1 (555) 987-6543',
    clientAddress: '456 Finance Street, New York, NY 10001',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-08-15'),
    status: 'active',
    tasks: {
      total: 40,
      completed: 18,
    },
  },
  {
    id: '3',
    projectName: 'Healthcare Management System',
    description: 'Creating a comprehensive healthcare management solution',
    clientName: 'HealthCare Plus',
    clientEmail: 'info@healthcareplus.com',
    clientPhone: '+1 (555) 456-7890',
    clientAddress: '789 Medical Center Blvd, Chicago, IL 60601',
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-07-10'),
    status: 'on-hold',
    tasks: {
      total: 35,
      completed: 15,
    },
  },
  {
    id: '4',
    projectName: 'Real Estate Platform',
    description: 'Building a property listing and management system',
    clientName: 'Real Estate Pro',
    clientEmail: 'support@realestatepro.com',
    clientPhone: '+1 (555) 234-5678',
    clientAddress: '321 Property Lane, Miami, FL 33101',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-31'),
    status: 'completed',
    tasks: {
      total: 30,
      completed: 30,
    },
  },
  {
    id: '5',
    projectName: 'Educational LMS',
    description: 'Developing a learning management system for online education',
    clientName: 'EduTech Solutions',
    clientEmail: 'contact@edutechsolutions.com',
    clientPhone: '+1 (555) 345-6789',
    clientAddress: '567 Education Ave, Boston, MA 02108',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-09-15'),
    status: 'active',
    tasks: {
      total: 45,
      completed: 20,
    },
  },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'on-hold':
        return <PauseCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const calculateProgress = (project: Project) => {
    return Math.round((project.tasks.completed / project.tasks.total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track your project progress</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
          >
            {/* Project Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{project.projectName}</h2>
                <p className="text-gray-600 mt-1 line-clamp-2">{project.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>

            {/* Client Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{project.clientName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{project.clientEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{project.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm line-clamp-1">{project.clientAddress}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{calculateProgress(project)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress(project)}%` }}
                />
              </div>
            </div>

            {/* Tasks Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Start: {project.startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>End: {project.endDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
} 