document.addEventListener('DOMContentLoaded', async () => {
    // Load videos from API
    let VIDEOS = [];
    
    async function loadVideos() {
        try {
            const response = await fetch('/api/videos');
            if (response.ok) {
                VIDEOS = await response.json();
            } else {
                console.error('Failed to load videos from API');
                VIDEOS = [];
            }
        } catch (error) {
            console.error('Error loading videos:', error);
            VIDEOS = [];
        }
    }
    
    await loadVideos();
    
    // Rest of your existing code here - all the functions that use VIDEOS
    // ... (copy all the code from script.js but VIDEOS is loaded async)
});