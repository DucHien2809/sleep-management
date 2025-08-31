'use client'

import { useState } from 'react'
import { LogOut, Moon, User } from 'lucide-react'
import SleepForm from './SleepForm'
import SleepStats from './SleepStats'
import AIRecommendation from './AIRecommendation'

interface DashboardProps {
  userId: string
  onLogout: () => void
}

export default function Dashboard({ userId, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const handleSleepRecorded = () => {
    // Refresh data when new sleep record is added
    window.location.reload()
  }

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: Moon },
    { id: 'add', name: 'Ghi nhận', icon: User },
    { id: 'ai', name: 'Gợi ý AI', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                <Moon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Sleep Tracker</h1>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="inline h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Chào mừng bạn!</h2>
              <p className="text-blue-100">
                Theo dõi giấc ngủ của bạn và nhận gợi ý thông minh từ AI để cải thiện chất lượng giấc ngủ.
              </p>
            </div>
            
            <SleepStats userId={userId} />
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <SleepForm userId={userId} onSleepRecorded={handleSleepRecorded} />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <AIRecommendation userId={userId} />
          </div>
        )}
      </main>
    </div>
  )
}
