import { createStore } from 'vuex';

export default createStore({
  state: {
    loggedInUser: localStorage.getItem('characterName') || null,
    userData: null, // Add user data object
    character: {
      name: localStorage.getItem('characterName') || '', // Update to retrieve character name from localStorage
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
    setLoggedInUser(state, user) {
      state.loggedInUser = user;
      localStorage.setItem('characterName', user); // Save character name in localStorage
    },
    setUserData(state, data) {
      state.userData = data;
    },
    updateAttribute(state, { attribute, value }) {
      state.character.attributes[attribute] = value;
    },
  },
  actions: {
    updateCharacter({ commit }, character) {
      // Update character logic
      // For simplicity, I'm assuming the character is updated here
      // You should implement your actual logic to update the character
      // and commit the mutation to update the loggedInUser state accordingly
      commit('setLoggedInUser', character.name);
    },
    login({ commit }, username) {
      // Simulated login logic
      // For simplicity, I'm assuming the user is logged in here
      // You should implement your actual login logic and commit the mutation
      // to update the loggedInUser state accordingly
      commit('setLoggedInUser', username);
      
      // Set user data directly with the character name
      const userData = {
        character: {
          name: username,
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
        }
      };
      commit('setUserData', userData);
    },
    increaseAttribute({ commit, state }, attribute) {
      // Increase attribute logic
      // Check if there are available free points to spend
      if (state.character.freePoints > 0) {
        // Increase the attribute value by 1
        commit('updateAttribute', { attribute, value: state.character.attributes[attribute] + 1 });
        // Decrease the available free points
        commit('decreaseFreePoints');
      } else {
        alert('No more free points available!');
      }
    },
  },
});
