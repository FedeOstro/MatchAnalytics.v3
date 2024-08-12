import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = 'https://zsunezpjswzydjhmfrfd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdW5lenBqc3d6eWRqaG1mcmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDU1MzAsImV4cCI6MjAzNjAyMTUzMH0.wFMiG1RRHceZdKlJoDRayKKL7sJ749O0NP2JRs19S4Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);     