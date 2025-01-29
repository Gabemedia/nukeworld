<template>
  <div class="quest-list">
    <div class="quest-card" v-for="quest in quests" :key="quest.name">
      <div class="quest-image" :style="{
        backgroundImage: `url(${require(`@/assets/quests/bg/${quest.img}.jpg`)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }"></div>
      <div class="quest-details">
        <span v-if="quest.state !== 'completed'" class="quest-duration" title="Quest Duration">
          {{ getQuestDuration(quest) }}
        </span>
        <div class="quest-info">
          <h5 class="quest-title">{{ quest.name }}</h5>
          <p class="quest-description">{{ quest.desc }}</p>
        </div>
        <div class="quest-progress" v-if="quest.state === 'in-progress'">
          <div class="progress-bar" :style="{ width: quest.progress + '%' }"></div>
        </div>
        <div class="quest-status">
          <p v-if="quest.state === 'in-progress'">Remaining Time: {{ formatTime(quest.remainingTime) }}</p>
        </div>
        <div class="quest-rewards">
          <div class="reward">
            <img :src="require(`@/assets/interface/icons/exp.png`)" title="Exp">
            <span>{{ quest.exp }}</span>
          </div>
          <div class="reward">
            <img :src="require(`@/assets/interface/icons/money.png`)" title="Money">
            <span>{{ quest.money }}</span>
          </div>
          <div v-if="hasWeaponReward(quest)" class="reward">
            <img :src="require('@/assets/interface/icons/gun.png')" :title="'Weapon Reward Chance: ' + (quest.rewardChance * 100) + '%'">
            <span>{{ (quest.rewardChance * 100).toFixed(0) }}%</span>
          </div>
          <div v-if="hasArmorReward(quest)" class="reward">
            <img :src="require('@/assets/interface/icons/shield.png')" :title="'Armor Reward Chance: ' + (quest.armorRewardChance * 100) + '%'">
            <span>{{ (quest.armorRewardChance * 100).toFixed(0) }}%</span>
          </div>
          <div class="reward">
            <img :src="require('@/assets/interface/icons/resources/wood_scrap.png')" title="Random Resource">
            <span>{{ getTotalRewardChance(quest) }}%</span>
          </div>
        </div>
        <div class="quest-action">
          <button 
            class="btn btn-action" 
            :disabled="isButtonDisabled(quest)" 
            @click="handleQuestAction(quest)"
          >
            {{ getButtonText(quest) }}
          </button>
        </div>
        <div v-if="character.level < quest.levelRequirement" class="quest-level-requirement">
          Level {{ quest.levelRequirement }} required to start this quest.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { toast } from "vue3-toastify";
import confetti from 'canvas-confetti';

export default {
  props: {
    quests: Array,
  },
  computed: {
    ...mapState(['character']),
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
    handleQuestAction(quest) {
      if (quest.state === 'not-started') {
        this.handleQuest(quest);
        toast.success(`<strong>${quest.name} started!</strong>`, {
          autoClose: 5000,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body',
          dangerouslyHTMLString: true,
        });
      } else if (quest.state === 'ready-to-claim' && !quest.claimed) {
        this.claimRewardsAction(quest);
      }
    },
    async claimRewardsAction(quest) {
      const { obtainedReward, obtainedArmorReward, obtainedResource } = await this.claimRewards(quest);
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
            <span>${quest.exp} exp</span>
          </div>
          <div class="d-flex align-items-start justify-content-start reward-info mb-1">
            <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
            <span>${quest.money} money</span>
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
  },
};
</script>


<style scoped lang="scss">
.quest-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.quest-card {
  background-color: #1a1a1a;
  border: 1px solid #00ff00;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.quest-image {
  height: 150px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.quest-details {
  padding: 15px;
  position: relative;
}

.quest-duration {
  position: absolute;
  top: -30px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #00ff00;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.quest-title {
  color: #00ff00;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.quest-description {
  color: #fff;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.quest-progress {
  height: 5px;
  background-color: #333;
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #00ff00;
  transition: width 0.3s ease;
}

.quest-status {
  color: #00ff00;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.quest-rewards {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 0.8rem;

  img {
    width: 30px;
    height: 30px;
    margin-bottom: 5px;
  }
}

.quest-action {
  text-align: center;
}

.btn-action {
  background-color: #00ff00;
  color: #000;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

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
  font-size: 0.8rem;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .quest-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 576px) {
  .quest-list {
    grid-template-columns: 1fr;
  }
}
</style>
