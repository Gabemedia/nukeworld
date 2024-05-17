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
    inventory: [{ id: 0 }],
    equippedWeapon: JSON.parse(localStorage.getItem('equippedWeapon')) || 0,
  },
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
  items,
});

const getters = {
  characterInArray: (state) => (email) => state.characters.find((ch) => ch.email === email),
};

const mutations = {
  addCharacter(state, character) {
    state.characters.push(character);
  },
  updateCharacter(state, character) {
    Object.assign(state.character, character);
  },
  updateCharacterInArray(state, character) {
    const characterInArray = getters.characterInArray(state)(character.email);
    if (characterInArray) {
      Object.assign(characterInArray, character);
    }
  },
  increaseCharacterLevel(state) {
    state.character.level += 1;
  },
  increaseCharacterLevelInArray(state, character) {
    const characterInArray = getters.characterInArray(state)(character.email);
    if (characterInArray) {
      characterInArray.level += 1;
    }
  },
  updateQuestState(state, { quest, newState }) {
    const questIndex = state.quests.findIndex((q) => q.name === quest.name);
    if (questIndex !== -1) {
      state.quests[questIndex] = { ...state.quests[questIndex], ...newState };
    }
  },
  startQuest(state, quest) {
    const index = state.quests.findIndex((q) => q.name === quest.name);
    if (index !== -1) {
      state.quests[index] = { ...quest, disabled: true, state: 'in-progress', progress: 0, startTime: Date.now() };
    }
  },
  completeQuest(state, quest) {
    const index = state.quests.findIndex((q) => q.name === quest.name);
    if (index !== -1) {
      state.quests[index] = { ...quest, state: 'completed' };
    }
  },
  resetQuest(state, quest) {
    const index = state.quests.findIndex((q) => q.name === quest.name);
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
  equipWeapon(state, itemId) {
    const item = state.items.find(item => item.id === itemId);
    const characterItem = state.character.inventory.find(charItem => charItem.id === itemId);
    if (item && characterItem) {
      if (state.character.equippedWeapon) {
        const prevWeapon = state.items.find(item => item.id === state.character.equippedWeapon);
        if (prevWeapon) {
          prevWeapon.state = 'none';
        }
      }
      item.state = 'equipped';
      state.character.equippedWeapon = itemId;
    } else if (!state.character.equippedWeapon) {
      // Udstyr "Hands"-våbnet som standard for en ny karakter
      const handsWeapon = state.items.find(item => item.id === 0);
      if (handsWeapon) {
        handsWeapon.state = 'equipped';
        state.character.equippedWeapon = 0;
      }
    }
  },
};

const actions = {
  login({ commit }, { username, email, password }) {
    commit('updateCharacter', { name: username, email, password,});
  },
  createCharacter({ commit, state, }) {
    const newCharacter = { ...state.character, level: 1, exp: 1, maxExp: 2500, money: 0, inventory: [state.items[0]] };
    commit('addCharacter', newCharacter);
    commit('updateCharacter', newCharacter);
    commit('equipWeapon', 0);
  },
  updateCharacter({ commit }, character) {
    commit('updateCharacter', character);
    commit('updateCharacterInArray', character);
  },
  increaseExp({ commit, state, dispatch }, amount) {
    commit('updateCharacter', { exp: state.character.exp + amount });
    if (state.character.exp >= state.character.maxExp) {
      dispatch('levelUp');
    }
  },
  decreaseExp({ commit, state }) {
    const newExp = Math.max(state.character.exp - 5, 0);
    commit('updateCharacter', { exp: newExp });
  },
  increaseMoney({ commit, state }, amount) {
    commit('updateCharacter', { money: state.character.money + amount });
  },
  decreaseMoney({ commit, state }, amount) {
    const newMoney = Math.max(state.character.money - amount, 0);
    commit('updateCharacter', { money: newMoney });
  },
  levelUp({ commit, state }) {
    const overflowExp = state.character.exp - state.character.maxExp;
    const newMaxExp = Math.floor(state.character.maxExp * 1.6);
    commit('updateCharacter', { exp: overflowExp * 2, maxExp: newMaxExp, level: state.character.level + 1 });
    commit('increaseCharacterLevelInArray', state.character);
  },
  startQuestProgress({ commit, state }, quest) {
    const startTime = quest.startTime || Date.now();
    const questIndex = state.quests.findIndex((q) => q.name === quest.name);
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
      state.quests[state.quests.findIndex((q) => q.name === quest.name)].startTime = startTime;
      dispatch('startQuestProgress', { ...quest, startTime });
    } else if (quest.state === 'in-progress') {
      dispatch('startQuestProgress', quest);
    }
  },
  claimRewards({ commit, dispatch, state }, quest) {
    dispatch('increaseExp', quest.exp);
    dispatch('increaseMoney', quest.money);

    if (quest.reward && quest.reward.length > 0) {
      quest.reward.forEach((rewardId) => {
        const rewardItem = state.items.find((item) => item.id === rewardId);
        if (rewardItem) {
          state.character.inventory.push(rewardItem);
          console.log(`You received a ${rewardItem.name} as a reward for completing the quest "${quest.name}"!`);
        }
      });
    }

    commit('resetQuest', quest);
    commit('updateCharacterInArray', state.character);
  },
  clearQuests({ commit }) {
    commit('setQuests', []);
    commit('setQuests', defaultQuests);
  },
  equipWeapon({ commit }, itemId) {
    commit('equipWeapon', itemId);
  },
};

const store = createStore({
  state,
  getters,
  mutations,
  actions,
});

watch(
  () => state.character,
  (newCharacter) => {
    localStorage.setItem('character', JSON.stringify(newCharacter));
    localStorage.setItem('equippedWeapon', JSON.stringify(newCharacter.equippedWeapon));
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
