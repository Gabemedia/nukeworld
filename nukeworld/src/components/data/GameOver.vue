<template>
  <div v-if="isGameOver" class="game-over-modal">
    <div class="game-over-content">
      <h2>Game Over</h2>
      <p>Your character has been defeated.</p>
      <button @click="restartGame" class="btn btn-primary">Restart</button>
      <button @click="quitGame" class="btn btn-secondary">Quit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameOver',
  props: {
    isGameOver: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    restartGame() {
      this.$store.dispatch('resetCharacter');
      this.$emit('close');
    },
    quitGame() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.game-over-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>
