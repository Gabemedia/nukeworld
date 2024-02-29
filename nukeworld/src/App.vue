<template>
  <div id="app">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Admin Panel</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'UserLogin' }">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'CharacterCreation' }">Character Creation</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'GameWorld' }">Game World</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Router View for rendering components -->
    <router-view :loggedInUser="loggedInUser" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loggedInUser: null
    };
  },
  created() {
    // Fetch the loggedInUser from Vuex store on component creation
    this.loggedInUser = this.$store.state.loggedInUser;
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.navbar-nav .nav-link {
  color: #42b983;
  text-decoration: none;
  padding: 10px;
  border: 1px solid #42b983;
  display: inline-block;
  margin-bottom: 10px;
}

.navbar-nav .nav-link:hover {
  background-color: #42b983;
  color: white;
}

/* Add custom styles for your content */
</style>
