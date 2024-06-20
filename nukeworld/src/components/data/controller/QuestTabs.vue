<template>
  <div>
    <ul class="nav nav-tabs mx-2" id="questTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="availableQuests-tab" data-bs-toggle="tab" data-bs-target="#availableQuests" type="button" role="tab" aria-controls="availableQuests" aria-selected="true">Available Quests</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="highLevelQuests-tab" data-bs-toggle="tab" data-bs-target="#highLevelQuests" type="button" role="tab" aria-controls="highLevelQuests" aria-selected="false">Active Quests</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="readyQuests-tab" data-bs-toggle="tab" data-bs-target="#readyQuests" type="button" role="tab" aria-controls="readyQuests" aria-selected="false">Ready to Claim</button>
      </li>
    </ul>
    <div class="tab-content m-2" id="questTabsContent">
      <div class="tab-pane fade show active" id="availableQuests" role="tabpanel" aria-labelledby="availableQuests-tab">
        <quest-list :quests="availableQuests"></quest-list>
      </div>
      <div class="tab-pane fade" id="highLevelQuests" role="tabpanel" aria-labelledby="highLevelQuests-tab">
        <quest-list :quests="highLevelQuests"></quest-list>
      </div>
      <div class="tab-pane fade" id="readyQuests" role="tabpanel" aria-labelledby="readyQuests-tab">
        <quest-list :quests="claimQuests"></quest-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QuestList from './QuestList.vue';

export default {
  components: {
    QuestList,
  },
  computed: {
    ...mapState(['quests', 'character']),
    availableQuests() {
      return this.quests.filter(quest => quest.state === 'not-started' && this.character.level >= quest.levelRequirement);
    },
    highLevelQuests() {
      return this.quests.filter(quest => quest.state === 'in-progress');
    },
    claimQuests() {
      return this.quests.filter(quest => quest.state === 'ready-to-claim');
    },
  },
};
</script>

<style scoped>
/* Tilføj eventuelle nødvendige stilarter her */
</style>
