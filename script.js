// Mindful Bell App
class MindfulBell {
    constructor() {
        this.settings = {
            active: true,
            startHour: 8,
            endHour: 21,
            frequency: '2-3'
        };
        this.nextBellTime = null;
        this.bellsToday = 0;
        this.audioContext = null;
        this.scheduledTimeout = null;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.initAudio();
        this.setupEventListeners();
        this.updateUI();
        this.scheduleNextBell();
        this.registerServiceWorker();
    }

    loadSettings() {
        const saved = localStorage.getItem('mindfulBellSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        const lastDate = localStorage.getItem('lastBellDate');
        const today = new Date().toDateString();
        
        if (lastDate !== today) {
            this.bellsToday = 0;
            localStorage.setItem('lastBellDate', today);
            localStorage.setItem('bellsToday', '0');
        } else {
            this.bellsToday = parseInt(localStorage.getItem('bellsToday') || '0');
        }
    }

    saveSettings() {
        localStorage.setItem('mindfulBellSettings', JSON.stringify(this.settings));
    }

    initAudio() {
        // Initialize Web Audio API
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    }

    playBell() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        // Create singing bowl sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, now); // A4 = 432 Hz (healing frequency)
        
        // Add harmonic overtones
        const overtone1 = this.audioContext.createOscillator();
        overtone1.type = 'sine';
        overtone1.frequency.setValueAtTime(864, now);
        
        const overtone2 = this.audioContext.createOscillator();
        overtone2.type = 'sine';
        overtone2.frequency.setValueAtTime(1296, now);
        
        // Filter for warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(1, now);
        
        // Envelope for singing bowl resonance
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 4);
        
        const overtoneGain1 = this.audioContext.createGain();
        overtoneGain1.gain.setValueAtTime(0, now);
        overtoneGain1.gain.linearRampToValueAtTime(0.1, now + 0.02);
        overtoneGain1.gain.exponentialRampToValueAtTime(0.01, now + 3);
        
        const overtoneGain2 = this.audioContext.createGain();
        overtoneGain2.gain.setValueAtTime(0, now);
        overtoneGain2.gain.linearRampToValueAtTime(0.05, now + 0.03);
        overtoneGain2.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
        
        // Connect nodes
        oscillator.connect(gainNode);
        overtone1.connect(overtoneGain1);
        overtone2.connect(overtoneGain2);
        
        gainNode.connect(filter);
        overtoneGain1.connect(filter);
        overtoneGain2.connect(filter);
        
        filter.connect(this.audioContext.destination);
        
        // Start and stop
        oscillator.start(now);
        overtone1.start(now);
        overtone2.start(now);
        
        oscillator.stop(now + 4);
        overtone1.stop(now + 3);
        overtone2.stop(now + 2.5);
        
        // Visual feedback
        this.animateBellRing();
    }

    animateBellRing() {
        const bellButton = document.getElementById('play-bell');
        const bellIcon = bellButton.querySelector('.bell-icon');
        bellIcon.style.animation = 'none';
        setTimeout(() => {
            bellIcon.style.animation = 'ring 0.5s ease-in-out';
        }, 10);
    }

    scheduleNextBell() {
        if (this.scheduledTimeout) {
            clearTimeout(this.scheduledTimeout);
        }

        if (!this.settings.active) {
            this.nextBellTime = null;
            this.updateUI();
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        
        // Check if we're in active hours
        if (currentHour < this.settings.startHour || currentHour >= this.settings.endHour) {
            // Schedule for start of next active period
            const tomorrow = currentHour >= this.settings.endHour;
            const nextStart = new Date();
            if (tomorrow) {
                nextStart.setDate(nextStart.getDate() + 1);
            }
            nextStart.setHours(this.settings.startHour, 0, 0, 0);
            
            this.nextBellTime = nextStart;
            const delay = nextStart - now;
            this.scheduledTimeout = setTimeout(() => this.ringBell(), delay);
        } else {
            // Calculate random interval based on frequency
            const [min, max] = this.settings.frequency.split('-').map(Number);
            const bellsPerHour = min + Math.random() * (max - min);
            const minutesUntilBell = (60 / bellsPerHour) + (Math.random() * 10 - 5); // Add randomness
            const delay = minutesUntilBell * 60 * 1000;
            
            this.nextBellTime = new Date(now.getTime() + delay);
            this.scheduledTimeout = setTimeout(() => this.ringBell(), delay);
        }
        
        this.updateUI();
    }

    ringBell() {
        this.playBell();
        this.bellsToday++;
        localStorage.setItem('bellsToday', this.bellsToday.toString());
        this.updateUI();
        this.scheduleNextBell();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showScreen('settings-screen');
        });

        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('main-screen');
        });

        // Play bell button
        document.getElementById('play-bell').addEventListener('click', () => {
            this.playBell();
        });

        // Settings
        document.getElementById('toggle-active').addEventListener('change', (e) => {
            this.settings.active = e.target.checked;
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('start-hour').addEventListener('input', (e) => {
            this.settings.startHour = parseInt(e.target.value);
            this.updateTimeDisplay('start-time-display', this.settings.startHour);
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('end-hour').addEventListener('input', (e) => {
            this.settings.endHour = parseInt(e.target.value);
            this.updateTimeDisplay('end-time-display', this.settings.endHour);
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('frequency').addEventListener('change', (e) => {
            this.settings.frequency = e.target.value;
            document.getElementById('frequency-display').textContent = e.target.value;
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('reset-stats').addEventListener('click', () => {
            if (confirm('Reset today\'s bell count?')) {
                this.bellsToday = 0;
                localStorage.setItem('bellsToday', '0');
                this.updateUI();
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    updateUI() {
        // Status indicator
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (this.settings.active) {
            statusIndicator.className = 'status-active';
            statusText.textContent = 'Active';
        } else {
            statusIndicator.className = 'status-inactive';
            statusText.textContent = 'Inactive';
        }

        // Next bell time
        const nextBellElement = document.getElementById('next-bell-time');
        if (this.nextBellTime && this.settings.active) {
            nextBellElement.textContent = this.formatTime(this.nextBellTime);
        } else {
            nextBellElement.textContent = '--:--';
        }

        // Active hours
        const activeHoursElement = document.getElementById('active-hours');
        activeHoursElement.textContent = `${this.formatHour(this.settings.startHour)} - ${this.formatHour(this.settings.endHour)}`;

        // Bells today
        document.getElementById('bells-today').textContent = this.bellsToday;

        // Settings screen
        document.getElementById('toggle-active').checked = this.settings.active;
        document.getElementById('start-hour').value = this.settings.startHour;
        document.getElementById('end-hour').value = this.settings.endHour;
        document.getElementById('frequency').value = this.settings.frequency;
        
        this.updateTimeDisplay('start-time-display', this.settings.startHour);
        this.updateTimeDisplay('end-time-display', this.settings.endHour);
        document.getElementById('frequency-display').textContent = this.settings.frequency;
    }

    updateTimeDisplay(elementId, hour) {
        document.getElementById(elementId).textContent = this.formatHour(hour);
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:00 ${period}`;
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./service-worker.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MindfulBell());
} else {
    new MindfulBell();
}