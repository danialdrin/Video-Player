// Video Upload Handler
class VideoUploadHandler {
    constructor() {
        this.supportedFormats = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/mkv', 'video/ogg'];
        this.maxFileSize = 500 * 1024 * 1024; // 500MB
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        // Upload areas
        this.uploadArea = document.getElementById('upload-area');
        this.modalUploadArea = document.getElementById('modal-upload-area');

        // File inputs
        this.fileInput = document.getElementById('file-input');
        this.modalFileInput = document.getElementById('modal-file-input');
        this.fileSelectBtn = document.getElementById('file-select-btn');

        // Upload progress
        this.uploadProgress = document.getElementById('upload-progress');
        this.uploadProgressFill = document.getElementById('upload-progress-fill');
        this.uploadStatus = document.getElementById('upload-status');

        // Modal elements
        this.uploadModal = document.getElementById('upload-modal');
        this.modalClose = document.getElementById('modal-close');

        // Search and clear
        this.searchInput = document.getElementById('search-input');
        this.clearAllBtn = document.getElementById('clear-all-btn');
    }

    setupEventListeners() {
        // Modal close
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.uploadModal.addEventListener('click', (e) => {
            if (e.target === this.uploadModal) this.closeModal();
        });

        // File select buttons
        this.fileSelectBtn.addEventListener('click', () => this.fileInput.click());
        this.modalUploadArea.addEventListener('click', () => this.modalFileInput.click());

        // File input changes
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        this.modalFileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));

        // Drag and drop for main upload area
        this.setupDragAndDrop(this.uploadArea);
        this.setupDragAndDrop(this.modalUploadArea);

        // Search functionality
        this.searchInput.addEventListener('input', (e) => this.filterVideos(e.target.value));

        // Clear all videos
        this.clearAllBtn.addEventListener('click', () => this.clearAllVideos());

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.uploadModal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    setupDragAndDrop(area) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            area.addEventListener(eventName, () => area.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, () => area.classList.remove('dragover'), false);
        });

        // Handle dropped files
        area.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFileSelect(files);
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    openModal() {
        this.uploadModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.uploadModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    async handleFileSelect(files) {
        if (!files || files.length === 0) return;

        const validFiles = Array.from(files).filter(file => this.validateFile(file));

        if (validFiles.length === 0) {
            this.showError('No valid video files selected. Please select MP4, WebM, AVI, MOV, or MKV files.');
            return;
        }

        this.closeModal();

        for (const file of validFiles) {
            await this.processFile(file);
        }
    }

    validateFile(file) {
        // Check file type
        if (!this.supportedFormats.includes(file.type)) {
            this.showError(`Unsupported file format: ${file.name}. Please use MP4, WebM, AVI, MOV, or MKV.`);
            return false;
        }

        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError(`File too large: ${file.name}. Maximum size is 500MB.`);
            return false;
        }

        return true;
    }

    async processFile(file) {
        try {
            this.showUploadProgress(0, `Processing ${file.name}...`);

            // Create object URL for the video
            const url = URL.createObjectURL(file);

            // Get video metadata
            const metadata = await this.getVideoMetadata(url);

            // Create video data object
            const videoData = {
                id: this.generateId(),
                name: file.name,
                url: url,
                size: file.size,
                type: file.type,
                duration: metadata.duration,
                uploadDate: new Date().toISOString()
            };

            // Add to playlist
            window.videoPlayer.addVideoToPlaylist(videoData);

            // If this is the first video or no video is currently loaded, load it
            if (window.videoPlayer.playlist.length === 1 || !window.videoPlayer.video.src) {
                window.videoPlayer.loadTopVideo();
            }

            this.showUploadProgress(100, `${file.name} uploaded successfully!`);

            // Hide progress after 2 seconds
            setTimeout(() => this.hideUploadProgress(), 2000);

        } catch (error) {
            console.error('Error processing file:', error);
            this.showError(`Error processing ${file.name}: ${error.message}`);
        }
    }

    getVideoMetadata(url) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                resolve({
                    duration: video.duration,
                    width: video.videoWidth,
                    height: video.videoHeight
                });
            };

            video.onerror = () => {
                reject(new Error('Failed to load video metadata'));
            };

            video.src = url;
        });
    }

    showUploadProgress(percentage, status) {
        this.uploadProgress.style.display = 'block';
        this.uploadProgressFill.style.width = `${percentage}%`;
        this.uploadStatus.textContent = status;
    }

    hideUploadProgress() {
        this.uploadProgress.style.display = 'none';
    }

    showError(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 5000);
    }

    filterVideos(searchTerm) {
        const videoItems = document.querySelectorAll('.video-item');
        const term = searchTerm.toLowerCase();

        videoItems.forEach(item => {
            const videoName = item.querySelector('.video-name').textContent.toLowerCase();
            if (videoName.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    clearAllVideos() {
        if (confirm('Are you sure you want to delete all videos? This action cannot be undone.')) {
            window.videoPlayer.clearPlaylist();
            this.searchInput.value = '';
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize upload handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uploadHandler = new VideoUploadHandler();
});
