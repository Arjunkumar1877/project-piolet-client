import React, { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaUserMinus, FaChevronDown } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProjectDetails } from '@/src/types/project';
import { useEditTask } from '@/src/api/mutations';
import { CreateTaskDto, Task } from '@/src/types/tasks';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

export interface EditTaskModalProps {
  setShowAddTask: (show: boolean) => void;
  project: ProjectDetails;
  task?: Task;
}

export interface TaskFormInputs {
  title: string;
  description: string;
  assignedTo: string[];
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  dueDate: string;
}

const EditTaskModal: FC<EditTaskModalProps> = ({ setShowAddTask, project, task }) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<TaskFormInputs>();

  const editTask = useEditTask();
  const { id, taskId } = useParams();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        startDate: format(new Date(task.startDate), 'yyyy-MM-dd'),
        dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      });
      setSelectedMembers(task.assignedTo?.map(member => member._id) || []);
    }
  }, [task, reset]);

  const handleMemberSelect = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      const updatedMembers = [...selectedMembers, memberId];
      setSelectedMembers(updatedMembers);
      setValue('assignedTo', updatedMembers);
    }
    setIsDropdownOpen(false);
  };

  const removeMember = (memberId: string) => {
    const updatedMembers = selectedMembers.filter(id => id !== memberId);
    setSelectedMembers(updatedMembers);
    setValue('assignedTo', updatedMembers);
  };

  const onSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    if (!task?.ticketNumber) return;
    
    const taskData: CreateTaskDto = {
      ...data,
      project: id as string,
      ticketNumber: task.ticketNumber,
      startDate: new Date(data.startDate),
      dueDate: new Date(data.dueDate),
      assignedTo: data.assignedTo || [],
      priority: data.priority
    };

    editTask.mutateAsync({data: taskData, id: taskId as string});
    setShowAddTask(false);
  };

  return (
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
          <h2 className="text-2xl font-semibold text-white">Edit Task</h2>
          <button
            onClick={() => setShowAddTask(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
              placeholder="Enter task description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To</label>
            <div className="space-y-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 flex items-center justify-between"
                >
                  <span>Select team members</span>
                  <FaChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {project.teamMembers?.map((member) => (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() => handleMemberSelect(member._id)}
                        disabled={selectedMembers.includes(member._id)}
                        className={`w-full px-4 py-2 text-left text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedMembers.includes(member._id) ? 'bg-gray-700' : ''
                        }`}
                      >
                        {member.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selected Members Display */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMembers.map((memberId) => {
                  const member = project.teamMembers?.find(m => m._id === memberId);
                  if (!member) return null;
                  
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="text-gray-200">{member.name}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(memberId)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <FaUserMinus className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In-progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
            <select
              {...register('priority', { required: 'Priority is required' })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              {...register('dueDate', { required: 'Due date is required' })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
            />
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white py-2.5 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className="flex-1 bg-gray-700 text-white py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditTaskModal;
