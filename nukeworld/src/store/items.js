export default {
  weapons: [
    {
      id: 1,
      name: 'Tire Iron',
      desc: 'Tire Iron is a great melee weapon. It is used for all sorts of combat.',
      attack: 2,
      defence: 0,
      category: 'weapon',
    },
    {
      id: 2,
      name: 'Hunting Rifle',
      desc: 'Hunting Rifle is a great ranged weapon. It is used for hunting.',
      attack: 20,
      defence: 0,
      category: 'weapon',
    },
    // Add more weapons here
  ],
  armor: [
    {
      id: 1,
      name: 'Leather Armor',
      desc: 'Lightweight armor made from leather.',
      defence: 5,
      category: 'armor',
    },
    // Add more armor items here
  ],
  aid: [
    {
      id: 1,
      name: 'Stimpak',
      desc: 'A medical solution that can heal wounds and restore health.',
      healing: 25,
      category: 'aid',
    },
    // Add more aid items here
  ],
  misc: [
    {
      id: 1,
      name: 'Lockpick',
      desc: 'A tool used for picking locks.',
      category: 'misc',
    },
    // Add more miscellaneous items here
  ],
  junk: [
    {
      id: 1,
      name: 'Scrap Metal',
      desc: 'A pile of scrap metal that can be used for crafting.',
      category: 'junk',
    },
    // Add more junk items here
  ],
  account: [
    {
      id: 1,
      name: 'Bottle Caps',
      desc: 'The currency used in the wasteland.',
      value: 1,
      category: 'account',
    },
    // Add more account items here
  ],
};
