// src/store/questStore.js
import defaultQuests from './quests';

export const questStore = {
  state: () => ({
    quests: JSON.parse(localStorage.getItem('quests')) || defaultQuests,
  }),
  mutations: {
    startQuest(state, questName) {
      const quest = state.quests.find(q => q.name === questName);
      if (quest) {
        quest.state = 'in-progress';
        quest.startTime = Date.now();
        localStorage.setItem('quests', JSON.stringify(state.quests));
      }
    },
    completeQuest(state, questName) {
      const quest = state.quests.find(q => q.name === questName);
      if (quest) {
        quest.state = 'completed';
        localStorage.setItem('quests', JSON.stringify(state.quests));
      }
    },
    resetQuest(state, questName) {
      const quest = state.quests.find(q => q.name === questName);
      if (quest) {
        quest.state = 'not-started';
        quest.progress = 0;
        localStorage.setItem('quests', JSON.stringify(state.quests));
      }
    },
    updateQuestProgress(state, { questName, progress }) {
      const quest = state.quests.find(q => q.name === questName);
      if (quest) {
        quest.progress = progress;
        localStorage.setItem('quests', JSON.stringify(state.quests));
      }
    },
  },
  actions: {
    startQuest({ commit }, questName) {
      commit('startQuest', questName);
    },
    completeQuest({ commit }, questName) {
      commit('completeQuest', questName);
    },
    resetQuest({ commit }, questName) {
      commit('resetQuest', questName);
    },
    updateQuestProgress({ commit }, payload) {
      commit('updateQuestProgress', payload);
    },
  },
};