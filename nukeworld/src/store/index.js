import { createStore } from 'vuex';
import { reactive, watch } from 'vue';
import defaultQuests from './quests';
import defaultStoryLines from './story';
import { v4 as uuidv4 } from 'uuid'; 
import items from './items';
import armor from './armor';
import aid from './aid';
import resources from './ressources';

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
    resources: [],
  },
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
  storyLines: reactive(JSON.parse(localStorage.getItem('storyLines')) || defaultStoryLines),
  currentStoryLineId: JSON.parse(localStorage.getItem('currentStoryLineId')) || null,
  items,
  armor,
  aid,
  resources,
  mapBounds: null,
  markers: [],
});


const getters = {
  characterInArray: (state) => (email) => state.characters.find((ch) => ch.email === email),
  getResource: (state) => (resourceId) => {
    return state.character.resources.find(r => r.id === resourceId);
  },
  currentStoryLine: (state) => state.storyLines.find(sl => sl.id === state.currentStoryLineId),
  currentStoryStep: (state, getters) => {
    const storyLine = getters.currentStoryLine;
    return storyLine ? storyLine.steps[storyLine.currentStepIndex || 0] : null;
  },
  availableStoryLines: (state) => state.storyLines.filter(sl => {
    if (sl.completed) return false;
    if (state.character.level < sl.levelRequirement) return false;
    if (sl.requiredStoryLineId) {
      const requiredStoryLine = state.storyLines.find(rsl => rsl.id === sl.requiredStoryLineId);
      if (!requiredStoryLine || !requiredStoryLine.completed) return false;
    }
    return true;
  }),  
  completedStoryLines: (state) => state.storyLines.filter(sl => sl.completed),
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
  updateQuest(state, updatedQuest) {
    const index = state.quests.findIndex(q => q.id === updatedQuest.id);
    if (index !== -1) {
      state.quests[index] = updatedQuest;
      localStorage.setItem('quests', JSON.stringify(state.quests));
    }
  },
  startQuest(state, quest) {
    const index = state.quests.findIndex((q) => q.name === quest.name);
    if (index !== -1) {
      state.quests[index] = { ...quest, disabled: true, state: 'in-progress', progress: 0, startTime: Date.now() };
    }
  },
  updateQuestProgress({ commit, dispatch }, quest) {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - quest.startTime;
      const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
      const remainingTime = Math.max(0, quest.duration - elapsedTime);
      const updatedQuest = { ...quest, progress, remainingTime };
      
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        updatedQuest.state = 'ready-to-claim';
      }
      
      commit('updateQuest', updatedQuest);
      
      if (updatedQuest.state === 'ready-to-claim') {
        dispatch('completeQuest', updatedQuest);
      }
    }, 1000);
  },
  completeQuest({ commit }, quest) {
    commit('updateQuest', { ...quest, state: 'ready-to-claim' });
  },
  claimQuest(state, quest) {
    const index = state.quests.findIndex((q) => q.name === quest.name);
    if (index !== -1) {
      state.quests[index] = { ...quest, state: 'completed' };
    }
  },
  resetQuest(state, quest) {
    const index = state.quests.findIndex((q) => q.id === quest.id);
    if (index !== -1) {
      state.quests[index] = {
        ...quest,
        state: 'not-started',
        progress: 0,
        startTime: null,
        remainingTime: quest.duration,
      };
    }
  },
  setQuests(state, quests) {
    state.quests = quests;
  },
  setCurrentStoryLineId(state, id) {
    state.currentStoryLineId = id;
    if (id !== null) {
      const storyLine = state.storyLines.find(sl => sl.id === id);
      if (storyLine && !Object.prototype.hasOwnProperty.call(storyLine, 'currentStepIndex')) {
        storyLine.currentStepIndex = 0;
      }
    }
  },
  progressStoryStep(state) {
    if (state.currentStoryLineId !== null) {
      const storyLine = state.storyLines.find(sl => sl.id === state.currentStoryLineId);
      if (storyLine) {
        storyLine.currentStepIndex = (storyLine.currentStepIndex || 0) + 1;
      }
    }
  },
  addPlayerChoice(state, { storyLineId, choice }) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId);
    if (storyLine) {
      if (!storyLine.playerChoices) {
        storyLine.playerChoices = [];
      }
      storyLine.playerChoices.push(choice);
    }
  },

  completeStoryLine(state, id) {
    const storyLine = state.storyLines.find(sl => sl.id === id);
    if (storyLine) {
      storyLine.completed = true;
      storyLine.currentStepIndex = 0;
    }
  },

  setStoryLines(state, storyLines) {
    state.storyLines = storyLines;
  },
  
  checkRequiredResources({ state }, requiredResources) {
    if (!requiredResources || requiredResources.length === 0) return true;
    
    return requiredResources.every(required => {
      const playerResourceCount = state.character.resources.filter(r => r.id === required.id).length;
      return playerResourceCount >= required.amount;
    });
  },

  useRequiredResources({ commit, state }, requiredResources) {
    if (!requiredResources || requiredResources.length === 0) return;
    
    requiredResources.forEach(required => {
      const playerResources = state.character.resources.filter(r => r.id === required.id);
      for (let i = 0; i < required.amount; i++) {
        if (playerResources && playerResources.length > 0) {
          commit('removeResource', playerResources[i].uuid);
        }
      }
    });
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
        state.character.money += Math.floor(parseInt(soldItem.price) * 0.1);
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
        state.character.money += Math.floor(parseInt(soldItem.price) * 0.1);
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
  setFirstAidItem(state, item) {
    if (state.character.aid.length > 0) {
      state.character.aid[0] = item;
    } else {
      state.character.aid.push(item);
    }
  },
  useAid(state, itemUuid) {
    const itemIndex = state.character.aid.findIndex(item => item.uuid === itemUuid);
    if (itemIndex !== -1) {
      const usedItem = state.character.aid[itemIndex];
      state.character.health = Math.min(state.character.health + usedItem.health, state.character.maxHealth);
      state.character.aid.splice(itemIndex, 1);
    }
  },
  addResource(state, resourceId) {
    const resource = state.resources.find(r => r.id === resourceId);
    if (resource) {
      state.character.resources.push({ ...resource, uuid: uuidv4() });
    }
  },

  removeResource(state, resourceUuid) {
    state.character.resources = state.character.resources.filter(r => r.uuid !== resourceUuid);
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
      aid: [],
      resources: [],
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
  
  handleQuest({ dispatch, commit, state }, quest) {
    const stateQuest = state.quests.find(q => q.id === quest.id);
    if (!stateQuest) return;

    if (stateQuest.state === 'not-started' || stateQuest.state === 'in-progress') {
      const updatedQuest = { 
        ...stateQuest, 
        state: 'in-progress', 
        progress: stateQuest.progress || 0,
        startTime: stateQuest.startTime || Date.now()
      };
      commit('updateQuest', updatedQuest);
      dispatch('startQuestProgress', updatedQuest);
    }
  },
  startQuestProgress({ commit, state }, quest) {
    const updateProgress = () => {
      const stateQuest = state.quests.find(q => q.id === quest.id);
      if (!stateQuest || stateQuest.state !== 'in-progress') return;
  
      const now = Date.now();
      const elapsedTime = now - stateQuest.startTime;
      const progress = Math.min((elapsedTime / stateQuest.duration) * 100, 100);
      const remainingTime = Math.max(0, stateQuest.duration - elapsedTime);
      const updatedQuest = { ...stateQuest, progress, remainingTime };
      
      if (remainingTime <= 0) {
        updatedQuest.state = 'ready-to-claim';
      }
      
      commit('updateQuest', updatedQuest);
  
      if (updatedQuest.state === 'ready-to-claim') {
        clearInterval(stateQuest.intervalId);
      }
    };
  
    const existingQuest = state.quests.find(q => q.id === quest.id);
    if (existingQuest && existingQuest.intervalId) {
      clearInterval(existingQuest.intervalId);
    }
  
    if (!quest.startTime) {
      quest.startTime = Date.now();
    }
  
    const intervalId = setInterval(updateProgress, 1000);
    commit('updateQuest', { ...quest, intervalId });
    updateProgress(); // Kør første gang med det samme
  },
  
  
  initializeQuests({ commit, state, dispatch }) {
    const savedQuests = JSON.parse(localStorage.getItem('quests'));
    if (savedQuests && savedQuests.length > 0) {
      commit('setQuests', savedQuests);
      state.quests.forEach(quest => {
        if (quest.state === 'in-progress') {
          dispatch('resumeQuestProgress', quest);
        }
      });
    } else {
      commit('setQuests', defaultQuests);
    }
  },  
  
  resumeQuestProgress({ dispatch, commit }, quest) {
    const now = Date.now();
    const elapsedTime = now - quest.startTime;
    const remainingTime = Math.max(0, quest.duration - elapsedTime);
    const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
  
    if (remainingTime > 0) {
      const updatedQuest = { ...quest, progress, remainingTime };
      commit('updateQuest', updatedQuest);
      dispatch('startQuestProgress', updatedQuest);
    } else {
      commit('updateQuest', { ...quest, state: 'ready-to-claim', progress: 100 });
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
    commit('claimQuest', quest); // Opdater quest state til 'completed'
    return obtainedReward;
  },

  resetQuests({ state, commit }) {
    state.quests.forEach((quest) => {
      if (quest.state === 'completed') {
        commit('resetQuest', quest);
      }
    });
    localStorage.setItem('quests', JSON.stringify(state.quests));
  },
  

  resetCharacter({ commit, state, dispatch }) {
    commit('updateCharacter', {
      exp: 1,
      maxExp: 2500,
      level: 1,
      money: 0,
      health: 100,
      maxHealth: 100,
      weapons: [state.items[0]],
      equippedWeapons: [state.items[0]],
      armor: [state.armor[0]],
      equippedArmor: state.armor[0],
      resources: [],
      currentStoryLine: null,
      currentStoryStep: null,
    });
    commit('equipWeapon', state.items[0].uuid);
    commit('equipArmor', state.armor[0].uuid); 
    commit('setQuests', defaultQuests);
    commit('setCurrentStoryLineId', null);
    dispatch('resetStoryLines');
  },  
  clearQuests({ commit }) {
    commit('setQuests', []);
    commit('setQuests', defaultQuests);
  },

  startStoryLine({ commit, state }, storyLineId) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId && !sl.completed && state.character.level >= sl.levelRequirement);
    if (storyLine) {
      commit('setCurrentStoryLineId', storyLineId);
    }
  },

  completeStoryLine({ commit, dispatch, state }, { storyLineId, giveReward }) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId);
    if (storyLine && !storyLine.completed) {
      if ((storyLine.alwaysGiveReward || giveReward) && storyLine.reward) {
        if (storyLine.reward.exp) {
          dispatch('increaseExp', storyLine.reward.exp);
        }
        if (storyLine.reward.money) {
          dispatch('increaseMoney', storyLine.reward.money);
        }
        if (storyLine.reward.resourceRewards && storyLine.reward.resourceRewards.length > 0) {
          storyLine.reward.resourceRewards.forEach(reward => {
            for (let i = 0; i < reward.amount; i++) {
              dispatch('addResource', reward.id);
            }
          });
        }
      }
      commit('completeStoryLine', storyLineId);
      commit('setCurrentStoryLineId', null);
    }
  },

  checkRequiredResources({ state }, requiredResources) {
    if (!requiredResources || requiredResources.length === 0) return true;
    
    return requiredResources.every(required => {
      const playerResourceCount = state.character.resources.filter(r => r.id === required.id).length;
      return playerResourceCount >= required.amount;
    });
  },
  
  useRequiredResources({ dispatch }, requiredResources) {
    if (!requiredResources || requiredResources.length === 0) return;
    
    requiredResources.forEach(required => {
      for (let i = 0; i < required.amount; i++) {
        dispatch('removeResource', required.id);
      }
    });
  },

  progressStory({ commit, dispatch, state }, { nextId, choiceText, giveReward }) {
    if (state.currentStoryLineId !== null) {
      const currentStoryLine = state.storyLines.find(sl => sl.id === state.currentStoryLineId);
      const currentStep = currentStoryLine.steps[currentStoryLine.currentStepIndex || 0];
      
      if (currentStep) {
        const selectedOption = currentStep.playerOptions.find(option => option.text === choiceText);
        
        if (selectedOption && selectedOption.requiredResources) {
          const hasResources = dispatch('checkRequiredResources', selectedOption.requiredResources);
          if (!hasResources) {
            return;
          }
          dispatch('useRequiredResources', selectedOption.requiredResources);
        }
      }
      
      commit('addPlayerChoice', { storyLineId: state.currentStoryLineId, choice: choiceText });
      
      if (nextId === null) {
        dispatch('completeStoryLine', { storyLineId: state.currentStoryLineId, giveReward });
      } else {
        commit('progressStoryStep');
      }
    }
  },
  
  resetStoryLines({ commit, state }) {
    const resetStoryLines = state.storyLines.map(storyLine => ({
      ...storyLine,
      completed: false,
      currentStepIndex: 0,
      playerChoices: []
    }));
    commit('setStoryLines', resetStoryLines);
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
  
  autoResetQuests({ dispatch }) {
    setInterval(() => {
      dispatch('resetCompletedQuests');
    }, 60000); // 60 sekunder
  },
  
  // Tilføj denne nye action
  resetCompletedQuests({ state, commit }) {
    state.quests.forEach((quest) => {
      if (quest.state === 'completed') {
        commit('resetQuest', quest);
      }
    });
    localStorage.setItem('quests', JSON.stringify(state.quests));
  },
  
  addResource({ commit }, resourceId) {
    commit('addResource', resourceId);
  },
  removeResource({ commit }, resourceUuid) {
    commit('removeResource', resourceUuid);
  },
};

const store = createStore({
  state,
  getters,
  mutations,
  actions,
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
       //console.log('Quests gemt i localStorage:', questsString);
      } catch (error) {
       //console.error('Fejl ved gemning af quests i localStorage:', error);
      }
    } else {
      //console.warn('Forsøg på at gemme tomme eller ugyldige quests forhindret');
    }
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


// Watches for localStorage
watch(() => state.storyLines, (newStoryLines) => {
  localStorage.setItem('storyLines', JSON.stringify(newStoryLines));
}, { deep: true });

watch(() => state.currentStoryLineId, (newId) => {
  localStorage.setItem('currentStoryLineId', JSON.stringify(newId));
});
export default store;
