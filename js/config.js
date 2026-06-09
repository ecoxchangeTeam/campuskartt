// ============================================================
// Campus Kartt — Configuration File
// ============================================================
// STEP 1: Go to your Supabase project
// STEP 2: Click "Project Settings" (gear icon, bottom left)
// STEP 3: Click "API" in the sidebar
// STEP 4: Copy "Project URL" → paste below as SUPABASE_URL
// STEP 5: Copy "anon public" key → paste below as SUPABASE_ANON_KEY
// ============================================================

// NOTE: Since this is a static frontend website, the browser runs this file directly
// and does not read from your .env file. You must copy/paste new values here.
const SUPABASE_URL = 'https://sgehqcxbjrlwviphbtwv.supabase.co';

// WARNING: You have currently pasted a `service_role` key in your .env.
// The service_role key bypasses RLS (Row Level Security) and MUST NEVER be exposed in the browser!
// Please replace this key with the "anon public" key from your Supabase Dashboard -> Settings -> API.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZWhxY3hianJsd3ZpcGhidHd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk3OTQwOCwiZXhwIjoyMDk2NTU1NDA4fQ.Dc2k80FevRgsDHFfLaG6if3pZb_fKdf2shHGzafFIME';

// ============================================================
// CLOUDINARY — For photo uploads
// ============================================================
const CLOUDINARY_CLOUD_NAME = 'deevt6lle';
const CLOUDINARY_UPLOAD_PRESET = 'ecoxchange_unsigned';

// ============================================================
// RAZORPAY — Payment gateway
// To go live: replace with rzp_live_... key from Razorpay dashboard
// ============================================================
const RAZORPAY_KEY_ID = 'rzp_test_SZ2YHJzqSoFRb0';

// ============================================================
// Initialize Supabase client
// ============================================================
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── EcoXchange SSO: Auto-login if tokens passed in URL hash ────────────
window.ecoSessionRestored = (async () => {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.slice(1);
  if (!hash) return false;

  const params = new URLSearchParams(hash);
  const accessToken  = params.get('eco_access_token');
  const refreshToken = params.get('eco_refresh_token');
  if (!accessToken || !refreshToken) return false;

  try {
    const { data, error } = await supabaseClient.auth.setSession({
      access_token:  decodeURIComponent(accessToken),
      refresh_token: decodeURIComponent(refreshToken),
    });
    if (error || !data?.session) return false;

    // Clean up hash from URL immediately so tokens aren't in browser history
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  } catch (err) {
    console.error('EcoXchange SSO session restoration error:', err);
    return false;
  }
})();

// ============================================================
// App Constants
// ============================================================
const COMMISSION_PCT = 10; // 10% commission

const ITEM_CATEGORIES = [
  { id: 'textbooks', label: 'Textbooks & Notes', icon: '📚', range: '₹500–₹1.2K' },
  { id: 'drafter', label: 'Drafter Kits', icon: '📐', range: '₹1.5K–₹4.5K' },
  { id: 'bicycle', label: 'Bicycles', icon: '🚲', range: '₹5K–₹12K' },
  { id: 'chair', label: 'Study Chairs', icon: '🪑', range: '₹8K–₹18K' },
  { id: 'lamp', label: 'Desk Lamps', icon: '💡', range: '₹600–₹2.5K' },
  { id: 'calculator', label: 'Calculators', icon: '🧮', range: '₹800–₹3K' },
  { id: 'drawer', label: 'Drawer Units', icon: '🗄️', range: '₹800–₹2K' },
  { id: 'electronics', label: 'Electronics', icon: '⚡', range: '₹1K–₹15K' },
  { id: 'sports', label: 'Sports Gear', icon: '🏏', range: '₹500–₹4K' },
];

const CONDITION_LABELS = {
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  old: 'Well Used',
};

// Helper: format price in Indian format
function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Helper: get current user
async function getCurrentUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

// Helper: redirect if not logged in
async function requireAuth() {
  if (window.ecoSessionRestored) {
    await window.ecoSessionRestored;
  }
  const user = await getCurrentUser();
  if (!user) {
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
    window.location.href = `login.html?redirect_to=${returnUrl}`;
    return null;
  }
  return user;
}

// Helper: get user profile from public.users table
async function getUserProfile(userId) {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}
