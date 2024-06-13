import { v4 as uuidv4 } from 'uuid';
export default [
  {
    id: 0,
    uuid: uuidv4(),
    name: 'No Armor',
    desc: 'No armor equipped.',
    defence: 0,
    state: 'none',
    price: '-1',
  },
  {
    id: 1,
    uuid: uuidv4(),
    name: 'Leather Armor',
    desc: 'Leather Armor provides basic protection.',
    defence: 5,
    state: 'none',
    price: '50',
  },
  // Tilføj flere rustningsgenstande her
];
