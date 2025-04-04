import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'

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