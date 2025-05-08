'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/src/store/useAuthStore'
import toast from 'react-hot-toast'
import { useSignup } from '@/src/api/mutations'
import { useEffect, useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import React from 'react'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const router = useRouter()
  const user = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [router, user])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const signupMutation = useSignup()

  const onSubmit = async (data: SignupFormData) => {
    const res = await signupMutation.mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!res.user) {
      setError('root', { message: res.message })
      return toast.error(res.message)
    }
    toast.success(res.message)
    router.push('/login')
  }

  const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  const handleShowConfirmPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#121212] rounded-lg  border border-[#0f717b] shadow-[0_0_15px_rgba(15,113,123,0.3)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0f717b] via-[#0f8a96] to-[#0f717b]"></div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-md text-sm">
              {errors.root.message}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-0">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#0f717b] bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-[#0f717b] focus:border-[#0f8a96] focus:z-10 sm:text-sm rounded-t-md"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#0f717b] bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-[#0f717b] focus:border-[#0f8a96] focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#0f717b] bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-[#0f717b] focus:border-[#0f8a96] focus:z-10 sm:text-sm"
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
            <div className='relative'>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#0f717b] bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-[#0f717b] focus:border-[#0f8a96] focus:z-10 sm:text-sm rounded-b-md"
                placeholder="Confirm Password"
              />
              {
                showConfirmPassword ? (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleShowConfirmPassword(e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaRegEye className="w-4 h-4 text-[#0f717b]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleShowConfirmPassword(e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaRegEyeSlash className="w-4 h-4 text-[#0f717b]" />
                  </button>
                )
              }
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || signupMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0f717b] hover:bg-[#0f8a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f717b] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_10px_rgba(15,113,123,0.3)]"
            >
              {isSubmitting || signupMutation.isPending
                ? 'Creating account...'
                : 'Sign up'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/login"
              className="font-medium text-[#0f8a96] hover:text-[#0f717b] transition-colors duration-300"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 