<template>
  <div class="game-world bg-primary">
    <GameHeader class="game-header"/>
    <SideBar @open-savage-modal="openSavageModal" />
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
    <SavageWastelandModal 
      ref="savageModal"
      :showModal="showSavageModal" 
      :days="savageWasteland.days"
      :moneyReward="savageWasteland.money"
      :expReward="savageWasteland.exp"
      :resourceRewards="savageWasteland.resources"
      :enemyEncounter="savageWasteland.enemyEncounter"
      :playerGold="character.money"
      :availableResources="playerResources"
      :savageWastelandActive="savageWasteland.active"
      :fleeRewards="fleeRewards"
      @close="closeSavageModal" 
      @continue="continueSavage" 
      @claim="claimSavageRewards" 
      @start-battle="startSavageBattle" 
      @flee="fleeSavage"
      @start-survival="startSurvivalRun"
    />
    <EnemyEncounters v-if="showSavageBattle" @battle-ended="onSavageBattleEnded" @flee-battle="showFleeToastFromBattle" />
  </div>
</template>

<script>
import GameHeader from './GameHeader.vue';
import SideBar from './SideBar.vue';
import MapComponent from './data/MapComponent2.vue';
import QuickBar from './data/QuickBar.vue';
import QuickBarLeft from './data/QuickBarLeft.vue';
import QuickBarRight from './data/QuickBarRight.vue';
import GameOver from './data/GameOver.vue';
import LvlPopUp from './data/controller/popup/LvlPopUp.vue';
import SavageWastelandModal from './data/SavageWastelandModal.vue';
import EnemyEncounters from './data/EnemyEncounters.vue';
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
    SavageWastelandModal,
    EnemyEncounters,
  },
  data() {
    return {
      showModal: false,
      windowWidth: window.innerWidth,
      showSavageModal: false,
      showSavageBattle: false,
      fleeRewards: null,
    };
  },
  computed: {
    ...mapState(['character', 'savageWasteland']),
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
    playerResources() {
      // Convert character resources to availableResources format
      const resources = require('@/store/ressources').default;
      return resources.map(res => ({
        id: res.id,
        name: res.name,
        img: res.img,
        playerAmount: this.getResourceAmount(res.id)
      }));
    }
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
    },
    openSavageModal() {
      // Nulstil survival state ALTID før modal åbnes, så stake/startboks vises
      this.$store.dispatch('resetSavage');
      this.showSavageModal = true;
    },
    closeSavageModal() {
      this.showSavageModal = false;
      this.fleeRewards = null;
    },
    continueSavage() {
      this.$store.dispatch('continueSavage');
    },
    claimSavageRewards() {
      console.log('Claiming savage rewards'); // Debug log
      this.$store.dispatch('claimSavageRewards');
      this.closeSavageModal();
    },
    startSavageBattle() {
      // Get random enemy based on character level
      const enemies = require('@/store/enemy').default;
      const levelAppropriateEnemies = enemies.filter(e => {
        const enemyLevel = Math.floor(e.id / 5) + 1; // Rough level calculation
        return enemyLevel <= this.character.level + 2;
      });
      const randomEnemy = levelAppropriateEnemies[Math.floor(Math.random() * levelAppropriateEnemies.length)];
      
      // Set enemy in Vuex state for BattleSystem to use
      this.$store.commit('setCurrentEnemyId', randomEnemy.id);
      this.$store.commit('setEnemyEncounterOpen', true);
      
      this.showSavageBattle = true;
      this.closeSavageModal();
    },
    onSavageBattleEnded(battleResult) {
      this.showSavageBattle = false;
      
      // Clear enemy state
      this.$store.commit('setCurrentEnemyId', null);
      this.$store.commit('setEnemyEncounterOpen', false);
      
      console.log('Savage battle ended:', battleResult); // Debug log
      
      if (battleResult && battleResult.survived) {
        // Player won, clear enemy encounter and continue savage progression
        this.$store.dispatch('savageBattleVictory');
        this.$store.dispatch('continueSavage');
        this.showSavageModal = true;
      } else {
        // Player lost or fled from battle, treat as flee
        // This will give 20% rewards and end savage session
        this.$store.dispatch('fleeSavage');
        this.closeSavageModal();
      }
    },
    fleeSavage() {
      console.log('Fleeing savage session'); // Debug log
      // Udregn rewards FØR reset og send som prop – brug præcis de værdier der vises i UI
      const money = this.savageWasteland.money;
      const exp = this.savageWasteland.exp;
      const resources = (this.savageWasteland.resources || []).map(res => ({ ...res }));
      this.fleeRewards = {
        money: Math.floor(money * 0.2),
        exp: Math.floor(exp * 0.2),
        resources: resources.map(res => ({ ...res, amount: Math.ceil(res.amount * 0.2) }))
      };
      // Vis reward-toast FØR reset/lukning
      this.$refs.savageModal && this.$refs.savageModal.showFleeToast && this.$refs.savageModal.showFleeToast();
      this.$store.dispatch('fleeSavage');
      this.closeSavageModal();
      // Nulstil fleeRewards for at undgå dobbelt-toast
      setTimeout(() => { this.fleeRewards = null; }, 100);
    },
    startSurvivalRun(stakeData) {
      // Kald kun action - penge og ressourcer trækkes nu i Vuex
      this.$store.dispatch('startSavageWithStake', stakeData);
    },
    getResourceAmount(resourceId) {
      // Count how many of this resource the player has
      return this.character.resources.filter(r => r.id === resourceId).length;
    },
    showFleeToastFromBattle() {
      // ALTID brug rewards fra survival-run-boksen (savageWasteland state)
      // Dette sikrer at toasten matcher Survival-systemet og ikke BattleSystem/story
      const money = this.savageWasteland.money;
      const exp = this.savageWasteland.exp;
      const resources = (this.savageWasteland.resources || []).map(res => ({ ...res }));
      this.fleeRewards = {
        money: Math.floor(money * 0.2),
        exp: Math.floor(exp * 0.2),
        resources: resources.map(res => ({ ...res, amount: Math.ceil(res.amount * 0.2) }))
      };
      // Vis reward-toast på modal når man flygter fra kamp
      this.$refs.savageModal && this.$refs.savageModal.showFleeToast && this.$refs.savageModal.showFleeToast();
      // Nulstil fleeRewards for at undgå dobbelt-toast
      setTimeout(() => { this.fleeRewards = null; }, 100);
    },
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
