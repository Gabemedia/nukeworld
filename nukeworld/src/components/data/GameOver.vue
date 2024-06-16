<template>
  <div v-if="showModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="game-over-content">
            <h2>Game Over</h2>
            <p>Your character has been defeated.</p>
            <button @click="restartGame" class="btn btn-primary">Restart</button>
            <button @click="quitGame" class="btn btn-secondary">Quit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameOver',
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    restartGame() {
      this.$store.dispatch('resetCharacter');
      this.$emit('close');
    },
    async quitGame() {
      await this.$store.dispatch('quitGame');
      this.$router.push('/');
    },
  },
};
</script>
<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.game-over-content {
  text-align: center;
}
</style>
