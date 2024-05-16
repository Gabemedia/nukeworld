<template>
  <div class="game-world bg-primary">
    <GameHeader class="game-header"/>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <MapComponent class="flex-grow-1"/> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import MapComponent from './MapComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'GameWorld',
  components: {
    GameHeader,
    MapComponent,

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
    position: absolute;
    z-index:999;
}
.game-header {
  position: absolute;
  z-index:999;
}
</style>.
