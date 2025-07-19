// Perk system for NukeWorld game
// Defines all available perks based on SPECIAL stats and level requirements

const perkDefinitions = {
  // === STRENGTH-BASED PERKS ===
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    description: '+3 attack power',
    requirements: { strength: 2, level: 3 },
    effect: { type: 'damage', value: 3 }
  },
  
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    description: '+8 attack power',
    requirements: { strength: 5, level: 12 },
    effect: { type: 'damage', value: 8 }
  },

  // === ENDURANCE-BASED PERKS ===
  lifegiver: {
    id: 'lifegiver',
    name: 'Lifegiver',
    description: '+30 max health',
    requirements: { endurance: 3, level: 5 },
    effect: { type: 'health', value: 30 }
  },

  survivalist: {
    id: 'survivalist',
    name: 'Survivalist',
    description: '+80 max health',
    requirements: { endurance: 6, level: 15 },
    effect: { type: 'health', value: 80 }
  },

  // === CHARISMA-BASED PERKS ===
  negotiator: {
    id: 'negotiator',
    name: 'Negotiator',
    description: '12% better shop prices',
    requirements: { charisma: 3, level: 6 },
    effect: { type: 'shopDiscount', value: 0.88 }
  },

  merchant: {
    id: 'merchant',
    name: 'Merchant',
    description: '20% better shop prices',
    requirements: { charisma: 5, level: 12 },
    effect: { type: 'shopDiscount', value: 0.80 }
  },

  'master-trader': {
    id: 'master-trader',
    name: 'Master Trader',
    description: '35% better shop prices',
    requirements: { charisma: 7, level: 22 },
    effect: { type: 'shopDiscount', value: 0.65 }
  },

  // === INTELLIGENCE-BASED PERKS ===
  student: {
    id: 'student',
    name: 'Student',
    description: '+20% experience gained',
    requirements: { intelligence: 3, level: 4 },
    effect: { type: 'expBonus', value: 1.20 }
  },

  educated: {
    id: 'educated',
    name: 'Educated',
    description: '+40% experience gained',
    requirements: { intelligence: 5, level: 10 },
    effect: { type: 'expBonus', value: 1.40 }
  },

  scholar: {
    id: 'scholar',
    name: 'Scholar',
    description: '+70% experience gained',
    requirements: { intelligence: 7, level: 18 },
    effect: { type: 'expBonus', value: 1.70 }
  },

  // === AGILITY-BASED PERKS ===
  dodger: {
    id: 'dodger',
    name: 'Dodger',
    description: '+7% dodge chance',
    requirements: { agility: 4, level: 8 },
    effect: { type: 'dodge', value: 0.07 }
  },

  'evasion-expert': {
    id: 'evasion-expert',
    name: 'Evasion Expert',
    description: '+18% dodge chance',
    requirements: { agility: 7, level: 20 },
    effect: { type: 'dodge', value: 0.18 }
  },

  // === LUCK-BASED PERKS ===
  'fortune-finder': {
    id: 'fortune-finder',
    name: 'Fortune Finder',
    description: '+25% money from all sources',
    requirements: { luck: 3, level: 7 },
    effect: { type: 'moneyBonus', value: 1.25 }
  },

  wealthy: {
    id: 'wealthy',
    name: 'Wealthy',
    description: '+65% money from all sources',
    requirements: { luck: 6, level: 16 },
    effect: { type: 'moneyBonus', value: 1.65 }
  },

  // === MIXED REQUIREMENT PERKS ===
  'battle-veteran': {
    id: 'battle-veteran',
    name: 'Battle Veteran',
    description: '+6 attack power',
    requirements: { strength: 4, endurance: 4, level: 14 },
    effect: { type: 'damage', value: 6 }
  },

  // === PERCEPTION-BASED PERKS ===
  'keen-eye': {
    id: 'keen-eye',
    name: 'Keen Eye',
    description: '+15% money from all sources',
    requirements: { perception: 3, level: 6 },
    effect: { type: 'moneyBonus', value: 1.15 }
  },

  'sharp-shooter': {
    id: 'sharp-shooter',
    name: 'Sharp Shooter',
    description: '+4 attack power',
    requirements: { perception: 5, level: 11 },
    effect: { type: 'damage', value: 4 }
  },

  'treasure-hunter': {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    description: '+45% money from all sources',
    requirements: { perception: 7, luck: 5, level: 19 },
    effect: { type: 'moneyBonus', value: 1.45 }
  },

  // === ADVANCED STRENGTH PERKS ===
  'iron-muscles': {
    id: 'iron-muscles',
    name: 'Iron Muscles',
    description: '+25% experience gained',
    requirements: { strength: 6, endurance: 4, level: 17 },
    effect: { type: 'expBonus', value: 1.25 }
  },

  'unstoppable-force': {
    id: 'unstoppable-force',
    name: 'Unstoppable Force',
    description: '+12 attack power',
    requirements: { strength: 8, level: 25 },
    effect: { type: 'damage', value: 12 }
  },

  // === ADVANCED ENDURANCE PERKS ===
  'iron-skin': {
    id: 'iron-skin',
    name: 'Iron Skin',
    description: '+6% dodge chance',
    requirements: { endurance: 5, level: 13 },
    effect: { type: 'dodge', value: 0.06 }
  },

  'wasteland-survivor': {
    id: 'wasteland-survivor',
    name: 'Wasteland Survivor',
    description: '+110 max health',
    requirements: { endurance: 8, level: 23 },
    effect: { type: 'health', value: 110 }
  },

  // === ADVANCED INTELLIGENCE PERKS ===
  'quick-learner': {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: '+15% experience gained',
    requirements: { intelligence: 2, level: 2 },
    effect: { type: 'expBonus', value: 1.15 }
  },

  'genius': {
    id: 'genius',
    name: 'Genius',
    description: '+75% experience gained',
    requirements: { intelligence: 9, level: 16 },
    effect: { type: 'expBonus', value: 1.75 }
  },

  'combat-analyst': {
    id: 'combat-analyst',
    name: 'Combat Analyst',
    description: '+2 attack power',
    requirements: { intelligence: 6, perception: 4, level: 10 },
    effect: { type: 'damage', value: 2 }
  },

  // === ADVANCED AGILITY PERKS ===
  'nimble': {
    id: 'nimble',
    name: 'Nimble',
    description: '+3% dodge chance',
    requirements: { agility: 3, level: 3 },
    effect: { type: 'dodge', value: 0.03 }
  },

  'untouchable': {
    id: 'untouchable',
    name: 'Untouchable',
    description: '+25% dodge chance',
    requirements: { agility: 9, level: 30 },
    effect: { type: 'dodge', value: 0.25 }
  },

  // === ADVANCED LUCK PERKS ===
  'lucky-break': {
    id: 'lucky-break',
    name: 'Lucky Break',
    description: '+8% better shop prices',
    requirements: { luck: 4, level: 9 },
    effect: { type: 'shopDiscount', value: 0.92 }
  },

  'golden-touch': {
    id: 'golden-touch',
    name: 'Golden Touch',
    description: '+120% money from all sources',
    requirements: { luck: 9, level: 27 },
    effect: { type: 'moneyBonus', value: 2.20 }
  },

  // === ELITE MULTI-STAT PERKS ===
  'renaissance-man': {
    id: 'renaissance-man',
    name: 'Renaissance Man',
    description: '+25% experience gained',
    requirements: { intelligence: 6, charisma: 6, level: 12 },
    effect: { type: 'expBonus', value: 1.25 }
  },

  'jack-of-all-trades': {
    id: 'jack-of-all-trades',
    name: 'Jack of All Trades',
    description: '+30% money from all sources',
    requirements: { intelligence: 4, charisma: 4, luck: 4, level: 18 },
    effect: { type: 'moneyBonus', value: 1.30 }
  },

  'ultimate-warrior': {
    id: 'ultimate-warrior',
    name: 'Ultimate Warrior',
    description: '+18 attack power',
    requirements: { strength: 7, endurance: 7, agility: 6, level: 28 },
    effect: { type: 'damage', value: 18 }
  },

  'master-negotiator': {
    id: 'master-negotiator',
    name: 'Master Negotiator',
    description: '40% better shop prices',
    requirements: { charisma: 8, intelligence: 6, level: 26 },
    effect: { type: 'shopDiscount', value: 0.60 }
  },

  'legendary-survivor': {
    id: 'legendary-survivor',
    name: 'Legendary Survivor',
    description: '+180 max health',
    requirements: { endurance: 9, strength: 6, level: 32 },
    effect: { type: 'health', value: 180 }
  },

  // === EARLY GAME HELPER PERKS ===
  'beginner-luck': {
    id: 'beginner-luck',
    name: 'Beginner Luck',
    description: '+5% money from all sources',
    requirements: { luck: 2, level: 1 },
    effect: { type: 'moneyBonus', value: 1.05 }
  },

  'tough-skin': {
    id: 'tough-skin',
    name: 'Tough Skin',
    description: '+10 max health',
    requirements: { endurance: 2, level: 2 },
    effect: { type: 'health', value: 10 }
  },

  'penny-pincher': {
    id: 'penny-pincher',
    name: 'Penny Pincher',
    description: '5% better shop prices',
    requirements: { charisma: 2, level: 2 },
    effect: { type: 'shopDiscount', value: 0.95 }
  },

  // === SPECIALIST COMBAT PERKS ===
  'combat-expert': {
    id: 'combat-expert',
    name: 'Combat Expert',
    description: '+4 attack power',
    requirements: { strength: 6, perception: 4, level: 11 },
    effect: { type: 'damage', value: 4 }
  },

  'defensive-stance': {
    id: 'defensive-stance',
    name: 'Defensive Stance',
    description: '+8% dodge chance',
    requirements: { agility: 5, endurance: 5, level: 9 },
    effect: { type: 'dodge', value: 0.08 }
  },

  'wealthy-merchant': {
    id: 'wealthy-merchant',
    name: 'Wealthy Merchant',
    description: '+55% money from all sources',
    requirements: { charisma: 6, luck: 4, level: 21 },
    effect: { type: 'moneyBonus', value: 1.55 }
  },

  // === LEGENDARY TIER PERKS (Level 30-50) ===
  'apex-predator': {
    id: 'apex-predator',
    name: 'Apex Predator',
    description: '+20 attack power',
    requirements: { strength: 9, perception: 7, level: 35 },
    effect: { type: 'damage', value: 20 }
  },

  'immortal': {
    id: 'immortal',
    name: 'Immortal',
    description: '+200 max health',
    requirements: { endurance: 10, level: 40 },
    effect: { type: 'health', value: 200 }
  },

  'mastermind': {
    id: 'mastermind',
    name: 'Mastermind',
    description: '+150% experience gained',
    requirements: { intelligence: 10, level: 45 },
    effect: { type: 'expBonus', value: 2.50 }
  },

  'phantom': {
    id: 'phantom',
    name: 'Phantom',
    description: '+30% dodge chance',
    requirements: { agility: 10, level: 42 },
    effect: { type: 'dodge', value: 0.30 }
  },

  'midas': {
    id: 'midas',
    name: 'Midas',
    description: '+200% money from all sources',
    requirements: { luck: 10, level: 38 },
    effect: { type: 'moneyBonus', value: 3.00 }
  },

  'merchant-king': {
    id: 'merchant-king',
    name: 'Merchant King',
    description: '50% better shop prices',
    requirements: { charisma: 10, level: 36 },
    effect: { type: 'shopDiscount', value: 0.50 }
  },

  // === ULTIMATE TIER PERKS (Level 45-50) ===
  'god-of-war': {
    id: 'god-of-war',
    name: 'God of War',
    description: '+25 attack power',
    requirements: { strength: 10, endurance: 9, agility: 8, level: 48 },
    effect: { type: 'damage', value: 25 }
  },

  'perfect-being': {
    id: 'perfect-being',
    name: 'Perfect Being',
    description: '+100% experience gained',
    requirements: { intelligence: 9, charisma: 8, luck: 8, level: 46 },
    effect: { type: 'expBonus', value: 2.00 }
  },

  'wasteland-emperor': {
    id: 'wasteland-emperor',
    name: 'Wasteland Emperor',
    description: '+150% money from all sources',
    requirements: { charisma: 9, intelligence: 8, luck: 9, level: 49 },
    effect: { type: 'moneyBonus', value: 2.50 }
  },

  'legend': {
    id: 'legend',
    name: 'Legend',
    description: '+300 max health',
    requirements: { strength: 8, endurance: 10, intelligence: 7, level: 50 },
    effect: { type: 'health', value: 300 }
  }
};

