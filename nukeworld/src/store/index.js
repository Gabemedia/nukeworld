import { createStore } from 'vuex';
import { reactive, watch } from 'vue';
import defaultQuests from './quests';
import defaultStoryLines from './story';
import { v4 as uuidv4 } from 'uuid'; 
import items from './items';
import armor from './armor';
import aid from './aid';
import resources from './ressources';
import premium from './premium.js';
import enemies from './enemy';
import settlement from './settlement';
import perks from './perks';

const state = reactive({
  characters: JSON.parse(localStorage.getItem('characters')) || [],
  character: JSON.parse(localStorage.getItem('character')) || {
    id: '',
    name: '',
    email: '',
    password: '',
    exp: 1,
    maxExp: 2500,
    level: 1,
    money: 0,
    health: 100,
    maxHealth: 100,
    weapons: [], 
    equippedWeapons: [],
    armor: [], 
    equippedArmor: null,
    aid: [],
    resources: [],
    premium: [],
    // SPECIAL system attributes
    special: {
      strength: 1,     // Affects attack damage and carry capacity
      perception: 1,   // Affects critical hit chance and accuracy
      endurance: 1,    // Affects health points and poison/radiation resistance
      charisma: 1,     // Affects shop prices and dialog options
      intelligence: 1, // Affects experience gained and skill points
      agility: 1,      // Affects dodge chance and movement speed
      luck: 1         // Affects critical hit chance and loot quality
    },
    skillPoints: 0,    // Available skill points to spend on SPECIAL
    availablePerks: [], // Array of available perks based on SPECIAL + level
    activePerks: []     // Array of active perks player has chosen
  },
  quests: reactive(JSON.parse(localStorage.getItem('quests')) || defaultQuests),
  storyLines: reactive(JSON.parse(localStorage.getItem('storyLines')) || defaultStoryLines),
  currentStoryLineId: JSON.parse(localStorage.getItem('currentStoryLineId')) || null,
  settlementMarker: JSON.parse(localStorage.getItem('settlementMarker')) || null,
  isSettlementModalOpen: false,
  isLootboxModalOpen: false,
  currentLootboxRewards: [],
  currentLootboxName: '',
  items,
  armor,
  aid,
  resources,
  premium,
  mapBounds: null,
  markers: [],
  currentBattleStoryLineId: null,
  currentBattleStepIndex: null,
  currentEnemyId: null,
  defeatedEnemies: {},
  userSettings: {
    music: (() => {
      try {
        const saved = localStorage.getItem('musicSettings');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure the parsed object has the required properties
          return {
            enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : true,
            volume: typeof parsed.volume === 'number' ? parsed.volume : 0.5
          };
        }
        return { enabled: true, volume: 0.5 };
      } catch (error) {
        console.error('Error loading music settings:', error);
        return { enabled: true, volume: 0.5 };
      }
    })(),
    isDeveloperMode: false
  }
});


