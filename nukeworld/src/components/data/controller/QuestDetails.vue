<template>
  <div v-if="quest">
    <div class="card my-2">
      <div class="card-header p-0 d-flex">
        <div class="col-6" :style="{
          backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat'
        }"></div>

        <div class="col-6 bg-light">
          <h5 class="card-text-header text-capitalize p-2">{{ quest.name }}</h5>
          <p class="card-text card-text-desc p-2">{{ quest.desc }}</p>
        </div>
      </div>
      <div class="progress p-0 m-0">
        <div class="progress-bar p-0 m-0" :style="{ width: quest.progress + '%' }"></div>
      </div>
      <div class="card-body bg-secondary bg-gradient p-2">
        <p class="card-text" v-if="quest.state === 'in-progress'">Remaining Time: {{ formatTime(quest.remainingTime) }}</p>
        <div class="d-flex align-items-center justify-content-center">
          <div class="flex-grow-1 text-center">
            <button class="btn btn-success bg-gradient" :disabled="isButtonDisabled(quest)" @click="handleQuestAction(quest)" style="width: 100%;">
              {{ quest.state === 'not-started' ? 'Start Quest' : quest.state === 'in-progress' ? 'Please Wait' : 'Claim Rewards' }}
            </button>
          </div>
          <div class="d-flex justify-content-around flex-grow-1 text-center">
            <div style="margin-top:5px;" class="card-text d-block fw-bold">
              <img style="width:25px; margin-top:-5px;" :src="require(`@/assets/interface/icons/exp.png`)" alt="Exp"> {{ quest.exp }}
            </div>
            <div style="margin-top:5px;" class="card-text d-block fw-bold"><img style="width:25px; margin-top:-5px;" :src="require(`@/assets/interface/icons/money.png`)" alt="Money"> {{ quest.money }}</div>
            <div v-if="quest.reward && quest.reward.length > 0" style="margin-top:5px;" class="card-text d-block fw-bold">
              <img style="width:25px; margin-top:-5px;" :src="require(`@/assets/interface/icons/reward.png`)" alt="Reward">
              <span v-for="rewardId in quest.reward" :key="rewardId">
                {{ getRewardItemName(rewardId) }}
                <p>{{ quest.rewardChance * 100 }}% Chance to Drop</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    No available quests.
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
      rollDice: null,
    };
  },
  methods: {
    ...mapActions(['handleQuest', 'claimRewards', 'startQuestProgress']),
    handleQuestAction(quest) {
      if (quest.state === 'not-started') {
        this.handleQuest(quest);
        this.startQuestProgress(quest);
      } else if (quest.state === 'completed') {
        this.claimRewardsAction(quest);
      }
    },
    claimRewardsAction(quest) {
      if (!quest.claimed) {
        this.rollDice = Math.random();
        let rewardText = 'Quest completed! You earned ' + quest.exp + ' exp and ' + quest.money + ' money.';
        if (quest.reward && quest.reward.length > 0 && this.rollDice <= quest.rewardChance) {
          const rewardItemNames = quest.reward.map(rewardId => this.getRewardItemName(rewardId)).join(', ');
          rewardText += ` You also received the following reward(s): ${rewardItemNames}.`;
        }
        this.popupTitle = quest.name;
        this.popupDesc = rewardText;
        if (this.$refs.questPopup) {
          this.$refs.questPopup.openPopup();
        }
        quest.claimed = true;
        this.claimRewards(quest);
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
    isButtonDisabled(quest) {
      if (quest.state === 'not-started') {
        return false;
      } else if (quest.state === 'in-progress') {
        return true;
      } else if (quest.state === 'completed') {
        return false;
      }
    },
    getRewardItemName(rewardId) {
      const rewardItem = this.$store.state.items.find(item => item.id === rewardId);
      return rewardItem ? rewardItem.name : '';
    },
  },
};
</script>

<style scoped>
.popup-details {
  scale: 0.85;
}
.card-body {
  color: white;
  text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
}
.card-text {
  font-size: 0.8rem;
  font-weight: 400;
}
.card-text-header {
  font-weight: 600;
  font-size: 1rem;
}
.card-text-desc {
  font-size: 1rem;
  font-weight: 400;
}
.icon-reload {
  width: 18px;
  transition: opacity 0.3 ease;
  cursor: pointer;
  filter: opacity(0.5);
}

.icon-reload:hover {
  filter: opacity(0.8);
}
</style>
