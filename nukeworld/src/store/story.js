export default [
  { // Tutorial
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
        playerOptions: [{ text: "What else?", nextId: 3 }]
      },
      {
        npcMessage: "Complete the Story but Beware of hostile encounters!",
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
      resourceRewards: [{ id: 1, amount: 5 }, { id: 2, amount: 5 }],
      weaponRewards: [],
      armorRewards: [],
      aidRewards: [],
    },
    alwaysGiveReward: true
  },
  {
    id: 2,
    name: "Getting the basics!",
    levelRequirement: 2,
    completed: false,
    requiredStoryLineId: 1, 
    playerChoices: [],
    steps: [
      {
        npcMessage: "This should get you started. I'll give you a basic weapon, armor, and a medkit.",
        playerOptions: [{ text: "Thank you very much!", nextId: null }]
      },
    ],
    reward: {
      exp: 50,
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
            text: "I have them ready right here.", 
            nextId: 3, 
            requiredResources: [{ id: 2, amount: 2 }],
            giveReward: true
          },
          { 
            text: "I´m not gonna waste my Resources to help you.", 
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
      exp: 1000,
      money: 250,
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
    requiredStoryLineId: 2,
    playerChoices: [],
    requiredEnemyDefeat: { id: 1, count: 1 },
    steps: [
      {
        npcMessage: "A dangerous mutated Fly is terrorizing our settlement. Can you help us?",
        playerOptions: [{ text: "I'll take care of it", nextId: 2 }]
      },
      {
        npcMessage: "Great! You need to defeat the Fly in battle. Are you ready?",
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
      exp: 250,
      money: 12,
      resourceRewards: [{ id: 1, amount: 3 }, { id: 2, amount: 1 }],
      weaponRewards: [],
      armorRewards: [],
      aidRewards: [{ id: 1}],
    },
    alwaysGiveReward: false
  },  
  {
    id: 5,
    name: "The Scavenger's Dilemma",
    levelRequirement: 2,
    completed: false,
    requiredStoryLineId: 0,
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
          { text: "Start the mission", nextId: null, action: 'startEnemyBattle', actionParams: { enemyId: 2,} },
          { text: "Sounds too dangerous", giveReward: false, nextId: null }
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
        { id: 1, amount: 5 }, // 5x Wood Scrap
        { id: 2, amount: 2 },  // 2x Steel Scrap
        { id: 3, amount: 1 }   // 5x Plastic Scrap
      ],
      weaponRewards: [{ id: 2 }], // Baseball Bat
      armorRewards: [],
      aidRewards: [{ id: 1 }], // Small Medkit
    },
    alwaysGiveReward: false
  },
  
];
