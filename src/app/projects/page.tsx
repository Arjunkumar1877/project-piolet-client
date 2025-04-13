'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  FaUserPlus,
  FaTimes,
} from 'react-icons/fa';
import Link from 'next/link';
import { Project } from '@/src/types/project';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAddMembers } from '@/src/api/mutations';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useGetProjects } from '@/src/api/query';
import { format } from 'date-fns';
import { MemberFormData, memberSchema } from '@/src/form/form';


export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddMember, setShowAddMember] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data: projects, isLoading } = useGetProjects({ userId: user?._id || '' });
  const allProjects: Project[] = projects || []

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-900/30 text-emerald-400';
      case 'completed':
        return 'bg-blue-900/30 text-blue-400';
      case 'on-hold':
        return 'bg-amber-900/30 text-amber-400';
      default:
        return 'bg-gray-800/30 text-gray-400';
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
  const addMember = useAddMembers()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  const handleAddMember = async (data: MemberFormData) => {
    try {
      if (!user?._id) {
        throw new Error('User ID is required');
      }
      await addMember.mutateAsync({ ...data, userId: user._id });
      toast.success('Member added successfully!');
      setShowAddMember(false);
      reset();
    } catch {
      toast.error('Failed to add member. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage and track your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200"
          >
            <FaUserPlus className="w-5 h-5 mr-2" />
            Add Member
          </button>
          <button onClick={() => router.push('/projects/add-projects')} className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <FaPlus className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>
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
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project._id}`}
              className="group block"
            >
              <div className="bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md hover:border-teal-500/50 border border-gray-700/50 transition-all duration-200 overflow-hidden h-full flex flex-col">
                {/* Project Header */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4 p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-1">
                        {project.projectName}
                      </h3>
                      <p className="text-gray-400 mt-2 line-clamp-2 text-sm">{project.description}</p>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="p-6">
                    <div className="space-y-2.5 bg-gray-800/80 rounded-lg p-6 border border-gray-700/50">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="w-5 h-5 text-teal-400" />
                        <span className="text-sm text-gray-300">{project.clientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-5 h-5 text-teal-400" />
                        <span className="text-sm text-gray-300">{project.clientEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="w-5 h-5 text-teal-400" />
                        <span className="text-sm text-gray-300">{project.clientPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="border-t border-gray-700/50">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-900/30 rounded-lg">
                            <FaUsers className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-300">{project?.teamMembers?.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-900/30 rounded-lg">
                            <FaClock className="w-5 h-5 text-emerald-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-300">
                            1/4 tasks
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-teal-400 group-hover:gap-3 transition-all">
                        <span className="text-sm font-medium">View Details</span>
                        <FaArrowRight className="w-5 h-5 text-teal-400/70 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Timeline */}
                <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400">Start: {format(project.startDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400">End: {format(project.endDate, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <FaExclamationCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}


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
              className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Add Team Member</h2>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit(handleAddMember)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                    placeholder="Enter member name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <select
                    {...register('role')}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  >
                    <option value="">Select a role</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                    placeholder="Enter member email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={addMember.isPending}
                    className="flex-1 bg-teal-600 text-white py-2.5 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addMember.isPending ? 'Adding...' : 'Add Member'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 bg-gray-700 text-white py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors"
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
