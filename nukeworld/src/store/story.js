export default [
  {
    id: 1,
    name: "Welcome to NukeWorld",
    levelRequirement: 1,
    completed: false,
    requiredStoryLineId: null, 
    playerChoices: [],
    steps: [
      {
        npcMessage: "Welcome to NukeWorld, survivor! This is a dangerous world full of challenges and opportunities.",
        playerOptions: [{ text: "Tell me more", nextId: 2 }]
      },
      {
        npcMessage: "You will find quests marked on your map. Complete them to gain experience and rewards.",
        playerOptions: [{ text: "What about enemies?", nextId: 3 }]
      },
      {
        npcMessage: "Beware of hostile encounters! They can be dangerous, but also provide valuable resources.",
        playerOptions: [{ text: "Understood. What about equipment?", nextId: 4 }]
      },
      {
        npcMessage: "Visit the shop to buy and sell items. Good equipment is key to survival.",
        playerOptions: [{ text: "Thanks for the information", nextId: 5 }]
      },
      {
        npcMessage: "Good luck out there, survivor. NukeWorld awaits you!",
        playerOptions: [{ text: "End conversation", nextId: null }]
      }
    ],
    reward: {
      exp: 250,
      money: 50,
      resourceRewards: [
        { id: 1, amount: 5 },
        { id: 2, amount: 5 }
      ],
      weaponRewards: [],
      armorRewards: [],
      aidRewards: [],
    },
    alwaysGiveReward: true
  },
  {
    id: 2,
    name: "Getting the basics!",
    levelRequirement: 1,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 1, 
    playerChoices: [],
    steps: [
      {
        npcMessage: "You've going to encounter your first enemy soon.",
        playerOptions: [{ text: "Please accept this weapon", nextId: null }]
      },
    ],
    reward: {
      exp: 500,
      money: 50,
      resourceRewards: [],
      weaponRewards: [{ id: 1}],
      armorRewards: [{ id: 1}],
      aidRewards: [{ id: 1}],
    },
    alwaysGiveReward: true
  },
  {
    id: 3,
    name: "Setup HomeBase Settlement",
    levelRequirement: 2,
    completed: false,
    requiredStoryLineId: 1,
    playerChoices: [],
    steps: [
      {
        npcMessage: "It's time to establish a home base. We need resources to get started.",
        playerOptions: [{ text: "What do you need?", nextId: 2 }]
      },
      {
        npcMessage: "We need 2 Steel Scraps for our guards. Can you get them?",
        playerOptions: [
          { 
            text: "I have them ready", 
            nextId: 3, 
            requiredResources: [{ id: 2, amount: 2 }],
            giveReward: true
          },
          { 
            text: "I need to find them first", 
            nextId: null,
            giveReward: false
          }
        ]
      },
      {
        npcMessage: "Fantastic! Your help is invaluable. Here's your reward: 20,000 experience points!",
        playerOptions: [{ text: "Thanks! End conversation", nextId: null }]
      }
    ],
    reward: {
      exp: 200,
      money: 50,
      resourceRewards: [],
      weaponRewards: [],
      armorRewards: [],
      aidRewards: [],
    },
    alwaysGiveReward: false
  },
  {
    id: 4,
    name: "Defeat your first enemy encounter",
    levelRequirement: 1,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 2,
    playerChoices: [],
    requiredEnemyDefeat: { id: 1, count: 1 },
    steps: [
      {
        npcMessage: "A dangerous Goblin Raider is terrorizing our settlement. Can you help us?",
        playerOptions: [{ text: "I'll take care of it", nextId: 2 }]
      },
      {
        npcMessage: "Great! You need to defeat the Goblin Raider in battle. Are you ready?",
        playerOptions: [
          { text: "I'm ready to fight", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 1 } },
          { text: "I need to prepare first", giveReward: false, nextId: null }
        ]
      },
      {
        npcMessage: "You've defeated the Goblin Raider! Our settlement is safe now. Here's your reward.",
        playerOptions: [{ text: "Thank you", giveReward: true, nextId: null }]
      }
    ],
    reward: {
      exp: 100,
      money: 10,
      resourceRewards: [{ id: 3, amount: 10 }],
      weaponRewards: [],
      armorRewards: [],
      aidRewards: [],
    },
    alwaysGiveReward: false
  },  
  {
    id: 5,
    name: "The Scavenger's Dilemma",
    levelRequirement: 3,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 3,
    playerChoices: [],
    requiredEnemyDefeat: { id: 2, count: 1 },
    steps: [
      {
        npcMessage: "Hey survivor! I've got a tricky situation. There's a cache of supplies nearby, but it's guarded by a pack of Mutated Rats.",
        playerOptions: [{ text: "Tell me more", nextId: 2 }]
      },
      {
        npcMessage: "I need someone to clear out the rats and retrieve the supplies. Are you up for it?",
        playerOptions: [
          { text: "I'm ready for action", nextId: 3 },
          { text: "Sounds too dangerous", nextId: null }
        ]
      },
      {
        npcMessage: "Great! Be careful out there. Those Mutated Rats are nasty.",
        playerOptions: [
          { text: "Start the mission", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 2,} }
        ]
      },
      {
        npcMessage: "You did it! You've cleared out the rats and secured the supplies. Here's your reward.",
        playerOptions: [{ text: "Thank you", giveReward: true, nextId: null }]
      }
    ],
    reward: {
      exp: 1500,
      money: 750,
      resourceRewards: [
        { id: 1, amount: 10 }, // 10x Wood Scrap
        { id: 2, amount: 5 }   // 5x Steel Scrap
      ],
      weaponRewards: [{ id: 2 }], // Baseball Bat
      armorRewards: [],
      aidRewards: [{ id: 1 }], // Small Medkit
    },
    alwaysGiveReward: false
  },
  {
    id: 6,
    name: "The Lost Scientist",
    levelRequirement: 4,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 5,
    playerChoices: [],
    requiredEnemyDefeat: { id: 6, count: 1 },
    steps: [
        {
            npcMessage: "Survivor, we have a critical situation. A scientist who was working on a cure for the radiation sickness has gone missing.",
            playerOptions: [{ text: "What do you need me to do?", nextId: 2 }]
        },
        {
            npcMessage: "We believe the scientist was captured by a group of Raiders. We need you to infiltrate their camp and rescue the scientist.",
            playerOptions: [{ text: "I'm ready to go.", nextId: 3 }]
        },
        {
            npcMessage: "Great! Be careful, those Raiders are heavily armed. You might encounter their leader, a dangerous Psychopath.",
            playerOptions: [{ text: "I'm prepared for the worst.", nextId: 4 }]
        },
        {
            npcMessage: "You've reached the Raider camp. You see the scientist tied up in a tent, but the Psychopath is guarding the entrance.",
            playerOptions: [{ text: "Engage the Psychopath in combat.", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 6 } }]
        },
        {
            npcMessage: "You defeated the Psychopath and rescued the scientist! The settlement will be forever grateful for your bravery.",
            playerOptions: [{ text: "It was my duty. End conversation.", nextId: null }]
        }
    ],
    reward: {
        exp: 5000,
        money: 2000,
        resourceRewards: [
            { id: 4, amount: 5 }, // 5x Gasoline
            { id: 6, amount: 3 }  // 3x Electronic Parts
        ],
        weaponRewards: [{ id: 7 }], // 10mm Pistol
        armorRewards: [{ id: 3 }], // Radiation Suit
        aidRewards: [{ id: 3 }], // Big Medkit
    },
    alwaysGiveReward: false
  },
  {
    id: 7,
    name: "Raiders on the Loose",
    levelRequirement: 5,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 6,
    playerChoices: [],
    requiredEnemyDefeat: { id: 7, count: 1 },
    steps: [
        {
            npcMessage: "Survivor, we've received reports of raiders attacking nearby settlements.",
            playerOptions: [{ text: "How can I help?", nextId: 2 }]
        },
        {
            npcMessage: "We need someone to track down their camp and eliminate their leader.",
            playerOptions: [{ text: "I'm on it.", nextId: 3 }]
        },
        {
            npcMessage: "Be cautious. Their leader is known as the Mutant, and he's extremely dangerous.",
            playerOptions: [{ text: "I'll handle it.", nextId: 4 }]
        },
        {
            npcMessage: "You've found the raiders' camp. The Mutant stands guard, ready for a fight.",
            playerOptions: [{ text: "Attack the Mutant.", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 7 } }]
        },
        {
            npcMessage: "You defeated the Mutant and dispersed the raiders! Our settlements are safe for now.",
            playerOptions: [{ text: "Glad to help. End conversation.", nextId: null }]
        }
    ],
    reward: {
        exp: 6000,
        money: 2500,
        resourceRewards: [
            { id: 7, amount: 10 }, // 10x Ammunition
            { id: 10, amount: 2 }  // 2x Battery
        ],
        weaponRewards: [{ id: 9 }], // Laser Pistol
        armorRewards: [{ id: 4 }], // Metal Armor
        aidRewards: [{ id: 2 }], // Medkit
    },
    alwaysGiveReward: false
  },
  {
    id: 8,
    name: "The Hidden Cache",
    levelRequirement: 6,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 7,
    playerChoices: [],
    requiredEnemyDefeat: { id: 4, count: 1 },
    steps: [
        {
            npcMessage: "We've discovered a hidden cache of supplies in an abandoned bunker.",
            playerOptions: [{ text: "What do you need me to do?", nextId: 2 }]
        },
        {
            npcMessage: "The bunker is infested with Ghouls. We need you to clear them out and secure the supplies.",
            playerOptions: [{ text: "I'm ready.", nextId: 3 }]
        },
        {
            npcMessage: "Be prepared for a tough fight. These Ghouls are vicious.",
            playerOptions: [{ text: "Let's do this.", nextId: 4 }]
        },
        {
            npcMessage: "You've reached the bunker. The Ghouls are swarming inside.",
            playerOptions: [{ text: "Engage the Ghouls.", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 4 } }]
        },
        {
            npcMessage: "You cleared the bunker and secured the supplies. Well done!",
            playerOptions: [{ text: "Mission accomplished. End conversation.", nextId: null }]
        }
    ],
    reward: {
        exp: 7000,
        money: 3000,
        resourceRewards: [
            { id: 9, amount: 5 }, // 5x Oil
            { id: 8, amount: 3 }  // 3x Fuel
        ],
        weaponRewards: [{ id: 12 }], // Hunting Rifle
        armorRewards: [{ id: 5 }], // Raider Armor
        aidRewards: [{ id: 3 }], // Big Medkit
    },
    alwaysGiveReward: false
  },
  {
    id: 9,
    name: "The Water Purifier",
    levelRequirement: 7,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 8,
    playerChoices: [],
    requiredEnemyDefeat: { id: 2, count: 1 },
    steps: [
        {
            npcMessage: "Our settlement is in desperate need of clean water. We found an old water purifier, but it's broken.",
            playerOptions: [{ text: "How can I help?", nextId: 2 }]
        },
        {
            npcMessage: "We need electronic parts to fix it. Can you find 3 Electronic Parts for us?",
            playerOptions: [{ text: "I'll get them.", nextId: 3 }]
        },
        {
            npcMessage: "Thank you! Those parts can be found in abandoned buildings, but be careful, they might be guarded by hostile creatures.",
            playerOptions: [{ text: "I'm on my way.", nextId: 4 }]
        },
        {
            npcMessage: "You've found the parts, but a group of Mutated Rats is blocking your way.",
            playerOptions: [{ text: "Fight the Mutated Rats.", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 2 } }]
        },
        {
            npcMessage: "You've got the parts and defeated the Mutated Rats! Our water purifier is back in action.",
            playerOptions: [{ text: "Happy to help. End conversation.", nextId: null }]
        }
    ],
    reward: {
        exp: 8000,
        money: 3500,
        resourceRewards: [
            { id: 6, amount: 3 }, // 3x Electronic Parts
            { id: 5, amount: 5 }  // 5x Cloth Scraps
        ],
        weaponRewards: [{ id: 13 }], // SMG
        armorRewards: [{ id: 6 }], // Plate Armor
        aidRewards: [{ id: 2 }], // Medkit
    },
    alwaysGiveReward: false
  },
  {
    id: 10,
    name: "The Stolen Artifact",
    levelRequirement: 8,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 9,
    playerChoices: [],
    requiredEnemyDefeat: { id: 6, count: 1 },
    steps: [
        {
            npcMessage: "An ancient artifact that could unlock new technologies has been stolen by a group of Psychopaths.",
            playerOptions: [{ text: "What do you need me to do?", nextId: 2 }]
        },
        {
            npcMessage: "We need you to infiltrate their base and retrieve the artifact.",
            playerOptions: [{ text: "Consider it done.", nextId: 3 }]
        },
        {
            npcMessage: "The base is heavily guarded. You'll need to be stealthy or prepare for a fight.",
            playerOptions: [{ text: "I'm ready for anything.", nextId: 4 }]
        },
        {
            npcMessage: "You've reached the Psychopaths' base. The artifact is in sight, but the Psychopath leader is patrolling.",
            playerOptions: [{ text: "Engage the Psychopath leader.", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 6 } }]
        },
        {
            npcMessage: "You defeated the Psychopath leader and recovered the artifact! Our researchers will be thrilled.",
            playerOptions: [{ text: "Happy to help. End conversation.", nextId: null }]
        }
    ],
    reward: {
        exp: 9000,
        money: 4000,
        resourceRewards: [
            { id: 9, amount: 3 }, // 3x Oil
            { id: 7, amount: 5 }  // 5x Ammunition
        ],
        weaponRewards: [{ id: 14 }], // Assault Rifle
        armorRewards: [{ id: 7 }], // Battle Armor
        aidRewards: [{ id: 3 }], // Big Medkit
    },
    alwaysGiveReward: false
  },
  {
    id: 11,
    name: "The Final Stand",
    levelRequirement: 10,
    completed: false,
    repeatable: false,
    requiredStoryLineId: 10,
    playerChoices: [],
    requiredEnemyDefeat: { id: 7, count: 1 },
    steps: [
        {
            npcMessage: "Survivor, the time has come for the final stand against the invaders. Our scouts have located their main base.",
            playerOptions: [{ text: "What do you need me to do?", nextId: 2 }]
        },
        {
            npcMessage: "We need to launch an all-out attack to end their threat once and for all. Are you ready to lead the charge?",
            playerOptions: [{ text: "I'm ready.", nextId: 3 }]
        },
        {
            npcMessage: "The invaders are heavily fortified, but we have no choice. This is our last chance.",
            playerOptions: [{ text: "Let's do this.", nextId: 4 }]
        },
        {
            npcMessage: "You've reached the invaders' base. Their leader, the Warlord, awaits you.",
            playerOptions: [{ text: "Confront the Warlord.", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 7 } }]
        },
        {
            npcMessage: "You've defeated the Warlord and secured victory for our settlement! We can finally rebuild in peace.",
            playerOptions: [{ text: "Victory at last. End conversation.", nextId: null }]
        }
    ],
    reward: {
        exp: 10000,
        money: 5000,
        resourceRewards: [
            { id: 8, amount: 5 }, // 5x Fuel
            { id: 10, amount: 3 }  // 3x Battery
        ],
        weaponRewards: [{ id: 19 }], // Rocket Launcher
        armorRewards: [{ id: 9 }], // Nano Suit
        aidRewards: [{ id: 3 }], // Big Medkit
    },
    alwaysGiveReward: false
}


];
