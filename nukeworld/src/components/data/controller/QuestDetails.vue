<template>
  <div class="quest-details" v-if="localQuest">
    <div class="quest-header" :style="{
      backgroundImage: `url(${require(`@/assets/quests/bg/${localQuest.img}.jpg`)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    }">
      <h2 class="quest-title">{{ localQuest.name }}</h2>
    </div>
    <div class="quest-content">
      <p class="quest-description">{{ localQuest.desc }}</p>
      <div class="quest-info">
        <div class="quest-rewards">
          <div class="reward">
            <img :src="require(`@/assets/interface/icons/exp.png`)" title="Experience with SPECIAL bonus">
            <span v-html="getDisplayExpReward(localQuest)"></span>
          </div>
          <div class="reward">
            <img :src="require(`@/assets/interface/icons/money.png`)" title="Money with SPECIAL bonus">
            <span v-html="getDisplayMoneyReward(localQuest)"></span>
          </div>
          <div v-if="hasWeaponReward(localQuest)" class="reward">
            <img :src="require('@/assets/interface/icons/gun.png')" :title="'Weapon Reward Chance: ' + (localQuest.rewardChance * 100) + '%'">
            <span v-html="getDisplayWeaponChance(localQuest)"></span>
          </div>
          <div v-if="hasArmorReward(localQuest)" class="reward">
            <img :src="require('@/assets/interface/icons/shield.png')" :title="'Armor Reward Chance: ' + (localQuest.armorRewardChance * 100) + '%'">
            <span v-html="getDisplayArmorChance(localQuest)"></span>
          </div>
          <div class="reward">
            <img :src="require('@/assets/interface/icons/resources/wood_scrap.png')" title="Random Resource">
            <span v-html="getDisplayResourceChance(localQuest)"></span>
          </div>
        </div>
        <div class="quest-duration">
          <span>Duration: {{ getQuestDuration(localQuest) }}</span>
        </div>
      </div>
      <div v-if="localQuest.state === 'in-progress'" class="quest-progress">
        <div class="progress-bar" :style="{ width: localQuest.progress + '%' }"></div>
        <span class="progress-text">{{ formatTime(localQuest.remainingTime) }}</span>
      </div>
      <div class="quest-action">
        <button 
            class="btn btn-action" 
            :disabled="isButtonDisabled(localQuest)" 
            @click="handleQuestAction(localQuest)"
          >
            {{ getButtonText(localQuest) }}
          </button>
      </div>
      <div v-if="character.level < localQuest.levelRequirement" class="quest-level-requirement">
        Level {{ localQuest.levelRequirement }} required to start this quest.
      </div>
    </div>
  </div>
  <div v-else class="no-quest">
    No quest selected.
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { toast } from "vue3-toastify";
import confetti from 'canvas-confetti';

export default {
  props: {
    quest: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localQuest: null,
    };
  },
  computed: {
    ...mapState(['character']),
    ...mapGetters(['experienceMultiplier', 'moneyMultiplier']),
  },
  watch: {
    quest: {
      immediate: true,
      handler(newQuest) {
        this.localQuest = { ...newQuest };
      },
    },
  },
  methods: {
    ...mapActions(['handleQuest', 'claimRewards']),
    isButtonDisabled(quest) {
      if (quest.state === 'not-started') {
        return this.character.level < quest.levelRequirement;
      } else if (quest.state === 'in-progress') {
        return true;
      } else if (quest.state === 'ready-to-claim') {
        return quest.claimed;
      } else if (quest.state === 'completed') {
        return true;
      }
    },
    hasWeaponReward(quest) {
      return quest.reward && quest.reward.length > 0;
    },
    hasArmorReward(quest) {
      return quest.armorReward && quest.armorReward.length > 0;
    },
    getTotalRewardChance(quest) {
      const totalChance = (quest.rewardChance || 0) + (quest.armorRewardChance || 0);
      return (totalChance * 100).toFixed(0);
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
    },
    async handleQuestAction(quest) {
      if (quest.state === 'not-started') {
        await this.handleQuest(quest);
        this.localQuest = { ...quest, state: 'in-progress' };
        toast.success(`<strong>${quest.name} started!</strong>`, {
          autoClose: 5000,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body',
          dangerouslyHTMLString: true,
        });
      } else if (quest.state === 'ready-to-claim' && !quest.claimed) {
        await this.claimRewardsAction(quest);
      }
      this.$emit('quest-updated', this.localQuest);
    },
    async claimRewardsAction(quest) {
      const { obtainedReward, obtainedArmorReward, obtainedResource, actualExpGained, actualMoneyGained } = await this.claimRewards(quest);
      this.localQuest = { ...quest, state: 'completed', claimed: true };
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
      
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
        <p class="text-left fw-bold  mb-1">${quest.name} completed!</p>
        <p class="text-left fw-semi mb-2">You earned:</p>
        <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
            <span>${actualExpGained} exp${actualExpGained !== quest.exp ? ` ` : ''}</span>
          </div>
          <div class="d-flex align-items-start justify-content-start reward-info mb-1">
            <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
            <span>${actualMoneyGained} money${actualMoneyGained !== quest.money ? ` ` : ''}</span>
          </div>
        `;
      
      if (obtainedReward) {
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-1">
            <img src="${require(`@/assets/interface/icons/weapons/${obtainedReward.img}`)}" title="${obtainedReward.name}" style="width: 20px;" class="me-2">
            <span>${obtainedReward.name}</span>
          </div>
        `;
      }
      
      if (obtainedArmorReward) {
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-1">
            <img src="${require(`@/assets/interface/icons/armor/${obtainedArmorReward.img}`)}" title="${obtainedArmorReward.name}" style="width: 20px;" class="me-2">
            <span>${obtainedArmorReward.name}</span>
          </div>
        `;
      }
      
      if (obtainedResource) {
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-1">
            <img src="${require(`@/assets/interface/icons/resources/${obtainedResource.img}`)}" title="${obtainedResource.name}" style="width: 20px;" class="me-2">
            <span>${obtainedResource.name}</span>
          </div>
        `;
      }
      
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
    getButtonText(quest) {
      if (quest.state === 'not-started') {
        return 'Start Quest';
      } else if (quest.state === 'in-progress') {
        return 'In Progress';
      } else if (quest.state === 'ready-to-claim' && !quest.claimed) {
        return 'Claim Rewards';
      } else {
        return 'Completed';
      }
    },
    getQuestDuration(quest) {
      const duration = quest.duration / 1000;
      if (duration >= 60) {
        const minutes = Math.floor(duration / 60);
        return `${minutes}m`;
      } else {
        return `${duration}s`;
      }
    },
    formatTime(milliseconds) {
      if (isNaN(milliseconds)) {
        return '';
      }
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes} min ${seconds} sec`;
    },
    // Simplified display methods that show correct values without complex bonus logic
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
  },
};
</script>



