import { useQuery } from '@tanstack/react-query'
import api from './axios'
import { Project, ProjectDetails, TeamMember } from '../types/project';



  
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