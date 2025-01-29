export const storyTemplateData = [
  {
    id: 'basic-dialog',
    name: 'Basic Dialog Story',
    category: 'basic',
    difficulty: 'easy',
    shortDescription: 'A simple conversation-based story with basic rewards',
    description: 'Perfect for creating simple dialog-based quests with basic reward structure.',
    hasEnemy: false,
    hasResources: false,
    hasRewards: true,
    hasChoices: true,
    preview: {
      steps: [
        'Introduction dialog with NPC',
        'Player response options',
        'Story progression',
        'Reward completion'
      ],
      features: [
        'Simple dialog structure',
        'Basic reward system',
        'No combat or resource requirements',
        'Suitable for new players'
      ]
    },
    template: {
      name: 'New Dialog Story',
      levelRequirement: 1,
      completed: false,
      requiredStoryLineId: null,
      playerChoices: [],
      steps: [
        {
          npcMessage: "Greetings traveler! Can you help me with something?",
          playerOptions: [
            {
              text: "What do you need?",
              nextId: 2,
              requiredResources: [],
              giveReward: false
            }
          ]
        },
        {
          npcMessage: "Thank you for your interest. Let me explain...",
          playerOptions: [
            {
              text: "I'll help you",
              nextId: 3,
              requiredResources: [],
              giveReward: false
            },
            {
              text: "Sorry, not interested",
              nextId: null,
              requiredResources: [],
              giveReward: false
            }
          ]
        },
        {
          npcMessage: "Thank you for your help! Here's your reward.",
          playerOptions: [
            {
              text: "You're welcome!",
              nextId: null,
              requiredResources: [],
              giveReward: true
            }
          ]
        }
      ],
      reward: {
        exp: 100,
        money: 50,
        resourceRewards: [],
        weaponRewards: [],
        armorRewards: [],
        aidRewards: []
      },
      alwaysGiveReward: true
    }
  },
  {
    id: 'combat-basic',
    name: 'Basic Combat Story',
    category: 'combat',
    difficulty: 'medium',
    shortDescription: 'A combat-focused story with enemy encounters',
    description: 'Create an action-packed story featuring enemy battles and combat rewards.',
    hasEnemy: true,
    hasResources: false,
    hasRewards: true,
    hasChoices: true,
    preview: {
      steps: [
        'Combat introduction',
        'Enemy encounter setup',
        'Battle sequence',
        'Victory rewards'
      ],
      features: [
        'Enemy battle integration',
        'Combat-specific rewards',
        'Multiple choice paths',
        'Experience-based progression'
      ]
    },
    template: {
      name: 'New Combat Story',
      levelRequirement: 2,
      completed: false,
      requiredStoryLineId: null,
      playerChoices: [],
      steps: [
        {
          npcMessage: "We've spotted a dangerous enemy nearby!",
          playerOptions: [
            {
              text: "I'll help deal with it",
              nextId: 2,
              requiredResources: [],
              giveReward: false
            }
          ]
        },
        {
          npcMessage: "Be careful, it's a tough one. Ready to fight?",
          playerOptions: [
            {
              text: "Let's do this!",
              nextId: null,
              action: "startEnemyBattle",
              actionParams: { enemyId: 1 },
              giveReward: false
            },
            {
              text: "I need to prepare first",
              nextId: null,
              giveReward: false
            }
          ]
        }
      ],
      requiredEnemyDefeat: { id: 1, count: 1 },
      reward: {
        exp: 250,
        money: 100,
        resourceRewards: [],
        weaponRewards: [{ id: 2 }],
        armorRewards: [],
        aidRewards: [{ id: 1 }]
      },
      alwaysGiveReward: false
    }
  },
  {
    id: 'resource-gathering',
    name: 'Resource Collection Quest',
    category: 'resource',
    difficulty: 'medium',
    shortDescription: 'A resource gathering mission with specific requirements',
    description: 'Create a quest that requires players to collect and deliver specific resources.',
    hasEnemy: false,
    hasResources: true,
    hasRewards: true,
    hasChoices: true,
    preview: {
      steps: [
        'Resource request',
        'Collection objectives',
        'Delivery and rewards'
      ],
      features: [
        'Resource requirements',
        'Multiple resource types',
        'Reward scaling',
        'Optional paths'
      ]
    },
    template: {
      name: 'New Resource Quest',
      levelRequirement: 1,
      completed: false,
      requiredStoryLineId: null,
      playerChoices: [],
      steps: [
        {
          npcMessage: "We need resources for the settlement. Can you help?",
          playerOptions: [
            {
              text: "What resources do you need?",
              nextId: 2,
              requiredResources: [],
              giveReward: false
            }
          ]
        },
        {
          npcMessage: "We need 5 Wood Scraps and 2 Metal Parts.",
          playerOptions: [
            {
              text: "Here are the resources",
              nextId: null,
              requiredResources: [
                { id: 1, amount: 5 },
                { id: 2, amount: 2 }
              ],
              giveReward: true
            },
            {
              text: "I'll come back when I have them",
              nextId: null,
              giveReward: false
            }
          ]
        }
      ],
      reward: {
        exp: 150,
        money: 75,
        resourceRewards: [{ id: 5, amount: 1 }],
        weaponRewards: [],
        armorRewards: [],
        aidRewards: []
      },
      alwaysGiveReward: false
    }
  },
  {
    id: 'quest-chain',
    name: 'Multi-Part Quest Chain',
    category: 'quest',
    difficulty: 'hard',
    shortDescription: 'A complex quest chain with multiple objectives',
    description: 'Create an engaging quest chain that combines dialog, combat, and resource gathering.',
    hasEnemy: true,
    hasResources: true,
    hasRewards: true,
    hasChoices: true,
    preview: {
      steps: [
        'Chain introduction',
        'Multiple objectives',
        'Combat sequences',
        'Resource gathering',
        'Final rewards'
      ],
      features: [
        'Multiple quest stages',
        'Combined objectives',
        'Progressive rewards',
        'Branching paths'
      ]
    },
    template: {
      name: 'New Quest Chain',
      levelRequirement: 3,
      completed: false,
      requiredStoryLineId: null,
      playerChoices: [],
      steps: [
        {
          npcMessage: "We have a complex situation that needs your help...",
          playerOptions: [
            {
              text: "Tell me more",
              nextId: 2,
              requiredResources: [],
              giveReward: false
            }
          ]
        },
        {
          npcMessage: "First, we need to gather supplies. Bring me 3 Wood Scraps.",
          playerOptions: [
            {
              text: "Here are the resources",
              nextId: 3,
              requiredResources: [{ id: 1, amount: 3 }],
              giveReward: true
            }
          ]
        },
        {
          npcMessage: "Now, there's an enemy blocking our path. Ready to fight?",
          playerOptions: [
            {
              text: "Let's handle this enemy",
              nextId: null,
              action: "startEnemyBattle",
              actionParams: { enemyId: 2 },
              giveReward: true
            }
          ]
        }
      ],
      requiredEnemyDefeat: { id: 2, count: 1 },
      reward: {
        exp: 500,
        money: 250,
        resourceRewards: [{ id: 2, amount: 3 }],
        weaponRewards: [{ id: 3 }],
        armorRewards: [{ id: 2 }],
        aidRewards: [{ id: 2 }]
      },
      alwaysGiveReward: false
    }
  }
]; 