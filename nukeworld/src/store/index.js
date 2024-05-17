import { createStore } from 'vuex';
import { reactive, watch } from 'vue';
import defaultQuests from './quests';
import items from './items';

const state = reactive({
  characters: JSON.parse(localStorage.getItem('characters')) || [],
  character: JSON.parse(localStorage.getItem('character')) || {
    name: '',
    email: '',
    password: '',
    exp: 1,
    maxExp: 2500,
    level: 1,
    money: 0,
    inventory: [],
  },
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
  items: items,
});

const store = createStore({
  state,
  mutations: {
    addCharacter(state, character) {
      state.characters.push(character);
    },
    updateCharacter(state, character) {
      Object.assign(state.character, character);
    },
    addExp(state, exp) {
      state.character.exp += exp;
    },
    increaseMaxExp(state, amount) {
      state.character.maxExp += amount;
    },
    addMoney(state, amount) {
      state.character.money += amount;
    },
    updateCharacterInArray(state, character) {
      const characterInArray = state.characters.find(ch => ch.email === character.email);
      if (characterInArray) {
        Object.assign(characterInArray, character);
      }
    },
    increaseCharacterLevel(state) {
      state.character.level += 1;
    },
    increaseCharacterLevelInArray(state, character) {
      const characterInArray = state.characters.find(ch => ch.email === character.email);
      if (characterInArray) {
        characterInArray.level += 1;
      }
    },
    updateQuestState(state, { quest, newState }) {
      const questIndex = state.quests.findIndex(q => q.name === quest.name);
      if (questIndex !== -1) {
        state.quests[questIndex] = { ...state.quests[questIndex], ...newState };
      }
    },
    startQuest(state, quest) {
      const index = state.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        state.quests[index] = { ...quest, disabled: true, state: 'in-progress', progress: 0, startTime: Date.now() };
      }
    },
    completeQuest(state, quest) {
      const index = state.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        state.quests[index] = { ...quest, state: 'completed' };
      }
    },
    resetQuest(state, quest) {
      const index = state.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        state.quests[index] = { ...quest, disabled: false, state: 'not-started', progress: 0 };
      }
    },
    setQuests(state, quests) {
      state.quests = quests;
    },
    updateQuestProgress(state, { questIndex, progress, remainingTime }) {
      state.quests[questIndex].progress = progress;
      state.quests[questIndex].remainingTime = remainingTime;
    },
  },
  actions: {
    login({ commit }, { username, email, password }) {
      commit('updateCharacter', { name: username, email, password });
    },
    createCharacter({ commit, state }) {
      const newCharacter = { ...state.character, level: 1, exp: 1, maxExp: 2500, money: 0 };
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
      const overflowExp = state.character.exp - state.character.maxExp;
      const newMaxExp = Math.floor(state.character.maxExp * 1.6);
      commit('updateCharacter', { exp: overflowExp * 2, maxExp: newMaxExp });
      commit('increaseCharacterLevel');
      commit('increaseCharacterLevelInArray', state.character);
    },
    startQuestProgress({ commit, state }, quest) {
      const startTime = quest.startTime || Date.now();
      const questIndex = state.quests.findIndex(q => q.name === quest.name);
      state.quests[questIndex].startTime = startTime;

      const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
        const remainingTime = Math.max(0, quest.duration - elapsedTime);
        commit('updateQuestProgress', { questIndex, progress, remainingTime });
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          commit('completeQuest', quest);
        }
      }, 1000);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, quest.duration - elapsedTime);
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        commit('completeQuest', quest);
      }
    },
    handleQuest({ dispatch, commit, state }, quest) {
      if (quest.state === 'not-started') {
        commit('startQuest', quest);
        const startTime = Date.now();
        state.quests[state.quests.findIndex(q => q.name === quest.name)].startTime = startTime;
        dispatch('startQuestProgress', { ...quest, startTime });
      } else if (quest.state === 'in-progress') {
        dispatch('startQuestProgress', quest);
      }
    },
    claimRewards({ commit, dispatch, state }, quest) {
      dispatch('increaseExp', quest.exp);
      dispatch('increaseMoney', quest.money);
  
      // Check if the quest has a reward
      if (quest.reward && quest.reward.length > 0) {
        // Select a random item ID from the reward array
        const rewardItemId = quest.reward[Math.floor(Math.random() * quest.reward.length)];
  
        // Find the item object in the items array from the state
        const rewardItem = state.items.weapons.find(item => item.id === rewardItemId) ||
                           state.items.armor.find(item => item.id === rewardItemId) ||
                           state.items.aid.find(item => item.id === rewardItemId) ||
                           state.items.misc.find(item => item.id === rewardItemId) ||
                           state.items.junk.find(item => item.id === rewardItemId) ||
                           state.items.account.find(item => item.id === rewardItemId);
  
        if (rewardItem) {
          // Add the reward item to the character's inventory
          state.character.inventory.push(rewardItem);
  
          // Display a notification or message to the player
          console.log(`You received a ${rewardItem.name} as a reward for completing the quest "${quest.name}"!`);
        }
      }
  
      commit('resetQuest', quest);
    },
    clearQuests({ commit }) {
      commit('setQuests', []);
      commit('setQuests', defaultQuests);
    },
  },
});

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
    localStorage.setItem('quests', JSON.stringify(newQuests));
  },
  { deep: true }
);

export default store;
