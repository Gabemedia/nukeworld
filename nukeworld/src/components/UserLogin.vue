<template>
  <div class="login-container">
    <div class="login d-flex flex-column align-items-center mt-4 justify-content-start mx-auto w-75">
      <div class="row justify-content-center w-100 mt-4">
        <div class="col-12">
          <input autocomplete="name" class="game-input mx-4 w-100" v-model="character.name" placeholder="Enter your character's name">
        </div>
      </div>
      <div class="row justify-content-center mt-4 w-100">
        <div class="col-6">
          <input autocomplete="email" class="game-input mx-4 w-100" v-model="character.email" placeholder="Enter your email">
        </div>
        <div class="col-6">
          <input type="password" class="game-input mx-4 w-100" v-model="character.password" placeholder="Enter your password">
        </div>
      </div>
      <div class="row justify-content-center w-100">
        <div class="col-6">
          <button class="game-button col-3 mx-4" @click="login">Login</button>
        </div>
        <div class="col-6">
          <button class="game-create col-5 mx-4" @click="createCharacter">Create Character</button>
        </div>
      </div>
      <div class="row justify-content-start ms-3 mt-4 w-100">
        <div v-if="showSuccessMessage" class="alert alert-success mx-4" role="alert">
          Character created successfully!
        </div>
      </div>
    </div>
    <div class="login d-flex flex-column align-items-center justify-content-start mx-auto w-75 vh-100">
      <div class="row justify-content-center w-100">
        <div class="col-12">
          <CharacterList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CharacterList from './data/CharacterList.vue';

export default {
  name: 'UserLogin',
  props: ['loggedInUser'],
  components: {
    CharacterList,
  },
  data() {
    return {
      character: {
        name: '',
        email: '',
        password: ''
      },
      showSuccessMessage: false,
    };
  },
  computed: {
    ...mapState(['characters'])
  },
  methods: {
    async login() {
  if (this.character.email.trim() !== '' && this.character.password.trim() !== '') {
    try {
      // Load existing characters array from Vuex store
      let characters = this.$store.state.characters;

      // Check if the entered email and password match any character in the characters array
      let characterExists = characters.some(character => 
        character.email === this.character.email && character.password === this.character.password
      );

      if (!characterExists) {
        alert('Invalid login credentials. Please enter a valid email and password.');
        return;
      }

      // Find the character with the matching email and password
      let character = characters.find(character => 
        character.email === this.character.email && character.password === this.character.password
      );

      // Commit updated character object to Vuex store
      await this.$store.commit('updateCharacter', character);

      // Navigate to the game world if the character exists
      this.$router.push('/game-world');
    } catch (error) {
      alert('Invalid login credentials. Please enter valid email and password.');
    }
  } else {
    alert('Please enter all required fields.');
  }
},
    ...mapActions(['updateCharacter', 'createCharacter']),
    createCharacter() {
      if (this.character.name.trim() !== '') {
        // Update the character object in the Vuex store with the input values from the form
        this.$store.commit('updateCharacter', this.character);
        // Dispatch the createCharacter action
        this.$store.dispatch('createCharacter');
        this.showSuccessMessage = true;
      } else {
        alert('Please enter your character name.');
      }
    }

  }
};
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  position: absolute;
  z-index: 999;
}
.game-input {
  box-sizing: border-box;
  border: none;
  border-radius: 0;
  background-color: #333;
  color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1.2em;
}

input::placeholder{
  color: #fff;
  text-transform: capitalize;
}

.game-button {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2em;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 3px;
}

.game-create {
  background-color: #0acc7b;
  border: none;
  color: #fff;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2em;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 3px;
}

.game-link {
  color: #007bff;
  text-decoration: none;
  font-size: 1.2em;
}
</style>