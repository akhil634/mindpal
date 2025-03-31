// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your own Supabase URL and API key
const SUPABASE_URL ='https://cplbditcinkmxjzctaux.supabase.co';
const VITE_GEMINI_API_KEY='AIzaSyD46-_beH2FES7vp0zrmixI-swdFr5ptO8';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbGJkaXRjaW5rbXhqemN0YXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjYwNjAsImV4cCI6MjA1ODkwMjA2MH0.RBFL6TlsWkaKgsnJ8KmP0816ByK5O5CKCPbcInuggPs';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
