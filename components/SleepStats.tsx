'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format, differenceInHours, differenceInMinutes } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Moon, Clock, TrendingUp, Calendar } from 'lucide-react'

interface SleepRecord {
  id: string
  sleep_time: string
  wake_time: string
  sleep_quality: number
  notes: string | null
  created_at: string
}

interface SleepStatsProps {
  userId: string
}

export default function SleepStats({ userId }: SleepStatsProps) {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSleepRecords()
  }, [userId])

  const fetchSleepRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) {
        console.error('Error fetching sleep records:', error)
        return
      }

      setSleepRecords(data || [])
    } catch (error) {
      console.error('Error fetching sleep records:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSleepDuration = (sleepTime: string, wakeTime: string) => {
    const sleep = new Date(sleepTime)
    const wake = new Date(wakeTime)
    const hours = differenceInHours(wake, sleep)
    const minutes = differenceInMinutes(wake, sleep) % 60
    return { hours, minutes }
  }

  const getAverageSleepDuration = () => {
    if (sleepRecords.length === 0) return { hours: 0, minutes: 0 }
    
    const totalMinutes = sleepRecords.reduce((total, record) => {
      const duration = calculateSleepDuration(record.sleep_time, record.wake_time)
      return total + duration.hours * 60 + duration.minutes
    }, 0)
    
    const averageMinutes = totalMinutes / sleepRecords.length
    return {
      hours: Math.floor(averageMinutes / 60),
      minutes: Math.round(averageMinutes % 60)
    }
  }

  const getAverageSleepQuality = () => {
    if (sleepRecords.length === 0) return 0
    const total = sleepRecords.reduce((sum, record) => sum + record.sleep_quality, 0)
    return Math.round(total / sleepRecords.length * 10) / 10
  }

  const getChartData = () => {
    return sleepRecords.slice(0, 7).reverse().map(record => {
      const duration = calculateSleepDuration(record.sleep_time, record.wake_time)
      return {
        date: format(new Date(record.created_at), 'dd/MM', { locale: vi }),
        duration: duration.hours + duration.minutes / 60,
        quality: record.sleep_quality
      }
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  const averageDuration = getAverageSleepDuration()
  const averageQuality = getAverageSleepQuality()
  const chartData = getChartData()

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống kê giấc ngủ</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Thời gian ngủ TB</p>
              <p className="text-xl font-bold text-blue-900">
                {averageDuration.hours}h {averageDuration.minutes}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Chất lượng TB</p>
              <p className="text-xl font-bold text-green-900">{averageQuality}/10</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Tổng số bản ghi</p>
              <p className="text-xl font-bold text-purple-900">{sleepRecords.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-4">Biểu đồ 7 ngày gần nhất</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'duration' ? `${typeof value === 'number' ? value.toFixed(1) : value}h` : value,
                  name === 'duration' ? 'Thời gian ngủ' : 'Chất lượng'
                ]}
              />
              <Bar dataKey="duration" fill="#3b82f6" name="duration" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Records */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-4">Bản ghi gần đây</h4>
        <div className="space-y-3">
          {sleepRecords.slice(0, 5).map((record) => {
            const duration = calculateSleepDuration(record.sleep_time, record.wake_time)
            return (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(record.sleep_time), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(record.sleep_time), 'HH:mm', { locale: vi })} - {format(new Date(record.wake_time), 'HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {duration.hours}h {duration.minutes}m
                  </p>
                  <p className="text-xs text-gray-500">
                    Chất lượng: {record.sleep_quality}/10
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
