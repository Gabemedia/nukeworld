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
        "npcMessage": "Welcome to NukeWorld, {PlayerName}! This is a dangerous world full of challenges and opportunities.",
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
      "money": 500,
      "resourceRewards": [
        {
          "id": 1,
          "amount": 200
        },
        {
          "id": 2,
          "amount": 200
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
        "npcMessage": "This should get you started. I'll give you a basic weapon, armor, and a medkit.",
        "playerOptions": [
          {
            "text": "Thank you very much!",
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 200,
      "money": 25,
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
    "playerChoices": [],
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
        "npcMessage": "Fantastic! Your help is invaluable. Here's your reward: 20,000 experience points!",
        "playerOptions": [
          {
            "text": "Thanks! End conversation",
            "nextId": null
          }
        ]
      }
    ],
    "reward": {
      "exp": 2000,
      "money": 200,
      "resourceRewards": [],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": []
    },
    "alwaysGiveReward": false
  },
  {
    "id": 3,
    "name": "Defeat your first enemy encounter",
    "levelRequirement": 1,
    "completed": false,
    "requiredStoryLineId": 1,
    "playerChoices": [],
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
      "exp": 10,
      "money": 5,
      "resourceRewards": [],
      "weaponRewards": [],
      "armorRewards": [],
      "aidRewards": [
        {
          "id": 2
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
    "playerChoices": [],
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
      "exp": 750,
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
    "playerChoices": [],
    "steps": [
      {
        "npcMessage": "Hey survivor! I've got a simple delivery for you to do. Can you help me out?",
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
        "npcMessage": "I need you to collect 5 Wood Scraps for me. Can you do that?",
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
      "exp": 1000,
      "money": 250,
      "resourceRewards": [
        {
          "id": 5,
          "amount": 1
        }
      ],
      "weaponRewards": [
        {
          "id": 2
        }
      ],
      "armorRewards": [
        {
          "id": 3
        }
      ],
      "aidRewards": [
        {
          "id": 1
        }
      ]
    },
    "alwaysGiveReward": false
  },
  {
    "id": 6,
    "name": "THE GIANT RADBETTLE!",
    "levelRequirement": 5,
    "completed": false,
    "requiredStoryLineId": 4,
    "playerChoices": [],
    "steps": [
      {
        "npcMessage": "THE GIANT RADBETTLE IS BACK!",
        "playerOptions": [
          {
            "text": "OMG ITS... HUGE!!! KILL IT EVERYONE",
            "nextId": null,
            "requiredResources": [],
            "giveReward": false,
            "action": "startEnemyBattle",
            "actionParams": {
              "enemyId": 8
            }
          },
          {
            "text": "I am just gonna go over here annnd...",
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
            "text": "We just learn to help eachother!",
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
      "exp": 4000,
      "money": 825,
      "resourceRewards": [
        {
          "id": 1,
          "amount": 1
        },
        {
          "id": 2,
          "amount": 2
        }
      ],
      "weaponRewards": [],
      "armorRewards": [
        {
          "id": 6
        }
      ],
      "aidRewards": [
        {
          "id": 2
        }
      ]
    },
    "alwaysGiveReward": false
  }
];