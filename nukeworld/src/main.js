import { createApp } from 'vue';
import 'bootstrap/dist/js/bootstrap.bundle'
import './main.scss'
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import Toast from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import Vue from 'vue';

// Register Vue2Leaflet components
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);


const app = createApp(App);
app.use(router);
app.use(store); // Use the Vuex store
app.use(Toast);

app.mount('#app');
