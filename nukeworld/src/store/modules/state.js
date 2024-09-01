import defaultStoryLines from '../story';
import items from '../items';
import armor from '../armor';
import aid from '../aid';
import resources from '../ressources';

export default {
  lvlPopupRef: null,
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
    resources: [],
  },
  storyLines: JSON.parse(localStorage.getItem('storyLines')) || defaultStoryLines,
  currentStoryLineId: JSON.parse(localStorage.getItem('currentStoryLineId')) || null,
  settlementMarker: JSON.parse(localStorage.getItem('settlementMarker')) || null,
  isSettlementModalOpen: false,
  items,
  armor,
  aid,
  resources,
  mapBounds: null,
  markers: [],
  currentBattleStoryLineId: null,
  currentBattleStepIndex: null,
  currentEnemyId: null,
  defeatedEnemies: {},
};
