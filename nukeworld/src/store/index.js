import { createStore } from 'vuex';
import { reactive, watch } from 'vue';
import defaultQuests from './quests';
import { v4 as uuidv4 } from 'uuid'; 
import items from './items';
import armor from './armor';
import aid from './aid';

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
    health: 100,
    maxHealth: 100,
    weapons: [], // Ændret fra inventory
    equippedWeapons: [],
    armor: [], 
    equippedArmor: null,
  },
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
  items,
  armor,
  aid,
  mapBounds: null,
  markers: [],
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
  deleteCharacter(state, character) {
    state.characters = state.characters.filter(ch => ch.email !== character.email);
  },

  assignRandomCoordinates(state) {
    const playableArea = state.character.level < 5 ? [
      [270, 270], [850, 1650],
    ] : [
      [270, 270], [850, 1650],
    ];
    state.quests.forEach((quest) => {
      const lat = Math.random() * (playableArea[1][0] - playableArea[0][0]) + playableArea[0][0];
      const lon = Math.random() * (playableArea[1][1] - playableArea[0][1]) + playableArea[0][1];
      quest.lat = lat;
      quest.lon = lon;
    });
  },  

  addMarker(state, marker) {
    state.markers.push(marker);
  },

  updateQuestState(state, { quest, newState }) {
    const questIndex = state.quests.findIndex((q) => q.id === quest.id);
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
      state.quests[index] = {
        ...quest,
        disabled: false,
        state: 'not-started',
        progress: 0,
        claimed: false,
        startTime: null,
        remainingTime: quest.duration,
      };
    }
  },
  setQuests(state, quests) {
    state.quests = quests;
  },
  updateQuestProgress(state, { questIndex, progress, remainingTime }) {
    state.quests[questIndex].progress = progress;
    state.quests[questIndex].remainingTime = remainingTime;
  },
  addItemToWeapons(state, itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (item) {
      const newItem = { ...item, uuid: uuidv4() };
      state.character.weapons.push(newItem);
    }
  },
  equipWeapon(state, itemUuid) {
    const characterItem = state.character.weapons.find(item => item.uuid === itemUuid); // Ændret fra inventory
    if (characterItem) {
      // Fjern alle eksisterende udrustede våben
      state.character.equippedWeapons = [];

      // Tilføj det nye udrustede våben
      state.character.equippedWeapons.push(characterItem);
    }
  },
  sellWeapon(state, itemUuid) {
    const itemIndex = state.character.weapons.findIndex(item => item.uuid === itemUuid);
    if (itemIndex !== -1) {
      const soldItem = state.character.weapons[itemIndex];
      if (soldItem.price !== '-1') {
        state.character.weapons.splice(itemIndex, 1);
        state.character.money += parseInt(soldItem.price);
        state.character.equippedWeapons = state.character.equippedWeapons.filter(item => item.uuid !== itemUuid);
      }
    }
  },
  addItemToArmor(state, itemId) {
    const item = state.armor.find(i => i.id === itemId);
    if (item) {
      const newItem = { ...item, uuid: uuidv4() };
      state.character.armor.push(newItem);
    }
  },
  equipArmor(state, itemUuid) {
    const characterItem = state.character.armor.find(item => item.uuid === itemUuid);
    if (characterItem) {
      state.character.equippedArmor = characterItem;
    }
  },
  sellArmor(state, itemUuid) {
    const itemIndex = state.character.armor.findIndex(item => item.uuid === itemUuid);
    if (itemIndex !== -1) {
      const soldItem = state.character.armor[itemIndex];
      if (soldItem.price !== '-1') {
        state.character.armor.splice(itemIndex, 1);
        state.character.money += parseInt(soldItem.price);
        if (state.character.equippedArmor && state.character.equippedArmor.uuid === itemUuid) {
          state.character.equippedArmor = null;
        }
      }
    }
  },
  addItemToAid(state, itemId) {
    const item = state.aid.find(i => i.id === itemId);
    if (item) {
      const newItem = { ...item, uuid: uuidv4() };
      state.character.aid.push(newItem);
    }
  },  
  useAid(state, itemUuid) {
    const itemIndex = state.character.aid.findIndex(item => item.uuid === itemUuid);
    if (itemIndex !== -1) {
      const usedItem = state.character.aid[itemIndex];
      state.character.health = Math.min(state.character.health + usedItem.health, 100);
      state.character.aid.splice(itemIndex, 1);
    }
  },  
};

