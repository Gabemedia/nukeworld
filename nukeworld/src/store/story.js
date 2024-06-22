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
      exp: 500, // Give some exp for completing the first story
      money: 0,
      resourceRewards: [
        { id: 1, amount: 5 }, // 5x Wood Scrap (assuming Wood Scrap has id 1)
        { id: 2, amount: 5 }  // 5x Steel Scrap (assuming Steel Scrap has id 2)
      ]
    }
  },
  {
    id: 2,
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
            requiredResources: [{ id: 2, amount: 2 }] // Assuming Steel Scrap has id 2
          },
          { text: "I need to find them first", nextId: null }
        ]
      },
      {
        npcMessage: "Fantastic! Your help is invaluable. Here's your reward: 20,000 experience points!",
        playerOptions: [{ text: "Thanks! End conversation", nextId: null }]
      }
    ],
    reward: {
      exp: 2000,
      money: 0,
      resourceRewards: [] // If you want to give resources as a reward
    }
  },
  {
    id: 3,
    name: "Random Quest 1",
    levelRequirement: 5,
    completed: false,
    requiredStoryLineId: null,
    playerChoices: [],
    steps: [
      {
        npcMessage: "We need help with an important task. Are you interested?",
        playerOptions: [{ text: "Tell me more", nextId: 2 }]
      },
      {
        npcMessage: "We need [RANDOM OBJECTIVE]. Can you help us with that?",
        playerOptions: [
          { text: "I'm ready", nextId: 3 },
          { text: "Not right now", nextId: null }
        ]
      },
      {
        npcMessage: "Well done! Here's your reward: [RANDOM REWARD]",
        playerOptions: [{ text: "Thanks! End conversation", nextId: null }]
      }
    ],
    reward: {
      exp: 0,
      money: 0,
      resourceRewards: [] // If you want to give resources as a reward
    }
  },
  {
    id: 4,
    name: "Random Quest 2",
    levelRequirement: 6,
    completed: false,
    requiredStoryLineId: null,
    playerChoices: [],
    steps: [
      {
        npcMessage: "There's an urgent situation that requires your expertise. Interested?",
        playerOptions: [{ text: "Let me hear", nextId: 2 }]
      },
      {
        npcMessage: "We need [RANDOM OBJECTIVE]. Do you think you can handle it?",
        playerOptions: [
          { text: "I'll take the challenge", nextId: 3 },
          { text: "Maybe later", nextId: null }
        ]
      },
      {
        npcMessage: "Impressive work! Your reward is: [RANDOM REWARD]",
        playerOptions: [{ text: "Thanks! End conversation", nextId: null }]
      }
    ],
    reward: {
      exp: 0,
      money: 0,
      resourceRewards: [] // If you want to give resources as a reward
    }
  }
];
