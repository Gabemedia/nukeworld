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
import { mapState, mapGetters } from 'vuex';
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
    ...mapGetters(['experienceMultiplier', 'moneyMultiplier']),
    filteredQuests() {
      return this.quests.filter(quest => 
        quest.levelRequirement <= this.character.level &&
        quest.levelRequirement > Math.max(0, this.character.level - 3)
      );
    },
    activeQuests() {
      let quests = [];
      switch (this.activeTab) {
        case 'available':
          quests = this.filteredQuests.filter(quest => quest.state === 'not-started');
          break;
        case 'active':
          quests = this.filteredQuests.filter(quest => quest.state === 'in-progress');
          break;
        case 'ready':
          quests = this.filteredQuests.filter(quest => quest.state === 'ready-to-claim');
          break;
        default:
          quests = [];
      }
      
      // Add SPECIAL bonus calculations to each quest for display
      return quests.map(quest => ({
        ...quest,
        displayExpReward: this.getDisplayExpReward(quest),
        displayMoneyReward: this.getDisplayMoneyReward(quest),
        displayWeaponChance: this.getDisplayWeaponChance(quest),
        displayArmorChance: this.getDisplayArmorChance(quest),
        displayResourceChance: this.getDisplayResourceChance(quest),
        hasExpBonus: this.getDisplayExpReward(quest) > quest.exp,
        hasMoneyBonus: this.getDisplayMoneyReward(quest) > quest.money,
        hasWeaponBonus: this.getDisplayWeaponChance(quest).includes('+'),
        hasArmorBonus: this.getDisplayArmorChance(quest).includes('+'),
        hasResourceBonus: this.getDisplayResourceChance(quest).includes('+')
      }));
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
    getDisplayExpReward(quest) {
      if (quest.state === 'completed' && quest.actualExpGained) {
        return quest.actualExpGained;
      }
      if (quest.state === 'not-started' || quest.state === 'in-progress' || quest.state === 'ready-to-claim') {
        const baseExp = quest.exp || 0;
        const adjustedExp = Math.floor(baseExp * (this.experienceMultiplier || 1));
        
        if (adjustedExp !== baseExp) {
          const bonus = adjustedExp - baseExp;
          return `${baseExp} <span class="bonus-indicator">(+${bonus})</span>`;
        }
        return `${baseExp}`;
      }
      return quest.exp || 0;
    },
    getDisplayMoneyReward(quest) {
      if (quest.state === 'completed' && quest.actualMoneyGained) {
        return quest.actualMoneyGained;
      }
      if (quest.state === 'not-started' || quest.state === 'in-progress' || quest.state === 'ready-to-claim') {
        const baseMoney = quest.money || 0;
        const adjustedMoney = Math.floor(baseMoney * (this.moneyMultiplier || 1));
        
        if (adjustedMoney !== baseMoney) {
          const bonus = adjustedMoney - baseMoney;
          return `${baseMoney} <span class="bonus-indicator">(+${bonus})</span>`;
        }
        return `${baseMoney}`;
      }
      return quest.money || 0;
    },
    getDisplayWeaponChance(quest) {
      const baseChance = quest.rewardChance || 0;
      const basePercentage = (baseChance * 100).toFixed(0);
      
      // Check if player has Luck bonus that affects weapon drops
      const luckBonus = this.character.special?.luck || 0;
      const luckMultiplier = 1 + (luckBonus * 0.02); // 2% per Luck point
      const adjustedChance = baseChance * luckMultiplier;
      const adjustedPercentage = (adjustedChance * 100).toFixed(0);
      
      if (adjustedPercentage !== basePercentage) {
        const bonus = Math.round((adjustedChance - baseChance) * 100);
        return `${adjustedPercentage}% <span class="bonus-indicator">(+${bonus})</span>`;
      }
      return `${basePercentage}%`;
    },
    getDisplayArmorChance(quest) {
      const baseChance = quest.armorRewardChance || 0;
      const basePercentage = (baseChance * 100).toFixed(0);
      
      // Check if player has Luck bonus that affects armor drops
      const luckBonus = this.character.special?.luck || 0;
      const luckMultiplier = 1 + (luckBonus * 0.015); // 1.5% per Luck point for armor
      const adjustedChance = baseChance * luckMultiplier;
      const adjustedPercentage = (adjustedChance * 100).toFixed(0);
      
      if (adjustedPercentage !== basePercentage) {
        const bonus = Math.round((adjustedChance - baseChance) * 100);
        return `${adjustedPercentage}% <span class="bonus-indicator">(+${bonus})</span>`;
      }
      return `${basePercentage}%`;
    },
    getDisplayResourceChance(quest) {
      const baseChance = (quest.rewardChance || 0) + (quest.armorRewardChance || 0);
      const basePercentage = (baseChance * 100).toFixed(0);
      
      // Check if player has Luck bonus that affects resource drops
      const luckBonus = this.character.special?.luck || 0;
      const luckMultiplier = 1 + (luckBonus * 0.025); // 2.5% per Luck point for resources
      const adjustedChance = baseChance * luckMultiplier;
      const adjustedPercentage = (adjustedChance * 100).toFixed(0);
      
      if (adjustedPercentage !== basePercentage) {
        const bonus = Math.round((adjustedChance - baseChance) * 100);
        return `${adjustedPercentage}% <span class="bonus-indicator">(+${bonus})</span>`;
      }
      return `${basePercentage}%`;
    }
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

.bonus-indicator {
  font-size: 0.7rem;
  color: #00ff00;
  margin-left: 5px;
  font-weight: bold;
}
</style>
