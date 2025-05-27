// Playlist Management Extensions
class PlaylistManager {
    constructor() {
        this.sortOrder = 'name'; // name, date, size, duration
        this.sortDirection = 'asc'; // asc, desc
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addPlaylistControls();
    }

    setupEventListeners() {
        // Listen for playlist updates
        document.addEventListener('playlistUpdated', () => {
            this.updatePlaylistStats();
        });
    }

    addPlaylistControls() {
        // Add sort controls to library header
        const libraryHeader = document.querySelector('.library-header');
        if (libraryHeader) {
            const sortControls = this.createSortControls();
            libraryHeader.appendChild(sortControls);
        }

        // Add playlist stats
        const librarySection = document.querySelector('.library-section');
        if (librarySection) {
            const statsElement = this.createStatsElement();
            librarySection.insertBefore(statsElement, librarySection.querySelector('.video-list'));
        }
    }

    createSortControls() {
        const sortContainer = document.createElement('div');
        sortContainer.className = 'sort-controls';
        sortContainer.style.cssText = `
            display: flex;
            gap: 0.5rem;
            align-items: center;
            margin-top: 1rem;
        `;

        sortContainer.innerHTML = `
            <label style="font-size: 0.9rem; color: var(--text-secondary);">Sort by:</label>
            <select id="sort-select" style="
                padding: 0.25rem 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-size: 0.85rem;
            ">
                <option value="name">Name</option>
                <option value="date">Upload Date</option>
                <option value="size">File Size</option>
                <option value="duration">Duration</option>
            </select>
            <button id="sort-direction" class="btn-icon" style="
                padding: 0.25rem;
                font-size: 0.8rem;
            " title="Toggle Sort Direction">
                <i class="fas fa-sort-alpha-down"></i>
            </button>
        `;

        // Add event listeners
        const sortSelect = sortContainer.querySelector('#sort-select');
        const sortDirectionBtn = sortContainer.querySelector('#sort-direction');

        sortSelect.addEventListener('change', (e) => {
            this.sortOrder = e.target.value;
            this.sortPlaylist();
        });

        sortDirectionBtn.addEventListener('click', () => {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            this.updateSortIcon(sortDirectionBtn);
            this.sortPlaylist();
        });

        return sortContainer;
    }

    createStatsElement() {
        const statsElement = document.createElement('div');
        statsElement.className = 'playlist-stats';
        statsElement.id = 'playlist-stats';
        statsElement.style.cssText = `
            background: var(--bg-primary);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            border: 1px solid var(--border-color);
        `;

        this.updatePlaylistStats();
        return statsElement;
    }

