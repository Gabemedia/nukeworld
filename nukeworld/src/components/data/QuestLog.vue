<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="toggleModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/quests.png`)" title="Quest Log">
  </button>
  <div v-if="showModal" class="modal mt-2" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Quest Log</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <QuestTabs />
        </div>
        <div class="modal-footer">
          <div class="reset-quests" @click="confirmResetQuests">
            <span>Reset Quests</span>
            <img class="icon-reload" :src="require(`@/assets/interface/icons/reload.png`)" title="Reset Quests (Cost: 2500)">
          </div>
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import QuestTabs from './controller/QuestTabs.vue';
import { toast } from 'vue3-toastify';

export default {
  components: {
    QuestTabs,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    ...mapActions(['resetQuests', 'decreaseMoney']),
    toggleModal() {
      this.showModal = !this.showModal;
    },
    closeModal() {
      this.showModal = false;
    },
    async confirmResetQuests() {
      if (confirm('Are you sure you want to reset the quests? This will cost 2500 money.')) {
        if (this.$store.state.character.money >= 2500) {
          await this.decreaseMoney(2500);
          await this.resetQuests();
          toast.success('Quests have been reset successfully.', {
            autoClose: 3000,
          });
        } else {
          toast.warning('You don\'t have enough money to reset the quests. Cost: 2500', {
            autoClose: 3000,
          });
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
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
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 800px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
}

.modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 1rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  color: #fff;
}

.modal-footer {
  border-top: 1px solid #00ff00;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00ff00;
    color: #000;
  }
}

.reset-quests {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #00ff00;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
  }
}

.icon-reload {
  width: 18px;
  margin-left: 5px;
  transition: opacity 0.3s ease;
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%);

  &:hover {
    opacity: 0.8;
  }
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem auto;
  }
}
</style>
