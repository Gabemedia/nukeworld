import { v4 as uuidv4 } from 'uuid';
export default [
  {
    id: 0,
    uuid: uuidv4(),
    name: 'None',
    desc: 'None',
    health: 0,
    state: 'none',
    price: '-1',
  },
  {
    id: 1,
    uuid: uuidv4(),
    name: 'Small Medkit',
    desc: 'Small edkit restores 25 health.',
    health: 25,
    state: 'none',
    price: '50',
  },
  {
    id: 2,
    uuid: uuidv4(),
    name: 'Medkit',
    desc: 'Small edkit restores 50 health.',
    health: 50,
    state: 'none',
    price: '100',
  },
];