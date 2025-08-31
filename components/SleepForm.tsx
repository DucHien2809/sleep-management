'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Moon, Sun, Star, Plus } from 'lucide-react'

interface SleepFormProps {
  userId: string
  onSleepRecorded: () => void
}

export default function SleepForm({ userId, onSleepRecorded }: SleepFormProps) {
  // Tạo thời gian mặc định: giờ đi ngủ là hiện tại, giờ thức dậy là +8 tiếng
  const getDefaultTimes = () => {
    const now = new Date()
    const sleepTime = new Date(now)
    const wakeTime = new Date(now.getTime() + 8 * 60 * 60 * 1000) // +8 tiếng
    
    // Format thành datetime-local string (YYYY-MM-DDTHH:MM)
    const formatDateTime = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    
    return {
      sleepTime: formatDateTime(sleepTime),
      wakeTime: formatDateTime(wakeTime)
    }
  }
  
  const defaultTimes = getDefaultTimes()
  const [sleepTime, setSleepTime] = useState(defaultTimes.sleepTime)
  const [wakeTime, setWakeTime] = useState(defaultTimes.wakeTime)
  const [sleepQuality, setSleepQuality] = useState(5)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sleepTime || !wakeTime) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('sleep_records')
        .insert([
          {
            user_id: userId,
            sleep_time: sleepTime,
            wake_time: wakeTime,
            sleep_quality: sleepQuality,
            notes: notes || null,
          }
        ])

      if (error) {
        console.error('Error recording sleep:', error)
        return
      }

             // Reset form với thời gian mặc định mới
       const newDefaultTimes = getDefaultTimes()
       setSleepTime(newDefaultTimes.sleepTime)
       setWakeTime(newDefaultTimes.wakeTime)
       setSleepQuality(5)
       setNotes('')
      
      onSleepRecorded()
    } catch (error) {
      console.error('Error recording sleep:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
          <Plus className="h-5 w-5 text-black" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Ghi nhận giấc ngủ</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Moon className="inline h-4 w-4 mr-1" />
              Giờ đi ngủ
            </label>
                         <input
               type="datetime-local"
               value={sleepTime}
               onChange={(e) => setSleepTime(e.target.value)}
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder-black"
             />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Sun className="inline h-4 w-4 mr-1" />
              Giờ thức dậy
            </label>
                         <input
               type="datetime-local"
               value={wakeTime}
               onChange={(e) => setWakeTime(e.target.value)}
               required
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder-black"
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Star className="inline h-4 w-4 mr-1" />
            Chất lượng giấc ngủ (1-10)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="10"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-900 w-8 text-center">
              {sleepQuality}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Rất tệ</span>
            <span>Rất tốt</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ghi chú về giấc ngủ của bạn..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !sleepTime || !wakeTime}
          className="w-full bg-primary-600 text-black py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Đang ghi nhận...' : 'Ghi nhận giấc ngủ'}
        </button>
      </form>
    </div>
  )
}
