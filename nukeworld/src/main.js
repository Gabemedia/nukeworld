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
    const voices = window.speechSynthesis.getVoices();
    const savedSettings = localStorage.getItem('speechSettings');
    let settings = {
      enabled: true,
      volume: 1.0,
      rate: 1.0,
      pitch: 1.0,
      selectedVoiceURI: null
    };

    if (savedSettings) {
      settings = { ...settings, ...JSON.parse(savedSettings) };
    }

    if (!settings.selectedVoiceURI && voices.length > 0) {
      // Try to find a good English male voice
      let defaultVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('english') && 
        voice.name.toLowerCase().includes('male')
      );
      
      // If no male voice found, try any English voice
      if (!defaultVoice) {
        defaultVoice = voices.find(voice => voice.lang === 'en-US');
      }
      
      // If still no voice, use the first available
      defaultVoice = defaultVoice || voices[0];
      
      settings.selectedVoiceURI = defaultVoice.voiceURI;
      localStorage.setItem('speechSettings', JSON.stringify(settings));
    }
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
