export default [
  {
    id: 1,
    name: "Welcome to NukeWorld",
    levelRequirement: 1,
    completed: false,
    playerChoices: [],
    steps: [
      {
        npcMessage: "Velkommen til NukeWorld, overlevende! Dette er en farlig verden fuld af udfordringer og muligheder.",
        playerOptions: [{ text: "Fortæl mig mere", nextId: 2 }]
      },
      {
        npcMessage: "Du vil finde quests markeret på dit kort. Udfør dem for at få erfaring og belønninger.",
        playerOptions: [{ text: "Hvad med fjender?", nextId: 3 }]
      },
      {
        npcMessage: "Pas på fjendtlige møder! De kan være farlige, men også give værdifulde ressourcer.",
        playerOptions: [{ text: "Forstået. Hvad med udstyr?", nextId: 4 }]
      },
      {
        npcMessage: "Besøg shoppen for at købe og sælge genstande. Godt udstyr er nøglen til overlevelse.",
        playerOptions: [{ text: "Tak for informationen", nextId: 5 }]
      },
      {
        npcMessage: "Held og lykke derude, overlevende. NukeWorld venter på dig!",
        playerOptions: [{ text: "Afslut samtale", nextId: null }]
      }
    ]
  },
  {
    id: 2,
    name: "Setup HomeBase Settlement",
    levelRequirement: 2,
    completed: false,
    playerChoices: [],
    steps: [
      {
        npcMessage: "Det er tid til at etablere en hjemmebase. Vi har brug for ressourcer til at komme i gang.",
        playerOptions: [{ text: "Hvad har I brug for?", nextId: 2 }]
      },
      {
        npcMessage: "Vi mangler 2 læderrustninge til vores vagter. Kan du skaffe dem?",
        playerOptions: [
          { text: "Jeg har dem klar", nextId: 3 },
          { text: "Jeg må først finde dem", nextId: null }
        ]
      },
      {
        npcMessage: "Fantastisk! Din hjælp er uvurderlig. Her er din belønning: 20.000 erfaringspoint!",
        playerOptions: [{ text: "Tak! Afslut samtale", nextId: null }]
      }
    ]
  },
  {
    id: 3,
    name: "Random Quest 1",
    levelRequirement: 5,
    completed: false,
    playerChoices: [],
    steps: [
      {
        npcMessage: "Vi har brug for hjælp med en vigtig opgave. Er du interesseret?",
        playerOptions: [{ text: "Fortæl mig mere", nextId: 2 }]
      },
      {
        npcMessage: "Vi har brug for [RANDOM OBJECTIVE]. Kan du hjælpe os med det?",
        playerOptions: [
          { text: "Jeg er klar", nextId: 3 },
          { text: "Ikke lige nu", nextId: null }
        ]
      },
      {
        npcMessage: "Godt klaret! Her er din belønning: [RANDOM REWARD]",
        playerOptions: [{ text: "Tak! Afslut samtale", nextId: null }]
      }
    ]
  },
  {
    id: 4,
    name: "Random Quest 2",
    levelRequirement: 6,
    completed: false,
    playerChoices: [],
    steps: [
      {
        npcMessage: "Der er en presserende situation, der kræver din ekspertise. Interesseret?",
        playerOptions: [{ text: "Lad mig høre", nextId: 2 }]
      },
      {
        npcMessage: "Vi har brug for [RANDOM OBJECTIVE]. Tror du, at du kan klare det?",
        playerOptions: [
          { text: "Jeg tager udfordringen", nextId: 3 },
          { text: "Måske senere", nextId: null }
        ]
      },
      {
        npcMessage: "Imponerende arbejde! Din belønning er: [RANDOM REWARD]",
        playerOptions: [{ text: "Tak! Afslut samtale", nextId: null }]
      }
    ]
  }
];
