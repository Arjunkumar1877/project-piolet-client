'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/src/store/useAuthStore'
import { FaProjectDiagram, FaTasks } from 'react-icons/fa'
import { RiDashboardLine } from 'react-icons/ri'
import { BiLogOut } from 'react-icons/bi'

export default function Navbar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.logout)

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    clearAuth()
  }

  return (
    <nav className="bg-[#121212] border-b border-[#1a1a1a] fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and primary navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0f717b] to-[#0f8a96] flex items-center justify-center">
                  <FaTasks className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">Piolet</span>
              </Link>
            </div>

            {/* Primary Navigation - Only show when logged in */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive('/dashboard')
                      ? 'bg-[#0f717b] text-white'
                      : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <RiDashboardLine className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/projects"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive('/projects')
                      ? 'bg-[#0f717b] text-white'
                      : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <FaProjectDiagram className="w-4 h-4" />
                  <span>Projects</span>
                </Link>
              </div>
            )}
          </div>

          {/* Right side - Auth navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-gray-300 flex items-center">
                  <span className="h-8 w-8 rounded-full bg-[#0f717b] flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="ml-2">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <BiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/login')
                      ? 'bg-[#0f717b] text-white'
                      : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/signup')
                      ? 'bg-[#0f717b] text-white'
                      : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 