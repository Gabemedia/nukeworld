export default [
  {
    "id": 0,
    "name": "Welcome to NukeWorld",
    "levelRequirement": 1,
    "completed": false,
    "requiredStoryLineId": 0,
    "playerChoices": [
      "Tell me more!",
      "That´s Amazing!",
      "I understrand. What about equipment?",
      "Thanks for the information!",
      "Continue Story."
    ],
    "steps": [
      {
        "npcMessage": "Welcome to NukeWorld {PlayerName}! This is a dangerous world full of challenges and opportunities.",
        "playerOptions": [
          {
            "text": "Tell me more!",
            "nextId": 2
          }
        ]
      },
      {
        "npcMessage": "You can complete the Story and you will find quests marked on your map. Complete them to gain Experience, NukaCoins, Weapons, Armor and other Cool Drops!.",
        "playerOptions": [
          {
            "text": "That´s Amazing!",
            "nextId": 3
          }
        ]
      },
      {
        "npcMessage": "LevelUp your character, create a strong build and follow the Story but Beware of hostile encounters! Death have no mercy in the Toxic Wastelands of NukeWorld!",
        "playerOptions": [
          {
            "text": "I understrand. What about equipment?",
            "nextId": 4
          }
        ]
      },
      {
        "npcMessage": "Visit the shop to buy and sell items directly from our Inventory. Good equipment is key to survival.",
        "playerOptions": [
          {
            "text": "Thanks for the information!",
            "nextId": 5
          }
        ]
      },
      {
        "npcMessage": "Good luck out there, survivor. NukeWorld awaits you!",
        "playerOptions": [
          {
            "text": "Continue Story.",
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 250,
      "money": 50,
      "resourceRewards": [
        {
          "id": 1,
          "amount": 50
        },
        {
          "id": 2,
          "amount": 50
        }
      ],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": []
    },
    "alwaysGiveReward": true,
    "currentStepIndex": 0
  },
  {
    "id": 1,
    "name": "Getting to know the Basics!",
    "levelRequirement": 1,
    "completed": false,
    "requiredStoryLineId": 0,
    "playerChoices": [
      "Thank you very much!"
    ],
    "steps": [
      {
        "npcMessage": "I'll give you a basic weapon, armor, and a medkit. This should get you started out there in the wasteland!",
        "playerOptions": [
          {
            "text": "Thank you very much!",
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 250,
      "money": 50,
      "resourceRewards": [],
      "weaponRewards": [
        {
          "id": 1
        }
      ],
      "armorRewards": [
        {
          "id": 1
        }
      ],
      "aidRewards": [
        {
          "id": 1
        }
      ]
    },
    "alwaysGiveReward": true,
    "currentStepIndex": 0
  },
  {
    "id": 2,
    "name": "Locate, Supply and Establish Settlement",
    "levelRequirement": 1,
    "completed": false,
    "requiredStoryLineId": 1,
    "playerChoices": [
      "What do you need from me?",
      "I have them ready right here.",
      "I´m not gonna waste my Resources to help you.",
      "Thanks! End conversation"
    ],
    "steps": [
      {
        "npcMessage": "It's time to establish a new Settlement, we have grown tried of the life down in The Underground Tunnel. We need to get started... ",
        "playerOptions": [
          {
            "text": "What do you need from me?",
            "nextId": 2
          }
        ]
      },
      {
        "npcMessage": "We need 5 Wood Scraps for our guards. Can you get them?",
        "playerOptions": [
          {
            "text": "I have them ready right here.",
            "nextId": 3,
            "requiredResources": [
              {
                "id": 1,
                "amount": 5
              }
            ],
            "giveReward": true
          },
          {
            "text": "I´m not gonna waste my Resources to help you.",
            "nextId": null,
            "giveReward": false
          }
        ]
      },
      {
        "npcMessage": "Fantastic! Your help is invaluable. Here is your reward!",
        "playerOptions": [
          {
            "text": "Thanks! End conversation",
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 2500,
      "money": 500,
      "resourceRewards": [],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": [
        {
          "id": 1
        }
      ]
    },
    "alwaysGiveReward": false
  },
  {
    "id": 3,
    "name": "Defeat your first enemy encounter",
    "levelRequirement": 1,
    "completed": false,
    "requiredStoryLineId": 1,
    "playerChoices": [
      "I'll take care of it",
      "I'm ready to fight",
      "I need to prepare first",
      "Thank you"
    ],
    "requiredEnemyDefeat": {
      "id": 1,
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A dangerous mutated Fly is terrorizing our group!?",
        "playerOptions": [
          {
            "text": "I'll take care of it",
            "nextId": 2
          }
        ]
      },
      {
        "npcMessage": "Great! You need to defeat the Fly in battle. Are you ready?",
        "playerOptions": [
          {
            "text": "I'm ready to fight",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": {
              "enemyId": 1
            }
          },
          {
            "text": "I need to prepare first",
            "giveReward": false,
            "nextId": null
          }
        ]
      },
      {
        "npcMessage": "You've defeated the Fly! Our settlement is safe now. Here's your reward.",
        "playerOptions": [
          {
            "text": "Thank you",
            "giveReward": true,
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 500,
      "money": 50,
      "resourceRewards": [],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": [
        {
          "id": 1
        }
      ]
    },
    "alwaysGiveReward": false
  },
  {
    "id": 4,
    "name": "The Scavenger's Dilemma",
    "levelRequirement": 3,
    "completed": false,
    "requiredStoryLineId": 3,
    "playerChoices": [
      "Tell me more",
      "Start the mission",
      "Sounds too dangerous",
      "Thank you"
    ],
    "requiredEnemyDefeat": {
      "id": 2,
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "Hey survivor! I've got a tricky situation. There's a cache of supplies nearby, but it's guarded by a pack of Mutated Rats.",
        "playerOptions": [
          {
            "text": "Tell me more",
            "nextId": 2
          }
        ]
      },
      {
        "npcMessage": "I need someone to clear out the rats and retrieve the supplies. Are you up for it?",
        "playerOptions": [
          {
            "text": "Start the mission",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": {
              "enemyId": 2
            }
          },
          {
            "text": "Sounds too dangerous",
            "giveReward": false,
            "nextId": null
          }
        ]
      },
      {
        "npcMessage": "You did it! You've cleared out the rats and secured the supplies. Here's your reward.",
        "playerOptions": [
          {
            "text": "Thank you",
            "giveReward": true,
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 500,
      "money": 150,
      "resourceRewards": [
        {
          "id": 1,
          "amount": 5
        }
      ],
      "weaponRewards": [
        {
          "id": 2
        }
      ],
      "armorRewards": [],
      "aidRewards": [
        {
          "id": 1
        }
      ]
    },
    "alwaysGiveReward": false
  },
  {
    "id": 5,
    "name": "Simple Delivery",
    "levelRequirement": 3,
    "completed": false,
    "requiredStoryLineId": 1,
    "playerChoices": [
      "Sure, what do you need?",
      "No...",
      "Yes, I can do that",
      "No, I don't have the time"
    ],
    "steps": [
      {
        "npcMessage": "Hey survivor! I've got a delivery task for you. Can you help me?",
        "playerOptions": [
          {
            "text": "Sure, what do you need?",
            "nextId": 2,
            "requiredResources": [],
            "giveReward": false
          },
          {
            "text": "No...",
            "nextId": null,
            "requiredResources": [],
            "giveReward": false
          }
        ]
      },
      {
        "npcMessage": "I need you to collect 5 Wood Scraps for me?",
        "playerOptions": [
          {
            "text": "Yes, I can do that",
            "nextId": null,
            "requiredResources": [
              {
                "id": 1,
                "amount": 5
              }
            ],
            "giveReward": true
          },
          {
            "text": "No, I don't have the time",
            "nextId": null,
            "requiredResources": [],
            "giveReward": false
          }
        ]
      }
    ],
    "requiredEnemyDefeat": {
      "id": null,
      "count": 0
    },
    "reward": {
      "exp": 500,
      "money": 150,
      "resourceRewards": [
        {
          "id": 2,
          "amount": 2
        }
      ],
      "weaponRewards": [],
      "armorRewards": [
        {
          "id": 3
        }
      ],
      "aidRewards": []
    },
    "alwaysGiveReward": false
  },
  {
    "id": 6,
    "name": "THE GIANT RADBETTLE!",
    "levelRequirement": 5,
    "completed": false,
    "requiredStoryLineId": 4,
    "playerChoices": [
      "OMG ITS... HUGE!!! KILL IT!!!",
      "Run Run Run...",
      "We just learn to help each other!"
    ],
    "steps": [
      {
        "npcMessage": "THE GIANT RADBETTLE IS BACK!",
        "playerOptions": [
          {
            "text": "OMG ITS... HUGE!!! KILL IT!!!",
            "nextId": null,
            "requiredResources": [],
            "giveReward": false,
            "action": "startEnemyBattle",
            "actionParams": {
              "enemyId": 8
            }
          },
          {
            "text": "Run Run Run...",
            "nextId": null,
            "requiredResources": [],
            "giveReward": false,
            "action": null
          }
        ]
      },
      {
        "npcMessage": "Thank you Survivor!",
        "playerOptions": [
          {
            "text": "We just learn to help each other!",
            "nextId": null,
            "requiredResources": [],
            "giveReward": true,
            "action": null
          }
        ]
      }
    ],
    "requiredEnemyDefeat": {
      "id": 8,
      "count": 1
    },
    "reward": {
      "exp": 2500,
      "money": 500,
      "resourceRewards": [
        {
          "id": 1,
          "amount": 5
        },
        {
          "id": 2,
          "amount": 2
        }
      ],
      "weaponRewards": [],
      "armorRewards": [
        {
          "id": 2
        }
      ],
      "aidRewards": []
    },
    "alwaysGiveReward": false
  },
  {
    "id": 7,
    "name": "Scavenger's First Task",
    "levelRequirement": 2,
    "completed": false,
    "requiredStoryLineId": 1,
    "playerChoices": [
      "Where should I look?",
      "I'll bring what I find.",
      "Not ready yet.",
      "Here are the scraps."
    ],
    "steps": [
      {
        "npcMessage": "We need more materials to reinforce our shelter. Can you scavenge the nearby ruins?",
        "playerOptions": [
          { "text": "Where should I look?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Look for Wood Scrap and Steel Scrap. Bring at least 2 of each.",
        "playerOptions": [
          { "text": "I'll bring what I find.", "nextId": null },
          { "text": "Not ready yet.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Did you find the materials?",
        "playerOptions": [
          {
            "text": "Here are the scraps.",
            "nextId": null,
            "requiredResources": [
              { "id": 1, "amount": 2 }, // Wood Scrap
              { "id": 2, "amount": 2 }  // Steel Scrap
            ],
            "giveReward": true
          }
        ]
      }
    ],
    "reward": {
      "exp": 200,
      "money": 80,
      "resourceRewards": [
        { "id": 5, "amount": 2 } // Cloth Scraps
      ],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": [
        { "id": 1 } // Small Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 8,
    "name": "Rats in the Pantry",
    "levelRequirement": 3,
    "completed": false,
    "requiredStoryLineId": 7,
    "playerChoices": [
      "I'll handle it.",
      "Let me get ready.",
      "The rats are gone!"
    ],
    "requiredEnemyDefeat": {
      "id": 2, // Mutated Rat
      "count": 2
    },
    "steps": [
      {
        "npcMessage": "Rats have invaded our food supplies! Can you get rid of them?",
        "playerOptions": [
          { "text": "I'll handle it.", "nextId": 2 },
          { "text": "Let me get ready.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat 2 mutated rats in the storage area.",
        "playerOptions": [
          {
            "text": "Start the fight!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 2 }
          }
        ]
      },
      {
        "npcMessage": "You did it! The food is safe again.",
        "playerOptions": [
          { "text": "The rats are gone!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 300,
      "money": 100,
      "resourceRewards": [
        { "id": 1, "amount": 2 }, // Wood Scrap
        { "id": 5, "amount": 1 } // Cloth Scraps
      ],
      "weaponRewards": [
        { "id": 1 } // Knife
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 1 } // Small Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 9,
    "name": "A Friend in Need",
    "levelRequirement": 4,
    "completed": false,
    "requiredStoryLineId": 8,
    "playerChoices": [
      "Where did you last see them?",
      "I'll go look.",
      "Found your friend!"
    ],
    "steps": [
      {
        "npcMessage": "My friend hasn't returned from scavenging. Can you help find them?",
        "playerOptions": [
          { "text": "Where did you last see them?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "They went towards the old library. Please hurry!",
        "playerOptions": [
          { "text": "I'll go look.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found the friend and brought them back!",
        "playerOptions": [
          { "text": "Found your friend!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 400,
      "money": 120,
      "resourceRewards": [
        { "id": 3, "amount": 1 } // Plastic Scrap
      ],
      "weaponRewards": [
        { "id": 20 } // Pistol (added firearm reward)
      ],
      "armorRewards": [
        { "id": 1 } // T-Shirt
      ],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 10,
    "name": "Delivery Run",
    "levelRequirement": 5,
    "completed": false,
    "requiredStoryLineId": 9,
    "playerChoices": [
      "What needs to be delivered?",
      "I'll deliver it.",
      "Delivery complete!"
    ],
    "steps": [
      {
        "npcMessage": "We need to get supplies to the next outpost. Can you deliver this package?",
        "playerOptions": [
          { "text": "What needs to be delivered?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Just some basic supplies. Take them to the outpost and return for your reward.",
        "playerOptions": [
          { "text": "I'll deliver it.", "nextId": null }
        ]
      },
      {
        "npcMessage": "The outpost received the supplies. Thank you!",
        "playerOptions": [
          { "text": "Delivery complete!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 500,
      "money": 150,
      "resourceRewards": [
        { "id": 2, "amount": 2 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 21 } // 10mm Pistol (added firearm reward)
      ],
      "armorRewards": [
        { "id": 2 } // Wooden Armor
      ],
      "aidRewards": [
        { "id": 1 } // Small Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 11,
    "name": "The Watch Post",
    "levelRequirement": 6,
    "completed": false,
    "requiredStoryLineId": 10,
    "playerChoices": [
      "I'll take the watch.",
      "Let me rest first.",
      "All clear!"
    ],
    "steps": [
      {
        "npcMessage": "We need someone to keep watch tonight. Will you do it?",
        "playerOptions": [
          { "text": "I'll take the watch.", "nextId": 2 },
          { "text": "Let me rest first.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Stay alert and report anything unusual.",
        "playerOptions": [
          { "text": "All clear!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 600,
      "money": 180,
      "resourceRewards": [
        { "id": 5, "amount": 2 } // Cloth Scraps
      ],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 12,
    "name": "The Hungry Hound",
    "levelRequirement": 7,
    "completed": false,
    "requiredStoryLineId": 11,
    "playerChoices": [
      "I'll find food.",
      "Not now.",
      "Here, doggy!"
    ],
    "steps": [
      {
        "npcMessage": "A stray dog is starving outside the camp. Can you find some food for it?",
        "playerOptions": [
          { "text": "I'll find food.", "nextId": 2 },
          { "text": "Not now.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Find 1 Meat (resource) and return to the dog.",
        "playerOptions": [
          {
            "text": "Here, doggy!",
            "nextId": null,
            "requiredResources": [
              { "id": 12, "amount": 1 } // Example: Meat (if exists, else change to another resource)
            ],
            "giveReward": true
          }
        ]
      }
    ],
    "reward": {
      "exp": 700,
      "money": 200,
      "resourceRewards": [
        { "id": 1, "amount": 2 } // Wood Scrap
      ],
      "weaponRewards": [
        { "id": 18 } // Bow (added firearm/ranged reward)
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 13,
    "name": "The Broken Fence",
    "levelRequirement": 8,
    "completed": false,
    "requiredStoryLineId": 12,
    "playerChoices": [
      "What do you need?",
      "I'll fix it.",
      "Fence is fixed!"
    ],
    "steps": [
      {
        "npcMessage": "The fence is broken and creatures are getting in. Can you repair it?",
        "playerOptions": [
          { "text": "What do you need?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "We need 3 Wood Scrap and 2 Screws to fix the fence.",
        "playerOptions": [
          {
            "text": "I'll fix it.",
            "nextId": null,
            "requiredResources": [
              { "id": 1, "amount": 3 }, // Wood Scrap
              { "id": 11, "amount": 2 } // Screws
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "The fence is repaired. The camp is safer now!",
        "playerOptions": [
          { "text": "Fence is fixed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 800,
      "money": 250,
      "resourceRewards": [
        { "id": 2, "amount": 2 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 5 } // Wrench
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 14,
    "name": "The Water Pump",
    "levelRequirement": 6,
    "completed": false,
    "requiredStoryLineId": 13,
    "playerChoices": [
      "What's wrong with it?",
      "I'll check it out.",
      "Pump is working!"
    ],
    "steps": [
      {
        "npcMessage": "The water pump has stopped working. Can you investigate?",
        "playerOptions": [
          { "text": "What's wrong with it?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "It might be clogged or need parts. Check the pump house.",
        "playerOptions": [
          { "text": "I'll check it out.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You fixed the pump! Clean water is flowing again.",
        "playerOptions": [
          { "text": "Pump is working!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 900,
      "money": 300,
      "resourceRewards": [
        { "id": 2, "amount": 3 }, // Steel Scrap
        { "id": 11, "amount": 1 } // Screws
      ],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 15,
    "name": "The Lone Wolf",
    "levelRequirement": 7,
    "completed": false,
    "requiredStoryLineId": 14,
    "playerChoices": [
      "I'll hunt it down.",
      "Let me prepare.",
      "The wolf is dead!"
    ],
    "requiredEnemyDefeat": {
      "id": 4, // Example enemy ID for wolf
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A lone wolf has been attacking our livestock. Can you deal with it?",
        "playerOptions": [
          { "text": "I'll hunt it down.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Find and defeat the wolf before it kills more animals.",
        "playerOptions": [
          {
            "text": "Start the hunt!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 4 }
          }
        ]
      },
      {
        "npcMessage": "You killed the wolf! The livestock is safe now.",
        "playerOptions": [
          { "text": "The wolf is dead!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 1100,
      "money": 350,
      "resourceRewards": [
        { "id": 1, "amount": 3 }, // Wood Scrap
        { "id": 5, "amount": 2 } // Cloth Scraps
      ],
      "weaponRewards": [
        { "id": 22 } // Revolver (added firearm reward)
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 16,
    "name": "The Medicine Run",
    "levelRequirement": 8,
    "completed": false,
    "requiredStoryLineId": 15,
    "playerChoices": [
      "Where do I find medicine?",
      "I'll get the medicine.",
      "Medicine delivered!"
    ],
    "steps": [
      {
        "npcMessage": "We need medicine for the sick. Can you find some?",
        "playerOptions": [
          { "text": "Where do I find medicine?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Check the old clinic. Look for medkits or medical supplies.",
        "playerOptions": [
          { "text": "I'll get the medicine.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found medicine! The sick will recover now.",
        "playerOptions": [
          { "text": "Medicine delivered!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 1300,
      "money": 400,
      "resourceRewards": [
        { "id": 3, "amount": 2 } // Plastic Scrap
      ],
      "weaponRewards": [],
      "armorRewards": [
        { "id": 3 } // Leather Armor
      ],
      "aidRewards": [
        { "id": 3 } // Big Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 17,
    "name": "The Bandit Camp",
    "levelRequirement": 9,
    "completed": false,
    "requiredStoryLineId": 16,
    "playerChoices": [
      "I'll scout the camp.",
      "Let me gather intel.",
      "Camp cleared!"
    ],
    "requiredEnemyDefeat": {
      "id": 6, // Example enemy ID for bandit
      "count": 3
    },
    "steps": [
      {
        "npcMessage": "Bandits have set up camp nearby. Can you scout it out?",
        "playerOptions": [
          { "text": "I'll scout the camp.", "nextId": 2 },
          { "text": "Let me gather intel.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat 3 bandits and clear the camp.",
        "playerOptions": [
          {
            "text": "Attack the camp!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 6 }
          }
        ]
      },
      {
        "npcMessage": "You cleared the bandit camp! The area is safer now.",
        "playerOptions": [
          { "text": "Camp cleared!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 1500,
      "money": 500,
      "resourceRewards": [
        { "id": 2, "amount": 5 }, // Steel Scrap
        { "id": 7, "amount": 10 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 8 } // Police Baton
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 3 } // Big Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 18,
    "name": "The Old Factory",
    "levelRequirement": 10,
    "completed": false,
    "requiredStoryLineId": 17,
    "playerChoices": [
      "What's in the factory?",
      "I'll explore it.",
      "Factory explored!"
    ],
    "steps": [
      {
        "npcMessage": "An old factory might have useful supplies. Can you explore it?",
        "playerOptions": [
          { "text": "What's in the factory?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Look for metal parts, electronics, and any valuable materials.",
        "playerOptions": [
          { "text": "I'll explore it.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found useful supplies in the factory!",
        "playerOptions": [
          { "text": "Factory explored!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 1700,
      "money": 600,
      "resourceRewards": [
        { "id": 2, "amount": 4 }, // Steel Scrap
        { "id": 6, "amount": 2 } // Electronic Parts
      ],
      "weaponRewards": [
        { "id": 28 } // Hunting Rifle (added firearm reward)
      ],
      "armorRewards": [
        { "id": 4 } // Fur Coat
      ],
      "aidRewards": [
        { "id": 2 } // Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 19,
    "name": "The Radio Tower",
    "levelRequirement": 11,
    "completed": false,
    "requiredStoryLineId": 18,
    "playerChoices": [
      "What's the problem?",
      "I'll fix the tower.",
      "Tower is working!"
    ],
    "steps": [
      {
        "npcMessage": "The radio tower is down. We need communications back online.",
        "playerOptions": [
          { "text": "What's the problem?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "We need 2 Electronic Parts and 1 Battery to fix the tower.",
        "playerOptions": [
          {
            "text": "I'll fix the tower.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 2 }, // Electronic Parts
              { "id": 10, "amount": 1 } // Battery
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "The radio tower is working! We can communicate with other settlements.",
        "playerOptions": [
          { "text": "Tower is working!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 1900,
      "money": 700,
      "resourceRewards": [
        { "id": 7, "amount": 15 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 9 } // Spear
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 3 } // Big Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 20,
    "name": "The Mutant Nest",
    "levelRequirement": 12,
    "completed": false,
    "requiredStoryLineId": 19,
    "playerChoices": [
      "I'll clear the nest.",
      "Let me prepare.",
      "Nest destroyed!"
    ],
    "requiredEnemyDefeat": {
      "id": 7, // Example enemy ID for mutant
      "count": 4
    },
    "steps": [
      {
        "npcMessage": "Mutants have built a nest near our settlement. Can you clear it?",
        "playerOptions": [
          { "text": "I'll clear the nest.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat 4 mutants to destroy the nest.",
        "playerOptions": [
          {
            "text": "Attack the nest!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 7 }
          }
        ]
      },
      {
        "npcMessage": "You destroyed the mutant nest! The settlement is safe.",
        "playerOptions": [
          { "text": "Nest destroyed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 2100,
      "money": 800,
      "resourceRewards": [
        { "id": 2, "amount": 6 }, // Steel Scrap
        { "id": 7, "amount": 20 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 26 } // Shotgun (added firearm reward)
      ],
      "armorRewards": [
        { "id": 5 } // Body Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 21,
    "name": "The Missing Scout",
    "levelRequirement": 13,
    "completed": false,
    "requiredStoryLineId": 20,
    "playerChoices": [
      "Where was the scout last seen?",
      "I'll search the ruins.",
      "Scout rescued!"
    ],
    "steps": [
      {
        "npcMessage": "One of our scouts hasn't returned. Can you find them?",
        "playerOptions": [
          { "text": "Where was the scout last seen?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "They were last seen near the collapsed ruins. Be careful!",
        "playerOptions": [
          { "text": "I'll search the ruins.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found and rescued the scout!",
        "playerOptions": [
          { "text": "Scout rescued!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 2300,
      "money": 900,
      "resourceRewards": [
        { "id": 2, "amount": 6 }, // Steel Scrap
        { "id": 5, "amount": 3 } // Cloth Scraps
      ],
      "weaponRewards": [],
      "armorRewards": [
        { "id": 6 } // Trader Suit
      ],
      "aidRewards": [
        { "id": 3 } // Big Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 22,
    "name": "The Saboteur",
    "levelRequirement": 14,
    "completed": false,
    "requiredStoryLineId": 21,
    "playerChoices": [
      "What was sabotaged?",
      "I'll investigate.",
      "Saboteur caught!"
    ],
    "steps": [
      {
        "npcMessage": "Someone sabotaged our food stores. Can you find out who?",
        "playerOptions": [
          { "text": "What was sabotaged?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The food was poisoned. Look for clues in the storage area.",
        "playerOptions": [
          { "text": "I'll investigate.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found the saboteur and stopped them!",
        "playerOptions": [
          { "text": "Saboteur caught!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 2500,
      "money": 1000,
      "resourceRewards": [
        { "id": 3, "amount": 3 }, // Plastic Scrap
        { "id": 5, "amount": 2 } // Cloth Scraps
      ],
      "weaponRewards": [
        { "id": 12 } // Battle Axe (still not high-tier)
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 23,
    "name": "The Power Relay",
    "levelRequirement": 15,
    "completed": false,
    "requiredStoryLineId": 22,
    "playerChoices": [
      "What's wrong with the relay?",
      "I'll repair it.",
      "Relay fixed!"
    ],
    "steps": [
      {
        "npcMessage": "The power relay is down. Can you repair it?",
        "playerOptions": [
          { "text": "What's wrong with the relay?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "We need 2 Electronic Parts and 2 Screws to fix it.",
        "playerOptions": [
          {
            "text": "I'll repair it.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 2 }, // Electronic Parts
              { "id": 11, "amount": 2 } // Screws
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "The relay is working again! Power is restored.",
        "playerOptions": [
          { "text": "Relay fixed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 2700,
      "money": 1100,
      "resourceRewards": [
        { "id": 6, "amount": 2 }, // Electronic Parts
        { "id": 7, "amount": 15 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 13 } // Auto Axe (mid-tier)
      ],
      "armorRewards": [],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 24,
    "name": "The Raider Threat",
    "levelRequirement": 16,
    "completed": false,
    "requiredStoryLineId": 23,
    "playerChoices": [
      "I'll defend the camp.",
      "Let me prepare.",
      "Raiders defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 10, // Example enemy ID for raider
      "count": 5
    },
    "steps": [
      {
        "npcMessage": "Raiders are attacking again! Can you help defend the camp?",
        "playerOptions": [
          { "text": "I'll defend the camp.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat 5 raiders to protect the settlement.",
        "playerOptions": [
          {
            "text": "Start the battle!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 10 }
          }
        ]
      },
      {
        "npcMessage": "You defeated the raiders! The camp is safe.",
        "playerOptions": [
          { "text": "Raiders defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 3000,
      "money": 1200,
      "resourceRewards": [
        { "id": 2, "amount": 8 }, // Steel Scrap
        { "id": 7, "amount": 20 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 14 } // Machete
      ],
      "armorRewards": [
        { "id": 6 } // Trader Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 25,
    "name": "The Outpost Siege",
    "levelRequirement": 13,
    "completed": false,
    "requiredStoryLineId": 24,
    "playerChoices": [
      "I'll help defend!",
      "Let me prepare.",
      "Outpost is safe!"
    ],
    "requiredEnemyDefeat": {
      "id": 11, // Example enemy ID for raider/attacker
      "count": 6
    },
    "steps": [
      {
        "npcMessage": "Our outpost is under siege by a large group of raiders! Can you help defend it?",
        "playerOptions": [
          { "text": "I'll help defend!", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat 6 attackers to break the siege.",
        "playerOptions": [
          {
            "text": "Start the defense!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 11 }
          }
        ]
      },
      {
        "npcMessage": "You broke the siege! The outpost is safe.",
        "playerOptions": [
          { "text": "Outpost is safe!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 3400,
      "money": 1400,
      "resourceRewards": [
        { "id": 2, "amount": 10 }, // Steel Scrap
        { "id": 7, "amount": 25 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 26,
    "name": "The Lost Convoy",
    "levelRequirement": 14,
    "completed": false,
    "requiredStoryLineId": 25,
    "playerChoices": [
      "Where was the convoy last seen?",
      "I'll search for survivors.",
      "Convoy found!"
    ],
    "steps": [
      {
        "npcMessage": "A supply convoy never reached its destination. Can you find out what happened?",
        "playerOptions": [
          { "text": "Where was the convoy last seen?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "It was last seen near the old highway. Search for survivors and supplies.",
        "playerOptions": [
          { "text": "I'll search for survivors.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found the convoy and rescued the survivors!",
        "playerOptions": [
          { "text": "Convoy found!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 3700,
      "money": 1600,
      "resourceRewards": [
        { "id": 2, "amount": 12 }, // Steel Scrap
        { "id": 7, "amount": 30 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 26 } // Shotgun
      ],
      "armorRewards": [
        { "id": 5 } // Body Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 27,
    "name": "The Stolen Blueprints",
    "levelRequirement": 15,
    "completed": false,
    "requiredStoryLineId": 26,
    "playerChoices": [
      "Who took the blueprints?",
      "I'll recover them.",
      "Blueprints returned!"
    ],
    "steps": [
      {
        "npcMessage": "Important blueprints were stolen by a rival group. Can you get them back?",
        "playerOptions": [
          { "text": "Who took the blueprints?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "A group of bandits was seen heading east. Track them down and recover the blueprints.",
        "playerOptions": [
          { "text": "I'll recover them.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You recovered the blueprints and returned them to the engineers!",
        "playerOptions": [
          { "text": "Blueprints returned!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 3900,
      "money": 1700,
      "resourceRewards": [
        { "id": 6, "amount": 3 }, // Electronic Parts
        { "id": 7, "amount": 20 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 28 } // Hunting Rifle
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 28,
    "name": "The Sabotaged Generator",
    "levelRequirement": 16,
    "completed": false,
    "requiredStoryLineId": 27,
    "playerChoices": [
      "What happened to the generator?",
      "I'll fix it.",
      "Generator repaired!"
    ],
    "steps": [
      {
        "npcMessage": "The main generator was sabotaged and the camp is losing power. Can you repair it?",
        "playerOptions": [
          { "text": "What happened to the generator?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "You'll need 3 Electronic Parts and 2 Screws to repair it.",
        "playerOptions": [
          {
            "text": "I'll fix it.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 3 }, // Electronic Parts
              { "id": 11, "amount": 2 } // Screws
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "The generator is running again! The camp is safe.",
        "playerOptions": [
          { "text": "Generator repaired!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 4100,
      "money": 1800,
      "resourceRewards": [
        { "id": 6, "amount": 3 }, // Electronic Parts
        { "id": 2, "amount": 8 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 5 } // Body Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 29,
    "name": "The Mutant Alpha",
    "levelRequirement": 17,
    "completed": false,
    "requiredStoryLineId": 28,
    "playerChoices": [
      "I'll hunt the alpha.",
      "Let me prepare.",
      "Alpha defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 12, // Example enemy ID for mutant alpha
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A powerful mutant alpha is threatening the area. Can you hunt it down?",
        "playerOptions": [
          { "text": "I'll hunt the alpha.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat the mutant alpha to restore safety.",
        "playerOptions": [
          {
            "text": "Start the hunt!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 12 }
          }
        ]
      },
      {
        "npcMessage": "You defeated the mutant alpha! The area is safe again.",
        "playerOptions": [
          { "text": "Alpha defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 4400,
      "money": 2000,
      "resourceRewards": [
        { "id": 2, "amount": 14 }, // Steel Scrap
        { "id": 7, "amount": 35 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 31 } // Assault Rifle
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 30,
    "name": "The Caravan Escort",
    "levelRequirement": 18,
    "completed": false,
    "requiredStoryLineId": 29,
    "playerChoices": [
      "I'll escort the caravan.",
      "Let me prepare.",
      "Caravan arrived!"
    ],
    "requiredEnemyDefeat": {
      "id": 13, // Example enemy ID for raider ambush
      "count": 4
    },
    "steps": [
      {
        "npcMessage": "A caravan needs protection on its way to the next settlement. Will you escort it?",
        "playerOptions": [
          { "text": "I'll escort the caravan.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defend the caravan from 4 raider ambushes.",
        "playerOptions": [
          {
            "text": "Start the escort!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 13 }
          }
        ]
      },
      {
        "npcMessage": "The caravan arrived safely!",
        "playerOptions": [
          { "text": "Caravan arrived!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 4700,
      "money": 2200,
      "resourceRewards": [
        { "id": 2, "amount": 16 }, // Steel Scrap
        { "id": 7, "amount": 40 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 31,
    "name": "The Broken Bridge",
    "levelRequirement": 19,
    "completed": false,
    "requiredStoryLineId": 30,
    "playerChoices": [
      "What happened to the bridge?",
      "I'll help repair it.",
      "Bridge is fixed!"
    ],
    "steps": [
      {
        "npcMessage": "The main bridge to the north is broken, cutting off supply lines. Can you help repair it?",
        "playerOptions": [
          { "text": "What happened to the bridge?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "You'll need 5 Steel Scrap and 3 Screws to fix it.",
        "playerOptions": [
          {
            "text": "I'll help repair it.",
            "nextId": null,
            "requiredResources": [
              { "id": 2, "amount": 5 }, // Steel Scrap
              { "id": 11, "amount": 3 } // Screws
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "The bridge is repaired and supply lines are open again!",
        "playerOptions": [
          { "text": "Bridge is fixed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 5000,
      "money": 2500,
      "resourceRewards": [
        { "id": 2, "amount": 10 }, // Steel Scrap
        { "id": 7, "amount": 30 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 32,
    "name": "The Raider Fortress",
    "levelRequirement": 20,
    "completed": false,
    "requiredStoryLineId": 31,
    "playerChoices": [
      "I'll infiltrate the fortress.",
      "Let me prepare.",
      "Fortress cleared!"
    ],
    "requiredEnemyDefeat": {
      "id": 14, // Example enemy ID for raider boss
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A heavily fortified raider base is threatening the region. Can you infiltrate and clear it?",
        "playerOptions": [
          { "text": "I'll infiltrate the fortress.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat the raider boss to secure the area.",
        "playerOptions": [
          {
            "text": "Start the assault!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 14 }
          }
        ]
      },
      {
        "npcMessage": "You cleared the fortress and defeated the boss!",
        "playerOptions": [
          { "text": "Fortress cleared!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 5500,
      "money": 2700,
      "resourceRewards": [
        { "id": 2, "amount": 12 }, // Steel Scrap
        { "id": 7, "amount": 40 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 33,
    "name": "The Scientist's Request",
    "levelRequirement": 21,
    "completed": false,
    "requiredStoryLineId": 32,
    "playerChoices": [
      "What do you need?",
      "I'll collect the samples.",
      "Samples delivered!"
    ],
    "steps": [
      {
        "npcMessage": "A scientist needs rare samples from the wasteland. Can you collect them?",
        "playerOptions": [
          { "text": "What do you need?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Collect 3 Plastic Scrap and 2 Electronic Parts from the wild.",
        "playerOptions": [
          {
            "text": "I'll collect the samples.",
            "nextId": null,
            "requiredResources": [
              { "id": 3, "amount": 3 }, // Plastic Scrap
              { "id": 6, "amount": 2 } // Electronic Parts
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "You delivered the samples to the scientist!",
        "playerOptions": [
          { "text": "Samples delivered!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 6000,
      "money": 2900,
      "resourceRewards": [
        { "id": 3, "amount": 3 }, // Plastic Scrap
        { "id": 6, "amount": 2 } // Electronic Parts
      ],
      "weaponRewards": [
        { "id": 28 } // Hunting Rifle
      ],
      "armorRewards": [
        { "id": 5 } // Body Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 34,
    "name": "The Radioactive Zone",
    "levelRequirement": 22,
    "completed": false,
    "requiredStoryLineId": 33,
    "playerChoices": [
      "What dangers are there?",
      "I'll explore the zone.",
      "Zone mapped!"
    ],
    "steps": [
      {
        "npcMessage": "A new radioactive zone has appeared. Can you explore and map it?",
        "playerOptions": [
          { "text": "What dangers are there?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Beware of mutants and radiation. Bring back any useful data.",
        "playerOptions": [
          { "text": "I'll explore the zone.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You mapped the zone and returned safely!",
        "playerOptions": [
          { "text": "Zone mapped!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 6500,
      "money": 3100,
      "resourceRewards": [
        { "id": 2, "amount": 15 }, // Steel Scrap
        { "id": 7, "amount": 50 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 35,
    "name": "The Rescue Operation",
    "levelRequirement": 23,
    "completed": false,
    "requiredStoryLineId": 34,
    "playerChoices": [
      "Who needs rescuing?",
      "I'll lead the rescue.",
      "Rescue successful!"
    ],
    "steps": [
      {
        "npcMessage": "A group of survivors is trapped by mutants. Can you rescue them?",
        "playerOptions": [
          { "text": "Who needs rescuing?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Fight through the mutants and bring the survivors back.",
        "playerOptions": [
          { "text": "I'll lead the rescue.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You rescued the survivors and brought them to safety!",
        "playerOptions": [
          { "text": "Rescue successful!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 7000,
      "money": 3300,
      "resourceRewards": [
        { "id": 2, "amount": 18 }, // Steel Scrap
        { "id": 7, "amount": 60 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 36,
    "name": "The Final Stand",
    "levelRequirement": 25,
    "completed": false,
    "requiredStoryLineId": 35,
    "playerChoices": [
      "I'll lead the defense.",
      "Let me prepare.",
      "We survived!"
    ],
    "requiredEnemyDefeat": {
      "id": 15, // Example enemy ID for final boss/raider
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A massive enemy force is attacking the settlement. Will you lead the defense?",
        "playerOptions": [
          { "text": "I'll lead the defense.", "nextId": 2 },
          { "text": "Let me prepare.", "nextId": null }
        ]
      },
      {
        "npcMessage": "Defeat the enemy leader to save the settlement.",
        "playerOptions": [
          {
            "text": "Start the final battle!",
            "nextId": null,
            "action": "startEnemyBattle",
            "actionParams": { "enemyId": 15 }
          }
        ]
      },
      {
        "npcMessage": "You defeated the enemy leader and saved the settlement!",
        "playerOptions": [
          { "text": "We survived!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 8000,
      "money": 4000,
      "resourceRewards": [
        { "id": 2, "amount": 20 }, // Steel Scrap
        { "id": 7, "amount": 80 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 37,
    "name": "The Water Crisis",
    "levelRequirement": 22,
    "completed": false,
    "requiredStoryLineId": 36,
    "playerChoices": [
      "What's wrong with the water?",
      "I'll fix the purifier.",
      "Water is safe!"
    ],
    "steps": [
      {
        "npcMessage": "The water purifier is malfunctioning and the camp is running out of clean water. Can you help?",
        "playerOptions": [
          { "text": "What's wrong with the water?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "You'll need 2 Electronic Parts and 2 Plastic Scrap to repair the purifier.",
        "playerOptions": [
          {
            "text": "I'll fix the purifier.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 2 }, // Electronic Parts
              { "id": 3, "amount": 2 } // Plastic Scrap
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "The purifier is working again! The water is safe to drink.",
        "playerOptions": [
          { "text": "Water is safe!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 8500,
      "money": 4200,
      "resourceRewards": [
        { "id": 6, "amount": 2 }, // Electronic Parts
        { "id": 3, "amount": 2 } // Plastic Scrap
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 38,
    "name": "The Sniper's Nest",
    "levelRequirement": 23,
    "completed": false,
    "requiredStoryLineId": 37,
    "playerChoices": [
      "Where is the sniper?",
      "I'll take them out.",
      "Sniper neutralized!"
    ],
    "requiredEnemyDefeat": {
      "id": 16, // Example enemy ID for sniper
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A hostile sniper is pinning down our scouts. Can you eliminate the threat?",
        "playerOptions": [
          { "text": "Where is the sniper?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The sniper is hiding in the old radio tower. Approach with caution.",
        "playerOptions": [
          { "text": "I'll take them out.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You neutralized the sniper! The scouts can move safely again.",
        "playerOptions": [
          { "text": "Sniper neutralized!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 9000,
      "money": 4400,
      "resourceRewards": [
        { "id": 2, "amount": 15 }, // Steel Scrap
        { "id": 7, "amount": 60 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 29 } // Sniper Rifle
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 39,
    "name": "The Fuel Run",
    "levelRequirement": 25,
    "completed": false,
    "requiredStoryLineId": 38,
    "playerChoices": [
      "Where can I find fuel?",
      "I'll get the fuel.",
      "Fuel delivered!"
    ],
    "steps": [
      {
        "npcMessage": "The generators are almost out of fuel. Can you find more?",
        "playerOptions": [
          { "text": "Where can I find fuel?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Check the abandoned gas station and bring back 3 Fuel.",
        "playerOptions": [
          {
            "text": "I'll get the fuel.",
            "nextId": null,
            "requiredResources": [
              { "id": 8, "amount": 3 } // Fuel
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "You delivered the fuel! The generators are running again.",
        "playerOptions": [
          { "text": "Fuel delivered!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 9500,
      "money": 4700,
      "resourceRewards": [
        { "id": 8, "amount": 3 }, // Fuel
        { "id": 2, "amount": 10 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 26 } // Shotgun
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 40,
    "name": "The Bounty Hunter",
    "levelRequirement": 27,
    "completed": false,
    "requiredStoryLineId": 39,
    "playerChoices": [
      "Who is the target?",
      "I'll hunt them down.",
      "Target eliminated!"
    ],
    "requiredEnemyDefeat": {
      "id": 17, // Example enemy ID for bounty target
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A dangerous outlaw is terrorizing the region. Can you bring them to justice?",
        "playerOptions": [
          { "text": "Who is the target?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The outlaw is hiding in the old mines. Be careful!",
        "playerOptions": [
          { "text": "I'll hunt them down.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You eliminated the target! The region is safer now.",
        "playerOptions": [
          { "text": "Target eliminated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 10500,
      "money": 5000,
      "resourceRewards": [
        { "id": 2, "amount": 20 }, // Steel Scrap
        { "id": 7, "amount": 80 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 41,
    "name": "The Lost Technology",
    "levelRequirement": 29,
    "completed": false,
    "requiredStoryLineId": 40,
    "playerChoices": [
      "What technology?",
      "I'll recover it.",
      "Tech secured!"
    ],
    "steps": [
      {
        "npcMessage": "A piece of advanced technology was lost in the ruins. Can you recover it?",
        "playerOptions": [
          { "text": "What technology?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Search the old research lab and bring back the device.",
        "playerOptions": [
          { "text": "I'll recover it.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You recovered the lost technology and brought it back!",
        "playerOptions": [
          { "text": "Tech secured!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 11500,
      "money": 5400,
      "resourceRewards": [
        { "id": 6, "amount": 4 }, // Electronic Parts
        { "id": 2, "amount": 15 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 42,
    "name": "The Great Migration",
    "levelRequirement": 30,
    "completed": false,
    "requiredStoryLineId": 41,
    "playerChoices": [
      "Why are we moving?",
      "I'll help lead the way.",
      "Migration complete!"
    ],
    "steps": [
      {
        "npcMessage": "The settlement must move to a safer location. Can you help lead the migration?",
        "playerOptions": [
          { "text": "Why are we moving?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Scout ahead and clear the path of threats.",
        "playerOptions": [
          { "text": "I'll help lead the way.", "nextId": null }
        ]
      },
      {
        "npcMessage": "The migration was a success! The settlement is safe.",
        "playerOptions": [
          { "text": "Migration complete!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 12500,
      "money": 6000,
      "resourceRewards": [
        { "id": 2, "amount": 25 }, // Steel Scrap
        { "id": 7, "amount": 100 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 43,
    "name": "The Power Plant Raid",
    "levelRequirement": 31,
    "completed": false,
    "requiredStoryLineId": 42,
    "playerChoices": [
      "What's the plan?",
      "I'll lead the raid.",
      "Plant secured!"
    ],
    "requiredEnemyDefeat": {
      "id": 18, // Example enemy ID for power plant guards
      "count": 4
    },
    "steps": [
      {
        "npcMessage": "A rival faction controls the power plant. Can you lead a raid to take it back?",
        "playerOptions": [
          { "text": "What's the plan?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defeat the guards and secure the plant.",
        "playerOptions": [
          { "text": "I'll lead the raid.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You secured the power plant! The settlement has power again.",
        "playerOptions": [
          { "text": "Plant secured!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 13500,
      "money": 7000,
      "resourceRewards": [
        { "id": 2, "amount": 30 }, // Steel Scrap
        { "id": 7, "amount": 120 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 44,
    "name": "The Outcast's Return",
    "levelRequirement": 33,
    "completed": false,
    "requiredStoryLineId": 43,
    "playerChoices": [
      "Who is the outcast?",
      "I'll find them.",
      "Outcast returned!"
    ],
    "steps": [
      {
        "npcMessage": "A former ally has returned with vital information. Can you find and bring them back?",
        "playerOptions": [
          { "text": "Who is the outcast?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "They were last seen near the old subway tunnels.",
        "playerOptions": [
          { "text": "I'll find them.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found the outcast and brought them back to the settlement!",
        "playerOptions": [
          { "text": "Outcast returned!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 14500,
      "money": 7500,
      "resourceRewards": [
        { "id": 3, "amount": 5 }, // Plastic Scrap
        { "id": 6, "amount": 4 } // Electronic Parts
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 45,
    "name": "The Mutant Swarm",
    "levelRequirement": 35,
    "completed": false,
    "requiredStoryLineId": 44,
    "playerChoices": [
      "How many mutants?",
      "I'll stop the swarm.",
      "Swarm defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 19, // Example enemy ID for mutant swarm
      "count": 8
    },
    "steps": [
      {
        "npcMessage": "A massive swarm of mutants is approaching. Can you stop them?",
        "playerOptions": [
          { "text": "How many mutants?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defeat 8 mutants to protect the settlement.",
        "playerOptions": [
          { "text": "I'll stop the swarm.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You defeated the mutant swarm! The settlement is safe.",
        "playerOptions": [
          { "text": "Swarm defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 15500,
      "money": 8000,
      "resourceRewards": [
        { "id": 2, "amount": 35 }, // Steel Scrap
        { "id": 7, "amount": 140 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 46,
    "name": "The Engineer's Dilemma",
    "levelRequirement": 36,
    "completed": false,
    "requiredStoryLineId": 45,
    "playerChoices": [
      "What does the engineer need?",
      "I'll gather the parts.",
      "Parts delivered!"
    ],
    "steps": [
      {
        "npcMessage": "The chief engineer needs rare parts to upgrade the defenses. Can you help?",
        "playerOptions": [
          { "text": "What does the engineer need?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Collect 4 Electronic Parts and 4 Steel Scrap.",
        "playerOptions": [
          {
            "text": "I'll gather the parts.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 4 }, // Electronic Parts
              { "id": 2, "amount": 4 } // Steel Scrap
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "You delivered the parts and the defenses are upgraded!",
        "playerOptions": [
          { "text": "Parts delivered!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 16500,
      "money": 8500,
      "resourceRewards": [
        { "id": 6, "amount": 4 }, // Electronic Parts
        { "id": 2, "amount": 4 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 47,
    "name": "The Raider King",
    "levelRequirement": 38,
    "completed": false,
    "requiredStoryLineId": 46,
    "playerChoices": [
      "Who is the Raider King?",
      "I'll challenge him.",
      "King defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 20, // Example enemy ID for Raider King
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "The infamous Raider King is rallying the raiders. Can you defeat him?",
        "playerOptions": [
          { "text": "Who is the Raider King?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Find and defeat the Raider King to break the raider threat.",
        "playerOptions": [
          { "text": "I'll challenge him.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You defeated the Raider King! The region is safer now.",
        "playerOptions": [
          { "text": "King defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 18000,
      "money": 9000,
      "resourceRewards": [
        { "id": 2, "amount": 40 }, // Steel Scrap
        { "id": 7, "amount": 160 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 48,
    "name": "The Final Blueprint",
    "levelRequirement": 40,
    "completed": false,
    "requiredStoryLineId": 47,
    "playerChoices": [
      "What is the blueprint for?",
      "I'll retrieve it.",
      "Blueprint delivered!"
    ],
    "steps": [
      {
        "npcMessage": "The last piece of the defense blueprint is missing. Can you retrieve it?",
        "playerOptions": [
          { "text": "What is the blueprint for?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Search the old archives and bring back the blueprint.",
        "playerOptions": [
          { "text": "I'll retrieve it.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You delivered the final blueprint! The settlement's defenses are complete.",
        "playerOptions": [
          { "text": "Blueprint delivered!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 20000,
      "money": 10000,
      "resourceRewards": [
        { "id": 6, "amount": 5 }, // Electronic Parts
        { "id": 2, "amount": 20 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 49,
    "name": "The Alpha's Challenge",
    "levelRequirement": 41,
    "completed": false,
    "requiredStoryLineId": 48,
    "playerChoices": [
      "Who is the Alpha?",
      "I'll face the Alpha.",
      "Alpha defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 21, // Example enemy ID for mutant alpha
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A new mutant Alpha is threatening the region. Can you defeat it?",
        "playerOptions": [
          { "text": "Who is the Alpha?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Track down and defeat the Alpha to restore peace.",
        "playerOptions": [
          { "text": "I'll face the Alpha.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You defeated the Alpha! The region is safe again.",
        "playerOptions": [
          { "text": "Alpha defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 22000,
      "money": 11000,
      "resourceRewards": [
        { "id": 2, "amount": 45 }, // Steel Scrap
        { "id": 7, "amount": 180 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 50,
    "name": "The Exodus",
    "levelRequirement": 42,
    "completed": false,
    "requiredStoryLineId": 49,
    "playerChoices": [
      "Why are we leaving?",
      "I'll lead the exodus.",
      "Exodus complete!"
    ],
    "steps": [
      {
        "npcMessage": "The settlement must leave the region for a new beginning. Will you lead the exodus?",
        "playerOptions": [
          { "text": "Why are we leaving?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Guide the people through dangerous territory to safety.",
        "playerOptions": [
          { "text": "I'll lead the exodus.", "nextId": null }
        ]
      },
      {
        "npcMessage": "The exodus was a success! The people are safe in their new home.",
        "playerOptions": [
          { "text": "Exodus complete!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 25000,
      "money": 12000,
      "resourceRewards": [
        { "id": 2, "amount": 50 }, // Steel Scrap
        { "id": 7, "amount": 200 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 51,
    "name": "The Siege of Steel Town",
    "levelRequirement": 43,
    "completed": false,
    "requiredStoryLineId": 50,
    "playerChoices": [
      "What's the situation?",
      "I'll break the siege.",
      "Siege lifted!"
    ],
    "requiredEnemyDefeat": {
      "id": 22, // Example enemy ID for siege force
      "count": 10
    },
    "steps": [
      {
        "npcMessage": "Steel Town is under siege by a massive enemy force. Can you break the siege?",
        "playerOptions": [
          { "text": "What's the situation?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defeat 10 enemies to lift the siege.",
        "playerOptions": [
          { "text": "I'll break the siege.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You broke the siege! Steel Town is free.",
        "playerOptions": [
          { "text": "Siege lifted!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 27000,
      "money": 13000,
      "resourceRewards": [
        { "id": 2, "amount": 60 }, // Steel Scrap
        { "id": 7, "amount": 250 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 34 } // LMG
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 52,
    "name": "The Lost Expedition",
    "levelRequirement": 44,
    "completed": false,
    "requiredStoryLineId": 51,
    "playerChoices": [
      "Where did they go?",
      "I'll search for survivors.",
      "Expedition found!"
    ],
    "steps": [
      {
        "npcMessage": "A scientific expedition has gone missing in the wasteland. Can you find them?",
        "playerOptions": [
          { "text": "Where did they go?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "They were last seen near the radioactive crater. Search for survivors and data.",
        "playerOptions": [
          { "text": "I'll search for survivors.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You found the expedition and recovered valuable data!",
        "playerOptions": [
          { "text": "Expedition found!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 28500,
      "money": 13500,
      "resourceRewards": [
        { "id": 6, "amount": 6 }, // Electronic Parts
        { "id": 2, "amount": 40 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 29 } // Sniper Rifle
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 53,
    "name": "The Reactor Meltdown",
    "levelRequirement": 45,
    "completed": false,
    "requiredStoryLineId": 52,
    "playerChoices": [
      "What's the danger?",
      "I'll stabilize the reactor.",
      "Meltdown averted!"
    ],
    "steps": [
      {
        "npcMessage": "The main reactor is overheating and could explode. Can you stabilize it?",
        "playerOptions": [
          { "text": "What's the danger?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "You'll need 5 Electronic Parts and 5 Steel Scrap to repair the reactor.",
        "playerOptions": [
          {
            "text": "I'll stabilize the reactor.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 5 }, // Electronic Parts
              { "id": 2, "amount": 5 } // Steel Scrap
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "You stabilized the reactor and averted disaster!",
        "playerOptions": [
          { "text": "Meltdown averted!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 30000,
      "money": 14000,
      "resourceRewards": [
        { "id": 6, "amount": 5 }, // Electronic Parts
        { "id": 2, "amount": 20 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 34 } // LMG
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 54,
    "name": "The Bunker Assault",
    "levelRequirement": 46,
    "completed": false,
    "requiredStoryLineId": 53,
    "playerChoices": [
      "What's inside the bunker?",
      "I'll lead the assault.",
      "Bunker secured!"
    ],
    "requiredEnemyDefeat": {
      "id": 23, // Example enemy ID for bunker defenders
      "count": 6
    },
    "steps": [
      {
        "npcMessage": "A fortified bunker is held by hostile forces. Can you lead the assault?",
        "playerOptions": [
          { "text": "What's inside the bunker?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defeat 6 defenders and secure the bunker.",
        "playerOptions": [
          { "text": "I'll lead the assault.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You secured the bunker and found valuable supplies!",
        "playerOptions": [
          { "text": "Bunker secured!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 32000,
      "money": 15000,
      "resourceRewards": [
        { "id": 2, "amount": 70 }, // Steel Scrap
        { "id": 7, "amount": 300 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 35 } // Minigun
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 55,
    "name": "The Final Convoy",
    "levelRequirement": 47,
    "completed": false,
    "requiredStoryLineId": 54,
    "playerChoices": [
      "Where is the convoy?",
      "I'll protect the convoy.",
      "Convoy arrived!"
    ],
    "requiredEnemyDefeat": {
      "id": 24, // Example enemy ID for convoy ambush
      "count": 5
    },
    "steps": [
      {
        "npcMessage": "The last supply convoy must reach the new settlement. Can you protect it?",
        "playerOptions": [
          { "text": "Where is the convoy?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defend the convoy from 5 ambushes.",
        "playerOptions": [
          { "text": "I'll protect the convoy.", "nextId": null }
        ]
      },
      {
        "npcMessage": "The convoy arrived safely! The settlement is well supplied.",
        "playerOptions": [
          { "text": "Convoy arrived!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 34000,
      "money": 16000,
      "resourceRewards": [
        { "id": 2, "amount": 80 }, // Steel Scrap
        { "id": 7, "amount": 350 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 34 } // LMG
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 56,
    "name": "The Last Stand",
    "levelRequirement": 48,
    "completed": false,
    "requiredStoryLineId": 55,
    "playerChoices": [
      "Who is attacking?",
      "I'll lead the defense.",
      "We survived!"
    ],
    "requiredEnemyDefeat": {
      "id": 25, // Example enemy ID for final wave
      "count": 12
    },
    "steps": [
      {
        "npcMessage": "A massive enemy force is attacking the settlement. Will you lead the defense?",
        "playerOptions": [
          { "text": "Who is attacking?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defend against 12 enemies to save the settlement.",
        "playerOptions": [
          { "text": "I'll lead the defense.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You survived the last stand! The settlement is safe.",
        "playerOptions": [
          { "text": "We survived!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 36000,
      "money": 17000,
      "resourceRewards": [
        { "id": 2, "amount": 90 }, // Steel Scrap
        { "id": 7, "amount": 400 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 35 } // Minigun
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 57,
    "name": "The Forgotten Vault",
    "levelRequirement": 49,
    "completed": false,
    "requiredStoryLineId": 56,
    "playerChoices": [
      "Where is the vault?",
      "I'll explore the vault.",
      "Vault explored!"
    ],
    "steps": [
      {
        "npcMessage": "A forgotten vault has been discovered. Can you explore it for valuable resources?",
        "playerOptions": [
          { "text": "Where is the vault?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Explore the vault and bring back anything useful.",
        "playerOptions": [
          { "text": "I'll explore the vault.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You explored the vault and found rare supplies!",
        "playerOptions": [
          { "text": "Vault explored!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 38000,
      "money": 18000,
      "resourceRewards": [
        { "id": 6, "amount": 10 }, // Electronic Parts
        { "id": 2, "amount": 100 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 29 } // Sniper Rifle
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 58,
    "name": "The New Dawn",
    "levelRequirement": 50,
    "completed": false,
    "requiredStoryLineId": 57,
    "playerChoices": [
      "What is our future?",
      "I'll lead the way.",
      "A new era begins!"
    ],
    "steps": [
      {
        "npcMessage": "The wasteland is finally safe. Will you lead the people into a new era?",
        "playerOptions": [
          { "text": "What is our future?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Guide the people and establish a new civilization.",
        "playerOptions": [
          { "text": "I'll lead the way.", "nextId": null }
        ]
      },
      {
        "npcMessage": "A new era begins! The people look to you as their leader.",
        "playerOptions": [
          { "text": "A new era begins!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 40000,
      "money": 20000,
      "resourceRewards": [
        { "id": 2, "amount": 120 }, // Steel Scrap
        { "id": 7, "amount": 500 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 34 } // LMG
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 59,
    "name": "The Black Market",
    "levelRequirement": 33,
    "completed": false,
    "requiredStoryLineId": 58,
    "playerChoices": [
      "Where is the market?",
      "I'll investigate.",
      "Market shut down!"
    ],
    "steps": [
      {
        "npcMessage": "A black market is operating nearby, trading in stolen goods. Can you shut it down?",
        "playerOptions": [
          { "text": "Where is the market?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The market is hidden in the old subway. Find and stop the ringleader.",
        "playerOptions": [
          { "text": "I'll investigate.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You shut down the black market and recovered stolen supplies!",
        "playerOptions": [
          { "text": "Market shut down!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 15000,
      "money": 8000,
      "resourceRewards": [
        { "id": 2, "amount": 30 }, // Steel Scrap
        { "id": 7, "amount": 100 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 7 } // Radiation Suit
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 60,
    "name": "The Mutant Uprising",
    "levelRequirement": 35,
    "completed": false,
    "requiredStoryLineId": 59,
    "playerChoices": [
      "How many mutants?",
      "I'll stop the uprising.",
      "Uprising crushed!"
    ],
    "requiredEnemyDefeat": {
      "id": 26, // Example enemy ID for mutant uprising
      "count": 10
    },
    "steps": [
      {
        "npcMessage": "A mutant uprising threatens the settlement. Can you stop it?",
        "playerOptions": [
          { "text": "How many mutants?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Defeat 10 mutants to crush the uprising.",
        "playerOptions": [
          { "text": "I'll stop the uprising.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You crushed the mutant uprising! The settlement is safe.",
        "playerOptions": [
          { "text": "Uprising crushed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 17000,
      "money": 9000,
      "resourceRewards": [
        { "id": 2, "amount": 40 }, // Steel Scrap
        { "id": 7, "amount": 120 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 61,
    "name": "The Engineer's Gamble",
    "levelRequirement": 36,
    "completed": false,
    "requiredStoryLineId": 60,
    "playerChoices": [
      "What is the plan?",
      "I'll gather the parts.",
      "Upgrade complete!"
    ],
    "steps": [
      {
        "npcMessage": "The chief engineer wants to upgrade the settlement's defenses with experimental tech. Can you help?",
        "playerOptions": [
          { "text": "What is the plan?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Collect 5 Electronic Parts and 5 Steel Scrap.",
        "playerOptions": [
          {
            "text": "I'll gather the parts.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 5 }, // Electronic Parts
              { "id": 2, "amount": 5 } // Steel Scrap
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "You delivered the parts and the upgrade is complete!",
        "playerOptions": [
          { "text": "Upgrade complete!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 18000,
      "money": 9500,
      "resourceRewards": [
        { "id": 6, "amount": 5 }, // Electronic Parts
        { "id": 2, "amount": 5 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 30 } // SMG
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 62,
    "name": "The Raider's Trap",
    "levelRequirement": 37,
    "completed": false,
    "requiredStoryLineId": 61,
    "playerChoices": [
      "Where is the trap?",
      "I'll spring the trap.",
      "Trap disarmed!"
    ],
    "steps": [
      {
        "npcMessage": "Raiders have set a deadly trap for the settlement. Can you disarm it?",
        "playerOptions": [
          { "text": "Where is the trap?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The trap is hidden in the old industrial zone. Disarm it before it's too late.",
        "playerOptions": [
          { "text": "I'll spring the trap.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You disarmed the trap and saved the settlement!",
        "playerOptions": [
          { "text": "Trap disarmed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 19000,
      "money": 10000,
      "resourceRewards": [
        { "id": 2, "amount": 45 }, // Steel Scrap
        { "id": 7, "amount": 140 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 9 } // Metal Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 63,
    "name": "The Alpha's Lair",
    "levelRequirement": 39,
    "completed": false,
    "requiredStoryLineId": 62,
    "playerChoices": [
      "Where is the lair?",
      "I'll face the Alpha.",
      "Alpha defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 27, // Example enemy ID for mutant alpha
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "A new mutant Alpha has been spotted. Can you find and defeat it?",
        "playerOptions": [
          { "text": "Where is the lair?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The Alpha is hiding in the old sewers. Be prepared for a tough fight.",
        "playerOptions": [
          { "text": "I'll face the Alpha.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You defeated the Alpha and secured the lair!",
        "playerOptions": [
          { "text": "Alpha defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 21000,
      "money": 11000,
      "resourceRewards": [
        { "id": 2, "amount": 50 }, // Steel Scrap
        { "id": 7, "amount": 160 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 32 } // AK-47
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 64,
    "name": "The Scientist's Secret",
    "levelRequirement": 40,
    "completed": false,
    "requiredStoryLineId": 63,
    "playerChoices": [
      "What is the secret?",
      "I'll recover the data.",
      "Secret revealed!"
    ],
    "steps": [
      {
        "npcMessage": "A scientist has discovered something important. Can you recover the lost data?",
        "playerOptions": [
          { "text": "What is the secret?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "The data is stored in a hidden terminal in the old lab. Retrieve it and return safely.",
        "playerOptions": [
          { "text": "I'll recover the data.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You recovered the data and revealed the scientist's secret!",
        "playerOptions": [
          { "text": "Secret revealed!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 23000,
      "money": 12000,
      "resourceRewards": [
        { "id": 6, "amount": 8 }, // Electronic Parts
        { "id": 2, "amount": 60 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 29 } // Sniper Rifle
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 65,
    "name": "The Raider's End",
    "levelRequirement": 41,
    "completed": false,
    "requiredStoryLineId": 64,
    "playerChoices": [
      "Who is the leader?",
      "I'll end the threat.",
      "Raiders defeated!"
    ],
    "requiredEnemyDefeat": {
      "id": 28, // Example enemy ID for raider leader
      "count": 1
    },
    "steps": [
      {
        "npcMessage": "The last raider leader is planning a final attack. Can you stop them?",
        "playerOptions": [
          { "text": "Who is the leader?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Find and defeat the raider leader to end the threat for good.",
        "playerOptions": [
          { "text": "I'll end the threat.", "nextId": null }
        ]
      },
      {
        "npcMessage": "You defeated the raider leader! The region is finally safe.",
        "playerOptions": [
          { "text": "Raiders defeated!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 25000,
      "money": 13000,
      "resourceRewards": [
        { "id": 2, "amount": 70 }, // Steel Scrap
        { "id": 7, "amount": 180 } // Ammunition
      ],
      "weaponRewards": [
        { "id": 34 } // LMG
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  },
  {
    "id": 66,
    "name": "The Final Experiment",
    "levelRequirement": 43,
    "completed": false,
    "requiredStoryLineId": 65,
    "playerChoices": [
      "What is the experiment?",
      "I'll help complete it.",
      "Experiment finished!"
    ],
    "steps": [
      {
        "npcMessage": "A scientist is working on a final experiment to secure the future. Can you help complete it?",
        "playerOptions": [
          { "text": "What is the experiment?", "nextId": 2 }
        ]
      },
      {
        "npcMessage": "Gather 10 Electronic Parts and 10 Steel Scrap for the experiment.",
        "playerOptions": [
          {
            "text": "I'll help complete it.",
            "nextId": null,
            "requiredResources": [
              { "id": 6, "amount": 10 }, // Electronic Parts
              { "id": 2, "amount": 10 } // Steel Scrap
            ],
            "giveReward": true
          }
        ]
      },
      {
        "npcMessage": "You completed the experiment and secured the future!",
        "playerOptions": [
          { "text": "Experiment finished!", "nextId": null, "giveReward": true }
        ]
      }
    ],
    "reward": {
      "exp": 27000,
      "money": 14000,
      "resourceRewards": [
        { "id": 6, "amount": 10 }, // Electronic Parts
        { "id": 2, "amount": 10 } // Steel Scrap
      ],
      "weaponRewards": [
        { "id": 34 } // LMG
      ],
      "armorRewards": [
        { "id": 13 } // Military Armor
      ],
      "aidRewards": [
        { "id": 4 } // Large Medkit
      ]
    },
    "alwaysGiveReward": false,
    "currentStepIndex": 0
  }
];