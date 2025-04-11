import { useQuery } from '@tanstack/react-query'
import api from './axios'

export function useGetMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const response = await api.get('/projects/team-members')
      return response.data
    }
  })
}
