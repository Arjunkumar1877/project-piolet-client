'use client'

import { FaProjectDiagram, FaTasks, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa'

export default function DashboardPage() {
  // Static data for now
  const stats = [
    {
      title: 'Total Projects',
      value: 12,
      icon: FaProjectDiagram,
      color: 'bg-[#0f717b]',
      textColor: 'text-[#0f717b]',
      increase: '+2 from last month'
    },
    {
      title: 'Total Tasks',
      value: 48,
      icon: FaTasks,
      color: 'bg-[#2c7a7b]',
      textColor: 'text-[#2c7a7b]',
      increase: '+5 from last week'
    },
    {
      title: 'Completed Tasks',
      value: 28,
      icon: FaCheckCircle,
      color: 'bg-[#38a169]',
      textColor: 'text-[#38a169]',
      increase: '+12 this month'
    },
    {
      title: 'Pending Tasks',
      value: 8,
      icon: FaClock,
      color: 'bg-[#d69e2e]',
      textColor: 'text-[#d69e2e]',
      increase: '-3 from last week'
    },
    {
      title: 'In Progress',
      value: 12,
      icon: FaSpinner,
      color: 'bg-[#3182ce]',
      textColor: 'text-[#3182ce]',
      increase: '+2 this week'
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-[#121212] border-b border-[#1a1a1a]">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here is your project overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#121212] rounded-lg p-6 border border-[#1a1a1a] shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#0f717b] group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-400 ml-3 text-sm font-medium">
                      {stat.title}
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-bold text-white group-hover:text-[#0f717b] transition-colors">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {stat.increase}
                    </p>
                  </div>
                </div>
                <div className={`${stat.textColor} opacity-20 group-hover:opacity-100 transition-opacity`}>
                  <stat.icon className="w-16 h-16" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color} transition-all duration-500 ease-in-out`}
                    style={{ width: `${(stat.value / (stat.title === 'Total Projects' ? 20 : 60)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-[#121212] rounded-lg p-6 border border-[#1a1a1a]">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center p-4 bg-[#1a1a1a] rounded-lg">
                <div className="h-10 w-10 rounded-full bg-[#0f717b] flex items-center justify-center">
                  <FaTasks className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-white font-medium">New task added to Project Alpha</p>
                  <p className="text-gray-400 text-sm">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 