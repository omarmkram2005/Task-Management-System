import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yasnqudtvsaejfujnvcs.supabase.co/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhc25xdWR0dnNhZWpmdWpudmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2Njg4MjMsImV4cCI6MjA2OTI0NDgyM30.Eqf3PlyTktBgviBFNRI_Fe1wpE66HQY7oLZ_NmUTgp4'

export const supabase = createClient(supabaseUrl, supabaseKey)
