import { createApp } from 'vue';
import 'bootstrap/dist/js/bootstrap.bundle';
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag'
import store from './store';
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import './main.scss';

// Initialize speech synthesis settings
const initializeSpeech = () => {
  const loadVoices = () => {
    // Force Safari to load voices synchronously
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.getVoices();
    }

    // Wait a moment for Safari to properly load voices
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      const savedSettings = localStorage.getItem('speechSettings');
      let settings = {
        enabled: true,
        volume: 1.0,
        rate: 1.0,
        pitch: 1.0,
        selectedVoiceURI: null
      };

      // Only use saved settings if they exist AND include a selectedVoiceURI
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.selectedVoiceURI) {
          settings = { ...settings, ...parsed };
        }
      }

      // Always try to set Karen as default voice on first load
      if (!settings.selectedVoiceURI && voices.length > 0) {
        // Try to find Karen voice first (Safari)
        let defaultVoice = voices.find(voice => voice.name === 'Karen');
        
        // If Karen not found, try Karen in different variations
        if (!defaultVoice) {
          defaultVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('karen') || 
            (voice.lang === 'en-AU' && voice.name.includes('Karen'))
          );
        }
        
        // If still no Karen, try any English voice
        if (!defaultVoice) {
          defaultVoice = voices.find(voice => voice.lang.startsWith('en-'));
        }
        
        // Last resort: use first available voice
        defaultVoice = defaultVoice || voices[0];
        
        settings.selectedVoiceURI = defaultVoice.voiceURI;
        
        // Save the settings immediately
        localStorage.setItem('speechSettings', JSON.stringify(settings));
        
        // Log the selected voice for debugging
        console.log('Selected voice:', defaultVoice.name, defaultVoice.lang);
      }
    }, 100); // Small delay to ensure voices are loaded in Safari
  };

  // Initial load of voices
  loadVoices();

  // Some browsers need the onvoiceschanged event
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
};

// Initialize speech settings when the app starts
initializeSpeech();

const app = createApp(App);

app.component('l-map', LMap);
app.component('l-tile-layer', LTileLayer);
app.component('l-marker', LMarker);

app.use(router);

app.use(VueGtag, {
    config: { id: 'G-QB6Y2S2390' }
  }, router)

app.use(store);
app.use(Toast);

app.mount('#app');
