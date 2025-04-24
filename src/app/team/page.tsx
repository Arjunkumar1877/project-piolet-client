'use client'

import { useState } from 'react'

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'CEO & Founder',
    bio: 'Visionary leader with 10+ years of experience in software development and team management.'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'CTO',
    bio: 'Technical expert specializing in cloud infrastructure and scalable systems architecture.'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Lead Developer',
    bio: 'Full-stack developer with expertise in modern web technologies and agile methodologies.'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    role: 'Product Manager',
    bio: 'Product strategist focused on user experience and market-driven feature development.'
  }
]

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 mb-12">
            Meet the talented individuals behind our success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-indigo-600 mb-3">{member.role}</p>
              <p className="text-gray-600 line-clamp-2">{member.bio}</p>
            </div>
          ))}
        </div>

        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMember.name}
                </h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-indigo-600 mb-4">{selectedMember.role}</p>
              <p className="text-gray-600">{selectedMember.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 