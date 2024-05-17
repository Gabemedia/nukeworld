export default {
  weapons: [
    {
      id: 1,
      name: 'Tire Iron',
      desc: 'Tire Iron is a great melee weapon. It is used for all sorts of combat.',
      attack: 2,
      defence: 0,
      state: 'none',
      category: 'weapon', // Add the category property
    },
    // ... other weapons
  ],
  armor: [
    {
      id: 10,
      name: 'Leather Armor',
      desc: 'Lightweight armor made from leather.',
      defence: 5,
      state: 'none',
      category: 'armor', // Add the category property
    },
    // ... other armor items
  ],
  aid: [
    {
      id: 20,
      name: 'Stimpak',
      desc: 'A medical solution that can heal wounds and restore health.',
      healing: 25,
      state: 'none',
      category: 'aid', // Add the category property
    },
    // ... other aid items
  ],
  misc: [
    {
      id: 30,
      name: 'Lockpick',
      desc: 'A tool used for picking locks.',
      state: 'none',
      category: 'misc', // Add the category property
    },
    // ... other miscellaneous items
  ],
  junk: [
    {
      id: 40,
      name: 'Scrap Metal',
      desc: 'A pile of scrap metal that can be used for crafting.',
      state: 'none',
      category: 'junk', // Add the category property
    },
    // ... other junk items
  ],
  account: [
    {
      id: 50,
      name: 'Bottle Caps',
      desc: 'The currency used in the wasteland.',
      value: 1,
      state: 'none',
      category: 'account', // Add the category property
    },
    // ... other account items
  ],
};
