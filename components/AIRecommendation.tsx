'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getSleepRecommendation } from '@/lib/gemini'
import { Brain, Sparkles, Loader2 } from 'lucide-react'

interface SleepRecord {
  id: string
  sleep_time: string
  wake_time: string
  sleep_quality: number
  notes: string | null
  created_at: string
}

interface AIRecommendationProps {
  userId: string
}

export default function AIRecommendation({ userId }: AIRecommendationProps) {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([])
  const [recommendation, setRecommendation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecentSleepRecords()
  }, [userId])

  const fetchRecentSleepRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      if (error) {
        console.error('Error fetching sleep records:', error)
        return
      }

      setSleepRecords(data || [])
    } catch (error) {
      console.error('Error fetching sleep records:', error)
    }
  }

  const generateRecommendation = async () => {
    if (sleepRecords.length === 0) {
      setError('Bạn cần có ít nhất 1 bản ghi giấc ngủ để nhận gợi ý')
      return
    }

    setLoading(true)
    setError('')

    try {
      const aiRecommendation = await getSleepRecommendation(sleepRecords)
      setRecommendation(aiRecommendation)
    } catch (error) {
      setError('Không thể tạo gợi ý vào lúc này. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const formatSleepData = (records: SleepRecord[]) => {
    return records.map(record => ({
      ngày: new Date(record.created_at).toLocaleDateString('vi-VN'),
      giờ_ngủ: new Date(record.sleep_time).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      giờ_thức: new Date(record.wake_time).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      thời_gian_ngủ: `${Math.floor((new Date(record.wake_time).getTime() - new Date(record.sleep_time).getTime()) / (1000 * 60 * 60))}h`,
      chất_lượng: record.sleep_quality,
      ghi_chú: record.notes || 'Không có'
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Gợi ý từ AI</h3>
      </div>

      {sleepRecords.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Bạn cần ghi nhận ít nhất 1 giấc ngủ để nhận gợi ý từ AI
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Dữ liệu giấc ngủ 7 ngày gần nhất:
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {formatSleepData(sleepRecords).map((data, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">{data.ngày}</p>
                    <p className="text-gray-600 text-xs">
                      {data.giờ_ngủ} - {data.giờ_thức}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {data.thời_gian_ngủ} | Chất lượng: {data.chất_lượng}/10
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateRecommendation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Đang tạo gợi ý...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Nhận gợi ý từ AI
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {recommendation && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h4 className="text-md font-medium text-blue-900 mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Gợi ý từ AI
              </h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-blue-800 leading-relaxed whitespace-pre-line">
                  {recommendation}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
