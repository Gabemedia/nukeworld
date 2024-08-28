import { createStore } from 'vuex';
import { reactive, watch } from 'vue';
import defaultQuests from './quests';
import defaultStoryLines from './story';
import { v4 as uuidv4 } from 'uuid'; 
import items from './items';
import armor from './armor';
import aid from './aid';
import resources from './ressources';
import enemies from './enemy';

import stateModule from './state';
import gettersModule from './getters';
import mutationsModule from './mutations';
import actionsModule from './actions';

const state = reactive({
  ...stateModule,
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
});

const store = createStore({
  state,
  getters: gettersModule,
  mutations: mutationsModule,
  actions: actionsModule,
});

store.commit('assignRandomCoordinates');
store.dispatch('initializeQuests');
store.dispatch('autoResetQuests'); 

watch(
  () => state.characters,
  (newCharacters) => {
    localStorage.setItem('characters', JSON.stringify(newCharacters));
  },
  { deep: true }
);

watch(
  () => state.character,
  (newCharacter) => {
    localStorage.setItem('character', JSON.stringify(newCharacter));
  },
  { deep: true }
);

watch(
  () => state.quests,
  (newQuests) => {
    if (Array.isArray(newQuests) && newQuests.length > 0) {
      try {
        const questsString = JSON.stringify(newQuests);
        localStorage.setItem('quests', questsString);
      } catch (error) {
        console.error('Fejl ved gemning af quests i localStorage:', error);
      }
    }
  },
  { deep: true }
);

watch(() => state.storyLines, (newStoryLines) => {
  localStorage.setItem('storyLines', JSON.stringify(newStoryLines));
}, { deep: true });

watch(() => state.currentStoryLineId, (newId) => {
  localStorage.setItem('currentStoryLineId', JSON.stringify(newId));
});

export default store;
