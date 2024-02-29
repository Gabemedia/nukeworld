<template>
  <div class="game-world">
    <h1 class="text-center mt-4">Welcome to the Game World, {{ character.name }}!</h1>
    <div class="container mt-4">
      <div class="card mb-4" v-for="(value, key) in character" :key="key">
        <div class="card-header">
          <strong class="text-capitalize">{{ key.replace('_', ' ') }}</strong>
        </div>
        <div class="card-body">
          <span v-if="key !== 'attributes'">{{ value }}</span>
          <div class="row" v-else>
            <div class="col-md-4 mb-4" v-for="(attrValue, attrKey) in value" :key="attrKey">
              <div class="card">
                <div class="card-header">
                  <strong class="text-capitalize">{{ attrKey.replace('_', ' ') }}</strong>
                </div>
                <div class="card-body">
                  {{ attrValue }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameWorld',
  computed: {
    character() {
      return this.$store.state.character;
    }
  },
  mounted() {
    console.log('Logged in user:', this.character.name);
  }
};
</script>

<style scoped>
/* Add styles for your game world page */
.game-world {
  font-family: Arial, sans-serif;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
  color: #666;
  font-size: 1.2em;
}

.card-body > .row > .col-md-4 > .card {
  margin-bottom: 20px;
}
</style>