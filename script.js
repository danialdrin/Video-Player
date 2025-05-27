// Advanced Video Player JavaScript
class AdvancedVideoPlayer {
    constructor() {
        this.video = document.getElementById('video');
        this.currentVideoIndex = 0;
        this.playlist = [];
        this.isFullscreen = false;
        this.isDragging = false;

        // Initialize player
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.loadStoredVideos();
        this.setupTheme();
        this.updatePlayButton(); // Set initial paused state
    }

    setupElements() {
        // Video controls
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.skipBackBtn = document.getElementById('skip-back-btn');
        this.skipForwardBtn = document.getElementById('skip-forward-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.speedSelect = document.getElementById('speed-select');
        this.qualitySelect = document.getElementById('quality-select');
        this.pipBtn = document.getElementById('pip-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');

        // Progress elements
        this.progressBar = document.getElementById('progress-bar');
        this.progressFilled = document.getElementById('progress-filled');
        this.progressHandle = document.getElementById('progress-handle');
        this.currentTimeSpan = document.getElementById('current-time');
        this.durationSpan = document.getElementById('duration');

        // Video info elements
        this.videoTitle = document.getElementById('video-title');
        this.videoDuration = document.getElementById('video-duration');
        this.videoSize = document.getElementById('video-size');
        this.videoFormat = document.getElementById('video-format');

        // Loading spinner
        this.loadingSpinner = document.getElementById('loading-spinner');

        // Theme toggle
        this.themeToggle = document.getElementById('theme-toggle');

        // Custom controls
        this.customControls = document.getElementById('custom-controls');
    }

    setupEventListeners() {
        // Video events
        this.video.addEventListener('loadstart', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());
        this.video.addEventListener('loadedmetadata', () => this.updateVideoInfo());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('ended', () => this.onVideoEnded());
        this.video.addEventListener('play', () => this.updatePlayButton());
        this.video.addEventListener('pause', () => this.updatePlayButton());
        this.video.addEventListener('volumechange', () => this.updateVolumeButton());
        this.video.addEventListener('click', () => this.togglePlayPause());

        // Control button events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.stopBtn.addEventListener('click', () => this.stopVideo());
        this.skipBackBtn.addEventListener('click', () => this.skipTime(-10));
        this.skipForwardBtn.addEventListener('click', () => this.skipTime(10));
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.speedSelect.addEventListener('change', (e) => this.setPlaybackSpeed(e.target.value));
        this.pipBtn.addEventListener('click', () => this.togglePictureInPicture());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Progress bar events
        this.progressBar.addEventListener('click', (e) => this.seekToPosition(e));
        this.progressBar.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.handleDragging(e));
        document.addEventListener('mouseup', () => this.stopDragging());

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.skipTime(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.skipTime(10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.adjustVolume(0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.adjustVolume(-0.1);
                    break;
                case 'KeyM':
                    this.toggleMute();
                    break;
                case 'KeyF':
                    this.toggleFullscreen();
                    break;
                case 'KeyP':
                    this.togglePictureInPicture();
                    break;
                case 'Escape':
                    if (this.isFullscreen) {
                        this.exitFullscreen();
                    }
                    break;
            }
        });
    }

    // Video control methods
    togglePlayPause() {
        if (this.video.paused) {
            this.video.play().catch(e => console.error('Error playing video:', e));
        } else {
            this.video.pause();
        }
    }

    stopVideo() {
        this.video.pause();
        this.video.currentTime = 0;
    }

