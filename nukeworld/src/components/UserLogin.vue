<template>
  <div class="login">
    <h1>Login</h1>
    <input v-model="characterName" type="text" placeholder="Enter your character's name">
    <button @click="login">Login</button>
    <router-link to="/character-creation">Create Character</router-link>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      characterName: '',
    };
  },
  methods: {
login() {
  if (this.characterName.trim() !== '') {
    const characterName = this.$store.state.loggedInUser; // Update this line
    console.log('Character name from store:', characterName); // Add this line
    if (characterName === this.characterName) {
      // Navigate to the game world if the character exists
      this.$router.push('/game-world');
    } else {
      alert('Invalid character name. Please enter a valid character name.');
    }
  } else {
    alert('Please enter a character name.');
  }
}

  }
};
</script>

<style scoped>
/* Add styles for your login page */
</style>
