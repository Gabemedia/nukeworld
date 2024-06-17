export default [
  {
    id: 1,
    name: 'Tunnel Access',
    desc: 'We need to gain Access to the Tunnels to get to the other side of the city. We need to find a way to get in.',
    exp: 1200,
    money: 100,
    duration: 2500,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [1, 1, 1, 1, 2, 2, 3],
    rewardChance: 0.40,
    armorReward: [1, 1, 1, 2],
    armorRewardChance: 0.60,
    levelRequirement: 1,
  },
  {
    id: 2,
    name: 'Gateway to the City',
    desc: 'The Settlement is surrounded by a wall. We need to find a way to get through the gate.',
    exp: 1500,
    money: 250,
    duration: 5200,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [3, 1, 1],
    rewardChance: 0.40,
    armorReward: [1, 1, 1, 2, 2, 3],
    armorRewardChance: 0.25,
    levelRequirement: 1,
  },
  {
    id: 3,
    name: 'Clock Tower',
    desc: 'Seek shelter for the night in the Clock Tower.',
    exp: 2000,
    money: 500,
    duration: 7000,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [2, 2, 2, 3],
    rewardChance: 0.15,
    armorReward: [1, 2, 2, 3],
    armorRewardChance: 0.15,
    levelRequirement: 2,
  },
  {
    id: 4,
    name: 'Dunvick Castle',
    desc: 'We need to find a way to get into the Castle to find the King.',
    exp: 2500,
    money: 1500,
    duration: 12000,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [2, 2, 2, 3, 4],
    rewardChance: 0.10,
    armorReward: [1, 1, 2, 2, 3, 4],
    armorRewardChance: 0.25,
    levelRequirement: 2,
  },
  {
    id: 5,
    name: 'Abandoned Warehouse',
    desc: 'Search the Abandoned Warehouse for supplies and weapons.',
    exp: 3000,
    money: 750,
    duration: 33000,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [4, 5, 2, 1, 1, 1],
    rewardChance: 0.03,
    armorReward: [2, 1, 1, 1],
    armorRewardChance: 0.01,
    levelRequirement: 3,
  },
  {
    id: 6,
    name: 'Mutant Hideout',
    desc: 'Infiltrate the Mutant Hideout and eliminate the mutant leader.',
    exp: 3000,
    money: 1500,
    duration: 39000,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [6, 7, 2, 2, 1, 1, 1,1],
    rewardChance: 0.06,
    armorReward: [3, 2, 2, 1, 1, 1,1 ],
    armorRewardChance: 0.02,
    levelRequirement: 4,
  },
  {
    id: 7,
    name: 'Forgotten Bunker',
    desc: 'Explore the Forgotten Bunker and recover the lost artifacts.',
    exp: 4000,
    money: 2000,
    duration: 47000,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [2, 6, 1, 1,],
    rewardChance: 0.08,
    armorReward: [4, 2, 1, 1, 1, 1, 2],
    armorRewardChance: 0.03,
    levelRequirement: 5,
  },
  {
    id: 8,
    name: 'Radioactive Wasteland',
    desc: 'Venture into the Radioactive Wasteland and collect rare resources.',
    exp: 5000,
    money: 2500,
    duration: 60000,
    progress: 0,
    state: 'not-started',
    claimed: false,
    disabled: false,
    reward: [4, 7, 2, 1, 1, 1, 2, 2],
    rewardChance: 0.65,
    armorReward: [5, 3],
    armorRewardChance: 0.50,
    levelRequirement: 10,
  },
];
