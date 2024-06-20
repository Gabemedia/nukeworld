<template>
  <div>
    <ul class="nav-tabs mx-2 quick-bar" id="questTabs" role="tablist">
      <li class="nav-item quick-bar-slot" role="presentation">
        <button
          :class="{'active quick-bar-key': activeTab === 'availableQuests', 'quick-bar-key': activeTab !== 'availableQuests'}"
          id="availableQuests-tab"
          data-bs-toggle="tab"
          data-bs-target="#availableQuests"
          type="button"
          role="tab"
          aria-controls="availableQuests"
          aria-selected="true"
          @click="setActiveTab('availableQuests')"
        >
          Available Quests
        </button>
      </li>
      <li class="nav-item quick-bar-slot" role="presentation">
        <button
          :class="{'active quick-bar-key': activeTab === 'highLevelQuests', 'quick-bar-key': activeTab !== 'highLevelQuests'}"
          id="highLevelQuests-tab"
          data-bs-toggle="tab"
          data-bs-target="#highLevelQuests"
          type="button"
          role="tab"
          aria-controls="highLevelQuests"
          aria-selected="false"
          @click="setActiveTab('highLevelQuests')"
        >
          Active Quests
        </button>
      </li>
      <li class="nav-item quick-bar-slot" role="presentation">
        <button
          :class="{'active quick-bar-key': activeTab === 'readyQuests', 'quick-bar-key': activeTab !== 'readyQuests'}"
          id="readyQuests-tab"
          data-bs-toggle="tab"
          data-bs-target="#readyQuests"
          type="button"
          role="tab"
          aria-controls="readyQuests"
          aria-selected="false"
          @click="setActiveTab('readyQuests')"
        >
          Ready to Claim
        </button>
      </li>
    </ul>
    <div class="tab-content m-2" id="questTabsContent">
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'availableQuests' }" id="availableQuests" role="tabpanel" aria-labelledby="availableQuests-tab">
        <quest-list :quests="availableQuests"></quest-list>
      </div>
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'highLevelQuests' }" id="highLevelQuests" role="tabpanel" aria-labelledby="highLevelQuests-tab">
        <quest-list :quests="highLevelQuests"></quest-list>
      </div>
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'readyQuests' }" id="readyQuests" role="tabpanel" aria-labelledby="readyQuests-tab">
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
  data() {
    return {
      activeTab: 'availableQuests',
    };
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
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped>
.quick-bar {
  display: flex;
  justify-content: center;
  padding: 0px 15px 15px 15px;
  border-radius: 5px;
  z-index: 9999;
}

.quick-bar-slot {
  margin: 0 5px;
  border-radius: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quick-bar-slot:hover {
  margin: 0 5px;
  border: 2px solid #9e2020;
  border-radius: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quick-bar-key {
    background-color: #000;
    color: #fff;
    padding: 3px 6px;
    border-radius: 6px;
    font-size: 0.7rem;
    color: #fff;
    font-weight: 700;
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    border: 1px #fff solid;
}

.quick-bar-key.active {
  background-color: #fff !important;
  color: #000 !important;
}

.tab-content {
  border-radius: 5px;
  border: 1px solid #000;
}
</style>
