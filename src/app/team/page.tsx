'use client'

import { useGetMembers } from '@/src/api/query'
import { useAuthStore } from '@/src/store/useAuthStore'
import { TeamMember } from '@/src/types/project'
import { useState } from 'react'






export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const user = useAuthStore((state)=> state.user)
  const { data: teamMembers , isLoading } = useGetMembers({ userId: user?._id || '' });

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
          { isLoading ? (
                   <div className="flex items-center justify-center min-h-[400px]">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f717b]"></div>
                 </div>
          ) : 
          
          
          teamMembers?.map((member) => (
            <div
              key={member._id}
              className="bg-[#121212] rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-[#1a1a1a] hover:border-[#0f717b]/50 group"
              onClick={() => setSelectedMember(member)}
            >
              <h3 className="text-xl font-semibold text-white group-hover:text-[#0f8a96] transition-colors mb-2">
                {member.name}
              </h3>
              <p className="text-[#0f717b] mb-3">{member.role}</p>
              <p className="text-gray-400 line-clamp-2">{member.email}</p>
            </div>
          ))}
        </div>

        {selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#121212] rounded-lg max-w-2xl w-full p-6 border border-[#1a1a1a] shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {selectedMember.name}
                </h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-[#0f8a96] transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-[#0f717b] mb-4">{selectedMember.role}</p>
              <p className="text-gray-400">{selectedMember.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 