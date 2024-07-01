<template>
  <div v-if="$store.state.isEnemyEncounterOpen" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <BattleSystem 
            @battle-ended="closeModal" 
            @battle-cancelled="closeModal" 
            @show-reward-toast="showRewardToast" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BattleSystem from './controller/BattleSystem.vue';
import { toast } from "vue3-toastify";

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
    showRewardToast(storyLineName, rewards) {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
        <p class="text-left fw-bold mb-1">${storyLineName} completed!</p>
        <p class="text-left fw-semi mb-2">You earned:</p>
        <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;

      rewards.forEach(reward => {
        switch (reward.type) {
          case 'exp':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
                <span>${reward.amount} exp</span>
              </div>
            `;
            break;
          case 'money':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>${reward.amount} money</span>
              </div>
            `;
            break;
          case 'resource':
            if (reward.item && reward.item.name) {
              rewardMessage += `
                <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                  <img src="${require(`@/assets/interface/icons/resources/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                  <span>${reward.amount} x ${reward.item.name}</span>
                </div>
              `;
            }
            break;
          case 'weapon':
            if (reward.item && reward.item.name) {
              rewardMessage += `
                <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                  <img src="${require(`@/assets/interface/icons/weapons/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                  <span>${reward.item.name}</span>
                </div>
              `;
            }
            break;
          case 'armor':
            if (reward.item && reward.item.name) {
              rewardMessage += `
                <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                  <img src="${require(`@/assets/interface/icons/armor/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                  <span>${reward.item.name}</span>
                </div>
              `;
            }
            break;
          case 'aid':
            if (reward.item && reward.item.name) {
              rewardMessage += `
                <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                  <img src="${require(`@/assets/interface/icons/aid/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                  <span>${reward.item.name}</span>
                </div>
              `;
            }
            break;
        }
      });

      rewardMessage += '</div></div>';

      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 10000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast',
      });
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
