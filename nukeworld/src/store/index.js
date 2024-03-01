import { createStore } from 'vuex';
import { watch } from 'vue';

const store = createStore({
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
    },
    updateCharacterAttributes(state, attributes) {
      state.character.attributes = attributes;
    },
    setCharacterEmailAndPassword(state, { email, password }) {
      state.character.email = email;
      state.character.password = password;
    },
    setCharacterGender(state, gender) {
      state.character.gender = gender;
    },
    setCharacterClass(state, characterClass) {
      state.character.class = characterClass;
    },
    updateFreePoints(state, freePoints) {
      state.character.freePoints = freePoints;
    },
    increaseAttribute(state, attribute) {
      if (state.character.freePoints > 0) {
        state.character.attributes[attribute]++;
        state.character.freePoints--;
      }
    },
    decreaseAttribute(state, attribute) {
      if (state.character.attributes[attribute] > 1) {
        state.character.attributes[attribute]--;
        state.character.freePoints++;
      }
    },
    updateAttribute(state, { attribute, value }) {
      if (value > state.character.attributes[attribute] && state.character.freePoints > 0) {
        state.character.attributes[attribute] = value;
        state.character.freePoints--;
      } else if (value < state.character.attributes[attribute]) {
        state.character.attributes[attribute] = value;
        state.character.freePoints++;
      }
    },
  },
  actions: {
    login({ commit }, { username, email, password }) {
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
      if (state.character.freePoints > 0) {
        state.character.attributes[attribute]++;
        state.character.freePoints--;
        commit('updateCharacter', state.character);
      } else {
        alert('No more free points available!');
      }
    },
  },
});

watch(() => store.state.character, (newCharacter) => {
  localStorage.setItem('character', JSON.stringify(newCharacter));
}, { deep: true });

export default store;