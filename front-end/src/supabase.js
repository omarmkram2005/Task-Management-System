import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yznwpuvtvgxbdquakfel.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bndwdXZ0dmd4YmRxdWFrZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2ODg3MTgsImV4cCI6MjA2OTI2NDcxOH0.eyA44rIM4eUTWy4VI8zRhY2JhkxaBbEBvh8XfeRg8WA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
