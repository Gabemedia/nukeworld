import { v4 as uuidv4 } from 'uuid';
import enemies from './enemy';

// Load initial state from localStorage
const initialState = {
  settlement: JSON.parse(localStorage.getItem('settlement')) || {
    id: null,
    level: 1,
    health: 100,
    maxHealth: 100,
    inhabitants: 0,
    maxInhabitants: 10,
    defences: 0,
    maxDefences: 100,
    power: 0,
    maxPower: 100,
    radiation: 0,
    maxRadiation: 100,
    lastHealthUpdate: null,
    lastRadiationUpdate: null,
    lastAttack: null,
    upgrades: [],
    resources: [],
    position: null
  },
  // Add settings with defaults
  settings: JSON.parse(localStorage.getItem('settlementSettings')) || {
    attackInterval: 1,
    healthLossPerHour: 1,
    radiationDamageMultiplier: 1,
    startingHealth: 100,
    maxHealth: 100,
    startingResources: 0,
    maxResources: 1000,
    attackChance: 100,
    upgradeCosts: {
      defences: {
        resource1: 1, // Wood Scrap
        resource1Amount: 30,
        resource2: 2, // Steel Scrap
        resource2Amount: 50,
        amount: 10, // Defence increase amount
        moneyCost: 100
      },
      power: {
        resource1: 1, // Wood Scrap
        resource1Amount: 40,
        resource2: 2, // Steel Scrap
        resource2Amount: 40,
        amount: 10, // Power increase amount
        moneyCost: 100
      },
      level: {
        resource1: 1, // Wood Scrap
        resource1Amount: 100,
        resource2: 2, // Steel Scrap
        resource2Amount: 100,
        healthIncrease: 50,
        inhabitantsIncrease: 5,
        defencesIncrease: 25,
        powerIncrease: 25,
        moneyCost: 200
      },
      inhabitant: {
        resource1: 1, // Wood Scrap
        resource1Amount: 50,
        resource2: 2, // Steel Scrap
        resource2Amount: 30
      }
    }
  }
};

const state = initialState;

