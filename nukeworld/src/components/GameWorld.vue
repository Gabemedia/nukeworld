<template>
  <div class="game-world bg-primary">
    <GameHeader @toggleMap="toggleMapVisibility" @toggleMap2="toggleMapVisibility2" class="game-header"/>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <MapComponent v-if="showMap" class="flex-grow-1 "/> 
          <MapComponent2 v-if="showMap2" class="flex-grow-1 "/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import MapComponent from './data/MapComponent.vue';
import MapComponent2 from './data/MapComponent2.vue';
import { mapState } from 'vuex';

export default {
  name: 'GameWorld',
  components: {
    GameHeader,
    MapComponent,
    MapComponent2,
  },
  data() {
    return {
      showMap: true,
      showMap2: false,
    };
  },
  computed: {
    ...mapState(['character']),
    defaultMap() {
      return this.character.level < 5 ? 'MapComponent' : 'MapComponent2';
    },
  },
  mounted() {
    console.log('Logged in user:', this.character.name);
    this.setDefaultMap();
  },
  methods: {
    setDefaultMap() {
      if (this.defaultMap === 'MapComponent') {
        this.showMap = true;
        this.showMap2 = false;
      } else {
        this.showMap = false;
        this.showMap2 = true;
      }
    },
    toggleMapVisibility() {
      this.showMap = !this.showMap;
    },
    toggleMapVisibility2() {
      this.showMap2 = !this.showMap2;
    },
  },
};
</script>

<style lang="scss">
.game-world {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  position: absolute;
  z-index:999;
}
.game-header {
  position: absolute;
  z-index:999;
}
</style>
