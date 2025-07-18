<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/quests.png`)" title="Quest Log">
  </button>
  
  <div v-if="showModal" class="shop-modal" tabindex="-1" @click.self="closeModal">
    <div class="shop-dialog">
      <div class="shop-content">
        <div class="shop-header">
          <div class="shop-title-wrapper">
            <img class="shop-logo" :src="require(`@/assets/interface/icons/quests.png`)" alt="Quest Log Icon">
            <h5 class="shop-title">Quest Log</h5>
          </div>
          <div class="player-money">
            <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
            <span>{{ $store.state.character.money }}</span>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
        </div>
        
        <div class="modal-body">
          <QuestTabs />
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
    openModal() {
      this.showModal = true;
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
.shop-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shop-dialog {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.shop-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.shop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding: 15px 15px 10px 15px;
}

.shop-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-logo {
  width: 24px;
  height: 24px;
}

.shop-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.player-money {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 0, 0.1);
  border: 1px solid #ffff00;
  border-radius: 4px;
  color: #ffff00;
  font-size: 14px;

  img {
    width: 16px;
    height: 16px;
  }
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  
  &:hover {
    color: #ff0000;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 0 15px;
  height: calc(90vh - 150px);
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border-top: 2px solid #2a2a2a;
  margin-top: 15px;
}

.reset-quests {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #00ff00;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #00ff00;
  border-radius: 4px;
  background: rgba(0, 255, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 255, 0, 0.2);
  }

  .icon-reload {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 768px) {
  .shop-dialog {
    padding: 10px;
    max-height: 100vh;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .modal-body {
    height: calc(100vh - 150px);
  }

  .shop-header {
    padding: 10px 10px 8px 10px;
  }

  .modal-body {
    padding: 0 10px;
  }

  .modal-footer {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .shop-header {
    padding: 8px 8px 6px 8px;
  }

  .modal-body {
    padding: 0 8px;
  }

  .modal-footer {
    padding: 8px;
  }

  .reset-quests {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>

