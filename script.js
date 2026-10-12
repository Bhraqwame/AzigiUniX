document.addEventListener('DOMContentLoaded', async () => {

    // ==========================================================
    // 1. DATA MODEL
    // ==========================================================
    const SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';
    const seedThumb = (s) => `https://picsum.photos/seed/${s}/320/180`;

    let VIDEOS = [];
    
    async function loadSupabaseVideos() {
        try {
            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) {
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
                        src: v.video_url,
                        comments: v.comments || []
                    }));
                    return true;
                }
            }
        } catch (error) {
            console.log('Failed to load videos from database:', error);
        }
        return false;
    }
    await loadSupabaseVideos();

    // ==========================================================
    // DB HELPERS FOR USER DATA
    // ==========================================================
    async function loadUserFavorites(userId) {
        try {
            if (!window.supabaseClient || !userId) return [];
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
            if (!window.supabaseClient || !userId) return {};
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

    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const modalVideoTitle = document.getElementById('modalVideoTitle');
    const modalVideoMeta = document.getElementById('modalVideoMeta');
    const watchPlayer = document.getElementById('watchPlayer');
    const playerFallback = document.getElementById('playerFallback');
    const watchLive = document.getElementById('watchLive');
    const qualitySelect = document.getElementById('qualitySelect');
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
    let currentUser = null;

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
        try {
            if (!window.supabaseClient || !userId) return null;
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) throw error;
            return data;
        } catch (e) {
            return null;
        }
    }
    
    async function reloadUserData() {
        if (currentUser) {
            userFavorites = await loadUserFavorites(currentUser.id);
            userRatings = await loadUserRatings(currentUser.id);
            userProfile = await loadUserProfile(currentUser.id);
        } else {
            userFavorites = [];
            userRatings = {};
            userProfile = null;
        }
    }

    function setCurrentUser(user) {
        currentUser = user;
        if (user) {
            localStorage.setItem('azigiCurrentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('azigiCurrentUser');
        }
        reloadUserData().then(() => {
            updateAuthUI();
            renderGrid();
            renderHistory();
        });
        updateAuthUI();
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
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggleBtn.textContent = '☀️ Mode';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeToggleBtn.textContent = '☀️ Mode';
            localStorage.setItem('theme', 'light');
        } else {
            themeToggleBtn.textContent = '🌙 Mode';
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================================
    // 6. FILTERING / SORTING PIPELINE & AUTH UI FIX
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

    // FIXED AUTH UI FUNCTION: Ensures avatar and dropdown are completely hidden when logged out
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
    // 7. HOVER PREVIEW THUMBNAILS
    // ==========================================================
    function attachPreview(card, video) {
        if (reducedMotion) return;
        const img = card.querySelector('img');
        const frames = [
            video.thumb,
            `https://picsum.photos/seed/${video.id}-p1/320/180`,
            `https://picsum.photos/seed/${video.id}-p2/320/180`,
            `https://picsum.photos/seed/${video.id}-p3/320/180`
        ];
        let timer = null;
        let frame = 0;

        card.addEventListener('mouseenter', () => {
            if (timer) return;
            card.classList.add('previewing');
            timer = setInterval(() => {
                frame = (frame + 1) % frames.length;
                img.src = frames[frame];
            }, 700);
        });

        card.addEventListener('mouseleave', () => {
            if (timer) clearInterval(timer);
            timer = null;
            frame = 0;
            img.src = video.thumb;
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
        updateActiveTabVisualState(filterValue);
        renderGrid();
        closeSidebar();
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
            closeSidebar();
        });
    });

    document.querySelectorAll('.footer-link[data-filter]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigationAttempt(link, link.getAttribute('data-filter'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    tagCloud.addEventListener('click', (e) => {
        const pill = e.target.closest('.tag-pill');
        if (!pill) return;
        handleNavigationAttempt(pill, pill.getAttribute('data-filter'));
        closeSidebar();
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
            authModal.classList.add('open');
            return;
        }
        const all = getRatings();
        const r = all[v.id] || { up: 0, down: 0, mine: null };
        if (r.mine === dir) {
            if (dir === 'up') r.up -= 1;
            else r.down -= 1;
            r.mine = null;
            try {
                if (window.supabaseClient) {
                    await window.supabaseClient.from('ratings').delete().eq('user_id', currentUser.id).eq('video_id', v.id);
                }
            } catch (e) {}
        } else {
            if (r.mine === 'up') r.up -= 1;
            if (r.mine === 'down') r.down -= 1;
            if (dir === 'up') r.up += 1;
            else r.down += 1;
            r.mine = dir;
            try {
                if (window.supabaseClient) {
                    await window.supabaseClient.from('ratings').upsert({ user_id: currentUser.id, video_id: v.id, rating: dir, updated_at: new Date().toISOString() }, { onConflict: 'user_id,video_id' });
                }
            } catch (e) {}
        }
        all[v.id] = r;
        userRatings = all;
        writeJSON(getUserKey('Ratings'), all);
        renderRatings(v);
    }

    if (likeBtn && dislikeBtn) {
        likeBtn.addEventListener('click', async () => await toggleRating('up'));
        dislikeBtn.addEventListener('click', async () => await toggleRating('down'));
    }

    async function loadCommentsForVideo(videoId) {
        try {
            if (!window.supabaseClient) return [];
            const { data, error } = await window.supabaseClient
                .from('comments')
                .select('*')
                .eq('video_id', videoId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            return (data || []).map(c => ({
                id: c.id,
                author: c.author_name || c.user_id,
                email: c.author_name,
                time: new Date(c.created_at).toLocaleString(),
                text: c.comment_text
            }));
        } catch (e) {
            return [];
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
            authModal.classList.add('open');
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
        if (isFavorite(video.id)) {
            favBtn.classList.add('active');
            favBtn.textContent = '🖤 Favorited';
        } else {
            favBtn.classList.remove('active');
            favBtn.textContent = '❤️ Favorite';
        }
    }

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();
            const v = byId(currentWatchId);
            if (!text || !v) return;
            if (!currentUser) {
                showToast('Please login to comment', 'warning');
                authModal.classList.add('open');
                return;
            }
            try {
                if (window.supabaseClient) {
                    await window.supabaseClient.from('comments').insert({
                        user_id: currentUser.id,
                        video_id: v.id,
                        comment_text: text,
                        author_name: currentUser.email
                    });
                }
            } catch (err) {}
            commentInput.value = '';
            await renderComments(v);
            showToast('Comment posted!', 'success');
        });
    }

    if (document.getElementById('favoriteBtn')) {
        document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
    }

    function renderRelated(video) {
        const scored = VIDEOS
            .filter((x) => x.id !== video.id && isVideoAllowed(x))
            .map((x) => ({
                x,
                score: (x.category === video.category ? 2 : 0) +
                    x.tags.filter((t) => video.tags.includes(t)).length
            }));
        let list = scored.filter((e) => e.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((e) => e.x);
        if (list.length === 0) list = scored.slice(0, 5).map((e) => e.x);
        relatedList.innerHTML = list.map((x) => `
            <div class="related-item" data-id="${x.id}">
                <div class="related-thumb"><img src="${x.thumb}" alt=""><span class="related-dur">${x.live ? 'LIVE' : formatDuration(x.durationSec)}</span></div>
                <div><p class="related-title">${escapeHtml(x.title)}</p><p class="related-meta">${escapeHtml(x.channel)}</p></div>
            </div>`).join('');
    }

    relatedList.addEventListener('click', (e) => {
        const item = e.target.closest('.related-item');
        if (!item) return;
        openWatch(item.getAttribute('data-id'));
    });

    async function openWatch(id) {
        const v = byId(id);
        if (!v || !isVideoAllowed(v)) return;
        currentWatchId = id;
        if (currentUser && window.supabaseClient) {
            try {
                await window.supabaseClient
                    .from('watch_history')
                    .upsert({ user_id: currentUser.id, video_id: id, watched_at: new Date().toISOString() }, { onConflict: 'user_id,video_id' });
            } catch (e) {}
        } else {
            const h = readJSON(getUserKey('History'), []).filter(x => x !== id);
            h.unshift(id);
            writeJSON(getUserKey('History'), h.slice(0, 12));
        }

        modalVideoTitle.textContent = v.title;
        modalVideoMeta.textContent = `${v.channel} • ${v.viewsText} • ${v.ageText}`;
        watchViews.textContent = v.viewsText;
        watchLive.hidden = !v.live;

        playerFallback.hidden = true;
        if (watchPlayer) {
            watchPlayer.poster = v.thumb;
            watchPlayer.src = v.src;
        }

        renderRatings(v);
        await renderComments(v);
        renderFavoriteBtn(v);
        renderRelated(v);
        renderHistory();
        hideSuggest();

        videoModal.classList.add('open');
    }

    if (watchPlayer) {
        watchPlayer.addEventListener('error', () => { playerFallback.hidden = false; });
    }

    if (qualitySelect) {
        qualitySelect.addEventListener('change', () => {
            watchPlayer.dataset.quality = qualitySelect.value;
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => { videoModal.classList.remove('open'); });
    }

    window.addEventListener('click', (e) => {
        if (e.target === videoModal) videoModal.classList.remove('open');
    });

    // ==========================================================
    // 14. HISTORY SHELF
    // ==========================================================
    historyTrack.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (!item) return;
        openWatch(item.getAttribute('data-id'));
    });

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', async () => {
            if (currentUser && window.supabaseClient) {
                try {
                    await window.supabaseClient.from('watch_history').delete().eq('user_id', currentUser.id);
                } catch (e) {}
            }
            writeJSON(getUserKey('History'), []);
            await renderHistory();
        });
    }

    // ==========================================================
    // 15. MOBILE DRAWER & ESCAPE
    // ==========================================================
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebarEl = document.querySelector('.sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    function closeSidebar() {
        if (!sidebarEl) return;
        sidebarEl.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
        if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    if (menuToggleBtn && sidebarEl && sidebarBackdrop) {
        menuToggleBtn.addEventListener('click', () => {
            const isOpen = !sidebarEl.classList.contains('open');
            sidebarEl.classList.toggle('open', isOpen);
            sidebarBackdrop.classList.toggle('open', isOpen);
            menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        sidebarBackdrop.addEventListener('click', closeSidebar);
        window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!searchSuggest.hidden) { hideSuggest(); return; }
        if (videoModal.classList.contains('open')) { videoModal.classList.remove('open'); return; }
        if (authModal && authModal.classList.contains('open')) { authModal.classList.remove('open'); return; }
        const adminModal = document.getElementById('adminModal');
        if (adminModal && adminModal.classList.contains('open')) { adminModal.classList.remove('open'); return; }
        closeSidebar();
    });

    // ==========================================================
    // 16. AUTHENTICATION & USER MENU MODALS
    // ==========================================================
    const loginBtn = document.getElementById('loginBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginFormEl = document.getElementById('loginFormEl');
    const signupFormEl = document.getElementById('signupFormEl');
    const profilePic = document.getElementById('profilePic');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutLink = document.getElementById('logoutLink');
    const favoritesLink = document.getElementById('favoritesLink');
    const historyLink = document.getElementById('historyLink');

    if (loginBtn && authModal) {
        loginBtn.addEventListener('click', () => { authModal.classList.add('open'); });
    }

    if (closeAuthModal && authModal) {
        closeAuthModal.addEventListener('click', () => { authModal.classList.remove('open'); });
    }

    if (authModal) {
        window.addEventListener('click', (e) => {
            if (e.target === authModal) authModal.classList.remove('open');
        });
    }

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.tab === 'login') {
                loginForm.hidden = false;
                signupForm.hidden = true;
            } else {
                loginForm.hidden = true;
                signupForm.hidden = false;
            }
        });
    });

    const switchToSignupLink = document.getElementById('switchToSignupLink');
    if (switchToSignupLink) {
        switchToSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'signup'));
            loginForm.hidden = true;
            signupForm.hidden = false;
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    if (loginFormEl) {
        loginFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            let valid = true;
            const emailError = document.getElementById('loginEmailError');
            const passError = document.getElementById('loginPasswordError');
            if (emailError) emailError.textContent = '';
            if (passError) passError.textContent = '';

            if (!email || !validateEmail(email)) {
                if (emailError) emailError.textContent = 'Valid email required';
                valid = false;
            }
            if (!password || password.length < 6) {
                if (passError) passError.textContent = 'Password must be at least 6 characters';
                valid = false;
            }
            if (!valid) return;

            const loginSubmitBtn = document.getElementById('loginSubmitBtn');
            if (loginSubmitBtn) {
                loginSubmitBtn.disabled = true;
                loginSubmitBtn.textContent = 'Signing in...';
            }

            if (window.supabaseClient && window.supabaseClient.auth) {
                window.supabaseClient.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
                    if (loginSubmitBtn) {
                        loginSubmitBtn.disabled = false;
                        loginSubmitBtn.textContent = 'Sign In';
                    }
                    if (error) {
                        showToast('Invalid email or password', 'error');
                        return;
                    }
                    if (data.user) {
                        setCurrentUser({
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.user_metadata?.full_name || data.user.email.split('@')[0]
                        });
                        authModal.classList.remove('open');
                        loginFormEl.reset();
                        showToast('Signed in successfully!', 'success');
                    }
                }).catch(() => {
                    if (loginSubmitBtn) {
                        loginSubmitBtn.disabled = false;
                        loginSubmitBtn.textContent = 'Sign In';
                    }
                    showToast('Authentication failed', 'error');
                });
            } else {
                if (loginSubmitBtn) {
                    loginSubmitBtn.disabled = false;
                    loginSubmitBtn.textContent = 'Sign In';
                }
                showToast('Authentication service unavailable', 'error');
            }
        });
    }

    if (signupFormEl) {
        signupFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirm').value;
            let valid = true;
            const emailError = document.getElementById('signupEmailError');
            const passError = document.getElementById('signupPasswordError');
            const confirmError = document.getElementById('signupConfirmError');
            if (emailError) emailError.textContent = '';
            if (passError) passError.textContent = '';
            if (confirmError) confirmError.textContent = '';

            if (!email || !validateEmail(email)) {
                if (emailError) emailError.textContent = 'Valid email required';
                valid = false;
            }
            if (!password || password.length < 6) {
                if (passError) passError.textContent = 'Password must be at least 6 characters';
                valid = false;
            }
            if (password !== confirm) {
                if (confirmError) confirmError.textContent = 'Passwords do not match';
                valid = false;
            }
            if (!valid) return;

            if (window.supabaseClient && window.supabaseClient.auth) {
                window.supabaseClient.auth.signUp({ email, password }).then(({ data, error }) => {
                    if (error) {
                        showToast(error.message || 'Registration failed', 'error');
                        return;
                    }
                    if (data.user) {
                        setCurrentUser({
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.user_metadata?.full_name || data.user.email.split('@')[0]
                        });
                        authModal.classList.remove('open');
                        signupFormEl.reset();
                        showToast('Account registered successfully!', 'success');
                    }
                }).catch(() => {
                    showToast('Registration failed', 'error');
                });
            } else {
                showToast('Authentication service unavailable', 'error');
            }
        });
    }

    if (profilePic && dropdownMenu) {
        profilePic.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.hidden = !dropdownMenu.hidden;
        });
        document.addEventListener('click', () => {
            dropdownMenu.hidden = true;
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                if (window.supabaseClient && window.supabaseClient.auth) {
                    await window.supabaseClient.auth.signOut();
                }
            } catch (err) {}
            
            setCurrentUser(null);
            if (dropdownMenu) dropdownMenu.hidden = true;
            state.favoritesOnly = false;
            state.filter = 'all';
            state.query = '';
            if (searchInput) searchInput.value = '';
            updateActiveTabVisualState('all');

            await renderGrid();
            showToast('Logged out successfully', 'info');
        });
    }

    if (favoritesLink) {
        favoritesLink.addEventListener('click', (e) => {
            e.preventDefault();
            state.favoritesOnly = true;
            state.filter = 'all';
            state.query = '';
            searchInput.value = '';
            hideSuggest();
            updateActiveTabVisualState('all');
            if (dropdownMenu) dropdownMenu.hidden = true;
            renderGrid();
        });
    }

    if (historyLink) {
        historyLink.addEventListener('click', (e) => {
            e.preventDefault();
            setFilter('all');
            if (dropdownMenu) dropdownMenu.hidden = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Admin Modal Logic
    const adminModal = document.getElementById('adminModal');
    const closeAdminModal = document.getElementById('closeAdminModal');
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminDashboardSection = document.getElementById('adminDashboardSection');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const floatAdminBtn = document.getElementById('floatAdminBtn');

    function openAdminModal() {
        if (!adminModal) return;
        adminModal.classList.add('open');
        if (adminLoginSection) adminLoginSection.hidden = false;
        if (adminDashboardSection) adminDashboardSection.hidden = true;
        if (adminLoginForm) adminLoginForm.reset();
    }

    if (closeAdminModal && adminModal) {
        closeAdminModal.addEventListener('click', () => { adminModal.classList.remove('open'); });
    }

    if (adminModal) {
        window.addEventListener('click', (e) => {
            if (e.target === adminModal) adminModal.classList.remove('open');
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;
            if ((email === 'admin@zigiunix.com' && password === 'admin123') || (email === 'gabby@azigiuni.com' && password === 'Gabby123')) {
                if (adminLoginSection) adminLoginSection.hidden = true;
                if (adminDashboardSection) adminDashboardSection.hidden = false;
                showToast('Admin access granted', 'success');
            } else {
                showToast('Invalid admin credentials', 'error');
            }
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            if (adminLoginSection) adminLoginSection.hidden = false;
            if (adminDashboardSection) adminDashboardSection.hidden = true;
            if (adminModal) adminModal.classList.remove('open');
            if (adminLoginForm) adminLoginForm.reset();
        });
    }

    if (floatAdminBtn) {
        floatAdminBtn.addEventListener('click', () => { openAdminModal(); });
    }

    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminModal();
        });
    }

    // Upload Form
    const uploadForm = document.getElementById('uploadForm');
    const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const uploadStatus = document.getElementById('uploadStatus');

    function showUploadProgress(pct, statusText) {
        uploadProgress.hidden = false;
        progressFill.style.width = pct + '%';
        if (statusText) uploadStatus.textContent = statusText;
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('uploadTitle').value.trim();
            const channel = document.getElementById('uploadChannel').value.trim();
            const category = document.getElementById('uploadCategory').value;
            const durationSec = parseInt(document.getElementById('uploadDuration').value, 10) || 0;
            const tagsRaw = document.getElementById('uploadTags').value.trim();
            const thumbUrl = document.getElementById('uploadThumbUrl').value.trim();
            const videoUrl = document.getElementById('uploadVideoUrl').value.trim();

            if (!title || !channel || !videoUrl) {
                uploadStatus.textContent = 'Please fill in required fields.';
                uploadStatus.classList.add('error-text');
                showUploadProgress(0, uploadStatus.textContent);
                return;
            }

            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

            uploadSubmitBtn.disabled = true;
            uploadSubmitBtn.textContent = 'Publishing...';
            showUploadProgress(30, 'Saving video...');

            try {
                const videoId = 'v' + Date.now().toString();
                const payload = {
                    id: videoId,
                    title,
                    channel,
                    category,
                    tags,
                    duration_sec: durationSec,
                    thumb_url: thumbUrl || `https://picsum.photos/seed/${videoId}/320/180`,
                    video_url: videoUrl,
                    live: false,
                    views_text: '0 views',
                    age_text: 'just now',
                    days_ago: 0,
                    likes: 0,
                    dislikes: 0,
                    comments: [],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                const { data, error } = await window.supabaseClient
                    .from('videos')
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;

                showUploadProgress(100, 'Success!');
                showToast('Video published successfully', 'success');

                VIDEOS.unshift({
                    id: data.id,
                    title: data.title,
                    channel: data.channel,
                    category: data.category,
                    tags: Array.isArray(data.tags) ? data.tags : [],
                    durationSec: data.duration_sec || 0,
                    live: data.live || false,
                    viewsText: data.views_text || '0 views',
                    ageText: data.age_text || 'just now',
                    daysAgo: data.days_ago || 0,
                    likes: data.likes || 0,
                    dislikes: data.dislikes || 0,
                    thumb: data.thumb_url,
                    src: data.video_url,
                    comments: []
                });

                setTimeout(() => {
                    uploadForm.reset();
                    uploadProgress.hidden = true;
                    uploadSubmitBtn.disabled = false;
                    uploadSubmitBtn.textContent = 'Publish Video';
                    if (adminModal) adminModal.classList.remove('open');
                    renderGrid();
                }, 500);

            } catch (err) {
                uploadStatus.textContent = 'Upload failed: ' + (err?.message || 'error');
                uploadSubmitBtn.disabled = false;
                uploadSubmitBtn.textContent = 'Publish Video';
            }
        });
    }

    // Initialize session state on load
    currentUser = getCurrentUser();
    await reloadUserData();

    if (typeof window !== 'undefined' && window.supabaseClient && window.supabaseClient.auth) {
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setCurrentUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
                });
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
            }
        });
        
        window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setCurrentUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
                });
            }
        }).catch(() => {});
    }

    updateAuthUI();
    renderTagCloud();
    await renderGrid();
});