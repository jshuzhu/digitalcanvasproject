// supabase-client.js
const supabaseUrl = 'https://sbwuivanwcllgzhwupcq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNid3VpdmFud2NsbGd6aHd1cGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjQxMjMsImV4cCI6MjA5NTIwMDEyM30.SPy9R7K4S30uD6L8GdEeBBM7pzela-bDhYpYF8XqcSw'; 

// Guna window supaya dia tak bertembung dengan skrip lain
window.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);