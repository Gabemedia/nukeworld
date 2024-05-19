<template>
  <div class="game-world bg-primary">
    <GameHeader @toggleMap="toggleMapVisibility" class="game-header"/>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <MapComponent v-if="showMap" class="flex-grow-1 "/> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import MapComponent from './data/MapComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'GameWorld',
  components: {
    GameHeader,
    MapComponent,

  },
  data() {
    return {
      showMap: true,
    };
  },
  computed: {
    ...mapState(['character'])
  },
  mounted() {
    console.log('Logged in user:', this.character.name);
  },
  methods: {
    toggleMapVisibility() {
      this.showMap = !this.showMap;
    },
  },
};
</script>

<style lang="scss">

.game-world {
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/bg.jpg');
    background-size: cover; // to ensure the image covers the whole div
    background-position: center; // to center the image
    position: absolute;
    z-index:999;
}
.game-header {
  position: absolute;
  z-index:999;
}
</style>.
