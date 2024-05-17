import defaultQuests from './quests';
import items from './items';

const questNames = defaultQuests.map(quest => quest.name);
const questDescriptions = defaultQuests.map(quest => quest.desc);
const questRewards = defaultQuests.map(quest => [quest.exp, quest.money]);

export function generateQuest() {
  const randomQuest = defaultQuests[Math.floor(Math.random() * defaultQuests.length)];

  const lat = (Math.random() * 180 - 90).toFixed(4); // Random latitude between -90 and 90
  const lon = (Math.random() * 360 - 180).toFixed(4); // Random longitude between -180 and 180

  const reward = [items[Math.floor(Math.random() * items.length)].id]; // Random item reward

  return {
    ...randomQuest,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    reward,
  };
}