    updatePlaylistStats() {
        const statsElement = document.getElementById('playlist-stats');
        if (!statsElement) return;

        const playlist = window.videoPlayer ? window.videoPlayer.playlist : [];

        if (playlist.length === 0) {
            statsElement.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                    No videos in playlist
                </div>
            `;
            return;
        }

        const totalSize = playlist.reduce((sum, video) => sum + (video.size || 0), 0);
        const totalDuration = playlist.reduce((sum, video) => sum + (video.duration || 0), 0);
        const avgFileSize = totalSize / playlist.length;

        statsElement.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; font-size: 0.85rem;">
                <div>
                    <div style="color: var(--text-muted); margin-bottom: 0.25rem;">Videos</div>
                    <div style="font-weight: 600; color: var(--primary-color);">${playlist.length}</div>
                </div>
                <div>
                    <div style="color: var(--text-muted); margin-bottom: 0.25rem;">Total Size</div>
                    <div style="font-weight: 600; color: var(--primary-color);">${this.formatFileSize(totalSize)}</div>
                </div>
                <div>
                    <div style="color: var(--text-muted); margin-bottom: 0.25rem;">Total Duration</div>
                    <div style="font-weight: 600; color: var(--primary-color);">${this.formatTime(totalDuration)}</div>
                </div>
                <div>
                    <div style="color: var(--text-muted); margin-bottom: 0.25rem;">Avg Size</div>
                    <div style="font-weight: 600; color: var(--primary-color);">${this.formatFileSize(avgFileSize)}</div>
                </div>
            </div>
        `;
    }

    sortPlaylist() {
        if (!window.videoPlayer) return;

        const playlist = [...window.videoPlayer.playlist];

        playlist.sort((a, b) => {
            let aValue, bValue;

            switch (this.sortOrder) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'date':
                    aValue = new Date(a.uploadDate || 0);
                    bValue = new Date(b.uploadDate || 0);
                    break;
                case 'size':
                    aValue = a.size || 0;
                    bValue = b.size || 0;
                    break;
                case 'duration':
                    aValue = a.duration || 0;
                    bValue = b.duration || 0;
                    break;
                default:
                    return 0;
            }

            if (this.sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        // Update the playlist and re-render
        window.videoPlayer.playlist = playlist;
        window.videoPlayer.renderPlaylist();
        this.updatePlaylistStats();

        // Load the top video after sorting
        if (playlist.length > 0) {
            window.videoPlayer.loadTopVideo();
        }
    }

    updateSortIcon(button) {
        const icon = button.querySelector('i');
        const isAsc = this.sortDirection === 'asc';

        switch (this.sortOrder) {
            case 'name':
                icon.className = isAsc ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up';
                break;
            case 'date':
                icon.className = isAsc ? 'fas fa-sort-numeric-down' : 'fas fa-sort-numeric-up';
                break;
            case 'size':
            case 'duration':
                icon.className = isAsc ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up';
                break;
            default:
                icon.className = 'fas fa-sort';
        }
    }

    // Export playlist functionality
    exportPlaylist() {
        if (!window.videoPlayer || window.videoPlayer.playlist.length === 0) {
            alert('No videos to export');
            return;
        }

        const playlistData = {
            name: 'Video Playlist',
            created: new Date().toISOString(),
            videos: window.videoPlayer.playlist.map(video => ({
                name: video.name,
                size: video.size,
                type: video.type,
                duration: video.duration,
                uploadDate: video.uploadDate
            }))
        };

        const blob = new Blob([JSON.stringify(playlistData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `video-playlist-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Shuffle playlist
    shufflePlaylist() {
        if (!window.videoPlayer || window.videoPlayer.playlist.length < 2) return;

        const playlist = [...window.videoPlayer.playlist];

        // Fisher-Yates shuffle
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }

        window.videoPlayer.playlist = playlist;
        window.videoPlayer.renderPlaylist();

        // Load the top video after shuffling
        if (playlist.length > 0) {
            window.videoPlayer.loadTopVideo();
        }
    }

    // Utility methods
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m ${secs}s`;
    }

    formatFileSize(bytes) {
        if (!bytes) return '0 B';

        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
}

// Add additional controls to the library
document.addEventListener('DOMContentLoaded', () => {
    // Wait for video player to initialize
    setTimeout(() => {
        window.playlistManager = new PlaylistManager();

        // Add export and shuffle buttons
        const libraryControls = document.querySelector('.library-controls');
        if (libraryControls) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn-icon';
            exportBtn.title = 'Export Playlist';
            exportBtn.innerHTML = '<i class="fas fa-download"></i>';
            exportBtn.addEventListener('click', () => window.playlistManager.exportPlaylist());

            const shuffleBtn = document.createElement('button');
            shuffleBtn.className = 'btn-icon';
            shuffleBtn.title = 'Shuffle Playlist';
            shuffleBtn.innerHTML = '<i class="fas fa-random"></i>';
            shuffleBtn.addEventListener('click', () => window.playlistManager.shufflePlaylist());

            libraryControls.appendChild(exportBtn);
            libraryControls.appendChild(shuffleBtn);
        }
    }, 100);
});
