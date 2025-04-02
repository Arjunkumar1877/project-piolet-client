'use client'

import Link from 'next/link'
import { FaProjectDiagram, FaTasks, FaRocket } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            <div className="mx-auto w-24 h-24 mb-8">
              <div className="w-full h-full rounded-2xl bg-gradient-to-r from-[#0f717b] to-[#0f8a96] flex items-center justify-center shadow-lg shadow-[#0f717b]/20">
                <FaProjectDiagram className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-white sm:text-7xl">
              Project{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative bg-gradient-to-r from-[#0f717b] to-[#0f8a96] text-transparent bg-clip-text">
                  Piolet
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Streamline your project management with our powerful and intuitive platform.
              Create, track, and deliver projects with ease.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-x-2 rounded-xl bg-[#0f717b] px-8 py-4 text-md font-semibold text-white shadow-lg shadow-[#0f717b]/20 outline-none ring-1 ring-[#0f717b]/50 transition hover:bg-[#0f8a96] hover:shadow-[#0f8a96]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f717b] sm:text-lg"
              >
                <FaRocket className="h-5 w-5 text-white" />
                <span>Create Your Project</span>
                <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-br from-[#0f717b] to-[#0f8a96] opacity-0 transition group-hover:opacity-30" />
              </Link>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: FaProjectDiagram,
                  title: 'Project Planning',
                  description: 'Plan and organize your projects with our intuitive tools',
                },
                {
                  icon: FaTasks,
                  title: 'Task Management',
                  description: 'Track and manage tasks efficiently with real-time updates',
                },
                {
                  icon: FaRocket,
                  title: 'Fast Delivery',
                  description: 'Accelerate your project delivery with streamlined workflows',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl bg-[#121212] p-8 shadow-xl ring-1 ring-[#1a1a1a]/10 transition-all duration-300 hover:shadow-[#0f717b]/20 hover:ring-[#0f717b]/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0f717b] to-[#0f8a96]">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-xl font-medium text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
