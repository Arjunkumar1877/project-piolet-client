import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ProjectDetails } from '@/src/types/project';
import { useCreateTask } from '@/src/api/mutations';
import { CreateTaskDto } from '@/src/types/tasks';
import { generateTicketNumber } from '@/src/utils/ticketNumberGenerator';
import { useParams } from 'next/navigation';

interface AddTaskModalProps {
  setShowAddTask: (show: boolean) => void;
  project: ProjectDetails;
}

interface TaskFormInputs {
  title: string;
  description: string;
  assignedTo: string;
  startDate: string;
  dueDate: string;
}

const AddTaskModal: FC<AddTaskModalProps> = ({ setShowAddTask, project }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormInputs>();

  const createTask = useCreateTask()
  const { id } = useParams();

  const onSubmit: SubmitHandler<TaskFormInputs> = (data) => {
    // Generate a unique ticket number
    const ticketNumber = generateTicketNumber(project, []); // TODO: Pass existing ticket numbers if available
    
    const taskData: CreateTaskDto = {
      ...data,
      status: 'pending',
      project: id as string,
      ticketNumber,
      startDate: new Date(data.startDate),
      dueDate: new Date(data.dueDate),
      assignedTo: data.assignedTo ? [data.assignedTo] : []
    };

    createTask.mutateAsync(taskData);
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
          <h2 className="text-2xl font-semibold text-white">Add New Task</h2>
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
            <select
              {...register('assignedTo')}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
            >
              <option value="">Select a team member</option>
              {project.teamMembers &&
                project.teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
            </select>
            {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo.message}</p>}
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
              Add Task
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

export default AddTaskModal;
