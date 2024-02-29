import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../components/UserLogin.vue';
import CharacterCreation from '../components/CharacterCreation.vue';
import GameWorld from '../components/GameWorld.vue';

const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin,
  },
  {
    path: '/character-creation',
    name: 'CharacterCreation',
    component: CharacterCreation,
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
