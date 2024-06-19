import { createApp } from 'vue';
import { ToolTip } from '@programic/vue3-tooltip';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue3-toastify';
import 'bootstrap/dist/js/bootstrap.bundle';
import '@programic/vue3-tooltip/dist/index.css';
import 'vue3-toastify/dist/index.css';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import './main.scss';
const app = createApp(App);

app.component('l-map', LMap);
app.component('l-tile-layer', LTileLayer);
app.component('l-marker', LMarker);
app.component('ToolTip', ToolTip);

app.use(router);
app.use(store);
app.use(Toast);
app.mount('#app');
