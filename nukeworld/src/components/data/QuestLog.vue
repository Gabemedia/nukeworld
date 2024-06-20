<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/quests.png`)" title="Quest Log">
  </button>
  <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <QuestList />
        </div>
        <div class="modal-footer card-text-header text-light bg-danger bg-gradient d-flex justify-content-between align-items-center" @click="confirmResetQuests" :src="require(`@/assets/interface/icons/reload.png`)" title="Reset Quests (Cost: 2500)">
          Reset Quests
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import QuestList from './controller/QuestList.vue';
import { toast } from 'vue3-toastify';

export default {
  components: {
    QuestList,
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

<style scoped>
.card-text-header {
  font-weight: 600;
  font-size: 0.777rem;
}

.icon-reload {
  width: 18px;
  transition: opacity 0.3 ease;
  cursor: pointer;
  filter:opacity(0.5);
}

.icon-reload:hover {
  filter:opacity(0.8);
}
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


@media (max-width: 576px) {
  .modal-dialog {
    width: 100vw;
    margin: 1.75rem auto;
  }
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 75vw;
    width: 90%;
    margin: 1.75rem auto;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 300px;
  overflow-y: scroll;
}
.modal-content {
  position: relative;
  background-clip: padding-box;
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

</style>