const actions = {
  login({ commit }, { username, email, password }) {
    commit('updateCharacter', { name: username, email, password });
  },
  createCharacter({ commit, state }) {
    const newCharacter = {
      ...state.character,
      level: 1,
      exp: 1,
      health: 100,
      maxExp: 2500,
      money: 0,
      weapons: [state.items[0]],
      equippedWeapons: [state.items[0]],
      armor: [state.armor[0]],
      equippedArmor: state.armor[0],
      aid: [state.aid[1], state.aid[1], state.aid[1]],
    };
    commit('addCharacter', newCharacter);
    commit('updateCharacter', newCharacter);
    commit('equipWeapon', 0);
    commit('equipArmor', 0); 
    commit('setQuests', defaultQuests);
  },
  
  updateCharacter({ commit }, character) {
    commit('updateCharacter', character);
    commit('updateCharacterInArray', character);
  },
  deleteCharacter({ commit }, character) {
    commit('deleteCharacter', character);
  },
  async quitGame({ commit, state }) {
    const updatedCharacter = { ...state.character, health: 0 };
    commit('updateCharacter', updatedCharacter);
    commit('updateCharacterInArray', updatedCharacter);
    localStorage.setItem('character', JSON.stringify(updatedCharacter));
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
    commit('updateCharacter', {
      exp: overflowExp * 2,
      maxExp: newMaxExp,
      level: state.character.level + 1,
      maxHealth: state.character.maxHealth + 50, // Tilføj denne linje
    });
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
    let obtainedReward = null;
  
    if (quest.reward && quest.reward.length > 0) {
      const rollDice = Math.random();
      if (rollDice <= quest.rewardChance) {
        const randomIndex = Math.floor(Math.random() * quest.reward.length);
        const rewardId = quest.reward[randomIndex];
        const rewardItem = state.items.find((item) => item.id === rewardId);
        if (rewardItem) {
          const newItem = { ...rewardItem, uuid: uuidv4() };
          state.character.weapons.push(newItem);
          obtainedReward = newItem;
        }
      }
    }
  
    if (quest.armorReward && quest.armorReward.length > 0) {
      const rollDice = Math.random();
      if (rollDice <= quest.armorRewardChance) {
        const randomIndex = Math.floor(Math.random() * quest.armorReward.length);
        const rewardId = quest.armorReward[randomIndex];
        const rewardItem = state.armor.find((item) => item.id === rewardId);
        if (rewardItem) {
          const newItem = { ...rewardItem, uuid: uuidv4() };
          state.character.armor.push(newItem);
          obtainedReward = newItem;
        }
      }
    }
  
    dispatch('increaseExp', quest.exp);
    dispatch('increaseMoney', quest.money);
    commit('updateCharacterInArray', state.character);
    commit('updateQuestState', { quest, newState: { claimed: true } });
    return obtainedReward;
  },
  resetQuests({ state, commit }) {
    state.quests.forEach((quest) => {
      commit('resetQuest', quest);
    });
  },

  resetCharacter({ commit, state }) {
    commit('updateCharacter', {
      exp: 1,
      maxExp: 2500,
      level: 1,
      money: 0,
      health: 100,
      weapons: [state.items[0]],
      equippedWeapons: [state.items[0]],
      armor: [state.armor[0]],
      equippedArmor: state.armor[0], 
    });
    commit('equipWeapon', state.items[0].uuid);
    commit('equipArmor', state.armor[0].uuid); 
    commit('setQuests', defaultQuests);
  },  
  clearQuests({ commit }) {
    commit('setQuests', []);
    commit('setQuests', defaultQuests);
  },
  equipWeapon({ commit }, itemId) {
    commit('equipWeapon', itemId);
  },
  sellWeapon({ commit }, itemUuid) {
    commit('sellWeapon', itemUuid);
  },
  equipArmor({ commit }, itemUuid) {
    commit('equipArmor', itemUuid);
  },
  sellArmor({ commit }, itemUuid) {
    commit('sellArmor', itemUuid);
  },
  useAid({ commit }, itemUuid) {
    commit('useAid', itemUuid);
  },
  addItemToAid({ commit }, itemId) {
    commit('addItemToAid', itemId);
  },
  addItemToWeapons({ commit }, itemId) {
    commit('addItemToWeapons', itemId);
  },
  addItemToArmor({ commit }, itemId) {
    commit('addItemToArmor', itemId);
  },
  
};

const store = createStore({
  state,
  getters,
  mutations,
  actions,
});

store.commit('assignRandomCoordinates');

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
    localStorage.setItem('quests', JSON.stringify(newQuests));
  },
  { deep: true }
);

export default store;
