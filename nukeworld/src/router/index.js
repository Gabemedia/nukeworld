import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import MainMenu from '@/components/MainMenu.vue';
import UserLogin from '@/components/UserLogin.vue';
import CharacterList from '@/components/data/CharacterList.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import GameWorld from '@/components/GameWorld.vue';
import CreditsRoll from '@/components/CreditsRoll.vue';
import GameSettings from '@/components/GameSettings.vue';
const routes = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu,
    meta: { allowCrawling: true }
  },
  {
    path: '/user-login',
    name: 'UserLogin',
    component: UserLogin,
    props: () => ({ loggedInUser: store.state.loggedInUser })
  },
  {
    path: '/character-list',
    name: 'CharacterList',
    component: CharacterList
  },
  {
    path: '/game-settings',
    name: 'GameSettings',
    component: GameSettings,
  },
  {
    path: '/loading',
    name: 'LoadingScreen',
    component: LoadingScreen
  },
  {
    path: '/game-world',
    name: 'GameWorld',
    component: GameWorld
  },
  {
    path: '/credits',
    name: 'CreditsRoll',
    component: CreditsRoll
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if ((to.name === 'GameWorld' && from.name !== 'LoadingScreen') || 
      (to.name === 'CharacterList' && from.name === 'MainMenu')) {
    next({ name: 'LoadingScreen' });
  } else {
    next();
  }
});

export default router;