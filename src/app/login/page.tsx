'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/src/store/useAuthStore'
import toast from 'react-hot-toast'
import { useLogin } from '@/src/api/mutations'
import { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useLogin()

  const onSubmit = async (data: LoginFormData) => {
    const res = await loginMutation.mutateAsync(data);

     if(!res.user){
      return toast.error(res.message)
     }
     setUser(res.user)
        setAccessToken(res.accessToken)
    toast.success(res.message)
        // router.push('/dashboard')
  }

  const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#121212] rounded-lg shadow-lg border border-[#0f717b] shadow-[0_0_15px_rgba(15,113,123,0.3)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f717b] via-[#0f8a96] to-[#0f717b]"></div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-md text-sm">
              {errors.root.message}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-[#1a1a1a]'
                } bg-[#1a1a1a] text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-[#0f717b] focus:border-[#0f717b] focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className='relative'>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-[#1a1a1a]'
                } bg-[#1a1a1a] text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-[#0f717b] focus:border-[#0f717b] focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {
                showPassword ? (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleShowPassword(e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaRegEye className="w-4 h-4 text-[#0f717b]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleShowPassword(e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaRegEyeSlash className="w-4 h-4 text-[#0f717b]" />
                  </button>
                )
              }
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0f717b] hover:bg-[#0f8a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f717b] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_10px_rgba(15,113,123,0.3)]"
            >
              {isSubmitting || loginMutation.isPending
                ? 'Signing in...'
                : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/signup"
              className="font-medium text-[#0f8a96] hover:text-[#0f717b] transition-colors duration-300"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 