<style scoped lang="scss">
.quest-details {
  background-color: #1a1a1a;
  border: 1px solid #00ff00;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.quest-header {
  height: 200px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.quest-title {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-size: 2rem;
  margin: 0;
}

.quest-content {
  padding: 20px;
}

.quest-description {
  color: #ccc;
  font-size: 1rem;
  margin-bottom: 20px;
}

.quest-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quest-rewards {
  display: flex;
  gap: 20px;
}

.reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;

  img {
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
  }

  span {
    font-size: 0.9rem;
  }
}

.quest-duration {
  color: #00ff00;
  font-size: 0.9rem;
}

.quest-progress {
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #00ff00;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.8rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.quest-action {
  text-align: center;
  margin-top: 20px;
}

.btn-action {
  background-color: #00ff00;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;

  &:hover:not(:disabled) {
    background-color: #00cc00;
  }

  &:disabled {
    background-color: #333;
    color: #666;
    cursor: not-allowed;
  }
}

.quest-level-requirement {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
}

.no-quest {
  color: #ccc;
  font-size: 1.2rem;
  text-align: center;
  padding: 20px;
}

.bonus-indicator {
  font-size: 0.7rem;
  color: #00ff00;
  margin-left: 5px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .quest-header {
    height: 150px;
  }

  .quest-title {
    font-size: 1.5rem;
  }

  .quest-rewards {
    flex-wrap: wrap;
  }
}
</style>
