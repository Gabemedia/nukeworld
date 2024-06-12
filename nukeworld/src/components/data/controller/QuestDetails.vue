<template>
  <div>
    <div class="row" v-if="quest">
      <div class="col-3" :style="{
            backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }"></div>
      <div class="card col-9 p-0 pe-2">
        <div class="card-header p-0 d-flex">
          <div class="bg-light">
            <h5 class="card-text-header text-capitalize p-2">{{ quest.name }}</h5>
            <p class="card-text card-text-desc p-2">{{ quest.desc }}</p>
          </div>
        </div>
        <div class="progress p-0 m-0">
          <div class="progress-bar p-0 m-0" :style="{ width: quest.progress + '%' }"></div>
        </div>
        <div class="card-body bg-secondary bg-gradient p-2">
          <div class="d-flex align-items-center justify-content-between py-1">
            <p class="card-text" v-if="quest.state === 'in-progress'">Remaining Time: {{ formatTime(quest.remainingTime) }}</p>
          </div>
          <div class="d-flex align-items-center justify-content-center">
            <div class="text-center">
              <button type="button" class="btn btn-success bg-gradient position-relative fw-bold" :disabled="isButtonDisabled(quest)" @click="handleQuestAction(quest)">
                {{ quest.state === 'not-started' ? 'Start Quest' : quest.state === 'in-progress' ? 'Please Wait' : 'Claim Rewards' }}
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                  <p class="card-text m-0">{{ quest.rewardChance * 100 }}%</p>
                </span>
              </button>
            </div>
            <div class="d-flex justify-content-end flex-grow-1 gap-2 text-center">
              <div class="card-text d-block fw-bold">
                <img style="width:25px;" :src="require(`@/assets/interface/icons/exp.png`)" alt="Exp">
                <span class="ps-1"> {{ quest.exp }} </span>
              </div>
              <div class="card-text d-block fw-bold">
                <img style="width:25px;" :src="require(`@/assets/interface/icons/money.png`)" alt="Money">
                <span class="ps-1"> {{ quest.money }} </span>
              </div>
              <div v-if="quest.reward && quest.reward.length > 0" class="card-text d-block fw-bold">
                <img style="width:25px;" :src="require(`@/assets/interface/icons/reward.png`)" alt="Reward">
                <span class="ps-1" v-for="rewardId in quest.reward" :key="rewardId">
                  {{ getRewardItemName(rewardId) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="character.level < quest.levelRequirement" class="alert alert-warning mt-2 alert-clear-text">
            Level {{ quest.levelRequirement }} required to start this quest.
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      No available quests.
    </div>
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
    ...mapMutations(['completeQuest', 'setQuests', 'updateQuestState']),
    isButtonDisabled(quest) {
      if (quest.state === 'not-started') {
        return this.character.level < quest.levelRequirement;
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
        toast.success(`<strong>${quest.name} started!</strong>`, {
          autoClose: 5000, // Set the desired duration in milliseconds
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body',
          dangerouslyHTMLString: true,
        });
      } else if (quest.state === 'completed') {
        this.claimRewardsAction(quest);
      }
    },

    async claimRewardsAction(quest) {
      const reactiveQuest = reactive(quest);
      if (!reactiveQuest.claimed) {
        const obtainedReward = await this.claimRewards(reactiveQuest);
        this.popupTitle = reactiveQuest.name;
        this.popupDesc = 'Quest completed! You earned ' + reactiveQuest.exp + ' exp and ' + reactiveQuest.money + ' money.';
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999, // Ensure confetti is on top
        });

        // Construct the reward message
        let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">${reactiveQuest.name} completed!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/exp.png')}" alt="Exp" style="width: 20px;" class="me-2">
              <span>${reactiveQuest.exp} exp</span>
            </div>
            <div class="d-flex align-items-start justify-content-start reward-info mb-1">
              <img src="${require('@/assets/interface/icons/money.png')}" alt="Money" style="width: 20px;" class="me-2">
              <span>${reactiveQuest.money} money</span>
            </div>
          </div>
        `;

        if (obtainedReward) {
          rewardMessage += '<div class="d-flex align-items-start justify-content-start reward-info mb-1"><img src="' + require('@/assets/interface/icons/reward.png') + '" alt="Reward" style="width: 20px;" class="me-2">';
          rewardMessage += `<span>${obtainedReward.name}</span>`;
          rewardMessage += '</div>';
        }

        rewardMessage += '</div></div>';

        toast.success(rewardMessage, {
          dangerouslyHTMLString: true,
          autoClose: 10000, // Duration in milliseconds (e.g., 1000ms = 1 seconds)
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast',
        });

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
      reactiveQuest.startTime = Date.now();
      localStorage.setItem(reactiveQuest.name + 'StartTime', reactiveQuest.startTime);
      reactiveQuest.remainingTime = reactiveQuest.duration;
      localStorage.setItem(reactiveQuest.name + 'RemainingTime', reactiveQuest.remainingTime);
      reactiveQuest.intervalId = setInterval(() => {
        if (reactiveQuest.remainingTime > 0) {
          reactiveQuest.remainingTime -= 1000;
          localStorage.setItem(reactiveQuest.name + 'RemainingTime', reactiveQuest.remainingTime);
          const elapsedTime = Date.now() - reactiveQuest.startTime;
          const progress = Math.min((elapsedTime / reactiveQuest.duration) * 100, 100);
          reactiveQuest.progress = progress;
        } else {
          clearInterval(reactiveQuest.intervalId);
          reactiveQuest.state = 'completed';
          setTimeout(() => {
            toast.success(`<strong>${reactiveQuest.name} completed!</strong> <br>Claim your rewards!`,{
              autoClose: 5000,
              toastClassName: 'quest-toast-container',
              bodyClassName: 'quest-toast-body',
              dangerouslyHTMLString: true,
            });
            }, reactiveQuest.duration);
        }
        this.saveQuests();
      }, 100);
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
    window.addEventListener('load', () => {
      this.quests.forEach(quest => {
        if (quest.state === 'in-progress') {
          const startTime = Number(localStorage.getItem(quest.name + 'StartTime'));
          const remainingTime = Number(localStorage.getItem(quest.name + 'RemainingTime'));
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
          quest.progress = progress;
          quest.remainingTime = remainingTime - elapsedTime;
          if (progress < 100) {
            this.startQuestProgress(quest);
          } else {
            quest.state = 'completed';
          }
        }
      });
    });
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
  font-size: 0.655rem;
  font-weight: 400;
}
.card-text-header {
  font-weight: 600;
  font-size: 1rem;
}
.card-text-desc {
  font-size: 0.655rem;
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
.alert-clear-text {
  text-shadow: none; /* Remove any text shadow */
  color: #000; /* Ensure text color is set to black for clarity */
}
.reward-info {
  display: flex;
  align-items: center;
  margin-top: 5px;
}
</style>
