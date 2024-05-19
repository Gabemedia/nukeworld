import { v4 as uuidv4 } from 'uuid';
export default [
  {
    id: 0,
    uuid: uuidv4(),
    name: 'Hands',
    desc: 'Hands is a great melee weapon. It is used for all sorts of combat.',
    attack: 1,
    defence: 0,
    state: 'none',
    price: '-1',
  },
  {
    id: 1,
    uuid: uuidv4(),
    name: 'Tire Iron',
    desc: 'Tire Iron is a great melee weapon. It is used for all sorts of combat.',
    attack: 2,
    defence: 0,
    state: '0',
    price: '5',

  },
  {
    id: 2,
    uuid: uuidv4(),
    name: 'Hunting Rifle',
    desc: 'Hunting Rifle is a great ranged weapon. It is used for hunting.',
    attack: 20,
    defence: 0,
    state: 'none',
    price: '100',

  },
  {
    id: 3,
    uuid: uuidv4(),
    name: 'Baseball Bat',
    desc: 'Baseball Bat is a great ranged weapon. It is used for hunting.',
    attack: 5,
    defence: 0,
    state: 'none',
    price: '10',

  },
  {
    id: 4,
    uuid: uuidv4(),
    name: '10mm Pistol',
    desc: '10mm Pistol is a great ranged weapon. It is used for hunting.',
    attack: 12,
    defence: 0,
    state: 'none',
    price: '25',

  },
];