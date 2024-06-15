<template>
  <div class="game-world bg-primary">
    <GameHeader class="game-header"/>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <MapComponent v-if="character.level < 5" ref="mapComponent" class="flex-grow-1 "/> 
          <MapComponent2 v-else-if="character.level >= 5 && character.level <= 100" ref="mapComponent2" class="flex-grow-1 "/>
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
  computed: {
    ...mapState(['character']),
  },
  watch: {
    'character.level': function (newLevel) {
      this.updateMapVisibility(newLevel);
    },
  },
  mounted() {
    console.log('Logged in user:', this.character.name);
    this.updateMapVisibility(this.character.level);
  },
  methods: {
    updateMapVisibility(level) {
      this.$nextTick(() => {
        if (level < 5 && this.$refs.mapComponent) {
          this.$refs.mapComponent.updateMapSize();
        } else if (level >= 5 && level <= 100 && this.$refs.mapComponent2) {
          this.$refs.mapComponent2.updateMapSize();
        }
      });
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
