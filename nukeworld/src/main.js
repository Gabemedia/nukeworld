import { createApp } from 'vue';
import 'bootstrap/dist/js/bootstrap.bundle'
import './main.scss'
import App from './App.vue';
import router from './router';
import store from './store'; // Import the Vuex store
import Toast from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(store); // Use the Vuex store
app.use(Toast);

app.mount('#app');
