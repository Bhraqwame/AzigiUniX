document.addEventListener('DOMContentLoaded', async () => {

    // ==========================================================
    // 1. DATA MODEL
    // ==========================================================
    const SAMPLE = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    const LEGACY_SAMPLE_PREFIX = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
    const seedThumb = (s) => `https://picsum.photos/seed/${s}/320/180`;

    const fallbackVideos = Array.isArray(window.VIDEOS) && window.VIDEOS.length
        ? window.VIDEOS
        : [
            { id: 'v1', title: 'Global University Campus Tour & Student Life Overview', channel: 'EduNetwork', viewsText: '50K views', ageText: '2 days ago', daysAgo: 2, durationSec: 765, category: 'universities', tags: ['newest', 'campus'], likes: 1204, dislikes: 31, thumb: 'https://picsum.photos/seed/azigi1/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', comments: [{ author: 'CampusKid', time: '1 day ago', text: 'The new library wing looks amazing!' }] },
            { id: 'v2', title: 'Late Night Adult Panel Discussion: Politics & Philosophy (18+)', channel: 'NightTalkers', viewsText: '120K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['trending', 'panel'], likes: 8811, dislikes: 204, thumb: 'https://picsum.photos/seed/azigi2/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', comments: [{ author: 'NightOwl', time: '2 hours ago', text: 'Great points tonight.' }] },
            { id: 'v3', title: 'Introduction to Data Science & Analytics Lecture Series', channel: 'UniLectures', viewsText: '15K views', ageText: '5 hours ago', daysAgo: 0, durationSec: 2720, category: 'universities', tags: ['trending', 'lecture'], likes: 934, dislikes: 12, thumb: 'https://picsum.photos/seed/azigi3/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', comments: [] },
            { id: 'v4', title: 'Virtual Reality Gaming Lounge Live Session (18+)', channel: 'PixelStreams', viewsText: '31K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['trending', 'gaming'], likes: 4102, dislikes: 87, thumb: 'https://picsum.photos/seed/azigi4/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', comments: [] },
            { id: 'v5', title: 'Final Exam Study Tips: 8 Focus Techniques That Work', channel: 'StudySmart', viewsText: '203K views', ageText: '1 week ago', daysAgo: 7, durationSec: 245, category: 'universities', tags: ['newest', 'study'], likes: 5610, dislikes: 74, thumb: 'https://picsum.photos/seed/azigi5/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', comments: [{ author: 'GradStudent', time: '3 days ago', text: 'Technique 6 changed my semester.' }] },
            { id: 'v6', title: 'After-Hours Comedy Open Mic Night (18+)', channel: 'LaughTrack', viewsText: '12K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['comedy'], likes: 2210, dislikes: 40, thumb: 'https://picsum.photos/seed/azigi6/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', comments: [] },
            { id: 'v7', title: 'Online Degrees Q&A: Admissions, Costs & Financial Aid', channel: 'EduNetwork', viewsText: '61K views', ageText: '3 weeks ago', daysAgo: 21, durationSec: 1020, category: 'universities', tags: ['degrees', 'talk'], likes: 1543, dislikes: 22, thumb: 'https://picsum.photos/seed/azigi7/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', comments: [] },
            { id: 'v8', title: 'Midnight Music Jam Session - Acoustic Covers (18+)', channel: 'NightOwlSessions', viewsText: '18K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['music'], likes: 3311, dislikes: 55, thumb: 'https://picsum.photos/seed/azigi8/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', comments: [] },
            { id: 'v9', title: 'Research Symposium: Climate Science Keynote', channel: 'UniLectures', viewsText: '7.2K views', ageText: '1 month ago', daysAgo: 30, durationSec: 5460, category: 'universities', tags: ['research', 'lecture'], likes: 640, dislikes: 18, thumb: 'https://picsum.photos/seed/azigi9/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', comments: [] },
            { id: 'v10', title: 'Neon Dance Party Live Stream (18+)', channel: 'ClubPulse', viewsText: '77K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['trending', 'dance'], likes: 6654, dislikes: 130, thumb: 'https://picsum.photos/seed/azigi10/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', comments: [] },
            { id: 'v11', title: 'Campus Library Resources & Research Database Walkthrough', channel: 'StudySmart', viewsText: '9.8K views', ageText: '4 days ago', daysAgo: 4, durationSec: 270, category: 'universities', tags: ['newest', 'study', 'campus'], likes: 812, dislikes: 9, thumb: 'https://picsum.photos/seed/azigi11/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', comments: [] },
            { id: 'v12', title: 'Uncensored Relationship Q&A Show (18+)', channel: 'HeartToHeart', viewsText: '53K views', ageText: '12 days ago', daysAgo: 12, durationSec: 780, category: 'live-18', tags: ['talk'], likes: 2987, dislikes: 96, thumb: 'https://picsum.photos/seed/azigi12/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', comments: [] },
            { id: 'v13', title: 'Dance Challenge Compilation: Viral TikTok Moves', channel: 'DanceCraze', viewsText: '840K views', ageText: '1 day ago', daysAgo: 1, durationSec: 180, category: 'tiktokers', tags: ['trending', 'dance', 'newest'], likes: 45210, dislikes: 892, thumb: 'https://picsum.photos/seed/azigi13/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', comments: [{ author: 'DanceFan', time: '5 hours ago', text: 'These moves are insane!' }] },
            { id: 'v14', title: 'Quick Recipe Hack: 30 Second Meal Ideas', channel: 'ChefTok', viewsText: '320K views', ageText: '2 days ago', daysAgo: 2, durationSec: 30, category: 'tiktokers', tags: ['food', 'recipe'], likes: 18932, dislikes: 245, thumb: 'https://picsum.photos/seed/azigi14/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', comments: [] },
            { id: 'v15', title: 'Comedy Skit: Awkward First Date Situations', channel: 'FunnyTok', viewsText: '1.2M views', ageText: '3 hours ago', daysAgo: 0, durationSec: 45, category: 'tiktokers', tags: ['trending', 'comedy', 'newest'], likes: 67421, dislikes: 1283, thumb: 'https://picsum.photos/seed/azigi15/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', comments: [{ author: 'LaughOutLoud', time: '1 hour ago', text: 'So relatable!' }] },
            { id: 'v16', title: 'Morning Workout Motivation: 5 Min Routine', channel: 'FitTok', viewsText: '210K views', ageText: '5 days ago', daysAgo: 5, durationSec: 300, category: 'tiktokers', tags: ['fitness', 'workout'], likes: 12543, dislikes: 167, thumb: 'https://picsum.photos/seed/azigi16/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', comments: [] }
        ];

    let VIDEOS = fallbackVideos;
    
    async function loadSupabaseVideos() {
        try {
            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && Array.isArray(data) && data.length > 0) {
                    VIDEOS = data.map(v => ({
                        id: v.id,
                        title: v.title,
                        channel: v.channel,
                        category: v.category,
                        tags: Array.isArray(v.tags) ? v.tags : (v.tags || []),
                        durationSec: v.duration_sec || 0,
                        live: v.live || false,
                        viewsText: v.views_text || '0 views',
                        ageText: v.age_text || 'just now',
                        daysAgo: v.days_ago || 0,
                        likes: v.likes || 0,
                        dislikes: v.dislikes || 0,
                        thumb: v.thumb_url || `https://picsum.photos/seed/${v.id}/320/180`,
                        src: v.video_url || SAMPLE,
                        comments: v.comments || []
                    }));
                    return true;
                }
            }
        } catch (error) {
            console.log('Failed to load videos from database:', error);
        }
        VIDEOS = fallbackVideos;
        return false;
    }
    await loadSupabaseVideos();

    // ==========================================================
    // DB HELPERS FOR USER DATA
    // ==========================================================
    async function loadUserFavorites(userId) {
        try {
            if (!window.supabaseClient || !userId) return readJSON(getUserKey('Favorites'), []);
            const { data, error } = await window.supabaseClient
                .from('favorites')
                .select('video_id')
                .eq('user_id', userId);
            if (error) throw error;
            return (data || []).map(f => f.video_id);
        } catch (e) {
            console.error('Failed to load favorites:', e);
            return readJSON(getUserKey('Favorites'), []);
        }
    }
    
    async function addToFavorites(userId, videoId) {
        try {
            if (!window.supabaseClient || !userId) {
                const favs = readJSON(getUserKey('Favorites'), []);
                if (!favs.includes(videoId)) favs.push(videoId);
                writeJSON(getUserKey('Favorites'), favs);
                return true;
            }
            const { error } = await window.supabaseClient
                .from('favorites')
                .insert([{ user_id: userId, video_id: videoId }]);
            if (error && error.code !== '23505') throw error;
            return true;
        } catch (e) {
            console.error('Failed to add favorite:', e);
            const favs = readJSON(getUserKey('Favorites'), []);
            if (!favs.includes(videoId)) favs.push(videoId);
            writeJSON(getUserKey('Favorites'), favs);
            return false;
        }
    }
    
    async function removeFromFavorites(userId, videoId) {
        try {
            if (!window.supabaseClient || !userId) {
                const favs = readJSON(getUserKey('Favorites'), []).filter(id => id !== videoId);
                writeJSON(getUserKey('Favorites'), favs);
                return true;
            }
            const { error } = await window.supabaseClient
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('video_id', videoId);
            if (error) throw error;
            return true;
        } catch (e) {
            console.error('Failed to remove favorite:', e);
            const favs = readJSON(getUserKey('Favorites'), []).filter(id => id !== videoId);
            writeJSON(getUserKey('Favorites'), favs);
            return false;
        }
    }
    
    let userFavorites = [];
    
    async function loadUserRatings(userId) {
        try {
            if (!window.supabaseClient || !userId) return readJSON(getUserKey('Ratings'), {});
            const { data, error } = await window.supabaseClient
                .from('ratings')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            const result = {};
            (data || []).forEach(r => { result[r.video_id] = { up: 0, down: 0, mine: r.rating }; });
            return result;
        } catch (e) {
            console.error('Failed to load ratings:', e);
            return readJSON(getUserKey('Ratings'), {});
        }
    }
    
    let userRatings = {};
    
    async function loadWatchHistory(userId) {
        try {
            if (!window.supabaseClient || !userId) return readJSON(getUserKey('History'), []);
            const { data, error } = await window.supabaseClient
                .from('watch_history')
                .select('video_id')
                .eq('user_id', userId)
                .order('watched_at', { ascending: false })
                .limit(12);
            if (error) throw error;
            return (data || []).map(h => h.video_id);
        } catch (e) {
            console.error('Failed to load history:', e);
            return readJSON(getUserKey('History'), []);
        }
    }

    // ==========================================================
    // 2. LAYOUT HOOKS & STATE
    // ==========================================================
    const videoGrid = document.getElementById('videoGrid');
    const sectionTitle = document.getElementById('sectionTitle');
    const filterChips = document.querySelectorAll('.chip');
    const sidebarItems = document.querySelectorAll('.nav-item');
    const tagCloud = document.getElementById('tagCloud');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchSuggest = document.getElementById('searchSuggest');
    const sortBtns = document.querySelectorAll('.sort-btn');
    const durationFilter = document.getElementById('durationFilter');
    const emptyState = document.getElementById('emptyState');
    const emptyStateMsg = document.getElementById('emptyStateMsg');
    const historyRow = document.getElementById('historyRow');
    const historyTrack = document.getElementById('historyTrack');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebarNav = document.getElementById('sidebarNav');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const userDropdown = document.getElementById('userDropdown');
    const profilePic = document.getElementById('profilePic');
    const dropdownMenu = document.getElementById('dropdownMenu');

    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const modalVideoMeta = document.getElementById('modalVideoMeta');
    const watchPlayer = document.getElementById('watchPlayer');
    const playerFallback = document.getElementById('playerFallback');
    const watchLive = document.getElementById('watchLive');
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');
    const likeCount = document.getElementById('likeCount');
    const dislikeCount = document.getElementById('dislikeCount');
    const watchViews = document.getElementById('watchViews');
    const commentForm = document.getElementById('commentForm');
    const commentInput = document.getElementById('commentInput');
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    const relatedList = document.getElementById('relatedList');

    const ageGateModal = document.getElementById('ageGateModal');
    const ageGateAcceptBtn = document.getElementById('ageGateAcceptBtn');
    const ageGateRejectBtn = document.getElementById('ageGateRejectBtn');

    let isAdultVerified = localStorage.getItem('adultVerified') === 'true';
    let pendingFilterTarget = null;
    let currentWatchId = null;
    let currentUser = getCurrentUser();

    const state = { filter: 'all', query: '', sort: 'relevance', duration: 'any', favoritesOnly: false };
    const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function getCurrentUser() {
        const stored = localStorage.getItem('azigiCurrentUser');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { return null; }
        }
        return null;
    }

    let userProfile = null;
    
    async function loadUserProfile(userId) {
        if (!window.supabaseClient || !userId) return null;
        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error) {
            if (error.code === 'PGRST205' || error.message?.includes("Could not find the table 'public.profiles'")) {
                throw new Error("The Supabase profiles table is missing. Run setup-sql.sql in the Supabase SQL Editor, wait for the schema cache to refresh, and try again.");
            }
            throw error;
        }
        return data;
    }
    
    async function reloadUserData() {
        if (currentUser) {
            userFavorites = await loadUserFavorites(currentUser.id);
            userRatings = await loadUserRatings(currentUser.id);
            try {
                userProfile = await loadUserProfile(currentUser.id);
            } catch (error) {
                console.error('Failed to load user profile:', error);
                userProfile = null;
            }
        } else {
            userFavorites = [];
            userRatings = {};
            userProfile = null;
        }
    }

    async function setCurrentUser(user) {
        currentUser = user;
        if (user) {
            localStorage.setItem('azigiCurrentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('azigiCurrentUser');
        }
        await reloadUserData();
        updateAuthUI();
        renderGrid();
        renderHistory();
    }

    // ==========================================================
    // 3. STORAGE + UTILITIES
    // ==========================================================
    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, (c) => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function formatDuration(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        const mm = h ? String(m).padStart(2, '0') : String(m);
        return (h ? h + ':' : '') + mm + ':' + String(s).padStart(2, '0');
    }

    function byId(id) {
        return VIDEOS.find((v) => v.id === id);
    }

    function getPlayableSource(src) {
        if (!src || src.startsWith(LEGACY_SAMPLE_PREFIX)) return SAMPLE;
        try {
            const url = new URL(src);
            return /\.mp4$/i.test(url.pathname) ? src : SAMPLE;
        } catch (error) {
            return SAMPLE;
        }
    }

    function isVideoAllowed(video) {
        return video.category !== 'live-18' || isAdultVerified;
    }

    // ==========================================================
    // 4. ANIMATION CORE
    // ==========================================================
    function animateGridItems() {
        const cards = videoGrid.querySelectorAll('.video-card');
        cards.forEach((card, index) => {
            card.getAnimations().forEach((anim) => anim.cancel());
            card.animate([
                { opacity: 0, transform: 'translateY(15px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 350,
                delay: index * 40,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'both'
            });
        });
    }

    // ==========================================================
    // 5. LIGHT / DARK THEME MANAGER
    // ==========================================================
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    const themeText = themeToggleBtn.querySelector('.theme-text');
    function renderTheme() {
        const isLight = document.body.classList.contains('light-mode');
        if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
        if (themeText) themeText.textContent = 'Mode';
    }
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    renderTheme();

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        renderTheme();
    });

    // ==========================================================
    // 6. FILTERING / SORTING PIPELINE & AUTH UI
    // ==========================================================
    function getVisibleVideos() {
        let list = VIDEOS.filter((v) => {
            if (!isVideoAllowed(v)) return false;

            if (state.favoritesOnly) {
                if (!isFavorite(v.id)) return false;
            }

            if (state.query) {
                const haystack = (v.title + ' ' + v.channel + ' ' + v.tags.join(' ')).toLowerCase();
                return haystack.includes(state.query);
            }

            const f = state.filter;
            if (f === 'all') return true;
            if (f === 'trending' || f === 'newest') return v.tags.includes(f);
            if (f.startsWith('tag:')) return v.tags.includes(f.slice(4));
            return v.category === f;
        });

        if (state.duration !== 'any') {
            list = list.filter((v) => {
                if (v.live) return false;
                const mins = v.durationSec / 60;
                if (state.duration === 'short') return mins < 5;
                if (state.duration === 'medium') return mins >= 5 && mins <= 20;
                return mins > 20;
            });
        }

        if (state.sort === 'date') {
            list = [...list].sort((a, b) => a.daysAgo - b.daysAgo);
        } else if (state.sort === 'duration') {
            list = [...list].sort((a, b) => b.durationSec - a.durationSec);
        }

        return list;
    }

    function updateAuthUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userDropdown = document.getElementById('userDropdown');
        const userEmail = document.getElementById('userEmail');
        const profilePic = document.getElementById('profilePic');
        const dropdownMenu = document.getElementById('dropdownMenu');

        if (loginBtn && userDropdown && userEmail && profilePic) {
            if (currentUser) {
                loginBtn.style.display = 'none';
                userDropdown.style.display = 'inline-block';
                userDropdown.hidden = false;
                userEmail.textContent = currentUser.email || '';
                profilePic.textContent = (currentUser.email || 'U').charAt(0).toUpperCase();
            } else {
                loginBtn.style.display = 'inline-block';
                userDropdown.style.display = 'none';
                userDropdown.hidden = true;
                if (dropdownMenu) dropdownMenu.hidden = true;
                userEmail.textContent = '';
                profilePic.textContent = '';
            }
        }

    }

    function closeSidebar() {
        if (sidebarNav) sidebarNav.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
        if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
    }

    function closeUserMenu() {
        if (dropdownMenu) dropdownMenu.hidden = true;
        if (profilePic) profilePic.setAttribute('aria-expanded', 'false');
    }

    function updateSectionTitle() {
        if (state.favoritesOnly) {
            sectionTitle.textContent = '❤️ Your Favorites';
            return;
        }
        if (state.query) {
            sectionTitle.textContent = `Search Results for: "${searchInput.value}"`;
            return;
        }
        const f = state.filter;
        if (f === 'all') {
            sectionTitle.textContent = 'Recommended Content';
        } else if (f === 'live-18') {
            sectionTitle.textContent = '🔴 Live 18+ Streaming Feeds';
        } else if (f === 'universities') {
            sectionTitle.textContent = '🏛️ Universities Content';
        } else if (f === 'tiktokers') {
            sectionTitle.textContent = '🎵 TikTokers Content';
        } else if (f.startsWith('tag:')) {
            sectionTitle.textContent = '🏷️ #' + f.slice(4);
        } else {
            sectionTitle.textContent = f.charAt(0).toUpperCase() + f.slice(1);
        }
    }

    // ==========================================================
    // 7. HOVER PREVIEW THUMBNAILS (Cleaned)
    // ==========================================================
    function attachPreview(card, video) {
        if (reducedMotion) return;
        const img = card.querySelector('img');
        const baseThumb = video.thumb;
        let timer = null;

        card.addEventListener('mouseenter', () => {
            if (timer) return;
            card.classList.add('previewing');
        });

        card.addEventListener('mouseleave', () => {
            if (timer) clearInterval(timer);
            timer = null;
            img.src = baseThumb;
            card.classList.remove('previewing');
        });
    }

    // ==========================================================
    // 8. GRID / SHELF / TAG RENDERING
    // ==========================================================
    function buildCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.id = video.id;
        const badge = video.live
            ? '<span class="badge-live">LIVE</span>'
            : `<span class="duration">${formatDuration(video.durationSec)}</span>`;
        card.innerHTML = `
            <div class="thumbnail-wrapper">
                <img src="${video.thumb}" alt="${escapeHtml(video.title)} thumbnail" loading="lazy">
                ${badge}
            </div>
            <div class="video-info">
                <h3 class="video-title">${escapeHtml(video.title)}</h3>
                <p class="video-meta">${escapeHtml(video.channel)} • ${escapeHtml(video.viewsText)} • ${escapeHtml(video.ageText)}</p>
            </div>`;
        card.addEventListener('click', () => openWatch(video.id));
        attachPreview(card, video);
        return card;
    }

    async function renderGrid() {
        const list = getVisibleVideos();
        if (videoGrid) videoGrid.innerHTML = '';
        const frag = document.createDocumentFragment();
        list.forEach((v) => frag.appendChild(buildCard(v)));
        if (videoGrid) videoGrid.appendChild(frag);

        if (emptyState) emptyState.hidden = list.length > 0;
        if (list.length === 0 && emptyStateMsg) {
            emptyStateMsg.textContent = state.query
                ? `No videos match "${searchInput.value.trim()}".`
                : 'No videos match the current filters.';
        }

        updateSectionTitle();
        await renderHistory();
        animateGridItems();
    }

    function getUserKey(key) {
        const uid = currentUser ? currentUser.id : 'guest';
        return `azigi${key}_${uid}`;
    }

    async function getHistoryAsync() {
        let h = currentUser ? await loadWatchHistory(currentUser.id) : readJSON(getUserKey('History'), []);
        h = h.filter((id) => {
            const v = byId(id);
            return v && isVideoAllowed(v);
        });
        return h;
    }

    async function renderHistory() {
        const ids = await getHistoryAsync();
        const show = ids.length > 0 && state.filter === 'all' && !state.query;
        if (historyRow) historyRow.hidden = !show;
        if (!show) {
            if (historyTrack) historyTrack.innerHTML = '';
            return;
        }
        if (historyTrack) {
            historyTrack.innerHTML = ids.map((id) => {
                const v = byId(id);
                return v ? `
                <div class="history-item" data-id="${v.id}">
                    <img src="${v.thumb}" alt="">
                    <p class="history-title">${escapeHtml(v.title)}</p>
                </div>` : '';
            }).join('');
        }
    }

    function renderTagCloud() {
        const tags = new Set();
        VIDEOS.filter(isVideoAllowed).forEach((v) => {
            v.tags.forEach((t) => {
                if (t !== 'trending' && t !== 'newest') tags.add(t);
            });
        });
        const sorted = [...tags].sort();
        tagCloud.innerHTML = sorted
            .map((t) => `<button type="button" class="tag-pill" data-filter="tag:${t}">#${t}</button>`)
            .join('');
        updateActiveTabVisualState(state.filter);
    }

    // ==========================================================
    // 9. FILTER NAVIGATION
    // ==========================================================
    function setFilter(filterValue) {
        state.filter = filterValue;
        state.favoritesOnly = false;
        state.query = '';
        searchInput.value = '';
        hideSuggest();
        closeSidebar();
        updateActiveTabVisualState(filterValue);
        renderGrid();
    }

    function handleNavigationAttempt(element, filterValue) {
        if (filterValue === 'live-18' && !isAdultVerified) {
            pendingFilterTarget = element;
            ageGateModal.classList.add('open');
            return;
        }
        setFilter(filterValue);
    }

    function updateActiveTabVisualState(filterValue) {
        filterChips.forEach((c) => {
            c.classList.toggle('active', c.getAttribute('data-filter') === filterValue);
        });
        sidebarItems.forEach((i) => {
            i.classList.toggle('active', i.getAttribute('data-filter') === filterValue);
        });
        document.querySelectorAll('.tag-pill').forEach((p) => {
            p.classList.toggle('active', p.getAttribute('data-filter') === filterValue);
        });
    }

    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            handleNavigationAttempt(chip, chip.getAttribute('data-filter'));
        });
    });

    sidebarItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigationAttempt(item, item.getAttribute('data-filter'));
        });
    });

    tagCloud.addEventListener('click', (e) => {
        const pill = e.target.closest('.tag-pill');
        if (!pill) return;
        handleNavigationAttempt(pill, pill.getAttribute('data-filter'));
    });

    // ==========================================================
    // 10. AGE GATE OVERLAY
    // ==========================================================
    if (ageGateAcceptBtn && ageGateRejectBtn) {
        ageGateAcceptBtn.addEventListener('click', () => {
            isAdultVerified = true;
            localStorage.setItem('adultVerified', 'true');
            ageGateModal.classList.remove('open');
            renderTagCloud();

            if (pendingFilterTarget) {
                const filterValue = pendingFilterTarget.getAttribute('data-filter');
                pendingFilterTarget = null;
                setFilter(filterValue);
            } else {
                renderTagCloud();
                renderGrid();
            }
        });

        ageGateRejectBtn.addEventListener('click', () => {
            ageGateModal.classList.remove('open');
            pendingFilterTarget = null;
            setFilter('all');
        });
    }

    // ==========================================================
    // 11. SEARCH & SUGGESTIONS
    // ==========================================================
    function hideSuggest() {
        searchSuggest.hidden = true;
        searchSuggest.innerHTML = '';
    }

    function showSuggest() {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
            hideSuggest();
            return;
        }
        const matches = VIDEOS
            .filter((v) => isVideoAllowed(v) && v.title.toLowerCase().includes(q))
            .slice(0, 6);
        if (matches.length === 0) {
            hideSuggest();
            return;
        }
        searchSuggest.innerHTML = matches
            .map((v) => `<div class="suggest-item" data-id="${v.id}">🎬 ${escapeHtml(v.title)}</div>`)
            .join('');
        searchSuggest.hidden = false;
    }

    function runSearch(rawQuery) {
        state.query = rawQuery.trim().toLowerCase();
        state.favoritesOnly = false;
        hideSuggest();
        renderGrid();
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => runSearch(searchInput.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runSearch(searchInput.value);
        });
        searchInput.addEventListener('input', showSuggest);
    }

    searchSuggest.addEventListener('click', (e) => {
        const item = e.target.closest('.suggest-item');
        if (!item) return;
        const v = byId(item.getAttribute('data-id'));
        if (!v) return;
        searchInput.value = v.title;
        runSearch(v.title);
    });

    document.addEventListener('click', (e) => {
        if (searchSuggest.hidden) return;
        if (!e.target.closest || !e.target.closest('.search-wrap')) hideSuggest();
    });

    // ==========================================================
    // 12. SORT + DURATION
    // ==========================================================
    sortBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            state.sort = btn.getAttribute('data-sort');
            sortBtns.forEach((b) => b.classList.toggle('active', b === btn));
            renderGrid();
        });
    });

    if (durationFilter) {
        durationFilter.addEventListener('change', () => {
            state.duration = durationFilter.value;
            renderGrid();
        });
    }

    // ==========================================================
    // 13. WATCH VIEW & INTERACTIONS
    // ==========================================================
    function getRatings() {
        return userRatings;
    }

    function renderRatings(video) {
        const r = getRatings()[video.id] || { up: 0, down: 0, mine: null };
        likeCount.textContent = (video.likes || 0) + r.up;
        dislikeCount.textContent = (video.dislikes || 0) + r.down;
        likeBtn.classList.toggle('active', r.mine === 'up');
        dislikeBtn.classList.toggle('active', r.mine === 'down');
    }

    async function toggleRating(dir) {
        const v = byId(currentWatchId);
        if (!v) return;
        if (!currentUser) {
            showToast('Please login to rate videos', 'warning');
            const authModal = document.getElementById('authModal');
            if (authModal) authModal.classList.add('open');
            return;
        }
        const all = getRatings();
        const previous = all[v.id] || { up: 0, down: 0, mine: null };
        const next = { ...previous };
        const removing = next.mine === dir;
        if (next.mine === 'up') next.up -= 1;
        if (next.mine === 'down') next.down -= 1;
        next.mine = removing ? null : dir;
        if (!removing && dir === 'up') next.up += 1;
        if (!removing && dir === 'down') next.down += 1;
        try {
            if (window.supabaseClient) {
                const result = removing
                    ? await window.supabaseClient.from('ratings').delete().eq('user_id', currentUser.id).eq('video_id', v.id)
                    : await window.supabaseClient.from('ratings').upsert({
                        user_id: currentUser.id,
                        video_id: v.id,
                        rating: dir,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id,video_id' });
                if (result.error) throw result.error;
            }
        } catch (error) {
            console.error('Failed to save rating:', error);
            showToast(`Could not save your rating: ${getErrorMessage(error)}`, 'error');
            return;
        }
        all[v.id] = next;
        userRatings = all;
        writeJSON(getUserKey('Ratings'), all);
        renderRatings(v);
    }

    if (likeBtn && dislikeBtn) {
        likeBtn.addEventListener('click', async () => await toggleRating('up'));
        dislikeBtn.addEventListener('click', async () => await toggleRating('down'));
    }

    function getLocalComments(videoId) {
        const comments = readJSON(`azigiComments_${videoId}_${currentUser ? currentUser.id : 'guest'}`, []);
        return Array.isArray(comments) ? comments : [];
    }

    function saveLocalComment(videoId, text) {
        const comments = getLocalComments(videoId);
        comments.push({
            author: currentUser ? currentUser.email : 'You',
            email: currentUser ? currentUser.email : '',
            time: new Date().toLocaleString(),
            text
        });
        writeJSON(`azigiComments_${videoId}_${currentUser ? currentUser.id : 'guest'}`, comments);
    }

    async function loadCommentsForVideo(videoId) {
        const localComments = getLocalComments(videoId);
        try {
            if (!window.supabaseClient) return localComments;
            const { data, error } = await window.supabaseClient
                .from('comments')
                .select('*')
                .eq('video_id', videoId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            return [...localComments, ...(data || []).map(c => ({
                id: c.id,
                author: c.author_name || c.user_id,
                email: c.author_name,
                time: new Date(c.created_at).toLocaleString(),
                text: c.comment_text
            }))];
        } catch (e) {
            console.error('Failed to load comments:', e);
            return localComments;
        }
    }

    async function renderComments(video) {
        const dbComments = await loadCommentsForVideo(video.id);
        const seeded = (video.comments && Array.isArray(video.comments)) ? video.comments : [];
        const all = [...seeded, ...dbComments];
        commentCount.textContent = `(${all.length})`;
        commentList.innerHTML = all.length
            ? all.map((c) => {
                const author = (currentUser && (c.email === currentUser.email || c.author === currentUser.email)) ? 'You' : (c.author || c.author_name);
                return `
            <li>
                <div class="comment-head"><span class="comment-author">${escapeHtml(author)}</span><span class="comment-time">${escapeHtml(c.time || '')}</span></div>
                <p>${escapeHtml(c.text || '')}</p>
            </li>`;
            }).join('')
            : '<li class="comment-empty">No comments yet. Be the first!</li>';
    }

    function isFavorite(id) {
        return userFavorites.includes(id);
    }

    async function toggleFavorite() {
        const v = byId(currentWatchId);
        if (!v) return;
        if (!currentUser) {
            showToast('Please login to manage favorites', 'warning');
            const authModal = document.getElementById('authModal');
            if (authModal) authModal.classList.add('open');
            return;
        }
        const idx = userFavorites.indexOf(v.id);
        if (idx > -1) {
            userFavorites.splice(idx, 1);
            await removeFromFavorites(currentUser.id, v.id);
            showToast('Removed from favorites', 'info');
        } else {
            userFavorites.push(v.id);
            await addToFavorites(currentUser.id, v.id);
            showToast('Added to favorites', 'success');
        }
        renderFavoriteBtn(v);
        if (state.favoritesOnly) renderGrid();
    }

    function renderFavoriteBtn(video) {
        const favBtn = document.getElementById('favoriteBtn');
        if (!favBtn) return;
        const fav = isFavorite(video.id);
        favBtn.textContent = fav ? '❤️ Favorited' : '❤️ Favorite';
        favBtn.classList.toggle('active', fav);
    }

    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) favoriteBtn.addEventListener('click', toggleFavorite);

    async function recordHistory(videoId) {
        let h = currentUser ? await loadWatchHistory(currentUser.id) : readJSON(getUserKey('History'), []);
        h = h.filter(id => id !== videoId);
        h.unshift(videoId);
        if (h.length > 20) h.pop();

        if (currentUser && window.supabaseClient) {
            try {
                await window.supabaseClient.from('watch_history').upsert({
                    user_id: currentUser.id,
                    video_id: videoId,
                    watched_at: new Date().toISOString()
                }, { onConflict: 'user_id,video_id' });
            } catch (e) {}
        } else {
            writeJSON(getUserKey('History'), h);
        }
        renderHistory();
    }

    async function openWatch(id) {
        const v = byId(id);
        if (!v) return;
        currentWatchId = v.id;

        modalVideoTitle.textContent = v.title;
        modalVideoMeta.textContent = `${v.channel} • ${v.viewsText} • ${v.ageText}`;
        watchViews.textContent = v.viewsText;

        if (watchPlayer) {
            const streamSrc = getPlayableSource(v.src);
            if (playerFallback) playerFallback.hidden = true;
            watchPlayer.onerror = () => {
                if (playerFallback) playerFallback.hidden = false;
            };
            watchPlayer.src = streamSrc;
            watchPlayer.load();

            watchPlayer.play().catch(() => {
                console.log('Autoplay blocked or stream requires user interaction.');
            });
        }

        watchLive.hidden = !v.live;
        renderRatings(v);
        renderFavoriteBtn(v);
        await renderComments(v);

        const related = VIDEOS.filter(item => item.id !== v.id && isVideoAllowed(item)).slice(0, 5);
        relatedList.innerHTML = related.map(item => `
            <div class="related-item" data-id="${item.id}">
                <div class="related-thumb">
                    <img src="${item.thumb}" alt="">
                    <span class="related-dur">${formatDuration(item.durationSec)}</span>
                </div>
                <div>
                    <p class="related-title">${escapeHtml(item.title)}</p>
                    <p class="related-meta">${escapeHtml(item.channel)}</p>
                </div>
            </div>
        `).join('');

        videoModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        await recordHistory(v.id);
    }

    function closeWatch() {
        if (watchPlayer) {
            watchPlayer.pause();
            watchPlayer.src = '';
        }
        videoModal.classList.remove('open');
        document.body.style.overflow = '';
        currentWatchId = null;
    }

    if (closeModal) closeModal.addEventListener('click', closeWatch);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeWatch();
    });

    relatedList.addEventListener('click', (e) => {
        const item = e.target.closest('.related-item');
        if (!item) return;
        openWatch(item.getAttribute('data-id'));
    });

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (!text || !currentWatchId) return;
            if (!currentUser) {
                showToast('Please sign in to post comments', 'warning');
                const authModal = document.getElementById('authModal');
                if (authModal) authModal.classList.add('open');
                return;
            }

            try {
                let savedLocally = !window.supabaseClient;
                if (window.supabaseClient) {
                    const { error } = await window.supabaseClient.from('comments').insert({
                        video_id: currentWatchId,
                        user_id: currentUser.id,
                        author_name: currentUser.email,
                        comment_text: text
                    });
                    if (error && error.code !== 'PGRST205') throw error;
                    savedLocally = !!error;
                }
                if (savedLocally) saveLocalComment(currentWatchId, text);
                commentInput.value = '';
                const v = byId(currentWatchId);
                await renderComments(v);
                showToast(
                    savedLocally
                        ? 'Comment saved on this device only; the comments table is unavailable.'
                        : 'Comment posted successfully',
                    savedLocally ? 'warning' : 'success'
                );
            } catch (err) {
                console.error('Failed to post comment:', err);
                showToast(`Failed to post comment: ${getErrorMessage(err)}`, 'error');
            }
        });
    }

    if (menuToggleBtn && sidebarNav && sidebarBackdrop) {
        menuToggleBtn.addEventListener('click', () => {
            const isOpen = sidebarNav.classList.toggle('open');
            sidebarBackdrop.classList.toggle('open', isOpen);
            menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
        });
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    if (profilePic && dropdownMenu) {
        profilePic.setAttribute('role', 'button');
        profilePic.setAttribute('tabindex', '0');
        profilePic.setAttribute('aria-haspopup', 'true');
        profilePic.setAttribute('aria-expanded', 'false');
        const toggleUserMenu = () => {
            dropdownMenu.hidden = !dropdownMenu.hidden;
            profilePic.setAttribute('aria-expanded', String(!dropdownMenu.hidden));
        };
        profilePic.addEventListener('click', toggleUserMenu);
        profilePic.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleUserMenu();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (userDropdown && !userDropdown.contains(e.target)) closeUserMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        closeSidebar();
        closeUserMenu();
        if (videoModal && videoModal.classList.contains('open')) closeWatch();
        document.querySelectorAll('.auth-modal.open').forEach((modal) => modal.classList.remove('open'));
        if (ageGateModal) ageGateModal.classList.remove('open');
    });

    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginFormEl');
    const signupForm = document.getElementById('signupFormEl');
    const switchToSignupLink = document.getElementById('switchToSignupLink');

    function showAuthTab(tab) {
        document.getElementById('loginForm').hidden = tab !== 'login';
        document.getElementById('signupForm').hidden = tab !== 'signup';
        authTabs.forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
    }

    function setAuthError(id, message) {
        const target = document.getElementById(id);
        if (target) target.textContent = message || '';
    }

    function getErrorMessage(error) {
        return error && error.message ? error.message : 'Please try again.';
    }

    if (loginBtn && authModal) loginBtn.addEventListener('click', () => authModal.classList.add('open'));
    if (closeAuthModal && authModal) closeAuthModal.addEventListener('click', () => authModal.classList.remove('open'));
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) authModal.classList.remove('open');
        });
    }
    authTabs.forEach((button) => button.addEventListener('click', () => showAuthTab(button.dataset.tab)));
    if (switchToSignupLink) {
        switchToSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthTab('signup');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            setAuthError('loginEmailError', '');
            setAuthError('loginPasswordError', '');
            try {
                if (!window.supabaseLogin) throw new Error('Sign-in is unavailable because the authentication service is not configured.');
                const { user } = await window.supabaseLogin(email, password);
                if (!user) throw new Error('Sign-in succeeded without a user session. Please try again.');
                await setCurrentUser({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata && user.user_metadata.full_name
                        ? user.user_metadata.full_name
                        : user.email.split('@')[0]
                });
                authModal.classList.remove('open');
                loginForm.reset();
                showToast('Signed in successfully.', 'success');
            } catch (error) {
                setAuthError('loginPasswordError', getErrorMessage(error));
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirm').value;
            setAuthError('signupEmailError', '');
            setAuthError('signupPasswordError', '');
            setAuthError('signupConfirmError', '');
            if (password.length < 6) {
                setAuthError('signupPasswordError', 'Use at least 6 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setAuthError('signupConfirmError', 'Passwords do not match.');
                return;
            }
            try {
                if (!window.supabaseSignup) throw new Error('Registration is unavailable because the authentication service is not configured.');
                const { user, session } = await window.supabaseSignup(email, password);
                if (session && user) {
                    await setCurrentUser({
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata && user.user_metadata.full_name
                            ? user.user_metadata.full_name
                            : user.email.split('@')[0]
                    });
                    authModal.classList.remove('open');
                    showToast('Account created successfully.', 'success');
                } else {
                    showToast('Check your email to confirm your account, then sign in.', 'info');
                    showAuthTab('login');
                }
                signupForm.reset();
            } catch (error) {
                setAuthError('signupEmailError', getErrorMessage(error));
            }
        });
    }

    const profileLink = document.getElementById('profileLink');
    const favoritesLink = document.getElementById('favoritesLink');
    const historyLink = document.getElementById('historyLink');
    const logoutLink = document.getElementById('logoutLink');
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeUserMenu();
            showToast(`Signed in as ${currentUser ? currentUser.email : 'guest'}.`, 'info');
        });
    }
    if (favoritesLink) {
        favoritesLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeUserMenu();
            if (!currentUser) {
                showToast('Please sign in to view your favorites.', 'warning');
                if (authModal) authModal.classList.add('open');
                return;
            }
            state.favoritesOnly = true;
            state.query = '';
            searchInput.value = '';
            hideSuggest();
            renderGrid();
        });
    }
    if (historyLink) {
        historyLink.addEventListener('click', async (e) => {
            e.preventDefault();
            closeUserMenu();
            state.filter = 'all';
            state.query = '';
            state.favoritesOnly = false;
            searchInput.value = '';
            hideSuggest();
            await renderGrid();
            if (historyRow && !historyRow.hidden) {
                historyRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                showToast('Your watch history is empty.', 'info');
            }
        });
    }
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                if (window.supabaseClient) await window.supabaseLogout();
                await setCurrentUser(null);
                closeUserMenu();
                showToast('You have been signed out.', 'success');
            } catch (error) {
                showToast(`Could not sign out: ${getErrorMessage(error)}`, 'error');
            }
        });
    }

    if (historyTrack) {
        historyTrack.addEventListener('click', (e) => {
            const item = e.target.closest('.history-item');
            if (item) openWatch(item.dataset.id);
        });
    }
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', async () => {
            try {
                if (currentUser && window.supabaseClient) {
                    const { error } = await window.supabaseClient
                        .from('watch_history')
                        .delete()
                        .eq('user_id', currentUser.id);
                    if (error) throw error;
                } else {
                    writeJSON(getUserKey('History'), []);
                }
                await renderHistory();
                showToast('Watch history cleared.', 'success');
            } catch (error) {
                console.error('Failed to clear watch history:', error);
                showToast(`Could not clear watch history: ${getErrorMessage(error)}`, 'error');
            }
        });
    }

    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminDashboardSection = document.getElementById('adminDashboardSection');
    const uploadForm = document.getElementById('uploadForm');

    if (closeAdminModal && adminModal) closeAdminModal.addEventListener('click', () => adminModal.classList.remove('open'));
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) adminModal.classList.remove('open');
        });
    }
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            if (adminLoginSection) adminLoginSection.hidden = false;
            if (adminDashboardSection) adminDashboardSection.hidden = true;
            if (adminModal) adminModal.classList.remove('open');
        });
    }
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;
            try {
                if (!window.supabaseLogin) throw new Error('Creator sign-in is unavailable because authentication is not configured.');
                const { user } = await window.supabaseLogin(email, password);
                if (!user) throw new Error('Authentication returned no user.');
                const profile = await loadUserProfile(user.id);
                if (!profile) {
                    await window.supabaseLogout();
                    await setCurrentUser(null);
                    throw new Error('Your account has no profile row yet. Run the Creator Studio admin setup SQL in Supabase, then sign in again.');
                }
                if (profile.role !== 'admin') {
                    await window.supabaseLogout();
                    await setCurrentUser(null);
                    throw new Error('This account is not marked as an admin. Run the Creator Studio admin setup SQL in Supabase, then sign in again.');
                }
                await setCurrentUser({
                    id: user.id,
                    email: user.email,
                    name: profile.full_name || user.email.split('@')[0]
                });
                userProfile = profile;
                if (adminLoginSection) adminLoginSection.hidden = true;
                if (adminDashboardSection) adminDashboardSection.hidden = false;
                showToast('Creator Studio unlocked.', 'success');
            } catch (error) {
                showToast(`Could not open Creator Studio: ${getErrorMessage(error)}`, 'error');
            }
        });
    }
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const videoUrl = document.getElementById('uploadVideoUrl').value.trim();
            let parsedUrl;
            try {
                parsedUrl = new URL(videoUrl);
            } catch (error) {
                showToast('Enter a valid direct video URL.', 'error');
                return;
            }
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                showToast('Video URLs must use HTTP or HTTPS.', 'error');
                return;
            }
            if (!window.supabaseClient || !userProfile || userProfile.role !== 'admin') {
                showToast('Sign in with an authorized admin account to publish videos.', 'warning');
                return;
            }

            const durationValue = document.getElementById('uploadDuration').value;
            const duration = durationValue ? Number(durationValue) : 0;
            if (!Number.isFinite(duration) || duration < 0) {
                showToast('Duration must be zero or greater.', 'error');
                return;
            }
            const category = document.getElementById('uploadCategory').value;
            const tags = [...new Set(document.getElementById('uploadTags').value
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean))];
            const video = {
                id: window.crypto && window.crypto.randomUUID
                    ? window.crypto.randomUUID()
                    : `video-${Date.now()}`,
                title: document.getElementById('uploadTitle').value.trim(),
                channel: document.getElementById('uploadChannel').value.trim(),
                category,
                tags,
                duration_sec: Math.floor(duration),
                live: category === 'live-18',
                views_text: '0 views',
                age_text: 'just now',
                days_ago: 0,
                likes: 0,
                dislikes: 0,
                thumb_url: document.getElementById('uploadThumbUrl').value.trim() || null,
                video_url: videoUrl
            };
            const submitButton = document.getElementById('uploadSubmitBtn');
            submitButton.disabled = true;
            try {
                const { error } = await window.supabaseClient.from('videos').insert(video);
                if (error) throw error;
                VIDEOS.unshift({
                    id: video.id,
                    title: video.title,
                    channel: video.channel,
                    category: video.category,
                    tags: video.tags,
                    durationSec: video.duration_sec,
                    live: video.live,
                    viewsText: video.views_text,
                    ageText: video.age_text,
                    daysAgo: video.days_ago,
                    likes: video.likes,
                    dislikes: video.dislikes,
                    thumb: video.thumb_url || seedThumb(video.id),
                    src: video.video_url,
                    comments: []
                });
                uploadForm.reset();
                renderTagCloud();
                renderGrid();
                showToast('Video published successfully.', 'success');
            } catch (error) {
                console.error('Failed to publish video:', error);
                showToast(`Could not publish video: ${getErrorMessage(error)}`, 'error');
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    if (window.supabaseClient) {
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session && session.user) {
                const user = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata && session.user.user_metadata.full_name
                        ? session.user.user_metadata.full_name
                        : session.user.email.split('@')[0]
                };
                setTimeout(() => {
                    if (!currentUser || currentUser.id !== user.id) setCurrentUser(user);
                }, 0);
            } else if (event === 'SIGNED_OUT') {
                setTimeout(() => {
                    if (currentUser) setCurrentUser(null);
                }, 0);
            }
        });
    }

    await reloadUserData();
    updateAuthUI();
    renderTagCloud();
    renderGrid();
});