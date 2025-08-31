import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          created_at?: string
        }
      }
      sleep_records: {
        Row: {
          id: string
          user_id: string
          sleep_time: string
          wake_time: string
          sleep_quality: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sleep_time: string
          wake_time: string
          sleep_quality: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sleep_time?: string
          wake_time?: string
          sleep_quality?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
