<template>
  <div class="game-world bg-primary">
    <GameHeader class="game-header"/>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <MapComponent v-if="character.level < 5" ref="mapComponent" class="flex-grow-1 "/> 
          <MapComponent2 v-else-if="character.level >= 5 && character.level <= 100" ref="mapComponent2" class="flex-grow-1 "/>
            <QuickBar ref="quickBar" />

        </div>
      </div>
    </div>
    <GameOver :showModal="showModal" @close="closeModal" />
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import MapComponent from './data/MapComponent.vue';
import MapComponent2 from './data/MapComponent2.vue';
import QuickBar from './data/QuickBar.vue';
import GameOver from './data/GameOver.vue';
import { mapState } from 'vuex';

export default {
  name: 'GameWorld',
  components: {
    GameHeader,
    MapComponent,
    MapComponent2,
    GameOver,
    QuickBar,
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapState(['character']),
  },
  watch: {
    'character.level': function (newLevel) {
      this.updateMapVisibility(newLevel);
    },
    'character.health': function (newHealth) {
      if (newHealth === 0) {
        this.openModal();
      }
    },
  },
  mounted() {
    console.log('Logged in user:', this.character.name);
    this.updateMapVisibility(this.character.level);
    this.checkCharacterHealth(); // Tilføj denne linje for at kontrollere spillerens health ved montering
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
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    checkCharacterHealth() {
      if (this.character.health === 0) {
        this.openModal(); // Vis "Game Over"-modalen, hvis spillerens health er 0
      }
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
