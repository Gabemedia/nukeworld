<template>
  <div class="quest-tabs">
    <div class="tab-buttons">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <quest-list :quests="activeQuests"></quest-list>
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
      activeTab: 'available',
      tabs: [
        { id: 'available', label: 'Available' },
        { id: 'active', label: 'Active' },
        { id: 'ready', label: 'Ready' },
      ],
    };
  },
  computed: {
    ...mapState(['quests', 'character']),
    filteredQuests() {
      return this.quests.filter(quest => 
        quest.levelRequirement <= this.character.level &&
        quest.levelRequirement > Math.max(1, this.character.level - 3)
      );
    },
    activeQuests() {
      switch (this.activeTab) {
        case 'available':
          return this.filteredQuests.filter(quest => quest.state === 'not-started');
        case 'active':
          return this.filteredQuests.filter(quest => quest.state === 'in-progress');
        case 'ready':
          return this.filteredQuests.filter(quest => quest.state === 'ready-to-claim');
        default:
          return [];
      }
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
.quest-tabs {
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.tab-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.tab-button {
  background-color: rgba(0, 0, 0, 0.6);
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex-grow: 1;
  margin: 0 5px;
}

.tab-button:hover {
  background-color: rgba(0, 255, 0, 0.2);
}

.tab-button.active {
  background-color: #00ff00;
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 10px #00ff00;
}

.tab-content {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 10px;
}

@media screen and (max-width: 768px) {
  .quest-tabs {
    padding: 10px;
  }

  .tab-button {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
}
</style>
