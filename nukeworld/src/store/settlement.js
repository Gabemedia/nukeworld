import { v4 as uuidv4 } from 'uuid';
import enemies from './enemy';
import { toast } from 'vue3-toastify';
import encounterIcon from '@/assets/interface/icons/encounter.png';

// Load initial state from localStorage
const initialState = {
  settlement: JSON.parse(localStorage.getItem('settlement')) || {
    id: null,
    level: 1,
    health: 100,
    maxHealth: 100,
    inhabitants: 0,
    maxInhabitants: 5,
    defences: 0,
    maxDefences: 50,
    power: 0,
    maxPower: 50,
    radiation: 0,
    maxRadiation: 100,
    lastHealthUpdate: null,
    lastRadiationUpdate: null,
    lastAttack: null,
    currentEnemyId: null,
    upgrades: [],
    resources: [],
    position: null
  },
  // Add settings with defaults
  settings: JSON.parse(localStorage.getItem('settlementSettings')) || {
    attackInterval: 240, // Now in seconds
    healthLossPerSecond: 1, // Damage per second
    radiationDamageMultiplier: 3,
    startingHealth: 100,
    maxHealth: 100,
    startingResources: 0,
    maxResources: 1000,
    attackChance: 0.50,
    placementCosts: {
      resource1: 1, // Wood Scrap
      resource1Amount: 5,
      resource2: 2, // Steel Scrap
      resource2Amount: 5,
    },
    upgradeCosts: {
      defences: {
        resource1: 3, // Wood Scrap
        resource1Amount: 10,
        resource2: 2, // Steel Scrap
        resource2Amount: 10,
        amount: 10, // Defence increase amount
        moneyCost: 1000
      },
      power: {
        resource1: 5, // Wood Scrap
        resource1Amount: 10,
        resource2: 2, // Steel Scrap
        resource2Amount: 10,
        amount: 10, // Power increase amount
        moneyCost: 1000
      },
      level: {
        resource1: 1, // Wood Scrap
        resource1Amount: 25,
        resource2: 2, // Steel Scrap
        resource2Amount: 25,
        healthIncrease: 50,
        inhabitantsIncrease: 5,
        defencesIncrease: 25,
        powerIncrease: 25,
        moneyCost: 2500
      },
      inhabitant: {
        resource1: 1, // Wood Scrap
        resource1Amount: 5,
        resource2: 2, // Steel Scrap
        resource2Amount: 5,
        moneyCost: 500
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
  
  updateSettlementLastHealthUpdate(state, timestamp) {
    state.settlement.lastHealthUpdate = timestamp;
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  updateSettlementLastRadiationUpdate(state, timestamp) {
    state.settlement.lastRadiationUpdate = timestamp;
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  updateSettings(state, settings) {
    // Update settings in state
    state.settings = {
      ...state.settings,
      attackInterval: Number(settings.attackInterval),
      healthLossPerSecond: Number(settings.healthLossPerSecond),
      radiationDamageMultiplier: Number(settings.radiationDamageMultiplier),
      startingHealth: Number(settings.startingHealth),
      maxHealth: Number(settings.maxHealth),
      startingResources: Number(settings.startingResources),
      maxResources: Number(settings.maxResources),
      attackChance: Number(settings.attackChance),
      placementCosts: settings.placementCosts || state.settings.placementCosts,
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
    // Ensure current health is a number
    const currentHealth = Number(state.settlement.health) || 0;
    // Ensure amount is a number
    const validAmount = Number(amount) || 0;
    // Ensure maxHealth is a number
    const maxHealth = Number(state.settlement.maxHealth) || 100;
    
    // Calculate new health
    state.settlement.health = Math.max(0, Math.min(maxHealth, currentHealth + validAmount));
    state.settlement.lastHealthUpdate = Date.now();
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  updateSettlementRadiation(state, amount) {
    // Ensure radiation stays within bounds and can actually decrease
    const newRadiation = state.settlement.radiation + amount;
    state.settlement.radiation = Math.max(0, Math.min(state.settlement.maxRadiation, newRadiation));
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
    // Restore health to new maximum when leveling up
    state.settlement.health = state.settlement.maxHealth;
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
  },
  
  healSettlement(state, amount) {
    const healAmount = Number(amount) || 0;
    state.settlement.health = Math.min(state.settlement.maxHealth, state.settlement.health + healAmount);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  startRadiationReduction(state) {
    // Store the start time of radiation reduction
    state.settlement.radiationReductionStart = Date.now();
    state.settlement.radiationReductionActive = true;
    // Initial reduction
    state.settlement.radiation = Math.max(0, state.settlement.radiation - 10);
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
  },
  
  clearRadiationReduction(state) {
    state.settlement.radiationReductionActive = false;
    state.settlement.radiationReductionStart = null;
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
      lastAttack: Date.now(),
      currentEnemyId: null,
      upgrades: [],
      resources: [],
      position
    };
    commit('setSettlement', settlement);
    localStorage.setItem('settlement', JSON.stringify(settlement));
    return settlement;
  },
  
  async updateSettlement({ commit, state, dispatch }) {
    const now = Date.now();
    
    // Apply radiation reduction if active - COMPLETELY STOP all radiation when clean is active
    if (state.settlement.radiationReductionActive) {
      // Only allow decreases, NO increases during clean
      if (Math.random() < 0.9) { // 90% chance for reduction during clean
        const reductionAmount = Math.floor(Math.random() * 15) + 5; // 5-20% reduction per update
        commit('updateSettlementRadiation', -reductionAmount);
      }
    } else {
      // Only apply normal fluctuations when clean is NOT active
      if (Math.random() < 0.85) { // 85% chance each update
        if (Math.random() < 0.5) { // 50% chance to increase - random
          const increase = Math.floor(Math.random() * 25) + 2; // 2-26% increase
          commit('updateSettlementRadiation', increase);
        } else { // 50% chance to decrease - random
          if (state.settlement.radiation > 0) {
            const decrease = Math.floor(Math.random() * 25) + 2; // 2-26% decrease
            commit('updateSettlementRadiation', -decrease);
          }
        }
      }
    }
    
    // Check if settlement is dead (moved from old damage system)
    if (state.settlement.health <= 0) {
      // Clear settlement data
      commit('setSettlement', {
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
        currentEnemyId: null,
        upgrades: [],
        resources: [],
        position: null
      });
      
      // Remove marker and clear localStorage
      dispatch('updateSettlementMarker', null, { root: true });
      localStorage.removeItem('settlement');
      
      // Close modal
      commit('setSettlementModalOpen', false, { root: true });

      // Show toast
      const defeatMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">Settlement Lost!</p>
          <p class="text-left fw-semi mb-2">Your settlement was destroyed due to lack of maintenance</p>
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${encounterIcon}" title="Settlement" style="width: 20px;" class="me-2">
            <span>Settlement was removed</span>
          </div>
        </div>
      `;

      toast.error(defeatMessage, {
        dangerouslyHTMLString: true,
        autoClose: 5000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });

      return; // Stop further processing
    }
    
    // Check for enemy attacks using settings
    const lastAttack = Number(state.settlement.lastAttack) || now;
    const secondsSinceLastAttack = (now - lastAttack) / 1000;
    const attackInterval = Number(state.settings.attackInterval) || 30;
    
    // Only try to start battle if we're not already in one and enough time has passed
    if (!state.settlement.currentEnemyId && secondsSinceLastAttack >= attackInterval) {
      // Use attack chance from settings
      const attackChance = Number(state.settings.attackChance) || 0;
      const roll = Math.random() * 100;
      
      if (roll <= attackChance) {
        await dispatch('handleEnemyAttack');
      }
    }
    

    // Only apply radiation damage if radiation is high (90% or more)
    if (state.settlement.radiation >= 90) {
      const radiationDamage = -1 * state.settings.healthLossPerSecond * 2; // Double damage when radiation is critical
      commit('updateSettlementHealth', radiationDamage);
      
      // Show warning toast about critical radiation
      const radiationWarning = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">Critical Radiation Levels!</p>
          <p class="text-left fw-semi mb-2">Your settlement is taking heavy damage from radiation</p>
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${encounterIcon}" title="Settlement" style="width: 20px;" class="me-2">
            <span>Settlement health is dropping rapidly</span>
          </div>
        </div>
      `;

      toast.warning(radiationWarning, {
        dangerouslyHTMLString: true,
        autoClose: 5000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    }
  },
  
  async handleEnemyAttack({ commit, getters }) {
    // Get a random enemy
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    if (!enemy) {
      return;
    }

    // Record the attack and set current enemy
    commit('recordAttack');
    commit('setCurrentEnemyId', enemy.id);

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
  },
  
  async healSettlementAction({ commit, dispatch, state }, { amount, cost }) {
    // Ensure we have valid numbers
    const healAmount = Number(amount) || 0;
    const healCost = Number(cost) || 0;
    
    // Check if healing is needed
    if (state.settlement.health >= state.settlement.maxHealth) {
      throw new Error('Settlement is already at full health');
    }
    
    // Check if player has enough money
    const hasEnoughMoney = await dispatch('checkMoney', healCost, { root: true });
    if (!hasEnoughMoney) {
      throw new Error('Not enough money');
    }
    
    // Deduct money first
    await dispatch('decreaseMoney', healCost, { root: true });
    
    // Then heal settlement
    commit('healSettlement', healAmount);
    
    // Save to localStorage
    localStorage.setItem('settlement', JSON.stringify(state.settlement));
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