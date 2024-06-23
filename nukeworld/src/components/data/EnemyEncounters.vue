<template>
  <div v-if="$store.state.isEnemyEncounterOpen" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <BattleSystem @battle-ended="closeModal" @battle-cancelled="closeModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BattleSystem from './controller/BattleSystem.vue';

export default {
  name: 'EnemyEncounters',
  components: {
    BattleSystem,
  },
  data() {
    return {
      showModal: false,
    };
  },
  watch: {
    '$store.state.isEnemyEncounterOpen'(newValue) {
      if (newValue) {
        this.openModal();
      }
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.$store.dispatch('closeEnemyEncounter');
      this.$store.commit('setCurrentEnemyId', null);
    },
    claimRewards() {
      if (this.isBattleWon && this.currentEnemy) {
        this.$store.dispatch('claimRewards', this.currentEnemy);
        this.$store.dispatch('defeatEnemy');
        this.showRewardConfetti();
        this.resetBattleState();
        this.$emit('battle-ended');
      }
    },
  },
};
</script>
  
<style scoped>

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 100%;
    margin: 1.75rem auto;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 300px;
  overflow-y: scroll;
  color: #fff;
}

.modal-content {
  position: relative;
  background-clip: padding-box;
  border: 1px #fff solid;
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.card-text-header {
  font-weight: 600;
  font-size: 1rem;
}
</style>
