<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="game-title">NukeWorld</h1>
      <div v-if="!showCharacterList" class="login-form">
        <h2 class="section-title">Login or Create Character</h2>
        <input v-model="character.name" placeholder="Character Name" class="input-field" autocomplete="name">
        <input v-model="character.email" placeholder="Email" class="input-field" autocomplete="email">
        <input type="password" v-model="character.password" placeholder="Password" class="input-field">
        <div class="button-group">
          <button @click="login" class="btn btn-primary">Login</button>
          <button @click="createCharacter" class="btn btn-secondary">Create Character</button>
        </div>
        <button @click="toggleCharacterList" class="btn btn-tertiary">Show Character List</button>
        <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
          Character created successfully!
        </div>
      </div>
      <div v-else class="character-list">
        <h2 class="section-title">Character List</h2>
        <div class="character-grid">
          <div v-for="char in characters" :key="char.id" class="character-card" @click="selectCharacter(char)">
            <h3 class="character-name">{{ char.name }}</h3>
            <p class="character-level">Level: {{ char.level }}</p>
          </div>
        </div>
        <button @click="toggleCharacterList" class="btn btn-tertiary">Back to Login</button>
        <button @click="clearLocalStorage" class="btn btn-danger">Delete All</button>
      </div>
    </div>
    <div class="version-number">v{{ version }}</div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'UserLogin',
  props: ['loggedInUser'],
  data() {
    return {
      character: {
        name: '',
        email: '',
        password: ''
      },
      showSuccessMessage: false,
      showCharacterList: false,
      version: '0.1.4.0', // Current version number
    };
  },
  computed: {
    ...mapState(['characters'])
  },
  methods: {
    toggleCharacterList() {
      this.showCharacterList = !this.showCharacterList;
    },
    selectCharacter(selectedCharacter) {
      this.character.name = selectedCharacter.name;
      this.character.email = selectedCharacter.email;
      this.character.password = selectedCharacter.password;
      this.toggleCharacterList();
    },
    async login() {
      if (this.character.email.trim() !== '' && this.character.password.trim() !== '') {
        try {
          let characters = this.$store.state.characters;
          let characterExists = characters.some(character => 
            character.email === this.character.email && character.password === this.character.password
          );

          if (!characterExists) {
            alert('Invalid login credentials. Please enter a valid email and password.');
            return;
          }

          let character = characters.find(character => 
            character.email === this.character.email && character.password === this.character.password
          );

          await this.$store.commit('updateCharacter', character);
          this.$router.push('/game-world');
        } catch (error) {
          alert('Invalid login credentials. Please enter a valid email and password.');
        }
      } else {
        alert('Please fill in all required fields.');
      }
    },
    ...mapActions(['updateCharacter', 'createCharacter']),
    createCharacter() {
      if (this.character.name.trim() !== '') {
        this.$store.commit('updateCharacter', this.character);
        this.$store.dispatch('createCharacter');
        this.showSuccessMessage = true;
      } else {
        alert('Please enter your character name.');
      }
    },
    clearLocalStorage() {
      if (confirm('Are you sure you want to delete all saved data for this game?')) {
        localStorage.clear();
        alert('All saved data has been deleted.');
        location.reload();
      }
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

.login-container {
  min-height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.login-content {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.game-title {
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff00;
}

.section-title {
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 300;
}

.input-field {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-bottom: 2px solid #00ff00;
  color: #ffffff;
  transition: all 0.3s ease;
}

.input-field:focus {
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  background-color: #00cc00;
}

.btn-secondary {
  background-color: #4a4a4a;
  color: #ffffff;
}

.btn-secondary:hover {
  background-color: #5a5a5a;
}

.btn-tertiary {
  background-color: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  width: 100%;
  margin-top: 1rem;
}

.btn-tertiary:hover {
  background-color: rgba(0, 255, 0, 0.1);
}

.btn-danger {
  background-color: #ff0000;
  color: #ffffff;
  width: 100%;
  margin-top: 1rem;
}

.btn-danger:hover {
  background-color: #cc0000;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.character-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.character-card:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.character-name {
  color: #00ff00;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.character-level {
  color: #ffffff;
  margin: 0;
  font-size: 0.875rem;
}

.version-number {
  position: fixed;
  bottom: 10px;
  right: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  font-weight: 300;
}
</style>