// Helper function to generate random rewards
const generateRandomReward = (state) => {
  const categories = ['weapons', 'armor', 'aid', 'resources'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  switch (randomCategory) {
    case 'weapons': {
      const availableWeapons = state.items.filter(item => item.price !== -1 && item.id !== 0);
      if (availableWeapons.length > 0) {
        const randomWeapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
        return {
          type: 'weapon',
          item: { ...randomWeapon, uuid: uuidv4() },
          category: 'weapons'
        };
      }
      break;
    }
    case 'armor': {
      const availableArmor = state.armor.filter(item => item.price !== -1 && item.id !== 0);
      if (availableArmor.length > 0) {
        const randomArmor = availableArmor[Math.floor(Math.random() * availableArmor.length)];
        return {
          type: 'armor',
          item: { ...randomArmor, uuid: uuidv4() },
          category: 'armor'
        };
      }
      break;
    }
    case 'aid': {
      const availableAid = state.aid.filter(item => item.price !== -1 && item.id !== 0);
      if (availableAid.length > 0) {
        const randomAid = availableAid[Math.floor(Math.random() * availableAid.length)];
        return {
          type: 'aid',
          item: { ...randomAid, uuid: uuidv4() },
          category: 'aid'
        };
      }
      break;
    }
    case 'resources': {
      const availableResources = state.resources.filter(item => item.price !== -1 && item.id !== 0);
      if (availableResources.length > 0) {
        const randomResource = availableResources[Math.floor(Math.random() * availableResources.length)];
        return {
          type: 'resource',
          item: { ...randomResource, uuid: uuidv4() },
          category: 'resources'
        };
      }
      break;
    }
  }
  
  // Fallback: give money
  return {
    type: 'money',
    amount: Math.floor(Math.random() * 50) + 10,
    category: 'money'
  };
};

const getters = {
  characterById: (state) => (id) => state.characters.find((ch) => ch.id === id),
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
  currentEnemy: (state) => {
    return state.currentEnemyId ? enemies.find(e => e.id === state.currentEnemyId) : null;
  },

  // SPECIAL system getters for bonuses
  totalAttackBonus: (state) => {
    const strengthBonus = state.character.special.strength; // 1:1 ratio - each Strength point = +1 Attack
    const perkBonus = state.character.activePerks
      .filter(p => p.effect.type === 'damage')
      .reduce((sum, p) => sum + p.effect.value, 0);
    return strengthBonus + perkBonus;
  },

  totalDefenseBonus: (state) => {
    const enduranceBonus = state.character.special.endurance; // 1:1 ratio - each Endurance point = +1 Defense
    return enduranceBonus;
  },

  criticalHitChance: (state) => {
    const perceptionBonus = state.character.special.perception * 0.02; // 2% per point
    const luckBonus = state.character.special.luck * 0.01; // 1% per point
    return Math.min(perceptionBonus + luckBonus, 0.5); // Max 50% crit chance
  },

  dodgeChance: (state) => {
    const agilityBonus = state.character.special.agility * 0.02; // 2% per point
    const perkBonus = state.character.activePerks
      .filter(p => p.effect.type === 'dodge')
      .reduce((sum, p) => sum + p.effect.value, 0);
    return Math.min(agilityBonus + perkBonus, 0.5); // Max 50% dodge chance
  },

  experienceMultiplier: (state) => {
    const intelligenceBonus = 1 + (state.character.special.intelligence * 0.05); // 5% per point
    const perkBonus = state.character.activePerks
      .filter(p => p.effect.type === 'expBonus')
      .reduce((sum, p) => sum + (p.effect.value - 1), 0);
    return intelligenceBonus + perkBonus;
  },

  shopPriceMultiplier: (state) => {
    const charismaBonus = 1 - (state.character.special.charisma * 0.02); // 2% discount per point
    const perkBonus = state.character.activePerks
      .filter(p => p.effect.type === 'shopDiscount')
      .reduce((multiplier, p) => multiplier * p.effect.value, 1);
    return Math.max(charismaBonus * perkBonus, 0.5); // Min 50% of original price
  },

  moneyMultiplier: (state) => {
    const luckBonus = 1 + (state.character.special.luck * 0.03); // 3% per point
    const perkBonus = state.character.activePerks
      .filter(p => p.effect.type === 'moneyBonus')
      .reduce((sum, p) => sum + (p.effect.value - 1), 0);
    return luckBonus + perkBonus;
  },
  
  // Perk system getters
  getPerkById: () => (perkId) => {
    return perks.getPerkById(perkId);
  },
  
  getAllPerks: () => {
    return perks.getAllPerks();
  }
};

const mutations = {
  addCharacter(state, character) {
    state.characters.push(character);
  },
  updateCharacter(state, character) {
    Object.assign(state.character, character);
  },
  updateCharacterInArray(state, character) {
    const index = state.characters.findIndex(ch => ch.id === character.id);
    if (index !== -1) {
      state.characters[index] = { ...state.characters[index], ...character };
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
        lat: quest.lat,
        lon: quest.lon
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

  resetStoryLineProgress(state, storyLineId) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId);
    if (storyLine) {
      storyLine.currentStepIndex = 0;
      storyLine.playerChoices = [];
    }
  },

  setStoryLines(state, storyLines) {
    state.storyLines = storyLines;
  },
  
  checkRequiredResources({ state }, requiredResources) {
    return requiredResources.every(required => {
      const resourceCount = state.character.resources.filter(r => r.id === required.id).length;
      return resourceCount >= required.amount;
    });
  },
  useRequiredResources({ state, commit }, requiredResources) {
    requiredResources.forEach(required => {
      for (let i = 0; i < required.amount; i++) {
        const resourceIndex = state.character.resources.findIndex(r => r.id === required.id);
        if (resourceIndex !== -1) {
          commit('removeResourceAtIndex', resourceIndex);
        }
      }
    });
  },
  updateSettlementMarker({ commit }, marker) {
    commit('setSettlementMarker', marker);
  },
  openSettlementModal({ commit }) {
    commit('setSettlementModalOpen', true);
  },
  removeResourceAtIndex(state, index) {
    state.character.resources.splice(index, 1);
  },
  setSettlementMarker(state, marker) {
    state.settlementMarker = marker;
    if (marker) {
      localStorage.setItem('settlementMarker', JSON.stringify(marker));
    } else {
      localStorage.removeItem('settlementMarker');
    }
  },
  
  setSettlementModalOpen(state, isOpen) {
    state.isSettlementModalOpen = isOpen;
  },
  setLootboxModalOpen(state, isOpen) {
    state.isLootboxModalOpen = isOpen;
  },
  setCurrentLootboxRewards(state, rewards) {
    state.currentLootboxRewards = rewards;
  },
  setCurrentLootboxName(state, name) {
    state.currentLootboxName = name;
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

  sellResource(state, resourceUuid) {
    const resourceIndex = state.character.resources.findIndex(item => item.uuid === resourceUuid);
    if (resourceIndex !== -1) {
      const soldItem = state.character.resources[resourceIndex];
      if (soldItem.price !== '-1') {
        state.character.resources.splice(resourceIndex, 1);
        state.character.money += Math.floor(parseInt(soldItem.price) * 0.1);
      }
    }
  },

  sellResourceStack(state, stack) {
    if (!Array.isArray(stack)) return;
    
    let totalValue = 0;
    stack.forEach(resource => {
      const resourceIndex = state.character.resources.findIndex(item => item.uuid === resource.uuid);
      if (resourceIndex !== -1) {
        const soldItem = state.character.resources[resourceIndex];
        if (soldItem.price !== '-1') {
          state.character.resources.splice(resourceIndex, 1);
          totalValue += parseInt(soldItem.price);
        }
      }
    });
    
    state.character.money += Math.floor(totalValue * 0.1);
  },

  sellAid(state, itemUuid) {
    const itemIndex = state.character.aid.findIndex(item => item.uuid === itemUuid);
    if (itemIndex !== -1) {
      const soldItem = state.character.aid[itemIndex];
      if (soldItem.price !== '-1') {
        state.character.aid.splice(itemIndex, 1);
        state.character.money += Math.floor(parseInt(soldItem.price) * 0.1);
      }
    }
  },
  sellPremium(state, itemUuid) {
    if (!state.character.premium) {
      state.character.premium = [];
      return;
    }
    const itemIndex = state.character.premium.findIndex(item => item.uuid === itemUuid);
    if (itemIndex !== -1) {
      const soldItem = state.character.premium[itemIndex];
      if (soldItem.price !== '-1') {
        state.character.premium.splice(itemIndex, 1);
        state.character.money += Math.floor(parseInt(soldItem.price) * 0.1);
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
  addItemToPremium(state, itemId) {
    const item = state.premium.find(i => i.id === itemId);
    if (item) {
      const newItem = { ...item, uuid: uuidv4() };
      if (!state.character.premium) {
        state.character.premium = [];
      }
      state.character.premium.push(newItem);
    }
  },
  openLootbox(state, lootboxUuid) {
    const lootboxIndex = state.character.premium.findIndex(item => item.uuid === lootboxUuid);
    if (lootboxIndex !== -1) {
      const lootbox = state.character.premium[lootboxIndex];
      if (lootbox.type === 'lootbox' && lootbox.lootbox) {
        // Remove the lootbox from inventory
        state.character.premium.splice(lootboxIndex, 1);
        
        // Set the lootbox name
        state.currentLootboxName = lootbox.name;
        
        // Generate random rewards based on lootbox count
        const rewards = [];
        for (let i = 0; i < lootbox.lootbox; i++) {
          const reward = generateRandomReward(state);
          if (reward) {
            rewards.push(reward);
          }
        }
        
        // Set the rewards in state
        state.currentLootboxRewards = rewards;
        return rewards;
      }
    }
    return [];
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

  setCurrentBattleStoryLineId(state, id) {
    state.currentBattleStoryLineId = id;
  },
  setCurrentBattleStepIndex(state, index) {
    state.currentBattleStepIndex = index;
  }, 

  removeResource(state, resourceUuid) {
    state.character.resources = state.character.resources.filter(r => r.uuid !== resourceUuid);
  },
  setEnemyEncounterOpen(state, isOpen) {
    state.isEnemyEncounterOpen = isOpen;
  },
  setCurrentEnemyId(state, enemyId) {
    state.currentEnemyId = enemyId;
  },
  addDefeatedEnemy(state, enemyId) {
    if (!state.defeatedEnemies[enemyId]) {
      state.defeatedEnemies[enemyId] = 0;
    }
    state.defeatedEnemies[enemyId]++;
  },
  resetDefeatedEnemies(state) {
    state.defeatedEnemies = {};
  },
  cancelStoryLine(state) {
    state.currentStoryLineId = null;
  },
  updateMusicSettings(state, { enabled, volume }) {
    // Ensure we have valid values
    const validEnabled = typeof enabled === 'boolean' ? enabled : true;
    const validVolume = typeof volume === 'number' && volume >= 0 && volume <= 1 ? volume : 0.5;
    
    state.userSettings.music.enabled = validEnabled;
    state.userSettings.music.volume = validVolume;
    
    // Save to localStorage
    try {
      localStorage.setItem('musicSettings', JSON.stringify({
        enabled: validEnabled,
        volume: validVolume
      }));
    } catch (error) {
      console.error('Error saving music settings to localStorage:', error);
    }
  },
  toggleDeveloperMode(state) {
    state.userSettings.isDeveloperMode = !state.userSettings.isDeveloperMode;
  },

  // SPECIAL system mutations
  increaseSpecialStat(state, { stat, amount = 1 }) {
    if (state.character.special[stat] && state.character.skillPoints >= amount) {
      // Max SPECIAL stat is 10
      const newValue = Math.min(state.character.special[stat] + amount, 10);
      const actualIncrease = newValue - state.character.special[stat];
      
      state.character.special[stat] = newValue;
      state.character.skillPoints -= actualIncrease;
    }
  },
  
  setSkillPoints(state, points) {
    state.character.skillPoints = points;
  },
  
  addSkillPoints(state, points) {
    state.character.skillPoints += points;
  },
  
  addPerk(state, perk) {
    if (!state.character.activePerks.find(p => p.id === perk.id)) {
      state.character.activePerks.push(perk);
    }
  },
  
  removePerk(state, perkId) {
    state.character.activePerks = state.character.activePerks.filter(p => p.id !== perkId);
  },
  
  updateAvailablePerks(state, perks) {
    state.character.availablePerks = perks;
  }
};

const actions = {
  login({ commit }, { username, email, password }) {
    commit('updateCharacter', { name: username, email, password });
  },
  createCharacter({ commit, state }, characterData) {
    const newCharacter = {
      id: uuidv4(),
      name: characterData.name,
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
      premium: [],
      // SPECIAL system for new character
      special: {
        strength: 1,
        perception: 1,
        endurance: 1,
        charisma: 1,
        intelligence: 1,
        agility: 1,
        luck: 1
      },
      skillPoints: 0,
      availablePerks: [],
      activePerks: []
    };
    commit('addCharacter', newCharacter);
    commit('updateCharacter', newCharacter);
    commit('equipWeapon', newCharacter.weapons[0].uuid);
    commit('equipArmor', newCharacter.armor[0].uuid); 
    commit('setQuests', defaultQuests);
  },
  
  updateCharacter({ commit }, character) {
    commit('updateCharacter', character);
    commit('updateCharacterInArray', character);
  },
  deleteCharacter({ commit }, character) {
    commit('deleteCharacter', character);
  },
  setSettlementModalOpen(state, isOpen) {
    state.isSettlementModalOpen = isOpen;
  },
  async quitGame({ commit, state }) {
    const updatedCharacter = { ...state.character, health: 0 };
    commit('updateCharacter', updatedCharacter);
    commit('updateCharacterInArray', updatedCharacter);
    localStorage.setItem('character', JSON.stringify(updatedCharacter));
  },
  increaseExp({ commit, state, dispatch, getters }, amount) {
    const multiplier = getters.experienceMultiplier;
    const adjustedAmount = Math.floor(amount * multiplier);
    commit('updateCharacter', { exp: state.character.exp + adjustedAmount });
    if (state.character.exp >= state.character.maxExp) {
      dispatch('levelUp');
    }
  },
  decreaseExp({ commit, state }) {
    const newExp = Math.max(state.character.exp - 5, 0);
    commit('updateCharacter', { exp: newExp });
  },
  increaseMoney({ commit, state, getters }, amount) {
    const multiplier = getters.moneyMultiplier;
    const adjustedAmount = Math.floor(amount * multiplier);
    commit('updateCharacter', { money: state.character.money + adjustedAmount });
  },
  decreaseMoney({ commit, state }, amount) {
    const newMoney = Math.max(state.character.money - amount, 0);
    commit('updateCharacter', { money: newMoney });
  },
  levelUp({ commit, state, dispatch }) {
    const overflowExp = state.character.exp - state.character.maxExp;
    const newMaxExp = Math.floor(state.character.maxExp * 1.6);
    const newLevel = state.character.level + 1;
    
    // Calculate skill points based on Intelligence
    const intelligenceBonus = state.character.special.intelligence;
    const baseSkillPoints = 1;
    const skillPointsGained = baseSkillPoints + Math.floor(intelligenceBonus / 2);
    
    // Calculate health bonus from Endurance
    const enduranceBonus = state.character.special.endurance;
    const healthGained = 10 + Math.floor(enduranceBonus / 2);
    
    commit('updateCharacter', {
      exp: overflowExp * 2,
      maxExp: newMaxExp,
      level: newLevel,
      maxHealth: state.character.maxHealth + healthGained
    });
    commit('addSkillPoints', skillPointsGained);
    commit('increaseCharacterLevelInArray', state.character);
    
    // Recalculate available perks after leveling up
    dispatch('calculatePerks');
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
  
  
  
  
  claimRewards({ commit, dispatch, state, getters }, quest) {
    let obtainedReward = null;
    let obtainedArmorReward = null;
    let obtainedResource = null;
  
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
  
      const rollDiceArmor = Math.random();
      if (rollDiceArmor <= quest.armorRewardChance) {
        const randomIndex = Math.floor(Math.random() * quest.armorReward.length);
        const rewardId = quest.armorReward[randomIndex];
        const rewardItem = state.armor.find((item) => item.id === rewardId);
        if (rewardItem) {
          const newItem = { ...rewardItem, uuid: uuidv4() };
          state.character.armor.push(newItem);
          obtainedArmorReward = newItem;
        }
      }

      const totalRewardChance = (quest.rewardChance || 0) + (quest.armorRewardChance || 0);
      const resourceRollDice = Math.random();
      if (resourceRollDice <= totalRewardChance) {
        const validResources = state.resources.filter(r => r.id === 1 || r.id === 2);
        const randomResource = validResources[Math.floor(Math.random() * validResources.length)];
        dispatch('addResource', randomResource.id);
        obtainedResource = randomResource;
      }
  
    // Calculate actual amounts with SPECIAL bonuses
    const actualExpGained = Math.floor(quest.exp * getters.experienceMultiplier);
    const actualMoneyGained = Math.floor(quest.money * getters.moneyMultiplier);
    
    dispatch('increaseExp', quest.exp);
    dispatch('increaseMoney', quest.money);
    commit('updateCharacterInArray', state.character);
    commit('claimQuest', quest);
    return {obtainedReward, obtainedArmorReward, obtainedResource, actualExpGained, actualMoneyGained};
  },

  resetQuests({ state, commit }) {
    state.quests.forEach((quest) => {
      if (quest.state === 'completed') {
        commit('resetQuest');
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
      aid: [],
      resources: [],
      premium: [],
      currentStoryLine: null,
      currentStoryStep: null,
      // Reset SPECIAL system
      special: {
        strength: 1,
        perception: 1,
        endurance: 1,
        charisma: 1,
        intelligence: 1,
        agility: 1,
        luck: 1
      },
      skillPoints: 0,
      availablePerks: [],
      activePerks: []
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

  completeStoryLine({ commit, dispatch, state, getters }, { storyLineId, giveReward }) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId);
    if (storyLine && (!storyLine.completed || storyLine.repeatable)) {
      let rewards = [];
  
      if ((storyLine.alwaysGiveReward || giveReward) && storyLine.reward) {
        if (storyLine.reward.exp) {
          const actualExpGained = Math.floor(storyLine.reward.exp * getters.experienceMultiplier);
          dispatch('increaseExp', storyLine.reward.exp);
          rewards.push({ type: 'exp', amount: actualExpGained });
        }
        if (storyLine.reward.money) {
          const actualMoneyGained = Math.floor(storyLine.reward.money * getters.moneyMultiplier);
          dispatch('increaseMoney', storyLine.reward.money);
          rewards.push({ type: 'money', amount: actualMoneyGained });
        }
        if (storyLine.reward.resourceRewards && storyLine.reward.resourceRewards.length > 0) {
          storyLine.reward.resourceRewards.forEach(reward => {
            const resource = state.resources.find(r => r.id === reward.id);
            for (let i = 0; i < reward.amount; i++) {
              dispatch('addResource', reward.id);
            }
            rewards.push({ type: 'resource', item: resource, amount: reward.amount });
          });
        }
        if (storyLine.reward.weaponRewards && storyLine.reward.weaponRewards.length > 0) {
          storyLine.reward.weaponRewards.forEach(reward => {
            const weapon = state.items.find(i => i.id === reward.id);
            dispatch('addItemToWeapons', reward.id);
            rewards.push({ type: 'weapon', item: weapon });
          });
        }
        if (storyLine.reward.armorRewards && storyLine.reward.armorRewards.length > 0) {
          storyLine.reward.armorRewards.forEach(reward => {
            const armorItem = state.armor.find(a => a.id === reward.id);
            dispatch('addItemToArmor', reward.id);
            rewards.push({ type: 'armor', item: armorItem });
          });
        }
        if (storyLine.reward.aidRewards && storyLine.reward.aidRewards.length > 0) {
          storyLine.reward.aidRewards.forEach(reward => {
            const aidItem = state.aid.find(a => a.id === reward.id);
            dispatch('addItemToAid', reward.id);
            rewards.push({ type: 'aid', item: aidItem });
          });
        }
      }
  
      if (!storyLine.repeatable) {
        commit('completeStoryLine', storyLineId);
      } else {
        commit('resetStoryLineProgress', storyLineId);
      }
      commit('setCurrentStoryLineId', null);
  
      return { storyLineName: storyLine.name, rewards };
    }
    return null;
  },
  
  checkRequiredResources({ state }, requiredResources) {
    return requiredResources.every(required => {
      const resourceCount = state.character.resources.filter(r => r.id === required.id).length;
      const hasEnough = resourceCount >= required.amount;
      return hasEnough;
    });
  },
  
  useRequiredResources({ state, commit }, requiredResources) {
    requiredResources.forEach(required => {
      for (let i = 0; i < required.amount; i++) {
        const resourceIndex = state.character.resources.findIndex(r => r.id === required.id);
        if (resourceIndex !== -1) {
          commit('removeResourceAtIndex', resourceIndex);
        }
      }
    });
  },

  async updateSettlementMarker({ commit }, marker) {
    commit('setSettlementMarker', marker);
  },

  openSettlementModal({ commit }) {
    commit('setSettlementModalOpen', true);
  },

  async progressStory({ commit, dispatch, state }, { nextId, choiceText, giveReward }) {
    if (state.currentStoryLineId !== null) {
      const currentStoryLine = state.storyLines.find(sl => sl.id === state.currentStoryLineId);
      const currentStep = currentStoryLine.steps[currentStoryLine.currentStepIndex || 0];
      
      if (currentStep) {
        const selectedOption = currentStep.playerOptions.find(option => option.text === choiceText);
        
        if (selectedOption) {
          if (selectedOption.action) {
            await dispatch(selectedOption.action, selectedOption.actionParams);
          }
        }
      }
      
      commit('addPlayerChoice', { storyLineId: state.currentStoryLineId, choice: choiceText });
      
      if (nextId === null) {
        return dispatch('completeStoryLine', { storyLineId: state.currentStoryLineId, giveReward });
      } else {
        commit('progressStoryStep');
      }
    }
  },
  
  async defeatEnemy({ commit, dispatch, state }) {
    const enemyId = state.currentEnemyId;
    commit('addDefeatedEnemy', enemyId);
    
    const currentStoryLine = state.storyLines.find(sl => sl.id === state.currentBattleStoryLineId);
    if (currentStoryLine && currentStoryLine.requiredEnemyDefeat) {
      const { id, count } = currentStoryLine.requiredEnemyDefeat;
      if (id === enemyId && state.defeatedEnemies[id] >= count) {
        commit('setCurrentStoryLineId', state.currentBattleStoryLineId);
        currentStoryLine.currentStepIndex = state.currentBattleStepIndex + 1;
        const result = await dispatch('progressStory', { 
          nextId: currentStoryLine.steps[currentStoryLine.currentStepIndex].playerOptions[0].nextId, 
          choiceText: 'I defeated the enemy', 
          giveReward: true 
        });
        commit('resetDefeatedEnemies');
        
        commit('setCurrentEnemyId', null);
        commit('setCurrentBattleStoryLineId', null);
        commit('setCurrentBattleStepIndex', null);
        
        return result;
      }
    }
    
    commit('setCurrentEnemyId', null);
    commit('setCurrentBattleStoryLineId', null);
    commit('setCurrentBattleStepIndex', null);
    
    return null;
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

  sellResource({ commit }, resourceUuid) {
    commit('sellResource', resourceUuid);
  },

  sellResourceStack({ commit }, stack) {
    commit('sellResourceStack', stack);
  },

  sellAid({ commit }, itemUuid) {
    commit('sellAid', itemUuid);
  },
  sellPremium({ commit }, itemUuid) {
    commit('sellPremium', itemUuid);
  },

  useAid({ commit }, itemUuid) {
    commit('useAid', itemUuid);
  },

  addItemToAid({ commit }, itemId) {
    commit('addItemToAid', itemId);
  },
  addItemToPremium({ commit }, itemId) {
    commit('addItemToPremium', itemId);
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

  startEnemyBattle({ commit, state }, { enemyId }) {
    const enemy = enemies.find(e => e.id === enemyId);
    if (enemy) {
      commit('setCurrentEnemyId', enemyId);
      commit('setEnemyEncounterOpen', true);
      commit('setCurrentBattleStoryLineId', state.currentStoryLineId);
      commit('setCurrentBattleStepIndex', state.storyLines.find(sl => sl.id === state.currentStoryLineId).currentStepIndex);
    } else {
      console.error(`Enemy with id ${enemyId} not found`);
    }
  },
   
  openEnemyEncounter({ commit }) {
    commit('setEnemyEncounterOpen', true);
  },
  closeEnemyEncounter({ commit }) {
    commit('setEnemyEncounterOpen', false);
  },
  
  cancelCurrentStoryLine({ commit }) {
    commit('cancelStoryLine');
  },

  checkMoney({ state }, amount) {
    return state.character.money >= amount;
  },
  openLootboxAction({ commit, state }, lootboxUuid) {
    // 1. Open lootbox and get rewards
    commit('openLootbox', lootboxUuid);
    // 2. Add rewards to inventory
    const rewards = state.currentLootboxRewards || [];
    rewards.forEach(reward => {
      if (reward.type === 'weapon') {
        state.character.weapons.push(reward.item);
      } else if (reward.type === 'armor') {
        state.character.armor.push(reward.item);
      } else if (reward.type === 'aid') {
        state.character.aid.push(reward.item);
      } else if (reward.type === 'resource') {
        state.character.resources.push(reward.item);
      } else if (reward.type === 'money') {
        state.character.money += reward.amount;
      }
    });
    // 3. Show modal with rewards
    commit('setLootboxModalOpen', true);
  },

  // SPECIAL system actions
  spendSkillPoint({ commit, state }, stat) {
    if (state.character.skillPoints > 0 && state.character.special[stat] < 10) {
      commit('increaseSpecialStat', { stat, amount: 1 });
    }
  },

  calculatePerks({ commit, state }) {
    // Use the dedicated perks module to calculate available perks
    const availablePerks = perks.calculateAvailablePerks(state.character);
    commit('updateAvailablePerks', availablePerks);
  },

  activatePerk({ commit, dispatch, state }, perk) {
    commit('addPerk', perk);
    
    // Apply perk effects immediately for permanent bonuses
    if (perk.effect.type === 'health') {
      commit('updateCharacter', {
        maxHealth: state.character.maxHealth + perk.effect.value,
        health: state.character.health + perk.effect.value
      });
    }
    
    // Recalculate available perks
    dispatch('calculatePerks');
  },

  // Additional perk-related actions
  getPerkInfo(context, perkId) {
    return perks.getPerkById(perkId);
  },
  
  checkPerkRequirements({ state }, perkId) {
    const perk = perks.getPerkById(perkId);
    if (!perk) return false;
    
    return perks.meetsRequirements(
      state.character.special, 
      state.character.level, 
      perk.requirements
    );
  }
};

const store = createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
    settlement
  }
});

// Remove settlement watcher initialization
store.dispatch('initializeQuests');
store.dispatch('autoResetQuests');

// Keep existing watchers for other state
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
