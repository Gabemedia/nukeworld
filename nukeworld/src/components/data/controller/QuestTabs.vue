<template>
  <div class="quest-tabs">
    <div class="quest-tabs-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        <img :src="getTabIcon(tab.id)" :alt="tab.label">
        {{ tab.label }}
        <span class="quest-count">{{ getQuestCount(tab.id) }}</span>
      </button>
    </div>
    
    <div class="quest-content">
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
        quest.levelRequirement > Math.max(0, this.character.level - 3)
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
    getTabIcon(tabId) {
      const iconMap = {
        'available': require('@/assets/interface/icons/quests.png'),
        'active': require('@/assets/interface/icons/in-progress-quest.png'),
        'ready': require('@/assets/interface/icons/claim-quest.png')
      };
      return iconMap[tabId] || require('@/assets/interface/icons/quests.png');
    },
    getQuestCount(tabId) {
      switch (tabId) {
        case 'available':
          return this.filteredQuests.filter(quest => quest.state === 'not-started').length;
        case 'active':
          return this.filteredQuests.filter(quest => quest.state === 'in-progress').length;
        case 'ready':
          return this.filteredQuests.filter(quest => quest.state === 'ready-to-claim').length;
        default:
          return 0;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.quest-tabs {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  padding: 15px;
  color: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.quest-tabs-navigation {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.tab-button {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #888;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #222;
    color: #fff;
    transform: translateY(-1px);
  }

  &.active {
    background: #333;
    color: #00ff00;
    border-color: #00ff00;
    box-shadow: 0 2px 8px rgba(0, 255, 0, 0.2);
  }

  .quest-count {
    display: inline-block;
    background: #333;
    color: #fff;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    margin-left: auto;
    min-width: 20px;
    text-align: center;
  }
}

.quest-content {
  flex: 1;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 6px;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
    
    &:hover {
      background: #444;
    }
  }
}

@media (max-width: 768px) {
  .quest-tabs {
    padding: 10px;
  }

  .quest-tabs-navigation {
    overflow-x: auto;
    padding-bottom: 5px;
    margin-bottom: 10px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 1.5px;
    }
  }

  .tab-button {
    padding: 6px 12px;
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .quest-tabs {
    padding: 8px;
  }

  .tab-button {
    padding: 4px 8px;
    font-size: 11px;
  }

  .quest-count {
    font-size: 10px;
    padding: 1px 4px;
  }
}
</style>
