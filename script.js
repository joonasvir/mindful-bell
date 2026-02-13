// Mindful Bell - App Logic

class MindfulBell {
    constructor() {
        this.settings = this.loadSettings();
        this.nextBellTime = null;
        this.bellTimeout = null;
        this.audioContext = null;
        this.updateInterval = null;
        
        this.initializeApp();
    }

    loadSettings() {
        const defaults = {
            active: true,
            startTime: '08:00',
            endTime: '21:00',
            frequency: 2.5,
            bellsToday: 0,
            lastDate: new Date().toDateString()
        };

        const saved = localStorage.getItem('mindfulBellSettings');
        if (saved) {
            const settings = { ...defaults, ...JSON.parse(saved) };
            // Reset bell count if it's a new day
            if (settings.lastDate !== new Date().toDateString()) {
                settings.bellsToday = 0;
                settings.lastDate = new Date().toDateString();
            }
            return settings;
        }
        return defaults;
    }

    saveSettings() {
        localStorage.setItem('mindfulBellSettings', JSON.stringify(this.settings));
    }

    initializeApp() {
        this.setupAudioContext();
        this.setupEventListeners();
        this.loadSettingsToUI();
        this.updateStatus();
        this.scheduleNextBell();
        this.startUpdateTimer();
        this.registerServiceWorker();
    }

    setupAudioContext() {
        // Lazy initialization - will be created on first user interaction
        this.audioContext = null;
    }

    createAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    setupEventListeners() {
        // Main screen buttons
        document.getElementById('testBellBtn').addEventListener('click', () => {
            this.playBell();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        // Settings screen
        document.getElementById('backBtn').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('activeToggle').addEventListener('change', (e) => {
            this.settings.active = e.target.checked;
            this.saveSettings();
            this.updateStatus();
            this.scheduleNextBell();
        });

        document.getElementById('startTime').addEventListener('change', (e) => {
            this.settings.startTime = e.target.value;
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('endTime').addEventListener('change', (e) => {
            this.settings.endTime = e.target.value;
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('frequencySlider').addEventListener('input', (e) => {
            this.settings.frequency = parseFloat(e.target.value);
            this.updateFrequencyDisplay();
        });

        document.getElementById('frequencySlider').addEventListener('change', () => {
            this.saveSettings();
            this.scheduleNextBell();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Reset all settings to defaults?')) {
                this.resetSettings();
            }
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkAndRescheduleBell();
            }
        });
    }

    loadSettingsToUI() {
        document.getElementById('activeToggle').checked = this.settings.active;
        document.getElementById('startTime').value = this.settings.startTime;
        document.getElementById('endTime').value = this.settings.endTime;
        document.getElementById('frequencySlider').value = this.settings.frequency;
        document.getElementById('bellCount').textContent = this.settings.bellsToday;
        this.updateFrequencyDisplay();
    }

    updateFrequencyDisplay() {
        const freq = this.settings.frequency;
        let display;
        if (freq <= 1.5) display = '1';
        else if (freq <= 2) display = '1-2';
        else if (freq <= 3) display = '2-3';
        else if (freq <= 4) display = '3-4';
        else display = '4-5';
        
        document.getElementById('frequencyDisplay').textContent = display;
    }

    updateStatus() {
        const indicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (this.settings.active && this.isWithinActiveHours()) {
            indicator.classList.remove('inactive');
            statusText.textContent = 'Active';
        } else if (this.settings.active) {
            indicator.classList.add('inactive');
            statusText.textContent = 'Outside Active Hours';
        } else {
            indicator.classList.add('inactive');
            statusText.textContent = 'Inactive';
        }
    }

    isWithinActiveHours() {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const [startHour, startMin] = this.settings.startTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        
        const [endHour, endMin] = this.settings.endTime.split(':').map(Number);
        const endMinutes = endHour * 60 + endMin;
        
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }

    getRandomInterval() {
        // Convert frequency (bells per hour) to interval (minutes between bells)
        const avgInterval = 60 / this.settings.frequency;
        // Add randomness: ±30% of average interval
        const minInterval = avgInterval * 0.7;
        const maxInterval = avgInterval * 1.3;
        return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    }

    scheduleNextBell() {
        // Clear existing timeout
        if (this.bellTimeout) {
            clearTimeout(this.bellTimeout);
            this.bellTimeout = null;
        }

        if (!this.settings.active) {
            this.nextBellTime = null;
            this.updateNextBellDisplay();
            return;
        }

        const now = new Date();
        let nextTime = new Date(now);

        // If outside active hours, schedule for start of next active period
        if (!this.isWithinActiveHours()) {
            const [startHour, startMin] = this.settings.startTime.split(':').map(Number);
            const [endHour, endMin] = this.settings.endTime.split(':').map(Number);
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            if (currentMinutes < startMinutes) {
                // Before start time today
                nextTime.setHours(startHour, startMin, 0, 0);
            } else {
                // After end time today, schedule for tomorrow
                nextTime.setDate(nextTime.getDate() + 1);
                nextTime.setHours(startHour, startMin, 0, 0);
            }
        } else {
            // Within active hours, schedule random interval
            const intervalMinutes = this.getRandomInterval();
            nextTime = new Date(now.getTime() + intervalMinutes * 60000);

            // Check if next bell would be outside active hours
            const [endHour, endMin] = this.settings.endTime.split(':').map(Number);
            const endTime = new Date(now);
            endTime.setHours(endHour, endMin, 0, 0);

            if (nextTime > endTime) {
                // Schedule for start of next active period
                const [startHour, startMin] = this.settings.startTime.split(':').map(Number);
                nextTime.setDate(nextTime.getDate() + 1);
                nextTime.setHours(startHour, startMin, 0, 0);
            }
        }

        this.nextBellTime = nextTime;
        this.updateNextBellDisplay();

        // Set timeout
        const timeUntilBell = nextTime - now;
        this.bellTimeout = setTimeout(() => {
            this.ringBell();
        }, timeUntilBell);
    }

    checkAndRescheduleBell() {
        // Check if scheduled time has passed (app was in background)
        if (this.nextBellTime && new Date() >= this.nextBellTime) {
            this.scheduleNextBell();
        }
        this.updateStatus();
    }

    updateNextBellDisplay() {
        const display = document.getElementById('nextBellTime');
        
        if (!this.nextBellTime) {
            display.textContent = '--:--';
            return;
        }

        const now = new Date();
        const diff = this.nextBellTime - now;
        
        if (diff < 0) {
            display.textContent = 'Soon';
            return;
        }

        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (hours > 0) {
            display.textContent = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            display.textContent = `${minutes}m ${seconds}s`;
        } else {
            display.textContent = `${seconds}s`;
        }
    }

    startUpdateTimer() {
        // Update display every second
        this.updateInterval = setInterval(() => {
            this.updateNextBellDisplay();
            
            // Check if we've entered a new day
            const currentDate = new Date().toDateString();
            if (currentDate !== this.settings.lastDate) {
                this.settings.bellsToday = 0;
                this.settings.lastDate = currentDate;
                this.saveSettings();
                document.getElementById('bellCount').textContent = '0';
            }
        }, 1000);
    }

    playBell() {
        const ctx = this.createAudioContext();
        
        // Create a warm, resonant bell sound using multiple sine waves
        const now = ctx.currentTime;
        const duration = 4;
        
        // Fundamental frequency and harmonics for singing bowl
        const frequencies = [
            396,      // Fundamental
            792,      // 2nd harmonic
            1188,     // 3rd harmonic
            1584,     // 4th harmonic
            528       // Perfect fifth for warmth
        ];
        
        const gains = [0.3, 0.15, 0.08, 0.05, 0.12];
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            // Envelope: slow attack, long decay
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(gains[i], now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            osc.start(now);
            osc.stop(now + duration);
        });
    }

    ringBell() {
        // Play sound and show overlay
        this.playBell();
        this.showBellOverlay();
        
        // Increment bell count
        this.settings.bellsToday++;
        this.saveSettings();
        document.getElementById('bellCount').textContent = this.settings.bellsToday;
        
        // Schedule next bell
        setTimeout(() => {
            this.scheduleNextBell();
        }, 100);
        
        // Hide overlay after 3 seconds
        setTimeout(() => {
            this.hideBellOverlay();
        }, 3000);
    }

    showBellOverlay() {
        document.getElementById('bellOverlay').classList.remove('hidden');
    }

    hideBellOverlay() {
        document.getElementById('bellOverlay').classList.add('hidden');
    }

    showSettings() {
        document.getElementById('mainScreen').classList.add('hidden');
        document.getElementById('settingsScreen').classList.remove('hidden');
    }

    hideSettings() {
        document.getElementById('settingsScreen').classList.add('hidden');
        document.getElementById('mainScreen').classList.remove('hidden');
    }

    resetSettings() {
        this.settings = {
            active: true,
            startTime: '08:00',
            endTime: '21:00',
            frequency: 2.5,
            bellsToday: this.settings.bellsToday,
            lastDate: this.settings.lastDate
        };
        this.saveSettings();
        this.loadSettingsToUI();
        this.updateStatus();
        this.scheduleNextBell();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.log('Service Worker registration failed', err));
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MindfulBell();
    });
} else {
    new MindfulBell();
}