'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaCircle,
  FaUsers,
  FaUserPlus,
  FaTimes,
  FaSearch,
  FaFilter,
  FaUser,
  FaFlag,
} from 'react-icons/fa';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllTasks, useGetMembers, useGetProjectsDetails } from '@/src/api/query';
import {  ProjectDetails, TeamMember } from '@/src/types/project';
import { format } from 'date-fns';
import { useAuthStore } from '@/src/store/useAuthStore';
import {  useAddMembersInProject } from '@/src/api/mutations';
import AddTaskModal from '@/src/components/tasks/AddTaskModal';
import { Task } from '@/src/types/tasks';



export default function ProjectDetailsPage() {

  const { id } = useParams();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddNewMember, setShowAddNewMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: projectDetails } = useGetProjectsDetails({ projectId: id as string });
  const user = useAuthStore((state) => state.user)
  const project: ProjectDetails = projectDetails as ProjectDetails;
  const [teamMembers, setTeamMembers] = useState<Array<{
    _id: string; name: string; role: string; email: string
  }>>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');

  const { data: availableTeamMembers, isLoading: isMembersLoading } = useGetMembers({ userId: user?._id || '' });
  const addMembersToProject = useAddMembersInProject()
  const { data: tasks, isLoading: isTasksLoading } = useGetAllTasks({ projectId: id as string });
  


  const addTeamMember = () => {
    if (selectedMember) {
      const member = availableTeamMembers?.find((m: TeamMember) => m.name === selectedMember);
      if (member && !teamMembers.some(m => m.name === member.name)) {
        setTeamMembers([...teamMembers, member]);
        setSelectedMember('');
      }
    }
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Project not found</h1>
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
        return 'bg-blue-900/30 text-blue-400';
      case 'in-progress':
        return 'bg-emerald-900/30 text-emerald-400';
      case 'todo':
        return 'bg-amber-900/30 text-amber-400';
      default:
        return 'bg-gray-800/30 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-emerald-400';
      default:
        return 'text-gray-400';
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

  const handleUpdateTeamMembers = () => {
    try {
      const response = addMembersToProject.mutateAsync({
        memberId: teamMembers.map((member) => member._id) as string[],
        projectId: id as string
      })

      console.log(response);
    } catch (error) {
      console.error(error)
    }
  };


  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAddTask(false);
  };

  const filteredMembers = availableTeamMembers?.filter((member) => 
    !projectDetails?.teamMembers?.some((item) => item?._id === member._id)
  );

  

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/projects"
          className="inline-flex items-center text-gray-400 hover:text-teal-400 mb-6 group transition-colors"
        >
          <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <div className="bg-gray-800/50 rounded-xl shadow-lg p-8 mb-8 hover:shadow-xl transition-all duration-300 border border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${getStatusColor(project.status)} shadow-sm`}>
                  {getStatusIcon(project.status)}
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white">{project.projectName}</h1>
              <p className="text-gray-400 mt-2 text-lg">{project.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddNewMember(true)}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200"
              >
                <FaUserPlus className="w-5 h-5 mr-2" />
                Add Member
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-200"
              >
                <FaPlus className="w-5 h-5 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="flex items-center gap-3 p-4 bg-gray-800/80 rounded-lg border border-gray-700/50">
              <div className="p-2 bg-teal-600/20 rounded-lg">
                <FaBuilding className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Client</p>
                <p className="font-medium text-white">{project.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-800/80 rounded-lg border border-gray-700/50">
              <div className="p-2 bg-teal-600/20 rounded-lg">
                <FaEnvelope className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white">{project.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-800/80 rounded-lg border border-gray-700/50">
              <div className="p-2 bg-teal-600/20 rounded-lg">
                <FaPhone className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-medium text-white">{project.clientPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-800/80 rounded-lg border border-gray-700/50">
              <div className="p-2 bg-teal-600/20 rounded-lg">
                <FaMapMarkerAlt className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p className="font-medium text-white line-clamp-1">{project.clientAddress}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 p-3 bg-gray-800/80 rounded-lg border border-gray-700/50">
              <FaCalendarAlt className="w-5 h-5 text-teal-400" />
              <div>
                <p className="text-gray-400">Start Date</p>
                <p className="font-medium text-white">{format(project.startDate, 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-800/80 rounded-lg border border-gray-700/50">
              <FaClock className="w-5 h-5 text-teal-400" />
              <div>
                <p className="text-gray-400">End Date</p>
                <p className="font-medium text-white">{format(project.endDate, 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl shadow-lg p-8 mb-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600/20 rounded-lg">
                <FaUsers className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Team Members</h2>
                <p className="text-sm text-gray-400">{project?.teamMembers?.length} members in the team</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.teamMembers && project?.teamMembers?.map((member, index) => (
              <motion.div
                key={member.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-800/80 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-teal-600/20 flex items-center justify-center">
                  <span className="text-teal-400 font-medium">{member?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-medium text-white">{member?.name}</h3>
                  <p className="text-sm text-gray-400">{member?.role}</p>
                  <p className="text-xs text-gray-500">{member?.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl shadow-lg p-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600/20 rounded-lg">
                <FaCheckCircle className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                {/* <p className="text-sm text-gray-400">
                  {tasks.filter(t => t.status === 'completed').length} / {tasks.length} completed
                </p> */}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="todo">To Do</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {isTasksLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              (tasks as unknown as Task[])?.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-lg p-6 bg-gray-800/80 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white text-lg">{task.title}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(task.status)} shadow-sm`}>
                          {getStatusIcon(task.status)}
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-2">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFlag className={`w-5 h-5 ${getPriorityColor(task.status)}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      <span>
                        {task.assignedTo && task.assignedTo.length > 0 
                          ? task.assignedTo.map((member: any) => member.name).join(', ')
                          : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span>Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaExclamationCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
              <p className="text-gray-400">Add a new task to get started</p>
            </div>
          )} */}
        </div>
      </motion.div>


      <AnimatePresence>
        {showAddNewMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-gray-800 rounded-xl p-8 w-full max-w-3xl lg:max-w-4xl shadow-2xl border border-gray-700/50"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Add Team Member</h2>
                <button
                  onClick={() => setShowAddNewMember(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              {!user?._id || isMembersLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Team Members</h2>
                    <div className="flex items-center gap-4">
                      <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
                      >
                        <option value="">Select a team member</option>
                        {filteredMembers?.map((member) => (
                          <option key={member.email} value={member.name}>
                            {member.name} - {member.role}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <FaPlus className="w-4 h-4" />
                        Add Selected Member
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-800/80 rounded-lg border border-gray-700/50"
                      >
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-gray-400 text-sm">{member.role}</p>
                          <p className="text-gray-400 text-sm">{member.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleUpdateTeamMembers}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showAddTask && (
        <AddTaskModal setShowAddTask={setShowAddTask} project={project} />
        )}
      </AnimatePresence>
    </div>
  );
}