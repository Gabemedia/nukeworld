export const questTemplateData = [
  {
    id: 'basic-quest',
    name: 'Basic Supply Quest',
    category: 'basic',
    difficulty: 'easy',
    shortDescription: 'A simple supply gathering quest with basic rewards',
    description: 'Perfect for creating basic supply gathering quests with standard reward structure.',
    hasWeapons: true,
    hasArmor: true,
    hasTimer: true,
    preview: {
      features: [
        'Short duration timer',
        'Basic weapon rewards',
        'Basic armor rewards',
        'Suitable for new players'
      ]
    },
    template: {
      name: 'New Supply Quest',
      desc: 'Help gather supplies for the settlement.',
      exp: 1000,
      money: 100,
      duration: 15000,
      progress: 0,
      state: 'not-started',
      claimed: false,
      disabled: false,
      reward: [1, 1, 2],
      rewardChance: 0.05,
      armorReward: [1, 2],
      armorRewardChance: 0.03,
      levelRequirement: 1
    }
  },
  {
    id: 'exploration',
    name: 'Exploration Quest',
    category: 'exploration',
    difficulty: 'medium',
    shortDescription: 'An exploration-focused quest with better rewards',
    description: 'Create quests that encourage exploration with improved reward chances.',
    hasWeapons: true,
    hasArmor: true,
    hasTimer: true,
    preview: {
      features: [
        'Medium duration timer',
        'Higher reward chances',
        'Multiple armor types',
        'Better weapon selection'
      ]
    },
    template: {
      name: 'New Exploration Quest',
      desc: 'Explore a dangerous area for valuable resources.',
      exp: 2500,
      money: 250,
      duration: 45000,
      progress: 0,
      state: 'not-started',
      claimed: false,
      disabled: false,
      reward: [2, 2, 3, 4],
      rewardChance: 0.1,
      armorReward: [2, 3, 4],
      armorRewardChance: 0.05,
      levelRequirement: 3
    }
  },
  {
    id: 'high-risk',
    name: 'High Risk Quest',
    category: 'dangerous',
    difficulty: 'hard',
    shortDescription: 'A challenging quest with rare rewards',
    description: 'Create high-risk, high-reward quests for experienced players.',
    hasWeapons: true,
    hasArmor: true,
    hasTimer: true,
    preview: {
      features: [
        'Long duration timer',
        'Rare weapon rewards',
        'High-tier armor',
        'Significant exp rewards'
      ]
    },
    template: {
      name: 'New High Risk Quest',
      desc: 'A dangerous mission with valuable rewards.',
      exp: 5000,
      money: 1000,
      duration: 120000,
      progress: 0,
      state: 'not-started',
      claimed: false,
      disabled: false,
      reward: [3, 4, 5, 6, 7],
      rewardChance: 0.15,
      armorReward: [3, 4, 5, 6],
      armorRewardChance: 0.1,
      levelRequirement: 5
    }
  },
  {
    id: 'settlement',
    name: 'Settlement Quest',
    category: 'settlement',
    difficulty: 'medium',
    shortDescription: 'A settlement maintenance and improvement quest',
    description: 'Create quests focused on maintaining and improving the settlement.',
    hasWeapons: true,
    hasArmor: true,
    hasTimer: true,
    preview: {
      features: [
        'Settlement focused',
        'Resource rewards',
        'Multiple reward types',
        'Community benefits'
      ]
    },
    template: {
      name: 'New Settlement Quest',
      desc: 'Help improve and maintain the settlement.',
      exp: 3000,
      money: 500,
      duration: 60000,
      progress: 0,
      state: 'not-started',
      claimed: false,
      disabled: false,
      reward: [1, 2, 2, 3, 3],
      rewardChance: 0.08,
      armorReward: [1, 2, 2, 3],
      armorRewardChance: 0.04,
      levelRequirement: 2
    }
  }
]; 