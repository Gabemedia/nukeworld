import { createStore } from 'vuex';
import { watch, reactive } from 'vue';
import defaultQuests from './quests';

const state = reactive({
  characters: JSON.parse(localStorage.getItem('characters')) || [],
  character: JSON.parse(localStorage.getItem('character')) || {
    name: '',
    email: '',
    password: '',
    exp: 1,
    maxExp: 10,
    level: 1,
    money: 0,
  },
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
});

const store = createStore({
  state,
  mutations: {
    addCharacter(state, character) {
      state.characters.push(character);
      localStorage.setItem('characters', JSON.stringify(state.characters));
    },
    updateCharacter(state, character) {
      for (let key in character) {
        if (Object.prototype.hasOwnProperty.call(character, key)) {
          state.character[key] = character[key];
        }
      }
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    addExp(state, exp) {
      state.character.exp += exp;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    increaseMaxExp(state, amount) {
      state.character.maxExp += amount;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    addMoney(state, amount) {
      state.character.money += amount;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    updateCharacterInArray(state, character) {
      const characterInArray = state.characters.find(ch => ch.email === character.email);
      if (characterInArray) {
        Object.assign(characterInArray, character);
      }
      localStorage.setItem('characters', JSON.stringify(state.characters));
    },
    increaseCharacterLevel(state) {
      state.character.level += 1;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    increaseCharacterLevelInArray(state, character) {
      const characterInArray = state.characters.find(ch => ch.email === character.email);
      if (characterInArray) {
        characterInArray.level += 1;
      }
      localStorage.setItem('characters', JSON.stringify(state.characters));
    },
    startQuest(state, quest) {
      const index = state.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        state.quests[index] = { ...quest, disabled: true, state: 'in-progress', progress: 0 };
      }
      localStorage.setItem('quests', JSON.stringify(state.quests));
    },
    completeQuest(state, quest) {
      const index = state.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        state.quests[index] = { ...quest, state: 'completed' };
      }
      localStorage.setItem('quests', JSON.stringify(state.quests));
    },
    resetQuest(state, quest) {
      const index = state.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        state.quests[index] = { ...quest, disabled: false, state: 'not-started', progress: 0 };
      }
      localStorage.setItem('quests', JSON.stringify(state.quests));
    },
  },  
  actions: {
    login({ commit }, { username, email, password }) {
      commit('updateCharacter', { name: username, email: email, password: password });
    },
    createCharacter({ commit, state }) {
      const newCharacter = { ...state.character, level: 1, exp: 1, maxExp: 10, money: 0 };
      commit('addCharacter', newCharacter);
      commit('updateCharacter', newCharacter);
    },
    updateCharacter({ commit }, character) {
      commit('updateCharacter', character);
    },
    increaseExp({ commit, state, dispatch }, amount) {
      commit('addExp', amount);
      if (state.character.exp >= state.character.maxExp) {
        dispatch('levelUp');
      }
    },
    decreaseExp({ commit, state }) {
      if (state.character.exp - 5 >= 0) {
        commit('addExp', -5);
      }
    },
    increaseMoney({ commit, state }, amount) {
      commit('addMoney', amount);
      commit('updateCharacterInArray', state.character);
    },
    decreaseMoney({ commit, state }, amount) {
      if (state.character.money - amount >= 0) {
        commit('addMoney', -amount);
        commit('updateCharacterInArray', state.character);
      }
    },
    levelUp({ commit, state }) {
      this.levelingUp = true;
      const overflowExp = state.character.exp - state.character.maxExp;
      const newMaxExp = Math.floor(state.character.maxExp * 1.6);
      commit('updateCharacter', { exp: overflowExp * 2, maxExp: newMaxExp });
      commit('increaseCharacterLevel');
      commit('increaseCharacterLevelInArray', state.character);
    },
    handleQuest({ commit, state }, quest) {
      if (quest.state === 'not-started') {
        commit('startQuest', quest);
        const startTime = Date.now();
        const intervalId = setInterval(() => {
          // Find the quest in the state
          const questIndex = state.quests.findIndex(q => q.name === quest.name);
          if (questIndex !== -1) {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
            const remainingTime = Math.max(0, quest.duration - elapsedTime);
            // Replace the quest in the array with a new object
            state.quests.splice(questIndex, 1, { ...state.quests[questIndex], progress, remainingTime });
            if (progress >= 100) {
              clearInterval(intervalId);
              commit('completeQuest', quest);
            }
          }
        }, 100); // Update progress and remaining time every second
      } else if (quest.state === 'completed') {
        commit('resetQuest', quest);
      }
    },
    claimRewards({ commit, dispatch }, quest) {
      dispatch('increaseExp', quest.exp);
      dispatch('increaseMoney', quest.money);
      commit('resetQuest', quest);
    },
  },
});

watch(() => state.character, (newCharacter) => {
  localStorage.setItem('character', JSON.stringify(newCharacter));
}, { deep: true });

watch(() => state.quests, (newQuests) => {
  localStorage.setItem('quests', JSON.stringify(newQuests));
}, { deep: true });

export default store;