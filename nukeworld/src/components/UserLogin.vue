<template>
  <div class="login-container">
    <div class="login d-flex flex-column align-items-center justify-content-center">
      <h1 class="text-center mb-4">Login or Create Character</h1>
      <div class="form-group">
        <input autocomplete="name" class="form-control" v-model="character.name" placeholder="Character Name">
      </div>
      <div class="form-group">
        <input autocomplete="email" class="form-control" v-model="character.email" placeholder="Email">
      </div>
      <div class="form-group">
        <input type="password" class="form-control" v-model="character.password" placeholder="Password">
      </div>
      <div class="button-group">
        <button class="btn btn-primary" @click="login">Login</button>
        <button class="btn btn-success" @click="createCharacter">Create Character</button>
      </div>
      <div v-if="showSuccessMessage" class="alert alert-success mt-3" role="alert">
        Character created successfully!
      </div>
    </div>
    <div class="character-list">
      <h1 class="text-center mb-6">Character List</h1>
      <CharacterList />
      <button class="btn btn-danger" @click="clearLocalStorage">Delete All</button>
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
    autoFillLoginForm(selectedCharacter) {
      this.character.name = selectedCharacter.name;
      this.character.email = selectedCharacter.email;
      this.character.password = selectedCharacter.password;
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
          alert('Invalid login credentials. Please enter valid email and password.');
        }
      } else {
        alert('Please enter all required fields.');
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
.login-container {
  width: 100%;
  min-height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.login {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}
h1 {
  color: #fff;
  font-weight: 800;
  font-size:1.2rem;
  text-transform: uppercase;
}
.form-group {
  margin-bottom: 20px;
}

.form-control {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
}

.form-control::placeholder {
  color: #ccc;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  border-radius: 0px;
  font-size: 1rem;
}

.character-list {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}

.btn-danger {
  margin-top: 20px;
}
</style>
