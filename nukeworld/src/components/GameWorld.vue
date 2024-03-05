<template>
  <div class="game-world bg-primary">
    <GameHeader />
    <h1 class="text-center mt-4">Welcome to LokalNyt Vue, {{ character.name }}!</h1>
    <div class="container mt-4">
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
import QuestsLines from './data/QuestsLines.vue';

export default {
  name: 'GameWorld',
  components: {
    GameHeader,
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

<style lang="scss">

.game-world {
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/bg.jpg');
    background-size: fit; // to ensure the image covers the whole div
    background-position: center; // to center the image
    background-color: #ff0000;

}</style>
