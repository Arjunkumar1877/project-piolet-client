import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'
import { Project } from '../types/project'

export function useSignup() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
        email: string,
        password: string,
        name: string
    }) => {
      const res = await api.post('/auth/signup', data)
      return res.data 
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Signup error:', error)
    },
  })
}







export function useLogin() {
  const mutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
        const userCredential = await api.post('/auth/login', {
            email, password
        })
        return userCredential.data

    },
    onSuccess: (data) => {
      console.log('Login successful', data)
    },
    onError: (error: Error) => {
      console.error('Login failed:', error.message)
    },
  })

  return mutation
}







export function useAddMembers() {
  const mutation = useMutation({
    mutationFn: async ({ name, role, email , userId}: { name: string; role: string; email: string , userId: string }) => {
        const response = await api.post('/team-members', {
            name, role, email, userId
        })
        return response.data

    },
    onSuccess: (data) => {
      console.log('saved member successful', data)
    },
    onError: (error: Error) => {
      console.error('saved member failed:', error.message)
    },
  })

  return mutation
}



export function useAddMembersInProject() {
  const mutation = useMutation({
    mutationFn: async (args: { memberId: string[], projectId: string }) => {
      const { memberId, projectId } = args;
        const response = await api.post('/team-members/add-to-project', {
          projectId: projectId,
          teamMemberIds: memberId
        })
        return response.data

    },
    onSuccess: (data) => {
      console.log('saved member to the project successful', data)
    },
    onError: (error: Error) => {
      console.error('saving member to the project failed:', error.message)
    },
  })

  return mutation
}







export function useAddProject() {
  const mutation = useMutation({
    mutationFn: async (data: Project) => {
      const response = await api.post('/projects', data);
        return response.data

    },
    onSuccess: (data) => {
      console.log('saved member successful', data)
    },
    onError: (error: Error) => {
      console.error('saved member failed:', error.message)
    },
  })

  return mutation
}

export function useEditProject() {
  const mutation = useMutation({
    mutationFn: async (data: Project) => {
      const response = await api.patch('/projects', data);
        return response.data

    },
    onSuccess: (data) => {
      console.log('saved member successful', data)
    },
    onError: (error: Error) => {
      console.error('saved member failed:', error.message)
    },
  })

  return mutation
}





