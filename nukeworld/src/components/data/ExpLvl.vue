<template>
  <div class="d-flex flex-column align-items-center justify-content-start m-0 p-0 w-100">
    <LvlPopUp ref="lvlPopUp" title="Congratulations!" desc="You've reached the maximum experience level." @popup-closed="onPopupClosed" />    
    <div class="row m-0 p-0 justify-content-center w-100">
      <div class="col-12 m-0 p-0 ">
        <div class="progress w-100 m-0 p-0 ">
          <div class="progress-bar" role="progressbar" :style="{ width: `${(character.exp / character.maxExp) * 100}%` }" :aria-valuenow="character.exp" aria-valuemin="0" :aria-valuemax="character.maxExp">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LvlPopUp from './controller/popup/LvlPopUp.vue';

export default {
  name: 'ExpLvl',
  components: {
    LvlPopUp,
  },
  computed: {
    ...mapState(['character'])
  },
  data() {
    return {
      isPopupOpen: false,
      levelingUp: false, // add this flag
    };
  },
  methods: {
    ...mapActions(['increaseExp', 'decreaseExp', 'levelUp', 'increaseMoney', 'decreaseMoney']),
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
}
</script>

<style scoped>
.progress {
  height: 10px;
  background-color: #f3f3f3;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
}
.progress-bar {
  height: 10px;
  background: linear-gradient(to right, #26db15, #11b403);
  border-radius: 3px;
  transition: width .4s ease-in-out;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  color:#000;
}
</style>