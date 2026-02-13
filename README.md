# 🔔 Mindful Bell

A mobile-first Progressive Web App that plays Tibetan singing bowl sounds at random intervals throughout the day to help you stay present and mindful.

## ✨ Features

- **Random Bell Intervals**: Plays warm singing bowl sounds 2-3 times per hour (customizable)
- **Active Hours**: Set specific time ranges when bells should ring (default: 8am-9pm)
- **Authentic Sound**: Web Audio API synthesizes realistic Tibetan singing bowl tones
- **Bell Counter**: Track how many mindful moments you've experienced each day
- **Test Bell**: Try the sound anytime with the test button
- **Offline Support**: Works offline as a Progressive Web App
- **Beautiful UI**: Warm, minimal design optimized for mobile devices

## 🚀 Getting Started

### Quick Start

1. Visit the app in your mobile browser
2. The app works immediately - bells will ring during active hours
3. Tap "Play Bell Sound" to hear the singing bowl
4. Customize settings to match your preferences

### Install as PWA

#### iOS (Safari)
1. Tap the Share button
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add"

#### Android (Chrome)
1. Tap the menu (three dots)
2. Tap "Install app" or "Add to Home Screen"
3. Tap "Install"

## ⚙️ Settings

### Active/Inactive Toggle
Quickly enable or disable bell notifications without losing your settings.

### Active Hours
Set the time range when you want to receive bell reminders. The app won't ring outside these hours.

### Bell Frequency
Adjust how often bells ring:
- **Less (1-2 per hour)**: Occasional gentle reminders
- **Default (2-3 per hour)**: Balanced mindfulness practice
- **More (4-5 per hour)**: Frequent presence checks

## 🎵 The Bell Sound

The singing bowl sound is synthesized using the Web Audio API with multiple harmonics:
- **Fundamental frequency**: 396 Hz
- **Harmonic overtones**: Creating warm, resonant timbre
- **Natural envelope**: Slow attack with long, meditative decay
- **No audio files needed**: Purely code-generated for minimal app size

## 📱 Technical Details

### Technologies
- **Vanilla JavaScript**: No frameworks, ultra-lightweight
- **Web Audio API**: Real-time audio synthesis
- **CSS3**: Smooth animations and transitions
- **Local Storage**: Settings persistence
- **Service Worker**: Offline functionality
- **PWA Manifest**: Native app experience

### Browser Support
- Chrome/Edge (Desktop & Mobile)
- Safari (iOS & macOS)
- Firefox (Desktop & Mobile)

### Performance
- Total app size: < 50KB
- No external dependencies
- Minimal battery impact
- Works offline after first load

## 🧘 Mindfulness Practice

### How to Use

1. **Setup**: Configure your active hours and preferred frequency
2. **Let it work**: Keep the app installed; it runs in the background during active hours
3. **When the bell rings**: 
   - Pause whatever you're doing
   - Take three deep breaths
   - Notice your present moment experience
   - Continue with awareness

### Tips
- Start with lower frequency (1-2 per hour) if you're new to mindfulness
- Adjust active hours to match your waking hours
- Use the test button during meditation sessions
- Track your daily bells to build a consistency habit

## 🔧 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/joonasvir/mindful-bell.git

# Navigate to directory
cd mindful-bell

# Serve locally (using Python)
python -m http.server 8000

# Or use any other local server
# Then visit http://localhost:8000
```

### File Structure

```
mindful-bell/
├── index.html          # Main app interface
├── style.css           # Mobile-first responsive styles
├── script.js           # App logic and audio synthesis
├── manifest.json       # PWA manifest
├── service-worker.js   # Offline caching
└── README.md          # Documentation
```

## 📄 License

MIT License - feel free to use and modify for your own mindfulness practice.

## 🙏 Acknowledgments

Inspired by the Tibetan Buddhist tradition of mindfulness bells and the Plum Village practice of stopping to breathe when hearing a bell.

---

May this app bring peace and presence to your day. 🔔✨