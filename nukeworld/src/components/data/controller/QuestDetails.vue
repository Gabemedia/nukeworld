<template>
  <div class="quest-details" v-if="quest">
    <div class="quest-header" :style="{
      backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    }">
      <h2 class="quest-title">{{ quest.name }}</h2>
    </div>
    <div class="quest-content">
      <p class="quest-description">{{ quest.desc }}</p>
      <div class="quest-info">
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
            <span>{{ quest.rewardChance * 100 }}%</span>
          </div>
          <div v-if="hasArmorReward(quest)" class="reward">
            <img :src="require('@/assets/interface/icons/shield.png')" :title="'Armor Reward Chance: ' + (quest.armorRewardChance * 100) + '%'">
            <span>{{ quest.armorRewardChance * 100 }}%</span>
          </div>
        </div>
        <div class="quest-duration">
          <span>Duration: {{ getQuestDuration(quest) }}</span>
        </div>
      </div>
      <div v-if="quest.state === 'in-progress'" class="quest-progress">
        <div class="progress-bar" :style="{ width: quest.progress + '%' }"></div>
        <span class="progress-text">{{ formatTime(quest.remainingTime) }}</span>
      </div>
      <div class="quest-action">
        <button 
          class="btn-action" 
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
  <div v-else class="no-quest">
    No quest selected.
  </div>
</template>

<script>
import { reactive } from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
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
      popupTitle: '',
      popupDesc: '',
    };
  },
  computed: {
    ...mapState(['quests', 'character']),
  },
  methods: {
    ...mapActions(['increaseExp', 'increaseMoney', 'handleQuest', 'claimRewards', 'clearQuests']),
    ...mapMutations(['completeQuest', 'setQuests', 'updateQuest']),
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
    handleQuestAction(quest) {
      if (quest.state === 'not-started') {
        this.handleQuest(quest);
        this.startQuestProgress(quest);
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
        return `${minutes} min`;
      } else {
        return `${duration} sec`;
      }
    },
    async claimRewardsAction(quest) {
      const reactiveQuest = reactive(quest);
      if (!reactiveQuest.claimed && reactiveQuest.state === 'ready-to-claim') {
        const obtainedReward = await this.claimRewards(reactiveQuest);
        console.log('Obtained reward in component:', obtainedReward);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999,
        });

        let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">${reactiveQuest.name} completed!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
              <span>${reactiveQuest.exp} exp</span>
            </div>
            <div class="d-flex align-items-start justify-content-start reward-info mb-1">
              <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
              <span>${reactiveQuest.money} money</span>
            </div>
          </div>
        `;

        if (obtainedReward) {
          rewardMessage += '<div class="d-flex align-items-start justify-content-start reward-info mb-1"><img src="' + require('@/assets/interface/icons/reward.png') + '" title="Reward" style="width: 20px;" class="me-2">';
          rewardMessage += `<span>${obtainedReward.name}</span>`;
          rewardMessage += '</div>';
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

        reactiveQuest.claimed = true;
        reactiveQuest.state = 'completed';
        this.saveQuests();
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
    startQuestProgress(quest) {
      const reactiveQuest = reactive(quest);
      reactiveQuest.state = 'in-progress';
      reactiveQuest.claimed = false;
      reactiveQuest.startTime = Date.now();
      reactiveQuest.remainingTime = reactiveQuest.duration;
      reactiveQuest.progress = 0;

      reactiveQuest.intervalId = setInterval(() => {
        if (reactiveQuest.remainingTime > 0) {
          reactiveQuest.remainingTime -= 1000;
          const elapsedTime = Date.now() - reactiveQuest.startTime;
          const progress = Math.min((elapsedTime / reactiveQuest.duration) * 100, 100);
          reactiveQuest.progress = progress;
        } else {
          clearInterval(reactiveQuest.intervalId);
          if (reactiveQuest.state !== 'ready-to-claim') {
            reactiveQuest.state = 'ready-to-claim';
            reactiveQuest.progress = 100;
            setTimeout(() => {
              toast.success(`<strong>${reactiveQuest.name} completed!</strong> <br>Claim your rewards!`, {
                autoClose: 5000,
                toastClassName: 'quest-toast-container',
                bodyClassName: 'quest-toast-body',
                dangerouslyHTMLString: true,
              });
            }, 0);
          }
        }
        this.saveQuests();
      }, 1000);
    },
    updateQuestData() {
      if (this.quest) {
        const updatedQuest = this.$store.state.quests.find(q => q.id === this.quest.id);
        if (updatedQuest) {
          Object.assign(this.quest, updatedQuest);
        }
      }
    },
    saveQuests() {
      localStorage.setItem('quests', JSON.stringify(this.quests));
    },
    getRewardItemName(rewardId) {
      const rewardItem = this.$store.state.items.find(item => item.id === rewardId);
      return rewardItem ? rewardItem.name : '';
    },
  },
  mounted() {
    window.addEventListener('beforeunload', this.saveQuests);
  },
  beforeUnmount() {
    this.quests.forEach(quest => {
      if (quest.intervalId) {
        clearInterval(quest.intervalId);
      }
    });
    window.removeEventListener('beforeunload', this.saveQuests);
  },
  created() {
    if (this.quest.state === 'in-progress') {
      this.startQuestProgress(this.quest);
    }
  },
  watch: {
    '$store.state.quests': {
      handler() {
        this.updateQuestData();
      },
      deep: true,
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
  color: #00ff00;

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
