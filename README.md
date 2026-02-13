# 🔔 Mindful Bell

A beautiful, mobile-first mindfulness web app that plays Tibetan singing bowl sounds at random intervals throughout the day to help you stay present and mindful.

## ✨ Features

- **Random Bell Intervals**: Plays soothing bell sounds 2-3 times per hour (customizable)
- **Adjustable Active Hours**: Set your preferred active hours (default: 8am-9pm)
- **Authentic Sound**: Warm, resonant Tibetan singing bowl sound generated using Web Audio API
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Progressive Web App**: Install on your device and use offline
- **Ultra-Lightweight**: Vanilla JavaScript, no dependencies
- **Simple Settings**: Easy-to-use configuration screen
- **Daily Statistics**: Track how many bells you've heard each day

## 🚀 Getting Started

### Live Demo

Simply open `index.html` in a modern web browser, or deploy to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### Installation as PWA

1. Open the app in your mobile browser
2. Tap the "Add to Home Screen" option
3. The app will install as a standalone application
4. Launch from your home screen like any native app

## 🎵 How It Works

The app uses the Web Audio API to generate authentic Tibetan singing bowl sounds with:

- **Fundamental frequency**: 432 Hz (healing frequency)
- **Harmonic overtones**: Creating depth and resonance
- **Exponential decay**: Mimicking the natural resonance of singing bowls
- **Low-pass filtering**: Adding warmth to the sound

## ⚙️ Configuration

### Active Hours
Set the time range when bells should ring:
- **Start Time**: When to begin ringing bells (default: 8:00 AM)
- **End Time**: When to stop ringing bells (default: 9:00 PM)

### Frequency
Adjust how often bells ring per hour:
- 1-2 times per hour (minimal)
- 2-3 times per hour (default)
- 3-4 times per hour (frequent)
- 4-6 times per hour (very frequent)

### Enable/Disable
Toggle the bell system on or off while preserving your settings.

## 📱 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure performance
- **Web Audio API**: Real-time audio synthesis
- **Service Workers**: Offline functionality
- **LocalStorage**: Settings persistence
- **PWA Manifest**: App installation support

### Browser Compatibility
- Chrome/Edge 60+
- Safari 11+
- Firefox 60+
- Opera 47+

### File Structure
```
mindful-bell/
├── index.html          # Main app interface
├── style.css           # Mobile-first styling
├── script.js           # App logic and audio
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline support
└── README.md          # Documentation
```

## 🎨 Design Philosophy

- **Mobile-First**: Designed for smartphones, works great on desktop
- **Minimal**: Clean interface with no distractions
- **Warm Colors**: Earthy, calming color palette
- **Smooth Animations**: Gentle transitions and interactions
- **Accessible**: High contrast, clear typography

## 🔒 Privacy

All data is stored locally on your device:
- No analytics or tracking
- No external API calls
- No personal data collection
- Works completely offline

## 🌟 Use Cases

- **Mindfulness Practice**: Regular reminders to return to the present moment
- **Work Breaks**: Gentle prompts to take micro-breaks during work
- **Meditation Support**: Random bells during meditation sessions
- **Stress Reduction**: Calming sounds throughout your day
- **Attention Training**: Practice bringing awareness to the present

## 🛠️ Development

### Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. No build process needed!

### Customization
The app is designed to be easily customizable:
- Modify colors in `:root` CSS variables
- Adjust bell frequency in `script.js`
- Change sound properties in the `playBell()` method

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🙏 Acknowledgments

Inspired by traditional Tibetan mindfulness practices and singing bowl meditation.

---

**Made with ❤️ for mindfulness and presence**