<template>
  <div class="row">
    <quest-pop-up ref="questPopup" :title="popupTitle" :desc="popupDesc"></quest-pop-up>
    <div class="col-sm-4" v-for="quest in quests" :key="quest.name">
      <div class="card" :style="{
        backgroundImage: `url(${require(`@/assets/quests/bg/${quest.name}.jpg`)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }">
        <div class="card-body" style="color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
          <h5 class="card-title">{{ quest.name }}</h5>
          <p class="card-text">{{ quest.desc }}</p>
          <p class="card-text">Exp: {{ quest.exp }}</p>
          <p class="card-text">Money: {{ quest.money }}</p>
          <p class="card-text" v-if="quest.state === 'in-progress'">Remaining Time: {{ formatTime(quest.remainingTime) }}</p>          
          <div class="progress">
            <div class="progress-bar" :style="{ width: quest.progress + '%' }"></div>
          </div>
          <button class="btn btn-primary mt-4" :disabled="quest.disabled || (quest.state === 'completed' && quest.claimed)" @click="handleQuestAction(quest)">
          {{ quest.state === 'not-started' ? 'Start Quest' : quest.state === 'in-progress' ? 'Please Wait' : 'Claim Rewards' }}
        </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import QuestPopUp from './controller/popup/QuestPopUp.vue';

export default {
  components: {
    QuestPopUp,
  },
  data() {
    return {
      popupTitle: '',
      popupDesc: '',
      questInterval: null,
    };
  },
  computed: {
    ...mapState(['quests']),
  },
  methods: {
    ...mapActions(['increaseExp', 'increaseMoney', 'handleQuest', 'claimRewards', 'resetClaimedQuest']),
    ...mapMutations(['completeQuest', 'setQuests']),
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
        this.claimRewards(quest);
        this.popupTitle = quest.name;
        this.popupDesc = 'Quest completed! You earned ' + quest.exp + ' exp and ' + quest.money + ' money.';
        if (this.$refs.questPopup) {
          this.$refs.questPopup.openPopup();
        }
        this.resetClaimedQuest(quest);
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
    checkQuestState() {
      this.quests.forEach(quest => {
        if (quest.state === 'in-progress' && !quest.intervalId) {
          this.startQuestTimer(quest);
        }
      });
    },
      startQuestProgress(quest) {
    quest.state = 'in-progress';
    quest.intervalId = setInterval(() => {
      if (quest.remainingTime > 0) {
        quest.remainingTime -= 100;
      } else {
        clearInterval(quest.intervalId);
        quest.state = 'completed';
      }
      this.saveQuests();
    }, 1000);
  },

    saveQuests() {
      localStorage.setItem('quests', JSON.stringify(this.quests));
    }
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
    const savedQuests = JSON.parse(localStorage.getItem('quests'));
    if (savedQuests) {
      this.setQuests(savedQuests);
    }
    this.quests.forEach(quest => {
      if (quest.state === 'in-progress') {
        this.startQuestProgress(quest);
      }
    });
  },
};
</script>
