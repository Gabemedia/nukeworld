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
          <button class="btn btn-primary mt-4" :disabled="isButtonDisabled(quest)" @click="handleQuestAction(quest)">
            {{ quest.state === 'not-started' ? 'Start Quest' : quest.state === 'in-progress' ? 'Please Wait' : 'Claim Rewards' }}
          </button>
        <button class="btn btn-primary" @click="resetQuests">Reset Quests</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
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
    ...mapMutations(['completeQuest', 'setQuests', 'updateQuestState']), 
    isButtonDisabled(quest) {
      if (quest.state === 'not-started') {
        return false;
      } else if (quest.state === 'in-progress') {
        return true;
      } else if (quest.state === 'completed') {
        return false;
      }
    },
    handleQuestAction(quest) {
    if (quest.state === 'not-started') {
      this.handleQuest(quest);
      this.startQuestProgress(quest);
    } else if (quest.state === 'completed') {
      this.claimRewardsAction(quest);
    }
  },
    claimRewardsAction(quest) {
      const reactiveQuest = reactive(quest);
      if (!reactiveQuest.claimed) {
        this.claimRewards(reactiveQuest);
        this.popupTitle = reactiveQuest.name;
        this.popupDesc = 'Quest completed! You earned ' + reactiveQuest.exp + ' exp and ' + reactiveQuest.money + ' money.';
        if (this.$refs.questPopup) {
          this.$refs.questPopup.openPopup();
        }
        this.resetClaimedQuest(reactiveQuest);
        reactiveQuest.claimed = true;
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
      const reactiveQuest = reactive(quest);
      reactiveQuest.state = 'in-progress';
      reactiveQuest.startTime = Date.now(); // Save the start time
      localStorage.setItem(reactiveQuest.name + 'StartTime', reactiveQuest.startTime);
      reactiveQuest.remainingTime = reactiveQuest.duration; // Save the remaining time
      localStorage.setItem(reactiveQuest.name + 'RemainingTime', reactiveQuest.remainingTime);
      reactiveQuest.intervalId = setInterval(() => {
        if (reactiveQuest.remainingTime > 0) {
          reactiveQuest.remainingTime -= 1000;
          localStorage.setItem(reactiveQuest.name + 'RemainingTime', reactiveQuest.remainingTime);
          
          // Calculate the elapsed time and progress
          const elapsedTime = Date.now() - reactiveQuest.startTime;
          const progress = Math.min((elapsedTime / reactiveQuest.duration) * 100, 100);
          reactiveQuest.progress = progress;
        } else {
          clearInterval(reactiveQuest.intervalId);
          reactiveQuest.state = 'completed';
        }
        this.saveQuests();
      }, 1000);
    },

    saveQuests() {
      localStorage.setItem('quests', JSON.stringify(this.quests));
    },
    resetQuests() {
      this.quests.forEach(quest => {
        quest.state = 'not-started';
        quest.progress = 0;
        quest.claimed = false;
        if (quest.intervalId) {
          clearInterval(quest.intervalId);
          quest.intervalId = null;
        }
      });
      this.saveQuests();
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
    window.addEventListener('load', () => {
      this.quests.forEach(quest => {
        if (quest.state === 'in-progress') {
          // Retrieve the start time and remaining time from localStorage
          const startTime = Number(localStorage.getItem(quest.name + 'StartTime'));
          const remainingTime = Number(localStorage.getItem(quest.name + 'RemainingTime'));

          // Calculate the elapsed time and progress
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
          quest.progress = progress;

          // Update the remaining time
          quest.remainingTime = remainingTime - elapsedTime;

          // If the quest is not yet completed, start the quest progress
          if (progress < 100) {
            this.startQuestProgress(quest);
          } else {
            // If the quest is completed, enable the claim button
            quest.state = 'completed';
          }
        }
      });
    });
  },
};
</script>