/**
 * Check if character meets perk requirements
 * @param {Object} special - Character's SPECIAL stats
 * @param {number} level - Character's level
 * @param {Object} requirements - Perk requirements
 * @returns {boolean} - Whether requirements are met
 */
const meetsRequirements = (special, level, requirements) => {
  // Check level requirement
  if (level < requirements.level) return false;
  
  // Check SPECIAL stat requirements
  const specialStats = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
  
  for (const stat of specialStats) {
    if (requirements[stat] && special[stat] < requirements[stat]) {
      return false;
    }
  }
  
  return true;
};

/**
 * Generate requirement text for display
 * @param {Object} requirements - Perk requirements
 * @returns {string} - Formatted requirement text
 */
const generateRequirementText = (requirements) => {
  const parts = [];
  
  const statNames = {
    strength: 'Strength',
    perception: 'Perception', 
    endurance: 'Endurance',
    charisma: 'Charisma',
    intelligence: 'Intelligence',
    agility: 'Agility',
    luck: 'Luck'
  };
  
  // Add SPECIAL requirements
  const specialStats = ['strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck'];
  for (const stat of specialStats) {
    if (requirements[stat]) {
      parts.push(`${statNames[stat]} ${requirements[stat]}`);
    }
  }
  
  // Add level requirement
  if (requirements.level) {
    parts.push(`Level ${requirements.level}`);
  }
  
  return parts.join(', ');
};

