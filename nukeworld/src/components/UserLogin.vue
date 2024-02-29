<template>
  <div class="login">
    <h1>Login</h1>
    <input v-model="characterName" type="text" placeholder="Enter your character's name">
    <input v-model="email" type="text" placeholder="Enter your email">
    <input v-model="password" type="password" placeholder="Enter your password">
    <button @click="login">Login</button>
    <router-link to="/character-creation">Create Character</router-link>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      characterName: '',
    };
  },
  methods: {
    async login() {
      if (this.email.trim() !== '' && this.password.trim() !== '' && this.characterName.trim() !== '') {
        try {
          // Load existing character object from localStorage
          let character = JSON.parse(localStorage.getItem('character')) || {
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
          };

          // Update name, email, and password properties
          character.name = this.characterName;
          character.email = this.email;
          character.password = this.password;

          // Commit updated character object to Vuex store
          await this.$store.commit('updateCharacter', character);

          // Navigate to the game world if the character exists
          this.$router.push('/game-world');
        } catch (error) {
          alert('Invalid login credentials. Please enter valid email, password, and character name.');
        }
      } else {
        alert('Please enter all required fields.');
      }
    }
  }
};
</script>

<style scoped>
/* Add styles for your login page */
</style>