# 🎬Video Player

A modern, feature-rich video player built with vanilla HTML, CSS, and JavaScript. This project transforms a basic video player into a professional-grade application with advanced features and a beautiful, responsive design.

## ✨ Features

### 🎮Video Controls
- **Play/Pause** - Click video or spacebar
- **Stop** - Reset video to beginning
- **Skip Forward/Backward** - 10-second jumps with arrow keys
- **Volume Control** - Slider and mute toggle
- **Playback Speed** - 0.5x to 2x speed options
- **Progress Bar** - Click to seek, drag to scrub
- **Fullscreen Mode** - F key or button
- **Picture-in-Picture** - P key or button

### 📁 File Management
- **Drag & Drop Upload** - Drag videos directly into the player
- **Multi-file Upload** - Select multiple videos at once
- **Format Support** - MP4, WebM, AVI, MOV, MKV
- **File Validation** - Size limits and format checking
- **Video Library** - Organized list of all uploaded videos

### 🎨 User Interface
- **Modern Design** - Clean, professional interface
- **Dark/Light Theme** - Toggle between themes
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Polished user experience
- **Accessibility** - Keyboard navigation and screen reader support

### 📊 Playlist Management
- **Auto-playlist** - All uploaded videos in one place
- **Search & Filter** - Find videos quickly
- **Sort Options** - By name, date, size, or duration
- **Playlist Stats** - Total videos, size, and duration
- **Export Playlist** - Save playlist as JSON
- **Shuffle** - Randomize video order

### ⌨️ Keyboard Shortcuts
- `Space` - Play/Pause
- `←/→` - Skip backward/forward 10s
- `↑/↓` - Volume up/down
- `M` - Mute/Unmute
- `F` - Fullscreen
- `P` - Picture-in-Picture
- `Esc` - Exit fullscreen/close modal

### 💾 Data Persistence
- **Local Storage** - Videos and settings saved locally
- **Theme Preference** - Remembers your theme choice
- **Playlist State** - Maintains video library between sessions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for file uploads to work properly)

### Installation
1. Clone or download this repository
2. Navigate to the project directory
3. Start a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
4. Open `http://localhost:8000` in your browser

## 📱 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic Playback | ✅ | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ |
| Picture-in-Picture | ✅ | ✅ | ✅ | ✅ |
| Fullscreen | ✅ | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |

## 🎯 Usage

### Uploading Videos
1. Click the upload button in the header
2. Drag and drop videos or click to select files
3. Supported formats: MP4, WebM, AVI, MOV, MKV
4. Maximum file size: 500MB per video

### Playing Videos
1. Click on any video in the library to start playing
2. Use the custom controls or keyboard shortcuts
3. Videos auto-advance to the next in the playlist

### Managing Your Library
- **Search**: Use the search box to find specific videos
- **Sort**: Choose sorting method and direction
- **Delete**: Click the trash icon on any video
- **Clear All**: Remove all videos at once
- **Export**: Download your playlist as JSON

## 🛠️ Technical Details

### Architecture
- **Modular Design** - Separate classes for player, upload, and playlist
- **Event-Driven** - Responsive to user interactions
- **Progressive Enhancement** - Works without JavaScript for basic playback

### File Structure
```
├── index.html          # Main HTML structure
├── style.css           # Complete styling and themes
├── script.js           # Core video player functionality
├── upload.js           # File upload and management
├── playlist.js         # Playlist and library features
└── README.md           # This file
```

### Performance Optimizations
- **Lazy Loading** - Videos load only when needed
- **Efficient DOM Updates** - Minimal reflows and repaints
- **Memory Management** - Proper cleanup of object URLs
- **Responsive Images** - Optimized for different screen sizes

## 🎨 Customization

### Themes
The player supports light and dark themes with CSS custom properties. You can easily customize colors by modifying the CSS variables in `style.css`.

### Adding New Features
The modular architecture makes it easy to extend functionality:
1. Add new methods to existing classes
2. Create new modules for complex features
3. Use the event system for communication between modules

## 🐛 Troubleshooting

### Common Issues
- **Videos won't play**: Ensure you're using a local server, not file:// protocol
- **Upload not working**: Check file format and size limits
- **Controls not responding**: Verify JavaScript is enabled
- **Styling issues**: Clear browser cache and reload

### Browser Console
Check the browser's developer console for any error messages that can help diagnose issues.

## 🤝 Contributing

This project is open for improvements! Some ideas for contributions:
- Additional video format support
- Cloud storage integration
- Video editing features
- Subtitle support
- Streaming capabilities

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Modern CSS techniques for responsive design
- HTML5 Video API for media functionality

---

**Enjoy your video player! 🎬✨**
