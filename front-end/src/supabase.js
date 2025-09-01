import { createClient } from "@supabase/supabase-js";

// VITE_SUPABASE_URL='https://yznwpuvtvgxbdquakfel.supabase.co'
// VITE_SUPABASE_ANON_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bndwdXZ0dmd4YmRxdWFrZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2ODg3MTgsImV4cCI6MjA2OTI2NDcxOH0.eyA44rIM4eUTWy4VI8zRhY2JhkxaBbEBvh8XfeRg8WA'

// 2. عدل supabase.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
