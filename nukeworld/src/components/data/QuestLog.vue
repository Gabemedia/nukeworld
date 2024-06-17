<template>
  <button class="btn btn-main btn-primary m-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasQuestsInfo">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/quests.png`)" title="Quest Log">
  </button>
  <div style="width:500px;" class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasQuestsInfo" aria-labelledby="offcanvasQuestsLabel">
    <div class="offcanvas-header card-text-header text-light bg-primary bg-gradient d-flex justify-content-between align-items-center">
    <h5 class="flex-grow-1">Quest Log</h5>
    <div class="d-flex align-items-center">
      <img class="icon-reload" @click="confirmResetQuests" :src="require(`@/assets/interface/icons/reload.png`)" title="Reset Quests (Cost: 2500)">
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
  </div>
    <div class="offcanvas-body">
      <QuestList />
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
  methods: {
    ...mapActions(['resetQuests', 'decreaseMoney']),
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
  font-size: 1rem;
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
</style>
