// @ts-ignore // Forhindre feil om manglande typer for CDN-import
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm';
const supabaseUrl = 'https://mvrsfhgplwzmznjhirdy.supabase.co';
//const supabaseKey = process.env.SUPABASE_KEY
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cnNmaGdwbHd6bXpuamhpcmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAyMjIsImV4cCI6MjA3NjY0NjIyMn0.kbxPhvEBx_689_NRPWeZZ4z76bwTQm7pJwHV_4Udqgk';
export const supabase = createClient(supabaseUrl, supabaseKey);
