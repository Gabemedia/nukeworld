<template>
  <div class="game-world bg-primary">
    <GameHeader class="game-header"/>
    <SideBar />
    <div class="scaled-ui-bottom-center" :style="{ transform: `scale(${uiScale})` }">
      <QuickBar ref="quickBar" />
    </div>
    <div class="d-none d-md-block">
      <div class="scaled-ui-bottom-left" :style="{ transform: `scale(${uiScale})` }">
        <QuickBarLeft ref="quickBarLeft" />
      </div>
      <div class="scaled-ui-bottom-right" :style="{ transform: `scale(${uiScale})` }">
        <QuickBarRight ref="quickBarRight" />
      </div>
    </div>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <MapComponent ref="mapComponent" class="flex-grow-1" :mapImageUrl="mapImageUrl"/> 
        </div>
      </div>
    </div>
    <GameOver :showModal="showModal" @close="closeModal" />
    <LvlPopUp ref="lvlPopUp" />
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import SideBar from './SideBar.vue';
import MapComponent from './data/MapComponent.vue';
import QuickBar from './data/QuickBar.vue';
import QuickBarLeft from './data/QuickBarLeft.vue';
import QuickBarRight from './data/QuickBarRight.vue';
import GameOver from './data/GameOver.vue';
import LvlPopUp from './data/controller/popup/LvlPopUp.vue';
import { mapState } from 'vuex';

export default {
  name: 'GameWorld',
  components: {
    GameHeader,
    SideBar,
    MapComponent,
    GameOver,
    QuickBar,
    QuickBarLeft,
    QuickBarRight,
    LvlPopUp,
  },
  data() {
    return {
      showModal: false,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapState(['character']),
    uiScale() {
      if (this.windowWidth <= 1280) return 0.8;
      if (this.windowWidth <= 1440) return 1;
      if (this.windowWidth <= 1920) return 1.2;
      if (this.windowWidth <= 2880) return 1.5;
      if (this.windowWidth <= 3840) return 1.8;
      return 2;
    },
    mapImageUrl() {
      if (this.character.level < 5) {
        return require('@/assets/maps/nukemap1.webp');
      } else if (this.character.level >= 5 && this.character.level < 10) {
        return require('@/assets/maps/nukemap2.webp');
      } else if (this.character.level >= 10 && this.character.level < 20) {
        return require('@/assets/maps/nukemap3.webp');
      } else {
        return require('@/assets/maps/nukemap4.webp');
      }
    },

  },
  watch: {
    'character.health': function (newHealth) {
      if (newHealth === 0) {
        this.openModal();
        this.$gtag.event('player_died', {
          event_category: 'game_event',
          event_label: 'Player Died',
          character_level: this.character.level
        });
      }
    },
    'character.level': function (newLevel, oldLevel) {
      if (newLevel > oldLevel) {
        this.$refs.lvlPopUp.openPopup();
        this.$gtag.event('player_level_up', {
          event_category: 'game_event',
          event_label: 'Player Level Up',
          character_level: newLevel
        });
      }
    },

    windowWidth() {
      this.updateUIScale();
    },
  },
  mounted() {
    console.log('Logged in user:', this.character.name);
    this.checkCharacterHealth();
    window.addEventListener('resize', this.handleResize);
    this.updateUIScale();
    this.$gtag.event('game_world_loaded', {
      event_category: 'game_event',
      event_label: 'Game World Loaded',
      character_level: this.character.level
    });


  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    checkCharacterHealth() {
      if (this.character.health === 0) {
        this.openModal();
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    updateUIScale() {
      // Vi behøver ikke at gøre noget her, da skaleringen håndteres i template
    }
  },
  created() {
    try {
      const savedCharacter = JSON.parse(localStorage.getItem('character'));
      if (savedCharacter) {
        console.log('Loaded character from localStorage:', savedCharacter);
        this.$store.commit('updateCharacter', savedCharacter);
      }
    } catch (error) {
      console.error('Error loading character from localStorage:', error);
    }
  },
};
</script>

<style lang="scss">
.game-world {
  width: 100%;
  height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  position: absolute;
  z-index: 1;
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.game-header {
  position: absolute;
  z-index: 999;
}

.scaled-ui-top-left,
.scaled-ui-bottom-center,
.scaled-ui-bottom-left,
.scaled-ui-bottom-right {
  position: absolute;
  z-index: 10;
  pointer-events: none;
}

.scaled-ui-top-left {
  top: 0;
  left: 0;
}

.scaled-ui-bottom-center {
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
}

.scaled-ui-bottom-left {
  bottom: 0;
  left: 0;
}

.scaled-ui-bottom-right {
  bottom: 0;
  right: 0;
}

.scaled-ui-top-left > *,
.scaled-ui-bottom-center > *,
.scaled-ui-bottom-left > *,
.scaled-ui-bottom-right > * {
  pointer-events: auto;
}

/* Responsive styles */
@media (min-width: 1441px) {
  .game-world {
    font-size: 1.1rem;
  }
}

@media (min-width: 1921px) {
  .game-world {
    font-size: 1.2rem;
  }
}

@media (min-width: 2561px) {
  .game-world {
    font-size: 1.3rem;
  }
}

@media (min-width: 3841px) {
  .game-world {
    font-size: 1.4rem;
  }
}


</style>
