'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useGetMembers, useGetProjectsDetails } from '@/src/api/query';
import { TeamMember } from '@/src/types/project';
import { useEditProject } from '@/src/api/mutations';
import { useAuthStore } from '@/src/store/useAuthStore';
import { format } from 'date-fns';

const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().min(1, 'Phone number is required'),
  clientAddress: z.string().min(1, 'Address is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['active', 'completed', 'on-hold', 'cancelled']),
  budget: z.string().min(1, 'Budget is required'),
  priority: z.enum(['low', 'medium', 'high']),
  teamMembers: z.array(z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email()
  })).optional(),
  notes: z.string().optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{
    _id: string; name: string; role: string; email: string 
  }>>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');

  const { data: members, isLoading } = useGetMembers({ userId: user?._id || '' });
  const availableTeamMembers = members || [];
  const { data: projectDetails } = useGetProjectsDetails({ projectId: id as string });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      description: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      startDate: '',
      endDate: '',
      status: 'active',
      budget: '',
      priority: 'medium',
      teamMembers: [],
      notes: '',
    },
  });

  useEffect(() => {
    if (projectDetails) {
      const formattedStartDate = projectDetails.startDate ? format(new Date(projectDetails.startDate), 'yyyy-MM-dd') : '';
      const formattedEndDate = projectDetails.endDate ? format(new Date(projectDetails.endDate), 'yyyy-MM-dd') : '';
      
      reset({
        projectName: projectDetails.projectName,
        description: projectDetails.description,
        clientName: projectDetails.clientName,
        clientEmail: projectDetails.clientEmail,
        clientPhone: projectDetails.clientPhone,
        clientAddress: projectDetails.clientAddress,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: projectDetails.status,
        budget: projectDetails.budget,
        priority: projectDetails.priority,
        notes: projectDetails.notes || '',
      });
      setTeamMembers(projectDetails.teamMembers || []);
    }
  }, [projectDetails, reset]);

  const addTeamMember = () => {
    if (selectedMember) {
      const member = availableTeamMembers.find((m: TeamMember) => m.name === selectedMember);
      if (member && !teamMembers.some(m => m.name === member.name)) {
        setTeamMembers([...teamMembers, member]);
        setValue('teamMembers', [...teamMembers, member]);
        setSelectedMember('');
      }
    }
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
    setValue('teamMembers', updatedMembers);
  };

  const editProject = useEditProject();

  const onSubmit = async (data: ProjectFormData) => {
    if (!user?._id) {
      toast.error('Please wait while we initialize your session');
      return;
    }

    try {
      setIsSubmitting(true);
      const transformedData = {
        ...data,
        _id: id as string,
        userId: user._id,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        teamMembers: teamMembers.map(member => member._id)
      };
      
      const result = await editProject.mutateAsync(transformedData);
      console.log('API response:', result);
      
      toast.success('Project updated successfully!');
      router.push('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Project</h1>
            <p className="text-gray-400 mt-1">Update project details and team members</p>
          </div>
          <Link href="/projects" className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors">
            <FaArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Project Details Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  {...register('projectName')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-400">{errors.projectName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter project description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Client Information Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Name
                </label>
                <input
                  {...register('clientName')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter client name"
                />
                {errors.clientName && (
                  <p className="mt AGN-1 text-sm text-red-400">{errors.clientName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Email
                </label>
                <input
                  {...register('clientEmail')}
                  type="email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter client email"
                />
                {errors.clientEmail && (
                  <p className="mt-1 text-sm text-red-400">{errors.clientEmail.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Phone
                </label>
                <input
                  {...register('clientPhone')}
                  type="tel"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter client phone"
                />
                {errors.clientPhone && (
                  <p className="mt-1 text-sm text-red-400">{errors.clientPhone.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Address
                </label>
                <input
                  {...register('clientAddress')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter client address"
                />
                {errors.clientAddress && (
                  <p className="mt-1 text-sm text-red-400">{errors.clientAddress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Timeline Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Project Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-400">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Budget and Priority Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Project Budget & Priority</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                  Budget
                </label>
                <input
                  {...register('budget')}
                  type="text"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  placeholder="Enter project budget"
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-400">{errors.budget.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-400">{errors.priority.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Notes Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-6">Additional Notes</h2>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                placeholder="Enter any additional notes about the project"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-400">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Team Members Section */}
          {!user?._id ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="bg Deprecated-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Team Members</h2>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200"
                  >
                    <option value="">Select a team member</option>
                    {availableTeamMembers.map((member: TeamMember) => (
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
                    Add Member
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/80 rounded-lg border border-gray-700/50">
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !user?._id}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}