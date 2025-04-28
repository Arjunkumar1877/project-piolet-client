'use client'

import { useAuthStore } from '@/src/store/useAuthStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateProfile } from '@/src/api/mutations'
import { FaEdit } from 'react-icons/fa'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const updateProfile = useUpdateProfile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync(data)
    setIsEditModalOpen(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Profile Details</h1>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0f717b] hover:bg-[#0f8a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f717b]"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-400">Name</h2>
              <p className="mt-1 text-lg text-white">{user.name}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-400">Email</h2>
              <p className="mt-1 text-lg text-white">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md bg-[#2a2a2a] border border-[#3a3a3a] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f717b] focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md bg-[#2a2a2a] border border-[#3a3a3a] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0f717b] focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f717b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0f717b] hover:bg-[#0f8a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f717b] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 