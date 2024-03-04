import { createStore } from 'vuex';
import { watch, reactive } from 'vue';

const state = reactive({
  characters: JSON.parse(localStorage.getItem('characters')) || [],
  character: JSON.parse(localStorage.getItem('character')) || {
    name: '',
    email: '',
    password: '',
    exp: 1,
    maxExp: 10,
    level: 1,
    money: 0,
  },
});

const store = createStore({
  state,
  mutations: {
    addCharacter(state, character) {
      state.characters.push(character);
      localStorage.setItem('characters', JSON.stringify(state.characters));
    },
    updateCharacter(state, character) {
      for (let key in character) {
        if (Object.prototype.hasOwnProperty.call(character, key)) {
          state.character[key] = character[key];
        }
      }
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    addExp(state, exp) {
      state.character.exp += exp;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    increaseMaxExp(state, amount) {
      state.character.maxExp += amount;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    addMoney(state, amount) {
      state.character.money += amount;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    updateCharacterInArray(state, character) {
      const characterInArray = state.characters.find(ch => ch.email === character.email);
      if (characterInArray) {
        Object.assign(characterInArray, character);
      }
      localStorage.setItem('characters', JSON.stringify(state.characters));
    },
    increaseCharacterLevel(state) {
      state.character.level += 1;
      localStorage.setItem('character', JSON.stringify(state.character));
    },
    increaseCharacterLevelInArray(state, character) {
      const characterInArray = state.characters.find(ch => ch.email === character.email);
      if (characterInArray) {
        characterInArray.level += 1;
      }
      localStorage.setItem('characters', JSON.stringify(state.characters));
    },
  },  
  actions: {
    login({ commit }, { username, email, password }) {
      commit('updateCharacter', { name: username, email: email, password: password });
    },
    createCharacter({ commit, state }) {
      const newCharacter = { ...state.character, level: 1, exp: 1, maxExp: 10, money: 0 };
      commit('addCharacter', newCharacter);
      commit('updateCharacter', newCharacter);
    },
    updateCharacter({ commit }, character) {
      commit('updateCharacter', character);
    },
    increaseExp({ commit, state, dispatch }, amount) {
      commit('addExp', amount);
      if (state.character.exp >= state.character.maxExp) {
        dispatch('levelUp');
      }
    },
    decreaseExp({ commit, state }) {
      if (state.character.exp - 5 >= 0) {
        commit('addExp', -5);
      }
    },
    increaseMoney({ commit, state }, amount) {
      commit('addMoney', amount);
      commit('updateCharacterInArray', state.character);
    },
    decreaseMoney({ commit, state }, amount) {
      if (state.character.money - amount >= 0) {
        commit('addMoney', -amount);
        commit('updateCharacterInArray', state.character);
      }
    },
    levelUp({ commit, state }) {
      this.levelingUp = true;
      const overflowExp = state.character.exp - state.character.maxExp;
      const newMaxExp = Math.floor(state.character.maxExp * 1.6);
      commit('updateCharacter', { exp: overflowExp * 2, maxExp: newMaxExp });
      commit('increaseCharacterLevel');
      commit('increaseCharacterLevelInArray', state.character);
    },
  },
});

watch(() => state.character, (newCharacter) => {
  localStorage.setItem('character', JSON.stringify(newCharacter));
}, { deep: true });

export default store;