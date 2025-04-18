'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaCircle,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { useGetTaskDetails } from '@/src/api/query';
import { TeamMember } from '@/src/types/project';

export default function TaskDetailsPage() {
  const { id, taskId } = useParams();
  const { data: task, isLoading } = useGetTaskDetails({ taskId: taskId as string });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Task not found</h1>
          <Link href={`/projects/${id}`} className="text-teal-400 hover:underline mt-4 inline-block">
            Back to Project
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-900/30 text-blue-400';
      case 'in-progress':
        return 'bg-emerald-900/30 text-emerald-400';
      case 'todo':
        return 'bg-amber-900/30 text-amber-400';
      default:
        return 'bg-gray-800/30 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <FaCircle className="w-4 h-4" />;
      case 'todo':
        return <FaCircle className="w-4 h-4" />;
      default:
        return <FaCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center text-gray-400 hover:text-teal-400 mb-6 group transition-colors"
        >
          <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Project
        </Link>

        <div className="bg-gray-800/50 rounded-xl shadow-lg p-8 border border-gray-700/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(task.status)} shadow-sm`}>
                  {getStatusIcon(task.status)}
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className="text-gray-400 text-sm">#{task.ticketNumber}</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{task.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-teal-400 transition-colors">
                <FaEdit className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Task Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-400">Assigned To</p>
                    <p className="text-white">
                      {task.assignedTo && task.assignedTo.length > 0
                        ? task.assignedTo.map((member: TeamMember) => member.name).join(', ')
                        : 'Unassigned'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-white">{format(new Date(task.startDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-400">Due Date</p>
                    <p className="text-white">{format(new Date(task.dueDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaClock className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white">{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="w-5 h-5 text-teal-400" />
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-white">{format(new Date(task.updatedAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 