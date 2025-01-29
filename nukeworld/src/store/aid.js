import { v4 as uuidv4 } from 'uuid';

export default [
  {
    "id": 0,
    "uuid": uuidv4(),
    "name": "None",
    "desc": "None",
    "health": 0,
    "state": "none",
    "price": -1,
    "img": "none.png"
  },
  {
    "id": 1,
    "uuid": uuidv4(),
    "name": "Small Medkit",
    "desc": "Small edkit restores 25 health.",
    "health": 25,
    "state": "none",
    "price": 50,
    "img": "small_medkit.png"
  },
  {
    "id": 2,
    "uuid": uuidv4(),
    "name": "Medkit",
    "desc": "Medkit restores 50 health.",
    "health": 50,
    "state": "none",
    "price": 150,
    "img": "medkit.png"
  },
  {
    "id": 3,
    "uuid": uuidv4(),
    "name": "Big Medkit",
    "desc": "Big medkit restores 100 health.",
    "health": 100,
    "state": "none",
    "price": 250,
    "img": "big_medkit.png"
  },
  {
    "id": 4,
    "uuid": uuidv4(),
    "name": "Large Medkit",
    "desc": "Large Medkit restores 200 health.",
    "health": 200,
    "state": "none",
    "price": 500,
    "img": "large_medkit.png"
  },
  {
    "id": 5,
    "name": "Huge Medkit",
    "desc": "Huge Medkit restores 500 health.",
    "health": 500,
    "state": "none",
    "price": 1000,
    "uuid": uuidv4(),
    "img": "huge_medkit.png"
  }
];