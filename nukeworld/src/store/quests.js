export default [
  {
    id: 1,
    name: 'Tunnel Access',
    desc: 'We need to gain Access to the Tunnels to get to the other side of the city. We need to find a way to get in.',
    exp: 50,
    money: 50,
    duration: 5000,
    progress: 0,
    state: 'not-started',
    disabled: false,
    lat: 51.5074, // Latitude for Tunnel Access
    lon: -0.1278, // Longitude for Tunnel Access
    reward: [
      { category: 'weapon', id: 1 }, // Tire Iron
      { category: 'armor', id: 1 }, // Leather Armor
      { category: 'aid', id: 1 }, // Stimpak
    ],
  },
  {
    id: 2,
    name: 'Gateway to the City',
    desc: 'The Settlement is surrounded by a wall. We need to find a way to get through the gate.',
    exp: 250,
    money: 500,
    duration: 10000,
    progress: 0,
    state: 'not-started',
    disabled: false,
    lat: 51.5137, // Latitude for Gateway to the City
    lon: -0.0983, // Longitude for Gateway to the City
    reward: [
      { category: 'weapon', id: 1 }, // Tire Iron
      { category: 'armor', id: 1 }, // Leather Armor
      { category: 'aid', id: 1 }, // Stimpak
    ],
  },
  {
    id: 3,
    name: 'Clock Tower',
    desc: 'Seek shelter for the night in the Clock Tower.',
    exp: 1000,
    money: 500,
    duration: 10000,
    progress: 0,
    state: 'not-started',
    disabled: false,
    lat: 51.5099, // Latitude for Clock Tower
    lon: -0.0768, // Longitude for Clock Tower
    reward: [
      { category: 'weapon', id: 1 }, // Tire Iron
      { category: 'armor', id: 1 }, // Leather Armor
      { category: 'aid', id: 1 }, // Stimpak
    ],
  },
  {
    id: 4,
    name: 'Dunvick Castle',
    desc: 'We need to find a way to get into the Castle to find the King.',
    exp: 1200,
    money: 1000,
    duration: 20000,
    progress: 0,
    state: 'not-started',
    disabled: false,
    lat: 51.5015, // Latitude for Dunvick Castle
    lon: -0.0762, // Longitude for Dunvick Castle
    reward: [
      { category: 'weapon', id: 1 }, // Tire Iron
      { category: 'armor', id: 1 }, // Leather Armor
      { category: 'aid', id: 1 }, // Stimpak
    ],
  },
];
