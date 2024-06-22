<template>
  <LvlPopUp ref="lvlPopUp" title="Congratulations!" @popup-closed="onPopupClosed" />    
  <div class="quick-bar-left  text-white">
    <div class="d-flex justify-content-start text-white mb-2">
      <img style="width:20px;" :src="require(`@/assets/interface/icons/aid/medkit.png`)" title="Health" class="me-1">
      <span class="mobile-text fw-bold fs-6">Health:</span>
    </div>
    <div class="health-bar">
      <div class="health-bar-fill" :style="{ width: healthPercentage + '%' }"></div>
      <div class="health-bar-text">{{ character.health }} / {{ character.maxHealth }}</div>
    </div>
    <div class="d-flex justify-content-start text-white mb-2">
      <img style="width:20px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Experence" class="me-1">
      <span class="mobile-text fw-bold fs-6">Experence:</span>
    </div>
    <div class="exp-bar">
      <div class="exp-bar-fill" :style="{ width: expPercentage + '%' }"></div>
      <div class="exp-bar-text">{{ character.exp }} / {{ character.maxExp }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LvlPopUp from './controller/popup/LvlPopUp.vue';


export default {
  name: 'QuickBarLeft',  
  components: {
    LvlPopUp,
  },
  computed: {
    ...mapState(['character']),
    healthPercentage() {
      return (this.character.health / this.character.maxHealth) * 100;
    },
    expPercentage() {
      return (this.character.exp / this.character.maxExp) * 100;
    },
  },
  data() {
    return {
      isPopupOpen: false,
      levelingUp: false, // add this flag
    };
  },
  methods: {
    ...mapActions(['increaseExp', 'decreaseExp', 'levelUp']),
    onPopupClosed() {
      this.isPopupOpen = false;
      this.levelingUp = false; // set the flag to false when the popup is closed
    },
  },
  watch: {
    'character.level': function(newLevel, oldLevel) {
      if (newLevel > oldLevel && !this.isPopupOpen && !this.levelingUp) { // check the flag here
        this.isPopupOpen = true;
        this.$refs.lvlPopUp.openPopup();
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.quick-bar-left {
position: absolute;
  bottom: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 5px;
  z-index: 9999;
}

.health-bar {
  width: 200px;
  height: 20px;
  background-color: #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.health-bar-text {
  position: absolute;
  top: 67%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.exp-bar {
  width: 200px;
  height: 20px;
  background-color: #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.exp-bar-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.exp-bar-text {
  position: absolute;
  top: 67%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

@media screen and (max-width: 600px) {
  .quick-bar-left {
    bottom: 10px;
    left: 10px;
  }

  .health-bar {
    width: 150px;
    height: 15px;
  }

  .health-bar-text {
    font-size: 10px;
  }
}
</style>