    skipTime(seconds) {
        this.video.currentTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + seconds));
    }

    setVolume(value) {
        this.video.volume = value / 100;
        this.updateVolumeButton();
    }

    adjustVolume(delta) {
        const newVolume = Math.max(0, Math.min(1, this.video.volume + delta));
        this.video.volume = newVolume;
        this.volumeSlider.value = newVolume * 100;
        this.updateVolumeButton();
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.updateVolumeButton();
    }

    setPlaybackSpeed(speed) {
        this.video.playbackRate = parseFloat(speed);
    }

    // Progress bar methods
    updateProgress() {
        if (this.video.duration && !this.isDragging) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressFilled.style.width = `${progress}%`;
            this.progressHandle.style.left = `${progress}%`;
        }

        this.currentTimeSpan.textContent = this.formatTime(this.video.currentTime);
        this.durationSpan.textContent = this.formatTime(this.video.duration || 0);
    }

    seekToPosition(e) {
        if (!this.video.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }

    startDragging(e) {
        this.isDragging = true;
        this.seekToPosition(e);
    }

    handleDragging(e) {
        if (this.isDragging) {
            this.seekToPosition(e);
        }
    }

    stopDragging() {
        this.isDragging = false;
    }

    // UI update methods
    updatePlayButton() {
        const icon = this.playPauseBtn.querySelector('i');
        const videoContainer = this.video.closest('.video-container');

        if (this.video.paused) {
            icon.className = 'fas fa-play';
            videoContainer.classList.add('paused');
        } else {
            icon.className = 'fas fa-pause';
            videoContainer.classList.remove('paused');
        }
    }

    updateVolumeButton() {
        const icon = this.volumeBtn.querySelector('i');
        if (this.video.muted || this.video.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.video.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    updateVideoInfo() {
        if (this.video.src) {
            // Try to get video data from playlist first
            const videoData = this.playlist.find(v => v.url === this.video.src);

            if (videoData) {
                this.videoTitle.textContent = videoData.name;
                this.videoDuration.textContent = `Duration: ${this.formatTime(this.video.duration || videoData.duration || 0)}`;
                this.videoSize.textContent = `Size: ${this.formatFileSize(videoData.size || 0)}`;
                this.videoFormat.textContent = `Format: ${videoData.type || 'Unknown'}`;
            } else {
                // Fallback to filename
                const fileName = this.video.src.split('/').pop().split('?')[0];
                this.videoTitle.textContent = fileName || 'Unknown Video';
                this.videoDuration.textContent = `Duration: ${this.formatTime(this.video.duration || 0)}`;
                this.videoSize.textContent = 'Size: --';
                this.videoFormat.textContent = 'Format: --';
            }
        }
    }

    showLoading() {
        this.loadingSpinner.classList.add('show');
    }

    hideLoading() {
        this.loadingSpinner.classList.remove('show');
    }

    // Fullscreen methods
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        const container = this.video.closest('.video-container');
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    handleFullscreenChange() {
        this.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        const icon = this.fullscreenBtn.querySelector('i');
        if (this.isFullscreen) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }

    // Picture in Picture
    async togglePictureInPicture() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await this.video.requestPictureInPicture();
            }
        } catch (error) {
            console.error('Picture in Picture error:', error);
        }
    }

    // Theme methods
    setupTheme() {
        const savedTheme = localStorage.getItem('videoPlayerTheme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('videoPlayerTheme', theme);

        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // Video management methods
    loadVideo(videoData) {
        this.video.src = videoData.url;
        this.video.load();
        this.updateVideoInfo();

        // Update active state in playlist
        document.querySelectorAll('.video-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`[data-video-id="${videoData.id}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    loadTopVideo() {
        if (this.playlist.length > 0) {
            this.currentVideoIndex = 0;
            this.loadVideo(this.playlist[0]);
        }
    }

    clearVideoPlayer() {
        this.video.src = '';
        this.video.load();
        this.videoTitle.textContent = 'Select a video to play';
        this.videoDuration.textContent = 'Duration: --:--';
        this.videoSize.textContent = 'Size: --';
        this.videoFormat.textContent = 'Format: --';
        this.currentVideoIndex = 0;

        // Remove active state from all items
        document.querySelectorAll('.video-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    onVideoEnded() {
        // Auto-play next video if available
        const nextIndex = this.currentVideoIndex + 1;
        if (nextIndex < this.playlist.length) {
            this.currentVideoIndex = nextIndex;
            this.loadVideo(this.playlist[nextIndex]);
            this.video.play();
        }
    }

    // Storage methods
    loadStoredVideos() {
        const stored = localStorage.getItem('videoPlayerPlaylist');
        if (stored) {
            this.playlist = JSON.parse(stored);
            this.renderPlaylist();

            // Auto-load the first video if playlist exists
            if (this.playlist.length > 0) {
                this.loadTopVideo();
            }
        }
    }

    savePlaylist() {
        localStorage.setItem('videoPlayerPlaylist', JSON.stringify(this.playlist));
    }

    addVideoToPlaylist(videoData) {
        this.playlist.push(videoData);
        this.savePlaylist();
        this.renderPlaylist();
    }

    removeVideoFromPlaylist(videoId) {
        this.playlist = this.playlist.filter(video => video.id !== videoId);
        this.savePlaylist();
        this.renderPlaylist();

        // If removed video was currently playing, stop it
        const currentVideo = this.playlist[this.currentVideoIndex];
        if (!currentVideo || currentVideo.id === videoId) {
            this.video.src = '';
            this.videoTitle.textContent = 'Select a video to play';
            this.videoDuration.textContent = 'Duration: --:--';
            this.videoSize.textContent = 'Size: --';
            this.videoFormat.textContent = 'Format: --';
        }
    }

    clearPlaylist() {
        this.playlist = [];
        this.savePlaylist();
        this.renderPlaylist();
        this.video.src = '';
        this.videoTitle.textContent = 'Select a video to play';
        this.videoDuration.textContent = 'Duration: --:--';
        this.videoSize.textContent = 'Size: --';
        this.videoFormat.textContent = 'Format: --';
    }

    async renderPlaylist() {
        const videoList = document.getElementById('video-list');
        videoList.innerHTML = '';

        if (this.playlist.length === 0) {
            videoList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No videos uploaded yet</p>';
            // Clear video player when no videos
            this.clearVideoPlayer();
            return;
        }

        // Create video items asynchronously
        for (let index = 0; index < this.playlist.length; index++) {
            const video = this.playlist[index];
            const videoItem = await this.createVideoItem(video, index);
            videoList.appendChild(videoItem);
        }

        // Auto-load the first video (top of the list) if no video is currently playing
        if (this.playlist.length > 0 && (!this.video.src || this.video.src === '')) {
            this.loadTopVideo();
        }
    }

    async createVideoItem(video, index) {
        const item = document.createElement('div');
        item.className = 'video-item';
        item.setAttribute('data-video-id', video.id);

        // Create initial structure with loading placeholder
        item.innerHTML = `
            <div class="video-thumbnail loading">
                <div class="thumbnail-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </div>
            <div class="video-details">
                <div class="video-name" title="${video.name}">${video.name}</div>
                <div class="video-meta">
                    <span>${this.formatTime(video.duration || 0)}</span>
                    <span>${this.formatFileSize(video.size || 0)}</span>
                </div>
            </div>
            <div class="video-actions">
                <button class="action-btn delete" title="Delete Video">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Generate thumbnail asynchronously
        this.generateThumbnail(video.url).then(thumbnailUrl => {
            const thumbnailDiv = item.querySelector('.video-thumbnail');
            if (thumbnailUrl) {
                thumbnailDiv.innerHTML = `
                    <img src="${thumbnailUrl}" alt="Video thumbnail" class="thumbnail-image">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                `;
                thumbnailDiv.classList.remove('loading');
            } else {
                // Fallback if thumbnail generation fails
                thumbnailDiv.innerHTML = `
                    <i class="fas fa-video"></i>
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                `;
                thumbnailDiv.classList.remove('loading');
            }
        });

        // Add click event to play video
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                this.currentVideoIndex = index;
                this.loadVideo(video);
                // Auto-play the video when clicked
                setTimeout(() => {
                    this.video.play().catch(e => console.log('Auto-play prevented by browser:', e));
                }, 100);
            }
        });

        // Add delete event
        const deleteBtn = item.querySelector('.delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeVideoFromPlaylist(video.id);
        });

        return item;
    }

    // Utility methods
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    formatFileSize(bytes) {
        if (!bytes) return '0 B';

        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // Generate video thumbnail
    generateThumbnail(videoUrl) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let resolved = false;

            // Timeout after 10 seconds
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(null);
                }
            }, 10000);

            video.addEventListener('loadedmetadata', () => {
                // Set canvas size to match thumbnail
                canvas.width = 160;
                canvas.height = 100;

                // Seek to 10% of video duration for thumbnail
                video.currentTime = Math.min(video.duration * 0.1, 5); // Max 5 seconds
            });

            video.addEventListener('seeked', () => {
                if (!resolved) {
                    try {
                        // Draw video frame to canvas
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        // Convert to data URL
                        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
                        resolved = true;
                        clearTimeout(timeout);
                        resolve(thumbnailUrl);
                    } catch (error) {
                        resolved = true;
                        clearTimeout(timeout);
                        resolve(null);
                    }

                    // Clean up
                    video.src = '';
                    video.load();
                }
            });

            video.addEventListener('error', () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeout);
                    resolve(null);
                }
            });

            video.src = videoUrl;
            video.muted = true;
            video.crossOrigin = 'anonymous';
            video.load();
        });
    }
}

// Initialize the video player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.videoPlayer = new AdvancedVideoPlayer();
});
