<template>
  <div class="row">
    <quest-pop-up ref="questPopup" :title="popupTitle" :desc="popupDesc"></quest-pop-up>
    <div class="col-12" v-for="quest in quests" :key="quest.name">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { toast } from "vue3-toastify";
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
    ...mapActions(['increaseExp', 'increaseMoney', 'handleQuest', 'claimRewards', 'clearQuests']),
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
        reactiveQuest.claimed = true;
        this.deleteQuestData(reactiveQuest);
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
          toast.success(`Quest ${reactiveQuest.name} completed! You earned ${reactiveQuest.exp} exp and ${reactiveQuest.money} money.`);
        }
        this.saveQuests();
      }, 1000);
    },

    saveQuests() {
      localStorage.setItem('quests', JSON.stringify(this.quests));
    },
    resetQuests() {
      this.quests.forEach((quest, index) => {
        const newQuest = reactive({
          ...quest,
          state: 'not-started',
          progress: 0,
          claimed: false,
          intervalId: null
        });
        this.quests[index] = newQuest;
        if (quest.intervalId) {
          clearInterval(quest.intervalId);
        }
      });
      this.saveQuests();
    },
    deleteQuestData(quest) {
      this.$store.dispatch('clearQuests');
      localStorage.removeItem('quests');
      const index = this.quests.findIndex(q => q.name === quest.name);
      if (index !== -1) {
        this.quests.splice(index, 1);
      }
      this.quests = [];
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
<style scoped>
.card-body {
  color: white;
  text-shadow:rgba(0, 0, 0, 1) 0px 0px 2px;
}
.card-text{
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
  filter:opacity(0.5);
}

.icon-reload:hover {
  filter:opacity(0.8);
}
</style>