const mutations = {
  setSettlement(state, settlement) {
    state.settlement = { ...state.settlement, ...settlement };
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  updateSettings(state, settings) {
    // Update settings in state
    state.settings = {
      ...state.settings,
      attackInterval: Number(settings.attackInterval),
      healthLossPerHour: Number(settings.healthLossPerHour),
      radiationDamageMultiplier: Number(settings.radiationDamageMultiplier),
      startingHealth: Number(settings.startingHealth),
      maxHealth: Number(settings.maxHealth),
      startingResources: Number(settings.startingResources),
      maxResources: Number(settings.maxResources),
      attackChance: Number(settings.attackChance),
      upgradeCosts: settings.upgradeCosts || state.settings.upgradeCosts
    };
    
    // Update settlement maxHealth if needed
    if (state.settlement.maxHealth !== state.settings.maxHealth) {
      state.settlement.maxHealth = state.settings.maxHealth;
      // Ensure health doesn't exceed new maxHealth
      if (state.settlement.health > state.settings.maxHealth) {
        state.settlement.health = state.settings.maxHealth;
      }
    }
    
    // Save to localStorage
    localStorage.setItem('settlementSettings', JSON.stringify(state.settings));
  },
  
  updateSettlementHealth(state, amount) {
    state.settlement.health = Math.max(0, Math.min(state.settlement.maxHealth, state.settlement.health + amount));
    state.settlement.lastHealthUpdate = Date.now();
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  updateSettlementRadiation(state, amount) {
    state.settlement.radiation = Math.max(0, Math.min(state.settlement.maxRadiation, state.settlement.radiation + amount));
    state.settlement.lastRadiationUpdate = Date.now();
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  addInhabitant(state) {
    if (state.settlement.inhabitants < state.settlement.maxInhabitants) {
      state.settlement.inhabitants++;
      localStorage.setItem('settlement', JSON.stringify(state.settlement));
    }
  },
  
  removeInhabitant(state) {
    if (state.settlement.inhabitants > 0) {
      state.settlement.inhabitants--;
      localStorage.setItem('settlement', JSON.stringify(state.settlement));
    }
  },
  
  upgradeDefences(state) {
    const increaseAmount = state.settings.upgradeCosts.defences.amount;
    state.settlement.defences = Math.min(state.settlement.maxDefences, state.settlement.defences + increaseAmount);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  upgradePower(state) {
    const increaseAmount = state.settings.upgradeCosts.power.amount;
    state.settlement.power = Math.min(state.settlement.maxPower, state.settlement.power + increaseAmount);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  upgradeLevel(state) {
    state.settlement.level++;
    state.settlement.maxHealth += state.settings.upgradeCosts.level.healthIncrease;
    state.settlement.maxInhabitants += state.settings.upgradeCosts.level.inhabitantsIncrease;
    state.settlement.maxDefences += state.settings.upgradeCosts.level.defencesIncrease;
    state.settlement.maxPower += state.settings.upgradeCosts.level.powerIncrease;
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  recordAttack(state) {
    state.settlement.lastAttack = Date.now();
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  addUpgrade(state, upgrade) {
    state.settlement.upgrades.push({
      ...upgrade,
      id: uuidv4(),
      installedAt: Date.now()
    });
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  removeUpgrade(state, upgradeId) {
    state.settlement.upgrades = state.settlement.upgrades.filter(u => u.id !== upgradeId);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  setCurrentEnemyId(state, enemyId) {
    state.settlement.currentEnemyId = enemyId;
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  }
};

const actions = {
  initializeSettlement({ commit, state }, position) {
    const settlement = {
      id: uuidv4(),
      level: 1,
      health: state.settings.startingHealth,
      maxHealth: state.settings.maxHealth,
      inhabitants: 1,
      maxInhabitants: 10,
      defences: 10,
      maxDefences: 100,
      power: 10,
      maxPower: 100,
      radiation: Math.floor(Math.random() * 20),
      maxRadiation: 100,
      lastHealthUpdate: Date.now(),
      lastRadiationUpdate: Date.now(),
      lastAttack: null,
      upgrades: [],
      resources: [],
      position
    };
    commit('setSettlement', settlement);
    localStorage.setItem('settlement', JSON.stringify(settlement));
    return settlement;
  },
  
  async updateSettlement({ commit, state, dispatch }) {
    // Health decay over time
    const now = Date.now();
    const hoursSinceLastUpdate = (now - state.settlement.lastHealthUpdate) / (1000 * 60 * 60);
    
    if (hoursSinceLastUpdate >= 1) {
      // Use settings for health loss calculation
      const healthLoss = -1 * Math.floor(hoursSinceLastUpdate * state.settings.healthLossPerHour);
      const radiationDamage = -1 * Math.floor((state.settlement.radiation / 100) * hoursSinceLastUpdate * state.settings.radiationDamageMultiplier);
      commit('updateSettlementHealth', healthLoss + radiationDamage);
    }
    
    // Check for enemy attacks using settings
    const minutesSinceLastAttack = state.settlement.lastAttack 
      ? (now - state.settlement.lastAttack) / (1000 * 60)
      : (now - state.settlement.lastHealthUpdate) / (1000 * 60);
    
    if (minutesSinceLastAttack >= state.settings.attackInterval) {
      // Use attack chance from settings
      const roll = Math.random() * 100;
      if (roll <= state.settings.attackChance) {
        dispatch('handleEnemyAttack');
      }
    }
    
    // Update radiation levels
    const hoursSinceLastRadiation = (now - state.settlement.lastRadiationUpdate) / (1000 * 60 * 60);
    if (hoursSinceLastRadiation >= 1) {
      const radiationChange = Math.floor(Math.random() * 10) - 5; // -5 to +5
      commit('updateSettlementRadiation', radiationChange);
    }
  },
  
  async handleEnemyAttack({ commit, getters }) {
    // Get a random enemy
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (!enemy) return;

    // Record the attack and set current enemy
    commit('recordAttack');
    commit('setCurrentEnemyId', enemy.id, { root: true });

    return {
      attack: getters.settlementAttackPower,
      defence: getters.settlementDefencePower,
      enemy: { 
        ...enemy,
        level: 1 // Add level property for consistency
      }
    };
  },
  
  startSettlementBattle({ getters }, { enemyId }) {
    const enemy = enemies.find(e => e.id === enemyId);
    if (!enemy) {
      console.error('Enemy not found:', enemyId);
      return null;
    }
    return {
      attack: getters.settlementAttackPower,
      defence: getters.settlementDefencePower,
      enemy: { 
        ...enemy,
        level: 1 // Add level property for consistency
      }
    };
  },
  
  async upgradeSettlement({ commit, dispatch, state }, { type }) {
    let requiredResources;
    let moneyCost;
    
    switch(type) {
      case 'defences':
        requiredResources = [
          { id: state.settings.upgradeCosts.defences.resource1, amount: state.settings.upgradeCosts.defences.resource1Amount },
          { id: state.settings.upgradeCosts.defences.resource2, amount: state.settings.upgradeCosts.defences.resource2Amount }
        ];
        moneyCost = state.settings.upgradeCosts.defences.moneyCost;
        break;
      case 'power':
        requiredResources = [
          { id: state.settings.upgradeCosts.power.resource1, amount: state.settings.upgradeCosts.power.resource1Amount },
          { id: state.settings.upgradeCosts.power.resource2, amount: state.settings.upgradeCosts.power.resource2Amount }
        ];
        moneyCost = state.settings.upgradeCosts.power.moneyCost;
        break;
      case 'level':
        requiredResources = [
          { id: state.settings.upgradeCosts.level.resource1, amount: state.settings.upgradeCosts.level.resource1Amount },
          { id: state.settings.upgradeCosts.level.resource2, amount: state.settings.upgradeCosts.level.resource2Amount }
        ];
        moneyCost = state.settings.upgradeCosts.level.moneyCost;
        break;
      default:
        throw new Error('Invalid upgrade type');
    }
    
    // Check if player has enough money
    const hasEnoughMoney = await dispatch('checkMoney', moneyCost, { root: true });
    if (!hasEnoughMoney) {
      throw new Error('Not enough money');
    }
    
    // Check if player has enough resources
    const hasResources = await dispatch('checkRequiredResources', requiredResources, { root: true });
    if (!hasResources) {
      throw new Error('Not enough resources');
    }
    
    // Deduct money and resources
    await dispatch('decreaseMoney', moneyCost, { root: true });
    await dispatch('useRequiredResources', requiredResources, { root: true });
    
    switch(type) {
      case 'defences':
        commit('upgradeDefences');
        break;
      case 'power':
        commit('upgradePower');
        break;
      case 'level':
        commit('upgradeLevel');
        break;
    }
  }
};

const getters = {
  settlementAttackPower: state => {
    return state.settlement.inhabitants * 2 + state.settlement.power;
  },
  
  settlementDefencePower: state => {
    return state.settlement.defences + state.settlement.power / 2;
  },
  
  canUpgradeLevel: state => {
    return state.settlement.health > 50 && state.settlement.inhabitants >= state.settlement.level * 5;
  },

  settings: state => state.settings
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 