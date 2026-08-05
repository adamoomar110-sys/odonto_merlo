import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qcwffihmpboxybvzupnl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd2ZmaWhtcGJveHlidnp1cG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4OTc5MzIsImV4cCI6MjEwMTQ3MzkzMn0.Hsxlewmyaoec1xuNrLk7IibrZbJsJY4XcxcYjnpc_Xg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
