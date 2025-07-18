import { v4 as uuidv4 } from 'uuid';

export default [
  {
  "id": 0,
  "uuid": uuidv4(),
  "name": "None",
  "desc": "None",
  "state": "none",
  "type": "none",
  "price": "-1",
  "quantity": 0,
  "img": "none.png"
},
  {
  "id": 1,
  "uuid": uuidv4(),
  "name": "Loot Box Gold",
  "desc": "Loot Box Gold is a loot box that contains 5 Items or Gold.",
  "state": "none",
  "type": "lootbox",
  "lootbox": 5,
  "price": "100",
  "quantity": 0,
  "img": "donate.png"
},
  {
  "id": 2,
  "uuid": uuidv4(),
  "name": "Loot Box Silver",
  "desc": "Loot Box Silver is a loot box that contains 1 Item or Gold.",
  "state": "none",
  "type": "lootbox",
  "lootbox": 1,
  "price": "50",
  "quantity": 0,
  "img": "shop.png"
}
];