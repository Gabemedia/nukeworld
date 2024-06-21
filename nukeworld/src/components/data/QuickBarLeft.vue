<template>
  <div class="quick-bar-left  text-white">
    <div class="d-flex justify-content-start text-white mb-2">
      <img style="width:20px;" :src="require(`@/assets/interface/icons/aid/medkit.png`)" title="Health" class="me-1">
      <span class="mobile-text fw-bold fs-6">Health:</span>
    </div>
    <div class="health-bar">
      <div class="health-bar-fill" :style="{ width: healthPercentage + '%' }"></div>
      <div class="health-bar-text">{{ character.health }} / {{ character.maxHealth }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'QuickBarLeft',
  computed: {
    ...mapState(['character']),
    healthPercentage() {
      return (this.character.health / this.character.maxHealth) * 100;
    },
  },
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
