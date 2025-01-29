export const enemyTemplateData = [
  {
    id: 'basic-enemy',
    name: 'Basic Enemy',
    category: 'basic',
    difficulty: 'easy',
    shortDescription: 'A basic enemy with balanced stats',
    description: 'Perfect for creating standard enemies with basic combat capabilities.',
    hasWeapons: true,
    hasArmor: false,
    hasResources: true,
    preview: {
      features: [
        'Balanced combat stats',
        'Basic weapon drops',
        'Resource rewards',
        'Suitable for new players'
      ]
    },
    template: {
      name: 'New Basic Enemy',
      enemyHealth: 100,
      attack: 10,
      defense: 5,
      exp: 50,
      money: 25,
      reward: [1, 1, 2],
      rewardChance: 0.05,
      resourceReward: [1, 2],
      resourceRewardChance: 0.1,
      levelRequirement: 1
    }
  },
  {
    id: 'armored-enemy',
    name: 'Armored Enemy',
    category: 'defensive',
    difficulty: 'medium',
    shortDescription: 'A well-protected enemy with high defense',
    description: 'Create enemies with strong defensive capabilities and armor drops.',
    hasWeapons: true,
    hasArmor: true,
    hasResources: true,
    preview: {
      features: [
        'High defense stats',
        'Armor drops',
        'Multiple resource types',
        'Better rewards'
      ]
    },
    template: {
      name: 'New Armored Enemy',
      enemyHealth: 150,
      attack: 8,
      defense: 15,
      exp: 100,
      money: 50,
      reward: [2, 3],
      rewardChance: 0.05,
      armorReward: [1, 2],
      armorRewardChance: 0.1,
      resourceReward: [2, 3],
      resourceRewardChance: 0.15,
      levelRequirement: 3
    }
  },
  {
    id: 'elite-enemy',
    name: 'Elite Enemy',
    category: 'elite',
    difficulty: 'hard',
    shortDescription: 'A powerful enemy with high-tier rewards',
    description: 'Create challenging enemies with valuable rewards and strong combat abilities.',
    hasWeapons: true,
    hasArmor: true,
    hasResources: true,
    preview: {
      features: [
        'High combat stats',
        'Rare weapon drops',
        'Valuable resources',
        'Multiple reward types'
      ]
    },
    template: {
      name: 'New Elite Enemy',
      enemyHealth: 250,
      attack: 20,
      defense: 12,
      exp: 200,
      money: 100,
      reward: [3, 4, 5],
      rewardChance: 0.15,
      armorReward: [2, 3],
      armorRewardChance: 0.1,
      resourceReward: [3, 4],
      resourceRewardChance: 0.2,
      levelRequirement: 5
    }
  },
  {
    id: 'boss-enemy',
    name: 'Boss Enemy',
    category: 'boss',
    difficulty: 'very-hard',
    shortDescription: 'A formidable boss with guaranteed rewards',
    description: 'Create challenging boss enemies with guaranteed high-tier rewards.',
    hasWeapons: true,
    hasArmor: true,
    hasResources: true,
    preview: {
      features: [
        'Very high stats',
        'Guaranteed rewards',
        'Multiple reward types',
        'Significant exp/money'
      ]
    },
    template: {
      name: 'New Boss Enemy',
      enemyHealth: 500,
      attack: 30,
      defense: 20,
      exp: 500,
      money: 250,
      reward: [4, 5, 6],
      rewardChance: 0.25,
      armorReward: [3, 4],
      armorRewardChance: 0.2,
      resourceReward: [4, 5],
      resourceRewardChance: 0.3,
      levelRequirement: 8
    }
  }
]; 