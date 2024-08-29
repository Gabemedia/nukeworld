import { createStore } from 'vuex';
import { reactive, watch } from 'vue';
import defaultQuests from './quests';

import stateModule from './modules/state';
import gettersModule from './getters';
import mutationsModule from './modules/mutations';
import actionsModule from './modules/actions';

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
