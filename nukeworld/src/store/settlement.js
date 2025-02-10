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
  }
};

const state = initialState;

const mutations = {
  setSettlement(state, settlement) {
    state.settlement = { ...state.settlement, ...settlement };
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
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
  
  upgradeDefences(state, amount) {
    state.settlement.defences = Math.min(state.settlement.maxDefences, state.settlement.defences + amount);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  upgradePower(state, amount) {
    state.settlement.power = Math.min(state.settlement.maxPower, state.settlement.power + amount);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  upgradeLevel(state) {
    state.settlement.level++;
    state.settlement.maxHealth += 50;
    state.settlement.maxInhabitants += 5;
    state.settlement.maxDefences += 25;
    state.settlement.maxPower += 25;
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
  initializeSettlement({ commit }, position) {
    const settlement = {
      id: uuidv4(),
      level: 1,
      health: 100,
      maxHealth: 100,
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
      // Lose 1 health per hour + radiation damage
      const healthLoss = -1 * Math.floor(hoursSinceLastUpdate);
      const radiationDamage = -1 * Math.floor((state.settlement.radiation / 100) * hoursSinceLastUpdate);
      commit('updateSettlementHealth', healthLoss + radiationDamage);
    }
    
    // Check for enemy attacks every minute
    const minutesSinceLastAttack = state.settlement.lastAttack 
      ? (now - state.settlement.lastAttack) / (1000 * 60)
      : (now - state.settlement.lastHealthUpdate) / (1000 * 60);
    
    if (minutesSinceLastAttack >= 1) {
      // 100% chance of attack every minute
      dispatch('handleEnemyAttack');
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
  
  async upgradeSettlement({ commit, dispatch }, { type, amount, resources }) {
    const hasResources = await dispatch('checkRequiredResources', resources, { root: true });
    if (!hasResources) {
      throw new Error('Not enough resources');
    }
    
    await dispatch('useRequiredResources', resources, { root: true });
    
    switch(type) {
      case 'defences':
        commit('upgradeDefences', amount);
        break;
      case 'power':
        commit('upgradePower', amount);
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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 