/**
 * Calculate available perks for character
 * @param {Object} character - Character object with special stats, level, and activePerks
 * @returns {Array} - Array of available perk objects
 */
const calculateAvailablePerks = (character) => {
  const availablePerks = [];
  const { special, level, activePerks } = character;
  
  // Check each perk definition
  Object.values(perkDefinitions).forEach(perkDef => {
    // Skip if already active
    if (activePerks.find(p => p.id === perkDef.id)) return;
    
    // Check if requirements are met
    if (meetsRequirements(special, level, perkDef.requirements)) {
      availablePerks.push({
        id: perkDef.id,
        name: perkDef.name,
        description: perkDef.description,
        requirement: generateRequirementText(perkDef.requirements),
        effect: perkDef.effect
      });
    }
  });
  
  return availablePerks;
};

/**
 * Get perk definition by ID
 * @param {string} perkId - Perk ID
 * @returns {Object|null} - Perk definition or null if not found
 */
const getPerkById = (perkId) => {
  return perkDefinitions[perkId] || null;
};

/**
 * Get all perk definitions
 * @returns {Object} - All perk definitions
 */
const getAllPerks = () => {
  return perkDefinitions;
};

// Export all perk system functions and data
export default {
  perkDefinitions,
  calculateAvailablePerks,
  getPerkById,
  getAllPerks,
  meetsRequirements,
  generateRequirementText
}; 