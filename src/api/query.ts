import { useQuery } from '@tanstack/react-query'
import api from './axios'
import { Project, ProjectDetails, TeamMember } from '../types/project';
import { Task } from '../types/tasks';
import { auth, getIdToken } from '../lib/firebase';



  
  export function useGetMembers({ userId }: { userId: string }) {
    return useQuery<TeamMember[]>({
      queryKey: ['team-members', userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error('User ID is required');
        }
        const response = await api.get(`/team-members/${userId}`);
        return response.data;
      },
      enabled: !!userId,
    });
  }


  
  export function useGetProjects({ userId }: { userId: string }) {
    return useQuery<Project[]>({
      queryKey: ['team-project', userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error('User ID is required');
        }
        const response = await api.get(`/projects/${userId}`);
        return response.data;
      },
      enabled: !!userId,
    });
  }




  export function useGetProjectsDetails({ projectId }: { projectId: string }) {
    return useQuery<ProjectDetails>({
      queryKey: ['team-project', projectId],
      queryFn: async () => {
        if (!projectId) {
          throw new Error('User ID is required');
        }
        const response = await api.get(`/projects/details/${projectId}`);
        return response.data;
      },
      enabled: !!projectId,
    });
  }




  export function useGetAllTasks({ projectId }: { projectId: string }) {
    return useQuery<{ tasks: Task[] }>({
      queryKey: ['tasks', projectId],
      queryFn: async () => {
        if (!projectId) {
          throw new Error('Project ID is required');
        }
        const response = await api.get(`/task?projectId=${projectId}`);
        return response.data;
      },
      enabled: !!projectId,
    });
  }


  export function  useGetTaskDetails({ taskId }: { taskId: string }) {
    return useQuery<Task>({
      queryKey: ['tasks', taskId],
      queryFn: async () => {
        if (!taskId) {
          throw new Error('Project ID is required');
        }
        const response = await api.get(`/task/${taskId}`);
        return response.data;
      },
      enabled: !!taskId,
    });
  }



  export function useGetUser() {
    return useQuery({
      queryKey: ['user-details'],
      queryFn: async () => {
        const token = await getIdToken();
        if (!token) {
          throw new Error('No token available');
        }
        
        // Send the token to your backend for verification
        const response = await api.post("/auth/verify-token", {
          token
        });
        return response.data;
      },
    });
  }




