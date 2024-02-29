<template>
  <div class="game-world">
    <h1>Welcome to the Game World, {{ loggedInUser }}!</h1>
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          User Information
        </div>
        <div class="card-body">
          <!-- Add more user information as needed -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameWorld',
  props: {
    loggedInUser: {
      type: String,
      required: true
    }
  },
  computed: {
    userData() {
      return this.$store.state.userData;
    }
  },
  mounted() {
    console.log('Logged in user:', this.loggedInUser);
  }
};
</script>

<style scoped>
/* Add styles for your game world page */
</style>
