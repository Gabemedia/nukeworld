<template>
  <div class="d-flex flex-column align-items-center justify-content-start m-0 p-0">
    <LvlPopUp ref="lvlPopUp" title="Congratulations!" @popup-closed="onPopupClosed" />    
    <div class="row m-0 p-0 justify-content-center w-100">
      <div class="col-12 m-0 p-0 ">
        <div class="progress">
          <div class="progress-bar" role="progressbar" :style="{ width: `${(character.exp / character.maxExp) * 100}%` }" :aria-valuenow="character.exp" aria-valuemin="0" :aria-valuemax="character.maxExp"></div>
          <p class="text-center">{{ character.exp }} / {{ character.maxExp }}</p>
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
      levelingUp: false,
    };
  },
  methods: {
    ...mapActions(['increaseExp', 'decreaseExp', 'levelUp', 'increaseMoney', 'decreaseMoney']),
    onPopupClosed() {
      this.isPopupOpen = false;
      this.levelingUp = false;
    },
  },
  watch: {
    'character.level': function(newLevel, oldLevel) {
      if (newLevel > oldLevel && !this.isPopupOpen && !this.levelingUp) {
        this.isPopupOpen = true;
        this.$refs.lvlPopUp.openPopup();
      }
    },
  },
  mounted() {
    this.$store.commit('setLvlPopupRef', this.$refs.lvlPopUp);
  }
}
</script>

<style scoped>
.progress {
  height: 10px;
  background-color: #f3f3f3;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);
  position: relative;
  height: 13px;

}
.progress-bar {
  height: 10px;
  background: linear-gradient(to right, #26db15, #11b403);
  border-radius: 3px;
  transition: width .4s ease-in-out;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.655rem;
  color:#000;
  height: 13px;

}
.text-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.655rem;
  font-weight: bold;
}

</style>