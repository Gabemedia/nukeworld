const questNames = [
  'Explore the Ruins',
  'Defeat the Bandit Leader',
  'Gather Rare Herbs',
  'Investigate the Mysterious Signal',
];

const questDescriptions = [
  'Explore the ancient ruins and uncover their secrets.',
  'The bandit leader has been terrorizing the region. Defeat them and bring peace to the land.',
  'A rare herb is needed for a powerful healing potion. Gather as many as you can find.',
  'A strange signal has been detected in the wilderness. Investigate its source.',
];

const questRewards = [
  [10, 100],
  [50, 500],
  [20, 200],
  [30, 300],
];

import defaultQuests from './quests';
import items from './items';

export function generateQuest() {
  const nameIndex = Math.floor(Math.random() * questNames.length);
  const descIndex = Math.floor(Math.random() * questDescriptions.length);
  const rewardIndex = Math.floor(Math.random() * questRewards.length);
  const randomQuest = defaultQuests[Math.floor(Math.random() * defaultQuests.length)];

  const name = questNames[nameIndex];
  const desc = questDescriptions[descIndex];
  const [exp, money] = questRewards[rewardIndex];

  const lat = (Math.random() * 180 - 90).toFixed(4); // Random latitude between -90 and 90
  const lon = (Math.random() * 360 - 180).toFixed(4); // Random longitude between -180 and 180

  const reward = [items[Math.floor(Math.random() * items.length)].id]; // Random item reward

  return {
    name,
    desc,
    exp,
    money,
    duration: 10000, // Adjust as needed
    progress: 0,
    state: 'not-started',
    disabled: false,
    ...randomQuest,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    reward,
  };
}
