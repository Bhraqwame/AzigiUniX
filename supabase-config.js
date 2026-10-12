// Supabase Configuration
const SUPABASE_URL = 'https://hwpfdyhfiytoostlnjyx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3cGZkeWhmaXl0b29zdGxuanl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NzEzMTksImV4cCI6MjEwNzI0NzMxOX0.mdgS_b2sktZ7jVQA7cBnGaZj910-tKnnGrNbLn5OgCI';

// Safely initialize Supabase client
function initSupabase() {
    if (typeof window.supabase !== 'undefined' && !window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.SUPABASE_URL = SUPABASE_URL;
        window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
        console.log('✅ Supabase initialized successfully!');
    } else if (!window.supabaseClient) {
        console.warn('⚠️ Supabase CDN script not loaded yet or blocked by browser file:// restrictions.');
    }
}

initSupabase();

// Global helper bindings safely wrapped
window.supabaseLogin = async (email, password) => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

window.supabaseSignup = async (email, password) => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { data, error } = await window.supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    return data;
};

window.supabaseLogout = async () => {
    if (!window.supabaseClient) throw new Error('Supabase client not initialized');
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) throw error;
    return true;
};

if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
            };
            localStorage.setItem('azigiCurrentUser', JSON.stringify(user));
            window.dispatchEvent(new CustomEvent('supabase:authenticated', { detail: user }));
        } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('azigiCurrentUser');
            window.dispatchEvent(new CustomEvent('supabase:loggedOut'));
        }
    });
}