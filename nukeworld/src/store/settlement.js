import { v4 as uuidv4 } from 'uuid';

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
  },
  
  updateSettlementHealth(state, amount) {
    state.settlement.health = Math.max(0, Math.min(state.settlement.maxHealth, state.settlement.health + amount));
    state.settlement.lastHealthUpdate = Date.now();
  },
  
  updateSettlementRadiation(state, amount) {
    state.settlement.radiation = Math.max(0, Math.min(state.settlement.maxRadiation, state.settlement.radiation + amount));
    state.settlement.lastRadiationUpdate = Date.now();
  },
  
  addInhabitant(state) {
    if (state.settlement.inhabitants < state.settlement.maxInhabitants) {
      state.settlement.inhabitants++;
    }
  },
  
  removeInhabitant(state) {
    if (state.settlement.inhabitants > 0) {
      state.settlement.inhabitants--;
    }
  },
  
  upgradeDefences(state, amount) {
    state.settlement.defences = Math.min(state.settlement.maxDefences, state.settlement.defences + amount);
  },
  
  upgradePower(state, amount) {
    state.settlement.power = Math.min(state.settlement.maxPower, state.settlement.power + amount);
  },
  
  upgradeLevel(state) {
    state.settlement.level++;
    state.settlement.maxHealth += 50;
    state.settlement.maxInhabitants += 5;
    state.settlement.maxDefences += 25;
    state.settlement.maxPower += 25;
  },
  
  recordAttack(state) {
    state.settlement.lastAttack = Date.now();
  },
  
  addUpgrade(state, upgrade) {
    state.settlement.upgrades.push({
      ...upgrade,
      id: uuidv4(),
      installedAt: Date.now()
    });
  },
  
  removeUpgrade(state, upgradeId) {
    state.settlement.upgrades = state.settlement.upgrades.filter(u => u.id !== upgradeId);
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
      
      // Random enemy attacks
      if (Math.random() < 0.1) { // 10% chance per hour
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
  
  async handleEnemyAttack({ commit, dispatch }) {
    const enemyId = Math.floor(Math.random() * 8) + 1; // Random enemy from enemy.js
    commit('recordAttack');
    return dispatch('startSettlementBattle', { enemyId });
  },
  
  startSettlementBattle(context, { enemyId }) {
    return {
      attack: context.getters.settlementAttackPower,
      defence: context.getters.settlementDefencePower,
      enemyId
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

// Debounce function to limit storage updates
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Add watcher for settlement changes with optimizations
const watch = (store) => {
  let lastSave = Date.now();
  
  // Debounced save function
  const debouncedSave = debounce((settlement) => {
    try {
      // Only save essential settlement data
      const essentialData = {
        id: settlement.id,
        level: settlement.level,
        health: settlement.health,
        maxHealth: settlement.maxHealth,
        inhabitants: settlement.inhabitants,
        maxInhabitants: settlement.maxInhabitants,
        defences: settlement.defences,
        maxDefences: settlement.maxDefences,
        power: settlement.power,
        maxPower: settlement.maxPower,
        radiation: settlement.radiation,
        maxRadiation: settlement.maxRadiation,
        lastHealthUpdate: settlement.lastHealthUpdate,
        lastRadiationUpdate: settlement.lastRadiationUpdate,
        lastAttack: settlement.lastAttack,
        position: settlement.position
      };
      
      localStorage.setItem('settlement', JSON.stringify(essentialData));
    } catch (error) {
      console.error('Error saving settlement:', error);
    }
  }, 1000); // 1 second debounce

  store.watch(
    (state) => state.settlement.settlement,
    (newSettlement) => {
      const now = Date.now();
      // Only save if at least 1 second has passed since last save
      if (now - lastSave >= 1000) {
        debouncedSave(newSettlement);
        lastSave = now;
      }
    },
    { deep: true }
  );
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  watch // Export watch function to be used in store initialization
}; 