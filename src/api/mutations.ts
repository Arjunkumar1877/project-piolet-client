'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'
import { Project } from '../types/project'
import { CreateTaskDto } from '../types/tasks'

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
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (data: Project) => {
      const response = await api.post('/projects', data);
        return response.data

    },
    onSuccess: (data) => {
      console.log('saved member successful', data)
      qc.invalidateQueries({ queryKey: ['team-project'] })
    },
    onError: (error: Error) => {
      console.error('saved member failed:', error.message)
    },
  })

  return mutation
}



export function useEditProject() {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (data: Project) => {
      const response = await api.patch(`/projects/${data._id}`, data);
        return response.data

    },
    onSuccess: (data) => {
      console.log('saved member successful', data)
      qc.invalidateQueries({ queryKey: ['team-project'] })

    },
    onError: (error: Error) => {
      console.error('saved member failed:', error.message)
    },
  })

  return mutation
}




export function useCreateTask() {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (data: CreateTaskDto) => {
      const response = await api.post('/task', data);
        return response.data
    },
    onSuccess: (data) => {
      console.log('saved task successful', data)
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error: Error) => {
      console.error('saved task failed:', error.message)
    },
  })

  return mutation
}




export function useEditTask() {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (args: {data: CreateTaskDto, id: string}) => {
      const { data, id } = args;
      const response = await api.put(`/task/${id}`, data);
        return response.data
    },
    onSuccess: (data) => {
      console.log('saved task successful', data)
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error: Error) => {
      console.error('saved task failed:', error.message)
    },
  })

  return mutation

}



export function useDeleteTask() {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (args: {id: string}) => {
      const { id } = args;
      const response = await api.delete(`/task/${id}`);
        return response.data
    },
    onSuccess: (data) => {
      console.log('deleted task successful', data)
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error: Error) => {
      console.error('deleted task failed:', error.message)
    },
  })

  return mutation

}




