import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fdpntatmogkcvevafbbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcG50YXRtb2drY3ZldmFmYmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDUyMzMsImV4cCI6MjA5MDA4MTIzM30.JKe8g774pSETprJaePKh9dzzVRX0EFKerBtoRbKnyAQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  console.log("Checking contact_submissions...");
  const { data, error } = await supabase.from('contact_submissions').select('id, name, is_offer_eligible');
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Submissions:");
    console.table(data);
  }
}

check();
