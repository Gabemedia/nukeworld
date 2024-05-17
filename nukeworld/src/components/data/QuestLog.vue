<template>
  <button class="btn btn-primary m-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasQuestsInfo">
    Quest Log
  </button>
  <div style="width:30vw;" class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasQuestsInfo" aria-labelledby="offcanvasQuestsLabel">
    <div class="offcanvas-header card-text-header text-light bg-primary bg-gradient d-flex justify-content-between align-items-center">
      <h5 class="flex-grow-1">Quest Log</h5>
      <div class="d-flex align-items-center">
        <img class="icon-reload" @click="clearQuests" :src="require(`@/assets/interface/icons/reload.png`)" alt="Reload Quests">
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
import QuestList from './QuestList.vue';

export default {
  components: {
    QuestList,
  },
  methods: {
    ...mapActions(['clearQuests']),
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
