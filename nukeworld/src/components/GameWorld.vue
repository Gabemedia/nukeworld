<template>
  <div class="game-world">
    <GameHeader />
    <h1 class="text-center mt-4">Welcome to LokalNyt Vue, {{ character.name }}!</h1>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-3 mb-4" v-for="(value, key) in character" :key="key">
          <div class="card">
            <div class="card-header">
              <strong class="text-capitalize">{{ key.replace('_', ' ') }}</strong>
            </div>
            <div class="card-body">
              <span>{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12">
          <ExpController />
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12">
          <MoneyController />
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-12">
          <QuestsLines />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import { mapState } from 'vuex';
import ExpController from './data/controller/ExpController.vue';
import MoneyController from './data/controller/MoneyController.vue';
import QuestsLines from './data/QuestsLines.vue';


export default {
  name: 'GameWorld',
  components: {
    GameHeader,
    ExpController,
    MoneyController,
    QuestsLines,
  },
  computed: {
    ...mapState(['character'])
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
</style>./data/QuestsLines.vue