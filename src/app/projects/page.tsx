'use client';

import { useState } from 'react';
import { 
  FaPlus, 
  FaCalendarAlt, 
  FaUsers, 
  FaClock, 
  FaExclamationCircle,
  FaSearch,
  FaFilter,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaCheckCircle,
  FaCircle,
} from 'react-icons/fa';
import Link from 'next/link';
import { Project } from '@/src/types/project';
import { useRouter } from 'next/navigation';


const mockProjects: Project[] = [
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
  members: [
    { name: 'Alice Johnson', role: 'Project Manager', email: 'alice@techretail.com' },
    { name: 'Bob Smith', role: 'Lead Developer', email: 'bob@techretail.com' }
  ]
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
  members: [
    { name: 'Charlie Davis', role: 'Mobile Developer', email: 'charlie@fintech.com' },
    { name: 'Diana Prince', role: 'QA Engineer', email: 'diana@fintech.com' }
  ]
}
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FaCircle className="w-4 h-4" />;
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'on-hold':
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaCircle className="w-4 h-4" />;
    }
  };
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track your projects</p>
        </div>
        <button onClick={() => router.push('/projects/add-projects')} className="flex items-center px-4 py-2 bg-[#0f717b] text-white rounded-lg hover:bg-[#488289] transition-colors">
          <FaPlus className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Link 
            key={project.id} 
            href={`/projects/${project.id}`}
            className="group block"
          >
            <div className="bg-gray-700  rounded-xl shadow-sm  hover:shadow-md hover:border-blue-500 transition-all duration-200 overflow-hidden h-full flex flex-col">
              {/* Project Header */}
              <div className=" flex-1">
                <div className="flex items-start justify-between mb-4 p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-[#0f717b] transition-colors line-clamp-1">
                      {project.projectName}
                    </h3>
                    <p className="text-white mt-2 line-clamp-2 text-sm">{project.description}</p>
                  </div>
                </div>

                {/* Client Info */}
               <div className="p-6">
               <div className="space-y-2.5 bg-[#0f717b] rounded-lg p-6">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="w-5 h-5 text-white" />
                    <span className="text-sm text-white">{project.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-5 h-5 text-white" />
                    <span className="text-sm text-white">{project.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-5 h-5 text-white" />
                    <span className="text-sm text-white">{project.clientPhone}</span>
                  </div>
                </div>
               </div>

                {/* Project Stats */}
                <div className="border-t border-gray-100">
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                          <FaUsers className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-white">{project.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-50 rounded-lg">
                          <FaClock className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {project.tasks.completed}/{project.tasks.total} tasks
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#0f717b]group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">View Details</span>
                      <FaArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Timeline */}
              <div className="px-6 py-4 bg-gray-700 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="w-5 h-5 text-white" />
                    <span className="text-sm text-white">Start: {project.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="w-5 h-5 text-white" />
                    <span className="text-sm text-white">End: {project.endDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaExclamationCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-white">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
