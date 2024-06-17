<!-- src/components/HealthBar.vue -->
<template>
  <div class="health-bar">
    <div class="progress">
      <div class="progress-bar" role="progressbar" :style="{ width: healthPercentage + '%' }" :aria-valuenow="character.health" aria-valuemin="0" aria-valuemax="100">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'HealthBar',
  computed: {
    ...mapState(['character']),
    healthPercentage() {
      return (this.character.health / this.character.maxHealth) * 100; // Ændre denne linje
    },
  },
};
</script>

<style scoped>
.health-bar {
  display: flex;
  align-items: center;
}

.progress {
  width: 50vw;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin-left: 5px;
}

.progress-bar {
  background-color: #ff0000;
  color: white;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  transition: width 0.6s ease;
}
.text-center {
  position: absolute;
  top: 4.8%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.655rem;
  z-index: 99999;
  font-weight: bold;
  color: #000000;
}
</style>
