document.addEventListener('DOMContentLoaded', async () => {
    const SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
    const SAFE_FALLBACK_VIDEOS = [
        { id: 'v1', title: 'Global University Campus Tour & Student Life Overview', channel: 'EduNetwork', viewsText: '50K views', ageText: '2 days ago', daysAgo: 2, durationSec: 765, category: 'universities', tags: ['newest', 'campus'], likes: 1204, dislikes: 31, thumb: 'https://picsum.photos/seed/azigi1/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', comments: [{ author: 'CampusKid', time: '1 day ago', text: 'The new library wing looks amazing!' }] },
        { id: 'v2', title: 'Late Night Debate: Creativity, Culture & Future Thinking', channel: 'NightTalkers', viewsText: '120K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['trending', 'panel'], likes: 8811, dislikes: 204, thumb: 'https://picsum.photos/seed/azigi2/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', comments: [{ author: 'NightOwl', time: '2 hours ago', text: 'Great points tonight.' }] },
        { id: 'v3', title: 'Introduction to Data Science & Analytics Lecture Series', channel: 'UniLectures', viewsText: '15K views', ageText: '5 hours ago', daysAgo: 0, durationSec: 2720, category: 'universities', tags: ['trending', 'lecture'], likes: 934, dislikes: 12, thumb: 'https://picsum.photos/seed/azigi3/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', comments: [] },
        { id: 'v4', title: 'Virtual Reality Gaming Lounge Live Session', channel: 'PixelStreams', viewsText: '31K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['trending', 'gaming'], likes: 4102, dislikes: 87, thumb: 'https://picsum.photos/seed/azigi4/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', comments: [] },
        { id: 'v5', title: 'Final Exam Study Tips: 8 Focus Techniques That Work', channel: 'StudySmart', viewsText: '203K views', ageText: '1 week ago', daysAgo: 7, durationSec: 245, category: 'universities', tags: ['newest', 'study'], likes: 5610, dislikes: 74, thumb: 'https://picsum.photos/seed/azigi5/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', comments: [{ author: 'GradStudent', time: '3 days ago', text: 'Technique 6 changed my semester.' }] },
        { id: 'v6', title: 'After-Hours Comedy Open Mic Night', channel: 'LaughTrack', viewsText: '12K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['comedy'], likes: 2210, dislikes: 40, thumb: 'https://picsum.photos/seed/azigi6/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', comments: [] },
        { id: 'v7', title: 'Online Degrees Q&A: Admissions, Costs & Financial Aid', channel: 'EduNetwork', viewsText: '61K views', ageText: '3 weeks ago', daysAgo: 21, durationSec: 1020, category: 'universities', tags: ['degrees', 'talk'], likes: 1543, dislikes: 22, thumb: 'https://picsum.photos/seed/azigi7/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', comments: [] },
        { id: 'v8', title: 'Midnight Music Jam Session - Acoustic Covers', channel: 'NightOwlSessions', viewsText: '18K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['music'], likes: 3311, dislikes: 55, thumb: 'https://picsum.photos/seed/azigi8/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', comments: [] },
        { id: 'v9', title: 'Research Symposium: Climate Science Keynote', channel: 'UniLectures', viewsText: '7.2K views', ageText: '1 month ago', daysAgo: 30, durationSec: 5460, category: 'universities', tags: ['research', 'lecture'], likes: 640, dislikes: 18, thumb: 'https://picsum.photos/seed/azigi9/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', comments: [] },
        { id: 'v10', title: 'Neon Dance Party Live Stream', channel: 'ClubPulse', viewsText: '77K watching', ageText: 'streaming now', daysAgo: 0, durationSec: 0, live: true, category: 'live-18', tags: ['trending', 'dance'], likes: 6654, dislikes: 130, thumb: 'https://picsum.photos/seed/azigi10/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', comments: [] },
        { id: 'v11', title: 'Campus Library Resources & Research Database Walkthrough', channel: 'StudySmart', viewsText: '9.8K views', ageText: '4 days ago', daysAgo: 4, durationSec: 270, category: 'universities', tags: ['newest', 'study', 'campus'], likes: 812, dislikes: 9, thumb: 'https://picsum.photos/seed/azigi11/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', comments: [] },
        { id: 'v12', title: 'Community Relationship Q&A Show', channel: 'HeartToHeart', viewsText: '53K views', ageText: '12 days ago', daysAgo: 12, durationSec: 780, category: 'live-18', tags: ['talk'], likes: 2987, dislikes: 96, thumb: 'https://picsum.photos/seed/azigi12/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', comments: [] },
        { id: 'v13', title: 'Dance Challenge Compilation: Viral TikTok Moves', channel: 'DanceCraze', viewsText: '840K views', ageText: '1 day ago', daysAgo: 1, durationSec: 180, category: 'tiktokers', tags: ['trending', 'dance', 'newest'], likes: 45210, dislikes: 892, thumb: 'https://picsum.photos/seed/azigi13/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', comments: [{ author: 'DanceFan', time: '5 hours ago', text: 'These moves are insane!' }] },
        { id: 'v14', title: 'Quick Recipe Hack: 30 Second Meal Ideas', channel: 'ChefTok', viewsText: '320K views', ageText: '2 days ago', daysAgo: 2, durationSec: 30, category: 'tiktokers', tags: ['food', 'recipe'], likes: 18932, dislikes: 245, thumb: 'https://picsum.photos/seed/azigi14/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', comments: [] },
        { id: 'v15', title: 'Comedy Skit: Awkward First Date Situations', channel: 'FunnyTok', viewsText: '1.2M views', ageText: '3 hours ago', daysAgo: 0, durationSec: 45, category: 'tiktokers', tags: ['trending', 'comedy', 'newest'], likes: 67421, dislikes: 1283, thumb: 'https://picsum.photos/seed/azigi15/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', comments: [{ author: 'LaughOutLoud', time: '1 hour ago', text: 'So relatable!' }] },
        { id: 'v16', title: 'Morning Workout Motivation: 5 Min Routine', channel: 'FitTok', viewsText: '210K views', ageText: '5 days ago', daysAgo: 5, durationSec: 300, category: 'tiktokers', tags: ['fitness', 'workout'], likes: 12543, dislikes: 167, thumb: 'https://picsum.photos/seed/azigi16/320/180', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', comments: [] }
    ];
    const state = { filter: 'all', query: '', sort: 'relevance', duration: 'any', favoritesOnly: false };
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    let videos = [];
    let currentUser = readJSON('azigiCurrentUser', null);
    let userProfile = null;
    let currentWatchId = null;
    let favorites = [];
    let ratings = {};
    let progress = {};
    let suggestionIndex = -1;

    const $ = (id) => document.getElementById(id);
    const videoGrid = $('videoGrid');
    const sectionTitle = $('sectionTitle');
    const searchInput = $('searchInput');
    const searchSuggest = $('searchSuggest');
    const durationFilter = $('durationFilter');
    const videoModal = $('videoModal');
    const watchPlayer = $('watchPlayer');
    const watchIframe = $('watchIframe');
    const playerFallback = $('playerFallback');
    const commentList = $('commentList');
    const commentCount = $('commentCount');
    const authModal = $('authModal');
    const adminModal = $('adminModal');
    const ageGateModal = $('ageGateModal');

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Unable to save ${key} in local storage.`, error);
        }
    }

    function userKey(key) {
        return `azigi${key}_${currentUser?.id || 'guest'}`;
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[char]);
    }

    function showToast(message, type = 'info') {
        const container = $('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        window.setTimeout(() => toast.remove(), 3200);
    }

    function syncBodyLock() {
        document.body.style.overflow = document.querySelector('.video-modal.open, .auth-modal.open, .age-gate-modal.open') ? 'hidden' : '';
    }

    function openModal(modal) {
        modal?.classList.add('open');
        syncBodyLock();
    }

    function closeModal(modal) {
        modal?.classList.remove('open');
        syncBodyLock();
    }

    function normalizeVideo(video) {
        return {
            ...video,
            id: String(video.id),
            title: video.title || 'Untitled video',
            channel: video.channel || 'Unknown creator',
            category: video.category || 'universities',
            tags: Array.isArray(video.tags) ? video.tags : [],
            durationSec: Math.max(0, Number(video.durationSec ?? video.duration_sec) || 0),
            live: Boolean(video.live),
            views: Number(video.views) || 0,
            viewsText: video.viewsText || video.views_text || `${Number(video.views) || 0} views`,
            ageText: video.ageText || video.age_text || 'just now',
            daysAgo: Number(video.daysAgo ?? video.days_ago) || 0,
            likes: Number(video.likes) || 0,
            dislikes: Number(video.dislikes) || 0,
            thumb: video.thumb || video.thumb_url || `https://picsum.photos/seed/${encodeURIComponent(video.id)}/320/180`,
            src: video.src || video.video_url || SAMPLE,
            comments: Array.isArray(video.comments) ? video.comments : []
        };
    }

    function sanitizeVideoList(items) {
        if (!Array.isArray(items)) return [];
        const forbidden = /(fuck|pussy|virgin|porn|sex|naked|xxx|adult content|horny|sweaty|doggy|volleyball)/i;
        return items.filter((video) => {
            const content = `${video.title || ''} ${video.channel || ''} ${(video.tags || []).join(' ')}`;
            return !forbidden.test(content);
        });
    }

    function applySafeVideoSource() {
        const sanitized = sanitizeVideoList(window.VIDEOS);
        const nextVideos = sanitized.length ? sanitized : SAFE_FALLBACK_VIDEOS;
        window.VIDEOS = nextVideos.map((video) => ({
            ...video,
            title: String(video.title || '').replace(/(fuck|pussy|virgin|porn|sex|naked|xxx|adult content|horny|sweaty|doggy|volleyball)/gi, '').trim(),
            channel: String(video.channel || '').replace(/(fuck|pussy|virgin|porn|sex|naked|xxx|adult content|horny|sweaty|doggy|volleyball)/gi, '').trim() || 'AZIGI Studio',
            tags: Array.isArray(video.tags) ? video.tags.filter((tag) => !/(fuck|pussy|virgin|porn|sex|naked|xxx|adult content|horny|sweaty|doggy|volleyball)/i.test(tag)) : []
        }));
        return window.VIDEOS;
    }

    function ensureSafeFeed() {
        const safeVideos = applySafeVideoSource().filter((video) => {
            const title = `${video.title || ''} ${video.channel || ''} ${(video.tags || []).join(' ')}`;
            return !/(fuck|pussy|virgin|porn|sex|naked|xxx|adult content|horny|sweaty|doggy|volleyball)/i.test(title);
        });
        window.VIDEOS = safeVideos.length ? safeVideos : SAFE_FALLBACK_VIDEOS;
    }

    ensureSafeFeed();

    async function loadVideos() {
        const localVideos = sanitizeVideoList(window.VIDEOS).length
            ? sanitizeVideoList(window.VIDEOS).map(normalizeVideo)
            : SAFE_FALLBACK_VIDEOS.map(normalizeVideo);
        const client = window.supabaseClient;
        if (client) {
            try {
                const { data, error } = await client
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (Array.isArray(data) && data.length) {
                    videos = data.map(normalizeVideo);
                    return;
                }
            } catch (error) {
                console.warn('Could not load videos from Supabase; using the local feed.', error);
            }
        }
        videos = localVideos;
        if (videos.length === 0) {
            showToast('No videos are available. Check the connection or add videos to the feed.', 'warning');
        }
    }

    function isVideoAllowed(video) {
        return true;
    }

    function readLocalValue(key) {
        try { return localStorage.getItem(key); } catch (error) { return null; }
    }

    function writeLocalValue(key, value) {
        try { localStorage.setItem(key, value); } catch (error) {
            console.warn(`Unable to save ${key} in local storage.`, error);
        }
    }

    function getVideo(id) {
        return videos.find((video) => video.id === String(id));
    }

    async function loadUserData() {
        favorites = readJSON(userKey('Favorites'), []);
        ratings = readJSON(userKey('Ratings'), {});
        progress = readJSON(userKey('Progress'), {});
        userProfile = null;
        if (!currentUser || !window.supabaseClient) return;

        const client = window.supabaseClient;
        const [favoriteResult, ratingResult, progressResult, profileResult] = await Promise.all([
            client.from('favorites').select('video_id').eq('user_id', currentUser.id),
            client.from('ratings').select('video_id,rating').eq('user_id', currentUser.id),
            client.from('video_progress').select('video_id,progress_sec').eq('user_id', currentUser.id),
            client.from('profiles').select('*').eq('id', currentUser.id).maybeSingle()
        ]);
        if (favoriteResult.error) console.warn('Could not load favorites.', favoriteResult.error);
        else favorites = (favoriteResult.data || []).map((item) => item.video_id);
        if (ratingResult.error) console.warn('Could not load ratings.', ratingResult.error);
        else ratings = Object.fromEntries((ratingResult.data || []).map((item) => [item.video_id, item.rating]));
        if (progressResult.error) console.warn('Could not load watch progress.', progressResult.error);
        else progress = Object.fromEntries((progressResult.data || []).map((item) => [item.video_id, item.progress_sec]));
        if (profileResult.error) console.warn('Could not load profile.', profileResult.error);
        else userProfile = profileResult.data;
    }

    function updateAuthUI() {
        const loginButton = $('loginBtn');
        const userDropdown = $('userDropdown');
        const profilePic = $('profilePic');
        const dropdownMenu = $('dropdownMenu');
        if (loginButton) loginButton.hidden = Boolean(currentUser);
        if (userDropdown) {
            userDropdown.hidden = !currentUser;
            userDropdown.style.display = currentUser ? 'inline-block' : 'none';
        }
        if (profilePic) {
            profilePic.textContent = (currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase();
            profilePic.setAttribute('aria-label', currentUser ? `Account menu for ${currentUser.email}` : 'Account menu');
        }
        if ($('userEmail')) $('userEmail').textContent = currentUser?.email || '';
        if (dropdownMenu) dropdownMenu.hidden = true;
    }

    async function setCurrentUser(user) {
        currentUser = user;
        if (user) writeJSON('azigiCurrentUser', user);
        else {
            try { localStorage.removeItem('azigiCurrentUser'); } catch (error) { console.warn('Unable to clear saved account.', error); }
        }
        await loadUserData();
        updateAuthUI();
        renderGrid();
    }

    function durationLabel(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainder = seconds % 60;
        return `${hours ? `${hours}:${String(minutes).padStart(2, '0')}` : minutes}:${String(remainder).padStart(2, '0')}`;
    }

    function matchesFilter(video) {
        const filter = state.filter;
        if (filter === 'all' || filter === 'worldwide') return true;
        if (filter === 'trending' || filter === 'newest') return video.tags.includes(filter);
        if (filter.startsWith('tag:')) return video.tags.includes(filter.slice(4));
        return video.category === filter;
    }

    function getVisibleVideos() {
        let list = videos.filter((video) => {
            if (!isVideoAllowed(video)) return false;
            if (state.favoritesOnly && !favorites.includes(video.id)) return false;
            if (!matchesFilter(video)) return false;
            if (state.query) {
                const haystack = `${video.title} ${video.channel} ${video.tags.join(' ')}`.toLowerCase();
                if (!haystack.includes(state.query)) return false;
            }
            return true;
        });
        if (state.duration !== 'any') {
            list = list.filter((video) => {
                if (video.live) return false;
                const minutes = video.durationSec / 60;
                if (state.duration === 'short') return minutes < 5;
                if (state.duration === 'medium') return minutes >= 5 && minutes <= 20;
                return minutes > 20;
            });
        }
        if (state.sort === 'date') list = [...list].sort((a, b) => a.daysAgo - b.daysAgo);
        if (state.sort === 'duration') list = [...list].sort((a, b) => b.durationSec - a.durationSec);
        return list;
    }

    function makeCard(video, compact = false) {
        const card = document.createElement(compact ? 'button' : 'article');
        card.className = compact ? 'history-item' : 'video-card';
        card.dataset.id = video.id;
        if (compact) card.type = 'button';
        else {
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
        }
        const badge = video.live
            ? '<span class="badge-live">LIVE</span>'
            : `<span class="duration">${durationLabel(video.durationSec)}</span>`;
        const watched = Number(progress[video.id]) || 0;
        const percentage = video.durationSec ? Math.min(100, (watched / video.durationSec) * 100) : 0;
        const progressBar = !compact && percentage > 0
            ? `<div class="card-progress-bar" style="width:${percentage}%"></div>`
            : '';
        if (compact) {
            card.innerHTML = `<img src="${escapeHtml(video.thumb)}" alt="" loading="lazy"><p class="history-title">${escapeHtml(video.title)}</p>`;
            return card;
        }
        card.innerHTML = `
            <div class="thumbnail-wrapper">
                <img src="${escapeHtml(video.thumb)}" alt="${escapeHtml(video.title)} thumbnail" loading="lazy">
                ${badge}${progressBar}
            </div>
            <div class="video-info">
                <h3 class="video-title">${escapeHtml(video.title)}</h3>
                <p class="video-meta">${escapeHtml(video.channel)} · ${escapeHtml(video.viewsText)} · ${escapeHtml(video.ageText)}</p>
            </div>`;
        return card;
    }

    function renderHistory() {
        const row = $('historyRow');
        const track = $('historyTrack');
        if (!row || !track) return;
        const history = readJSON(userKey('History'), []);
        const recentVideos = history.map(getVideo).filter((video) => video && isVideoAllowed(video));
        const visible = recentVideos.length > 0 && state.filter === 'all' && !state.query && !state.favoritesOnly;
        row.hidden = !visible;
        track.replaceChildren(...(visible ? recentVideos.map((video) => makeCard(video, true)) : []));
    }

    function renderGrid() {
        if (!videoGrid) return;
        const list = getVisibleVideos();
        videoGrid.replaceChildren(...list.map((video) => makeCard(video)));
        $('emptyState').hidden = list.length > 0;
        const title = state.favoritesOnly
            ? '❤️ Your Favorites'
            : state.query
                ? `Search Results for: "${searchInput.value.trim()}"`
                : state.filter === 'all'
                    ? 'Recommended Content'
                    : state.filter.startsWith('tag:')
                        ? `🏷️ #${state.filter.slice(4)}`
                        : ({
                            'live-18': '🔴 Live 18+ Streaming Feeds',
                            universities: '🏛️ Universities Content',
                            worldwide: '🌍 WorldWide Content',
                            tiktokers: '🎵 TikTokers Content',
                            trending: '🔥 Trending',
                            newest: '✨ Latest Drops'
                        })[state.filter] || 'Recommended Content';
        if (sectionTitle) sectionTitle.textContent = title;
        renderHistory();
        updateActiveFilters();
    }

    function updateActiveFilters() {
        document.querySelectorAll('.chip, .nav-item').forEach((item) => {
            item.classList.toggle('active', !state.favoritesOnly && item.dataset.filter === state.filter);
        });
        document.querySelectorAll('.sort-btn').forEach((item) => {
            item.classList.toggle('active', item.dataset.sort === state.sort);
        });
    }

    function renderTagCloud() {
        const cloud = $('tagCloud');
        if (!cloud) return;
        const tags = new Set();
        videos.filter(isVideoAllowed).forEach((video) => video.tags.forEach((tag) => {
            if (tag !== 'trending' && tag !== 'newest') tags.add(tag);
        }));
        cloud.replaceChildren(...[...tags].sort().map((tag) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tag-pill';
            button.dataset.filter = `tag:${tag}`;
            button.textContent = `#${tag}`;
            return button;
        }));
    }

    function renderSuggestions() {
        const query = searchInput.value.trim().toLowerCase();
        state.query = query;
        if (!query) {
            searchSuggest.hidden = true;
            searchSuggest.replaceChildren();
            renderGrid();
            return;
        }
        const matches = videos.filter((video) => isVideoAllowed(video)
            && `${video.title} ${video.channel} ${video.tags.join(' ')}`.toLowerCase().includes(query)).slice(0, 6);
        searchSuggest.replaceChildren(...matches.map((video) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'suggest-item';
            item.dataset.id = video.id;
            item.textContent = `${video.title} · ${video.channel}`;
            return item;
        }));
        searchSuggest.hidden = matches.length === 0;
        suggestionIndex = -1;
        renderGrid();
    }

    function setFilter(value) {
        state.filter = value || 'all';
        state.favoritesOnly = false;
        state.query = '';
        if (searchInput) searchInput.value = '';
        searchSuggest.hidden = true;
        closeSidebar();
        renderGrid();
    }

    function closeSidebar() {
        $('sidebarNav')?.classList.remove('open');
        $('sidebarBackdrop')?.classList.remove('open');
        $('menuToggleBtn')?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    function setTheme(light) {
        document.body.classList.toggle('light-mode', light);
        writeLocalValue('theme', light ? 'light' : 'dark');
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = light ? '☀️' : '🌙';
    }

    function updateRatingButtons(video) {
        const rating = ratings[video.id];
        $('likeBtn').classList.toggle('active', rating === 'up');
        $('dislikeBtn').classList.toggle('active', rating === 'down');
        $('likeCount').textContent = video.likes.toLocaleString();
        $('dislikeCount').textContent = video.dislikes.toLocaleString();
        $('favoriteBtn').classList.toggle('active', favorites.includes(video.id));
        $('favoriteBtn').textContent = favorites.includes(video.id) ? '❤️ Favorited' : '❤️ Favorite';
    }

    function validHttpUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === 'https:' || url.protocol === 'http:';
        } catch (error) {
            return false;
        }
    }

    function getEmbedUrl(value) {
        try {
            const url = new URL(value);
            const host = url.hostname.toLowerCase();
            if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
                const id = url.pathname.split('/').filter(Boolean)[0];
                return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
            }
            if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
                const id = url.searchParams.get('v') || url.pathname.match(/\/embed\/([^/]+)/)?.[1];
                return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : '';
            }
            if (host === 'pornhub.com' || host.endsWith('.pornhub.com')) {
                if (/^\/embed\/[\w-]+/.test(url.pathname)) return url.href;
                const key = url.searchParams.get('viewkey');
                return key ? `https://www.pornhub.com/embed/${encodeURIComponent(key)}` : '';
            }
        } catch (error) {
            return '';
        }
        return '';
    }

    async function renderComments(video) {
        if (!commentList || !commentCount) return;
        let comments = video.comments || [];
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient
                .from('comments').select('*').eq('video_id', video.id).order('created_at', { ascending: true });
            if (error) {
                console.warn('Could not load comments.', error);
                showToast('Comments could not be loaded.', 'warning');
            } else comments = data || [];
        }
        commentCount.textContent = `(${comments.length})`;
        const parents = comments.filter((comment) => !comment.parent_id);
        if (!parents.length) {
            commentList.innerHTML = '<li class="comment-empty">No comments yet. Be the first!</li>';
            return;
        }
        commentList.innerHTML = parents.map((comment) => {
            const replies = comments.filter((reply) => reply.parent_id === comment.id);
            const author = currentUser?.id === comment.user_id ? 'You' : (comment.author_name || comment.author || 'User');
            const timestamp = comment.created_at ? new Date(comment.created_at).toLocaleString() : (comment.time || '');
            return `<li class="comment-item" data-id="${escapeHtml(comment.id)}">
                <div class="comment-head"><span class="comment-author">${escapeHtml(author)}</span><span class="comment-time">${escapeHtml(timestamp)}</span></div>
                <p class="comment-text">${escapeHtml(comment.comment_text || comment.text)}</p>
                <div class="comment-actions"><button type="button" class="comment-reply-trigger">Reply</button></div>
                <ul class="reply-list">${replies.map((reply) => `<li class="reply-item"><div class="comment-head"><span class="comment-author">${escapeHtml(reply.author_name || 'User')}</span></div><p class="comment-text">${escapeHtml(reply.comment_text)}</p></li>`).join('')}</ul>
                <form class="reply-form" data-parent-id="${escapeHtml(comment.id)}" hidden><input type="text" maxlength="300" placeholder="Write reply..." required><button type="submit">Post</button></form>
            </li>`;
        }).join('');
    }

    async function openWatch(id) {
        const video = getVideo(id);
        if (!video || !isVideoAllowed(video)) return;
        currentWatchId = video.id;
        $('modalVideoTitle').textContent = video.title;
        $('modalVideoMeta').textContent = `${video.channel} · ${video.viewsText} · ${video.ageText}`;
        $('watchViews').textContent = video.viewsText;
        $('watchLive').hidden = !video.live;
        playerFallback.hidden = true;
        const embedUrl = getEmbedUrl(video.src);
        if (embedUrl) {
            watchPlayer.pause();
            watchPlayer.removeAttribute('src');
            watchPlayer.hidden = true;
            watchIframe.src = embedUrl;
            watchIframe.style.display = 'block';
        } else if (validHttpUrl(video.src)) {
            watchIframe.src = '';
            watchIframe.style.display = 'none';
            watchPlayer.hidden = false;
            watchPlayer.src = video.src;
            watchPlayer.onloadedmetadata = () => {
                const savedProgress = Number(progress[video.id]) || 0;
                if (savedProgress > 5 && savedProgress < watchPlayer.duration - 3) watchPlayer.currentTime = savedProgress - 3;
            };
            watchPlayer.load();
            watchPlayer.play().catch(() => {});
        } else {
            watchIframe.src = '';
            watchIframe.style.display = 'none';
            watchPlayer.hidden = true;
            playerFallback.hidden = false;
        }
        openModal(videoModal);
        await renderComments(video);
        video.views += 1;
        video.viewsText = `${video.views.toLocaleString()} views`;
        $('watchViews').textContent = video.viewsText;
        $('modalVideoMeta').textContent = `${video.channel} · ${video.viewsText} · ${video.ageText}`;
        updateRatingButtons(video);
        const history = readJSON(userKey('History'), []).filter((videoId) => videoId !== video.id);
        history.unshift(video.id);
        writeJSON(userKey('History'), history.slice(0, 20));
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient.rpc('increment_video_views', { video_id_input: video.id });
            if (error) console.warn('Could not update video views.', error);
            else if (Number.isFinite(Number(data))) {
                video.views = Number(data);
                video.viewsText = `${video.views.toLocaleString()} views`;
                $('watchViews').textContent = video.viewsText;
                $('modalVideoMeta').textContent = `${video.channel} · ${video.viewsText} · ${video.ageText}`;
            }
        }
        renderGrid();
    }

    function closeWatch() {
        watchPlayer.pause();
        watchPlayer.removeAttribute('src');
        watchPlayer.load();
        watchIframe.src = '';
        if (currentWatchId && window.supabaseClient && currentUser) {
            const currentProgress = Number(progress[currentWatchId]) || 0;
            window.supabaseClient.from('video_progress').upsert({
                user_id: currentUser.id,
                video_id: currentWatchId,
                progress_sec: currentProgress,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,video_id' }).then(({ error }) => {
                if (error) console.warn('Could not save watch progress.', error);
            });
        }
        currentWatchId = null;
        closeModal(videoModal);
        renderGrid();
    }

    async function addFavorite(video) {
        if (!currentUser) {
            showToast('Sign in to save favorites.', 'warning');
            openModal(authModal);
            return;
        }
        const isFavorite = favorites.includes(video.id);
        const result = isFavorite
            ? await window.supabaseClient?.from('favorites').delete().eq('user_id', currentUser.id).eq('video_id', video.id)
            : await window.supabaseClient?.from('favorites').upsert({ user_id: currentUser.id, video_id: video.id }, { onConflict: 'user_id,video_id' });
        if (result?.error) {
            showToast('Could not update favorites. Please try again.', 'error');
            console.error('Favorite update failed.', result.error);
            return;
        }
        favorites = isFavorite ? favorites.filter((id) => id !== video.id) : [...favorites, video.id];
        writeJSON(userKey('Favorites'), favorites);
        updateRatingButtons(video);
        renderGrid();
    }

    async function saveRating(video, rating) {
        if (!currentUser) {
            showToast('Sign in to rate videos.', 'warning');
            openModal(authModal);
            return;
        }
        const previous = ratings[video.id];
        if (previous === rating) return;
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient.rpc('rate_video', {
                video_id_input: video.id,
                rating_input: rating
            });
            if (error) {
                showToast('Could not save your rating.', 'error');
                console.error('Rating update failed.', error);
                return;
            }
            video.likes = Number(data?.likes) || 0;
            video.dislikes = Number(data?.dislikes) || 0;
        } else {
            if (previous === 'up') video.likes = Math.max(0, video.likes - 1);
            if (previous === 'down') video.dislikes = Math.max(0, video.dislikes - 1);
            if (rating === 'up') video.likes += 1;
            else video.dislikes += 1;
        }
        ratings[video.id] = rating;
        writeJSON(userKey('Ratings'), ratings);
        updateRatingButtons(video);
    }

    function switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
        $('loginForm').hidden = tab !== 'login';
        $('signupForm').hidden = tab !== 'signup';
    }

    function setFormError(id, message) {
        const field = $(id);
        const error = $(`${id}Error`);
        if (error) error.textContent = message;
        field?.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    async function submitAuth(form, mode) {
        const email = $(mode === 'login' ? 'loginEmail' : 'signupEmail').value.trim();
        const password = $(mode === 'login' ? 'loginPassword' : 'signupPassword').value;
        if (!window.supabaseClient) {
            showToast('Account sign-in is unavailable until Supabase is configured.', 'error');
            return null;
        }
        try {
            const result = mode === 'login'
                ? await window.supabaseLogin(email, password)
                : await window.supabaseSignup(email, password);
            const user = result.user || result.session?.user;
            if (user) {
                await setCurrentUser({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
                });
                closeModal(authModal);
                showToast(mode === 'login' ? 'Signed in successfully.' : 'Account created successfully.', 'success');
            } else {
                showToast('Check your email to confirm your account, then sign in.', 'info');
            }
            form.reset();
            return user;
        } catch (error) {
            showToast(error.message || 'Authentication failed. Please try again.', 'error');
            return null;
        }
    }

    async function submitComment(form, parentId = null) {
        const input = form.querySelector('input');
        const text = input.value.trim();
        if (!text || !currentWatchId) return;
        if (!currentUser) {
            showToast('Sign in to join the discussion.', 'warning');
            openModal(authModal);
            return;
        }
        if (!window.supabaseClient) {
            showToast('Posting comments requires a configured account connection.', 'error');
            return;
        }
        const comment = {
            video_id: currentWatchId,
            user_id: currentUser.id,
            author_name: currentUser.email,
            comment_text: text
        };
        if (parentId) comment.parent_id = parentId;
        const { error } = await window.supabaseClient.from('comments').insert(comment);
        if (error) {
            showToast('Could not post your comment.', 'error');
            console.error('Comment submission failed.', error);
            return;
        }
        form.reset();
        await renderComments(getVideo(currentWatchId));
        showToast('Comment posted.', 'success');
    }

    async function verifyCreator(email, password) {
        if (!window.supabaseClient) {
            showToast('Creator Studio requires a configured Supabase connection.', 'error');
            return;
        }
        try {
            const data = await window.supabaseLogin(email, password);
            const user = data.user || data.session?.user;
            if (!user) throw new Error('Sign-in did not return an account.');
            currentUser = { id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email.split('@')[0] };
            await loadUserData();
            if (userProfile?.role !== 'admin') {
                await window.supabaseLogout();
                currentUser = null;
                updateAuthUI();
                throw new Error('This account is not authorized to use Creator Studio.');
            }
            writeJSON('azigiCurrentUser', currentUser);
            updateAuthUI();
            $('adminLoginSection').hidden = true;
            $('adminDashboardSection').hidden = false;
        } catch (error) {
            showToast(error.message || 'Creator authentication failed.', 'error');
        }
    }

    async function publishVideo(event) {
        event.preventDefault();
        if (!currentUser || userProfile?.role !== 'admin' || !window.supabaseClient) {
            showToast('Sign in with an administrator account before publishing.', 'error');
            return;
        }
        const title = $('uploadTitle').value.trim();
        const channel = $('uploadChannel').value.trim();
        const videoUrl = $('uploadVideoUrl').value.trim();
        const thumb = $('uploadThumbUrl').value.trim();
        if (!title || !channel || !validHttpUrl(videoUrl) || (thumb && !validHttpUrl(thumb))) {
            showToast('Enter a title, creator, and valid HTTP(S) media URLs.', 'warning');
            return;
        }
        const minutes = Number($('uploadMinutes').value) || 0;
        const seconds = Number($('uploadSeconds').value) || 0;
        if (seconds > 59 || minutes < 0 || seconds < 0) {
            showToast('Enter a valid duration.', 'warning');
            return;
        }
        const isLive = $('uploadCategory').value === 'live-18';
        const id = window.crypto?.randomUUID
            ? `video-${window.crypto.randomUUID()}`
            : `video-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const video = {
            id,
            title,
            channel,
            category: $('uploadCategory').value,
            tags: $('uploadTags').value.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean),
            duration_sec: isLive ? 0 : minutes * 60 + seconds,
            live: isLive,
            views: 0,
            views_text: '0 views',
            age_text: 'just now',
            days_ago: 0,
            video_url: videoUrl,
            thumb_url: thumb || null,
            likes: 0,
            dislikes: 0
        };
        const button = $('uploadSubmitBtn');
        button.disabled = true;
        try {
            const { error } = await window.supabaseClient.from('videos').insert(video);
            if (error) throw error;
            $('uploadForm').reset();
            closeModal(adminModal);
            await loadVideos();
            renderTagCloud();
            renderGrid();
            showToast('Video published.', 'success');
        } catch (error) {
            showToast(error.message || 'Could not publish video.', 'error');
            console.error('Video publishing failed.', error);
        } finally {
            button.disabled = false;
        }
    }

    function wireEvents() {
        $('themeToggleBtn')?.addEventListener('click', () => setTheme(!document.body.classList.contains('light-mode')));
        setTheme(readLocalValue('theme') === 'light');

        searchInput?.addEventListener('input', renderSuggestions);
        searchInput?.addEventListener('keydown', (event) => {
            const suggestions = [...searchSuggest.querySelectorAll('.suggest-item')];
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (suggestions.length === 0) return;
                event.preventDefault();
                suggestionIndex = (suggestionIndex + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
                suggestions.forEach((item, index) => item.classList.toggle('active', index === suggestionIndex));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                const selected = suggestions[suggestionIndex];
                if (selected) openWatch(selected.dataset.id);
                else renderSuggestions();
                searchSuggest.hidden = true;
            } else if (event.key === 'Escape') searchSuggest.hidden = true;
        });
        $('searchBtn')?.addEventListener('click', () => {
            renderSuggestions();
            searchSuggest.hidden = true;
            searchInput?.focus();
        });
        searchSuggest?.addEventListener('click', (event) => {
            const item = event.target.closest('.suggest-item');
            if (item) {
                searchSuggest.hidden = true;
                openWatch(item.dataset.id);
            }
        });
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.search-wrap')) searchSuggest.hidden = true;
        });

        document.querySelectorAll('.chip, .nav-item').forEach((item) => item.addEventListener('click', (event) => {
            event.preventDefault();
            setFilter(item.dataset.filter);
        }));
        $('tagCloud')?.addEventListener('click', (event) => {
            const item = event.target.closest('.tag-pill');
            if (item) setFilter(item.dataset.filter);
        });
        document.querySelectorAll('.sort-btn').forEach((button) => button.addEventListener('click', () => {
            state.sort = button.dataset.sort;
            renderGrid();
        }));
        durationFilter?.addEventListener('change', () => {
            state.duration = durationFilter.value;
            renderGrid();
        });
        videoGrid?.addEventListener('click', (event) => {
            const card = event.target.closest('[data-id]');
            if (card) openWatch(card.dataset.id);
        });
        $('historyTrack')?.addEventListener('click', (event) => {
            const item = event.target.closest('[data-id]');
            if (item) openWatch(item.dataset.id);
        });
        $('clearHistoryBtn')?.addEventListener('click', () => {
            try { localStorage.removeItem(userKey('History')); } catch (error) { console.warn('Unable to clear watch history.', error); }
            renderHistory();
        });

        $('menuToggleBtn')?.addEventListener('click', () => {
            const isOpen = $('sidebarNav').classList.toggle('open');
            $('sidebarBackdrop').classList.toggle('open', isOpen);
            $('menuToggleBtn').setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });
        $('sidebarBackdrop')?.addEventListener('click', closeSidebar);
        $('videoGrid')?.addEventListener('keydown', (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && event.target.classList.contains('video-card')) {
                event.preventDefault();
                openWatch(event.target.dataset.id);
            }
        });

        $('closeModal')?.addEventListener('click', closeWatch);
        videoModal?.addEventListener('click', (event) => { if (event.target === videoModal) closeWatch(); });
        watchPlayer?.addEventListener('error', () => { playerFallback.hidden = false; });
        watchPlayer?.addEventListener('timeupdate', () => {
            if (!currentWatchId || watchPlayer.currentTime < 1) return;
            progress[currentWatchId] = Math.floor(watchPlayer.currentTime);
            writeJSON(userKey('Progress'), progress);
        });
        $('likeBtn')?.addEventListener('click', () => {
            const video = getVideo(currentWatchId);
            if (video) saveRating(video, 'up');
        });
        $('dislikeBtn')?.addEventListener('click', () => {
            const video = getVideo(currentWatchId);
            if (video) saveRating(video, 'down');
        });
        $('favoriteBtn')?.addEventListener('click', () => {
            const video = getVideo(currentWatchId);
            if (video) addFavorite(video);
        });
        commentList?.addEventListener('click', (event) => {
            const reply = event.target.closest('.comment-reply-trigger');
            if (reply) {
                const form = reply.closest('.comment-item').querySelector('.reply-form');
                form.hidden = !form.hidden;
            }
        });
        commentList?.addEventListener('submit', (event) => {
            const form = event.target.closest('.reply-form');
            if (form) {
                event.preventDefault();
                submitComment(form, form.dataset.parentId);
            }
        });
        $('commentForm')?.addEventListener('submit', (event) => {
            event.preventDefault();
            submitComment(event.currentTarget);
        });

        $('loginBtn')?.addEventListener('click', () => openModal(authModal));
        $('closeAuthModal')?.addEventListener('click', () => closeModal(authModal));
        authModal?.addEventListener('click', (event) => { if (event.target === authModal) closeModal(authModal); });
        document.querySelectorAll('.auth-tab').forEach((button) => button.addEventListener('click', () => switchAuthTab(button.dataset.tab)));
        $('switchToSignupLink')?.addEventListener('click', (event) => { event.preventDefault(); switchAuthTab('signup'); });
        $('loginFormEl')?.addEventListener('submit', (event) => {
            event.preventDefault();
            setFormError('loginEmail', '');
            setFormError('loginPassword', '');
            if (!event.currentTarget.reportValidity()) return;
            submitAuth(event.currentTarget, 'login');
        });
        $('signupFormEl')?.addEventListener('submit', (event) => {
            event.preventDefault();
            const password = $('signupPassword').value;
            setFormError('signupConfirm', $('signupConfirm').value === password ? '' : 'Passwords do not match.');
            if (!event.currentTarget.reportValidity() || $('signupConfirm').value !== password) return;
            submitAuth(event.currentTarget, 'signup');
        });
        $('profilePic')?.addEventListener('click', () => {
            const menu = $('dropdownMenu');
            menu.hidden = !menu.hidden;
        });
        $('favoritesLink')?.addEventListener('click', (event) => {
            event.preventDefault();
            state.favoritesOnly = true;
            state.query = '';
            searchInput.value = '';
            $('dropdownMenu').hidden = true;
            renderGrid();
        });
        $('historyLink')?.addEventListener('click', (event) => {
            event.preventDefault();
            $('dropdownMenu').hidden = true;
            state.filter = 'all';
            state.favoritesOnly = false;
            state.query = '';
            searchInput.value = '';
            renderGrid();
            $('historyRow').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
        });
        $('profileLink')?.addEventListener('click', (event) => {
            event.preventDefault();
            $('dropdownMenu').hidden = true;
            showToast(currentUser?.email || '', 'info');
        });
        $('logoutLink')?.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                if (window.supabaseClient) await window.supabaseLogout();
                await setCurrentUser(null);
                showToast('Signed out.', 'success');
            } catch (error) {
                showToast(error.message || 'Could not sign out.', 'error');
            }
        });

        $('ageGateAcceptBtn')?.addEventListener('click', () => {
            writeLocalValue('adultVerified', 'true');
            closeModal(ageGateModal);
            renderTagCloud();
            renderGrid();
        });
        $('ageGateRejectBtn')?.addEventListener('click', () => window.location.replace('about:blank'));
        if (readLocalValue('adultVerified') !== 'true') openModal(ageGateModal);

        $('secretLogoTrigger')?.addEventListener('click', () => {
            const logo = $('secretLogoTrigger');
            const now = Date.now();
            const previous = Number(logo.dataset.lastClick) || 0;
            const count = now - previous > 1500 ? 1 : (Number(logo.dataset.clickCount) || 0) + 1;
            logo.dataset.clickCount = String(count);
            logo.dataset.lastClick = String(now);
            if (count >= 5) {
                logo.dataset.clickCount = '0';
                $('adminLoginSection').hidden = false;
                $('adminDashboardSection').hidden = true;
                openModal(adminModal);
            }
        });
        $('closeAdminModal')?.addEventListener('click', () => closeModal(adminModal));
        adminModal?.addEventListener('click', (event) => { if (event.target === adminModal) closeModal(adminModal); });
        $('adminLoginForm')?.addEventListener('submit', (event) => {
            event.preventDefault();
            if (event.currentTarget.reportValidity()) verifyCreator($('adminEmail').value.trim(), $('adminPassword').value);
        });
        $('adminLogoutBtn')?.addEventListener('click', async () => {
            try {
                await window.supabaseLogout();
                await setCurrentUser(null);
                $('adminLoginSection').hidden = false;
                $('adminDashboardSection').hidden = true;
                closeModal(adminModal);
            } catch (error) {
                showToast(error.message || 'Could not lock Creator Studio.', 'error');
            }
        });
        $('uploadForm')?.addEventListener('submit', publishVideo);

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (videoModal?.classList.contains('open')) closeWatch();
            closeModal(authModal);
            closeModal(adminModal);
            searchSuggest.hidden = true;
            closeSidebar();
        });
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.user-dropdown')) $('dropdownMenu').hidden = true;
        });
        window.addEventListener('supabase:authenticated', (event) => {
            const user = event.detail;
            setCurrentUser(user);
        });
        window.addEventListener('supabase:loggedOut', () => setCurrentUser(null));
    }

    wireEvents();
    await loadVideos();
    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient.auth.getSession();
            if (error) throw error;
            const user = data.session?.user;
            currentUser = user ? {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
            } : null;
        } catch (error) {
            console.warn('Could not restore the Supabase session.', error);
        }
    }
    await loadUserData().catch((error) => {
        console.warn('Could not load account data; using locally saved preferences.', error);
    });
    updateAuthUI();
    renderTagCloud();
    renderGrid();
});
