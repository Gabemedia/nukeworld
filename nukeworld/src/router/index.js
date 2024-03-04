import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import UserLogin from '../components/UserLogin.vue';
import GameWorld from '../components/GameWorld.vue';

const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin,
    props: () => ({ loggedInUser: store.state.loggedInUser })
  },
  {
    path: '/game-world',
    name: 'GameWorld',
    component: GameWorld,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
