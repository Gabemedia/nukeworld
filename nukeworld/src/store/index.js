import { createStore } from 'vuex';

export default createStore({
  state: {
    character: JSON.parse(localStorage.getItem('character')) || {
      name: '',
      email: '',
      password: '',
      class: '',
      gender: '',
      attributes: {
        strength: 1,
        perception: 1,
        endurance: 1,
        agility: 1,
        intelligence: 1,
        charisma: 1,
        luck: 1,
        projectX: 1,
      },
      freePoints: 5,
    },
  },
  mutations: {
    updateCharacter(state, character) {
      state.character = character;
      localStorage.setItem('character', JSON.stringify(character));
    },
    updateCharacterAttributes(state, attributes) {
      state.character.attributes = attributes;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    setCharacterEmailAndPassword(state, { email, password }) {
      state.character.email = email;
      state.character.password = password;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    setCharacterGender(state, gender) {
      state.character.gender = gender;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    setCharacterClass(state, characterClass) {
      state.character.class = characterClass;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    updateFreePoints(state, freePoints) {
      state.character.freePoints = freePoints;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
  },
  actions: {
    login({ commit }, { username, email, password }) {
      // Simulated login logic
      // For simplicity, I'm assuming the user is logged in here
      // You should implement your actual login logic and commit the mutation
      // to update the character state accordingly
      const character = {
        name: username,
        email: email,
        password: password,
        class: '',
        gender: '',
        attributes: {
          strength: 1,
          perception: 1,
          endurance: 1,
          agility: 1,
          intelligence: 1,
          charisma: 1,
          luck: 1,
          projectX: 1,
        },
        freePoints: 5,
      };
      commit('updateCharacter', character);
    },
    increaseAttribute({ commit, state }, attribute) {
      // Increase attribute logic
      // Check if there are available free points to spend
      if (state.character.freePoints > 0) {
        // Increase the attribute value by 1
        state.character.attributes[attribute] += 1;
        // Decrease the available free points
        state.character.freePoints -= 1;
        commit('updateCharacter', state.character);
      } else {
        alert('No more free points available!');
      }
    },
  },
});