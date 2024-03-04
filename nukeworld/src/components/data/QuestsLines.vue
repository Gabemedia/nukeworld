<template>
  <div class="row">
    <quest-pop-up ref="questPopup" :title="popupTitle" :desc="popupDesc"></quest-pop-up>
    <div class="col-sm-4" v-for="quest in quests" :key="quest.name">
      <div class="card" :style="{ backgroundImage: `url('./images/quests/bg/${quest.name}.jpg')` }">
        <div class="card-body">
          <h5 class="card-title">{{ quest.name }}</h5>
          <p class="card-text">{{ quest.desc }}</p>
          <p class="card-text">Exp: {{ quest.exp }}</p>
          <p class="card-text">Money: {{ quest.money }}</p>
          <p class="card-text" v-if="quest.state === 'in-progress'">Remaining Time: {{ formatTime(quest.remainingTime) }}</p>          
          <div class="progress">
            <div class="progress-bar" :style="{ width: quest.progress + '%' }"></div>
          </div>
          <button class="btn btn-primary mt-4" :disabled="quest.disabled" @click="handleQuestAction(quest)">
            {{ quest.state === 'not-started' ? 'Start Quest' : quest.state === 'in-progress' ? 'Please Wait' : 'Claim Rewards' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import QuestPopUp from './controller/popup/QuestPopUp.vue';

export default {
  components: {
    QuestPopUp,
  },
  data() {
    return {
      popupTitle: '',
      popupDesc: '',
    };
  },
  computed: {
    ...mapState(['quests']),
  },
  methods: {
    ...mapActions(['increaseExp', 'increaseMoney', 'handleQuest', 'claimRewards']),
    handleQuestAction(quest) {
      if (quest.state === 'not-started') {
        this.handleQuest(quest);
      } else if (quest.state === 'completed') {
        this.claimRewardsAction(quest);
      }
    },
    claimRewardsAction(quest) {
      this.claimRewards(quest);
      this.popupTitle = quest.name;
      this.popupDesc = 'Quest completed! You earned ' + quest.exp + ' exp and ' + quest.money + ' money.';
      this.$refs.questPopup.openPopup();
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