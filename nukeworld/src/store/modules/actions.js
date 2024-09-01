import defaultQuests from '../quests';
import { v4 as uuidv4 } from 'uuid';

export default {
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
  setSettlementModalOpen({ commit }, isOpen) {
    commit('setSettlementModalOpen', isOpen);
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
  levelUp({ commit, state, dispatch }) {
    const overflowExp = state.character.exp - state.character.maxExp;
    const newMaxExp = Math.floor(state.character.maxExp * 1.6);
    commit('updateCharacter', {
      exp: overflowExp * 2,
      maxExp: newMaxExp,
      level: state.character.level + 1,
      maxHealth: state.character.maxHealth + 50,
    });
    commit('increaseCharacterLevelInArray', state.character);
    
    // Tilføj denne linje for at udløse level up toasten
    dispatch('showLevelUpPopup');
  },

  showLevelUpPopup({ state }) {
    if (state.lvlPopupRef && typeof state.lvlPopupRef.openPopup === 'function') {
      state.lvlPopupRef.openPopup();
    }
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
  startStoryLine({ commit, state }, storyLineId) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId && !sl.completed && state.character.level >= sl.levelRequirement);
    if (storyLine) {
      commit('setCurrentStoryLineId', storyLineId);
    }
  },
  completeStoryLine({ commit, dispatch, state }, { storyLineId, giveReward }) {
    const storyLine = state.storyLines.find(sl => sl.id === storyLineId);
    if (storyLine && (!storyLine.completed || storyLine.repeatable)) {
      let rewards = [];
  
      if ((storyLine.alwaysGiveReward || giveReward) && storyLine.reward) {
        if (storyLine.reward.exp) {
          dispatch('increaseExp', storyLine.reward.exp);
          rewards.push({ type: 'exp', amount: storyLine.reward.exp });
        }
        if (storyLine.reward.money) {
          dispatch('increaseMoney', storyLine.reward.money);
          rewards.push({ type: 'money', amount: storyLine.reward.money });
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
  addResource({ commit }, resourceId) {
    commit('addResource', resourceId);
  },
  removeResource({ commit }, resourceUuid) {
    commit('removeResource', resourceUuid);
  },
  startEnemyBattle({ commit, state }, { enemyId }) {
    const enemy = state.enemies.find(e => e.id === enemyId);
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
  // Quest-relaterede actions
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
  
    dispatch('increaseExp', quest.exp);
    dispatch('increaseMoney', quest.money);
    commit('updateCharacterInArray', state.character);
    commit('updateQuest', { ...quest, state: 'completed' });
    return { obtainedReward, obtainedArmorReward, obtainedResource };
  },
  resetQuests({ state, commit }) {
    state.quests.forEach((quest) => {
      if (quest.state === 'completed') {
        const playableArea = [
          [270, 270], [850, 1650]
        ];
        const lat = Math.random() * (playableArea[1][0] - playableArea[0][0]) + playableArea[0][0];
        const lon = Math.random() * (playableArea[1][1] - playableArea[0][1]) + playableArea[0][1];
        
        commit('updateQuest', { 
          ...quest, 
          state: 'not-started', 
          progress: 0, 
          startTime: null,
          remainingTime: quest.duration,
          lat, 
          lon 
        });
      }
    });
    localStorage.setItem('quests', JSON.stringify(state.quests));
  },
  autoResetQuests({ dispatch }) {
    setInterval(() => {
      dispatch('resetQuests');
    }, 60000); // 60 sekunder
  },
};
