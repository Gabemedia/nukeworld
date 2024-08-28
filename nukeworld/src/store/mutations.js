import { v4 as uuidv4 } from 'uuid';

export default {
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
    const characterInArray = state.characters.find(ch => ch.email === character.email);
    if (characterInArray) {
      characterInArray.level += 1;
    }
  },
  deleteCharacter(state, character) {
    state.characters = state.characters.filter(ch => ch.email !== character.email);
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
  addItemToWeapons(state, itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (item) {
      const newItem = { ...item, uuid: uuidv4() };
      state.character.weapons.push(newItem);
    }
  },
  equipWeapon(state, itemUuid) {
    const characterItem = state.character.weapons.find(item => item.uuid === itemUuid);
    if (characterItem) {
      state.character.equippedWeapons = [];
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
};
