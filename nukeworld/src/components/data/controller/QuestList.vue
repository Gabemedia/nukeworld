<template>
  <div class="accordion" id="questAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header" id="availableQuestsHeader">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#availableQuests" aria-expanded="true" aria-controls="availableQuests">
          Available Quests
        </button>
      </h2>
      <div id="availableQuests" class="accordion-collapse collapse show" aria-labelledby="availableQuestsHeader" data-bs-parent="#questAccordion">
        <div class="accordion-body">
          <div class="row my-2" v-for="quest in availableQuests" :key="quest.name">
            <div class="col-3" :style="{
              backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }"></div>
            <div class="col-9 p-0">
              <div class="card">
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
                        {{ getButtonText(quest) }}
                        <span v-if="quest.state !== 'completed'" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fst-italic" title="Quest Duration">
                          <p class="card-text m-0">{{ getQuestDuration(quest) }}</p>
                        </span>
                      </button>
                    </div>
                    <div class="d-flex justify-content-between flex-grow-1 mx-4 text-center">
                      <div class="card-text d-block fw-bold">
                        <img style="width:20px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Exp">
                        <span class="ps-1"> {{ quest.exp }} </span>
                      </div>
                      <div class="card-text d-block fw-bold">
                        <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money">
                        <span class="ps-1"> {{ quest.money }} </span>
                      </div>
                      <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                        <img v-if="hasWeaponReward(quest)" :src="require('@/assets/interface/icons/gun.png')" alt="Attack" :title="'Weapon Reward Chance: ' + (quest.rewardChance * 100) + '%'" style="width: 20px;" class="me-2">
                        <span v-if="hasWeaponReward(quest)" class="position-absolute start-25 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                          <p class="card-text m-0">{{ quest.rewardChance * 100 }}%</p>
                        </span>
                      </div>
                      <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                        <img v-if="hasArmorReward(quest)" :src="require('@/assets/interface/icons/shield.png')" alt="Defence" :title="'Armor Reward Chance: ' + (quest.armorRewardChance * 100) + '%'" style="width: 20px;" class="me-2">
                        <span v-if="hasArmorReward(quest)" class="position-absolute start-75 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                          <p class="card-text m-0">{{ quest.armorRewardChance * 100 }}%</p>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-if="character.level < quest.levelRequirement" class="alert alert-warning mt-2 p-2 mb-2 alert-clear-text">
                    Level {{ quest.levelRequirement }} required to start this quest.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="highLevelQuestsHeader">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#highLevelQuests" aria-expanded="false" aria-controls="highLevelQuests">
          High Level Quests
        </button>
      </h2>
      <div id="highLevelQuests" class="accordion-collapse collapse" aria-labelledby="highLevelQuestsHeader" data-bs-parent="#questAccordion">
        <div class="accordion-body">
          <div class="row my-2" v-for="quest in highLevelQuests" :key="quest.name">
            <div class="col-3" :style="{
              backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }"></div>
            <div class="col-9 p-0">
              <div class="card">
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
                        {{ getButtonText(quest) }}
                        <span v-if="quest.state !== 'completed'" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fst-italic" title="Quest Duration">
                          <p class="card-text m-0">{{ getQuestDuration(quest) }}</p>
                        </span>
                      </button>
                    </div>
                    <div class="d-flex justify-content-between flex-grow-1 mx-4 text-center">
                      <div class="card-text d-block fw-bold">
                        <img style="width:20px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Exp">
                        <span class="ps-1"> {{ quest.exp }} </span>
                      </div>
                      <div class="card-text d-block fw-bold">
                        <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money">
                        <span class="ps-1"> {{ quest.money }} </span>
                      </div>
                      <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                        <img v-if="hasWeaponReward(quest)" :src="require('@/assets/interface/icons/gun.png')" alt="Attack" :title="'Weapon Reward Chance: ' + (quest.rewardChance * 100) + '%'" style="width: 20px;" class="me-2">
                        <span v-if="hasWeaponReward(quest)" class="position-absolute start-25 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                          <p class="card-text m-0">{{ quest.rewardChance * 100 }}%</p>
                        </span>
                      </div>
                      <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                        <img v-if="hasArmorReward(quest)" :src="require('@/assets/interface/icons/shield.png')" alt="Defence" :title="'Armor Reward Chance: ' + (quest.armorRewardChance * 100) + '%'" style="width: 20px;" class="me-2">
                        <span v-if="hasArmorReward(quest)" class="position-absolute start-75 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                          <p class="card-text m-0">{{ quest.armorRewardChance * 100 }}%</p>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-if="character.level < quest.levelRequirement" class="alert alert-warning mt-2 p-2 mb-2 alert-clear-text">
                    Level {{ quest.levelRequirement }} required to start this quest.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="completedQuestsHeader">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#completedQuests" aria-expanded="false" aria-controls="completedQuests">
          Completed Quests
        </button>
      </h2>
      <div id="completedQuests" class="accordion-collapse collapse" aria-labelledby="completedQuestsHeader" data-bs-parent="#questAccordion">
        <div class="accordion-body">
          <div class="row my-2" v-for="quest in completedQuests" :key="quest.name">
            <div class="col-3" :style="{
              backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }"></div>
            <div class="col-9 p-0">
              <div class="card">
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
                        {{ getButtonText(quest) }}
                        <span v-if="quest.state !== 'completed'" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fst-italic" title="Quest Duration">
                          <p class="card-text m-0">{{ getQuestDuration(quest) }}</p>
                        </span>
                      </button>
                    </div>
                    <div class="d-flex justify-content-between flex-grow-1 mx-4 text-center">
                      <div class="card-text d-block fw-bold">
                        <img style="width:20px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Exp">
                        <span class="ps-1"> {{ quest.exp }} </span>
                      </div>
                      <div class="card-text d-block fw-bold">
                        <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money">
                        <span class="ps-1"> {{ quest.money }} </span>
                      </div>
                      <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                        <img v-if="hasWeaponReward(quest)" :src="require('@/assets/interface/icons/gun.png')" alt="Attack" :title="'Weapon Reward Chance: ' + (quest.rewardChance * 100) + '%'" style="width: 20px;" class="me-2">
                        <span v-if="hasWeaponReward(quest)" class="position-absolute start-25 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                          <p class="card-text m-0">{{ quest.rewardChance * 100 }}%</p>
                        </span>
                      </div>
                      <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                        <img v-if="hasArmorReward(quest)" :src="require('@/assets/interface/icons/shield.png')" alt="Defence" :title="'Armor Reward Chance: ' + (quest.armorRewardChance * 100) + '%'" style="width: 20px;" class="me-2">
                        <span v-if="hasArmorReward(quest)" class="position-absolute start-75 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                          <p class="card-text m-0">{{ quest.armorRewardChance * 100 }}%</p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { reactive } from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { toast } from "vue3-toastify";
import confetti from 'canvas-confetti';

export default {
  computed: {
    ...mapState(['quests', 'character']),
    availableQuests() {
      return this.quests.filter(quest => quest.state === 'not-started' && this.character.level >= quest.levelRequirement);
    },
    highLevelQuests() {
      return this.quests.filter(quest => quest.state === 'not-started' && this.character.level < quest.levelRequirement);
    },
    completedQuests() {
      return this.quests.filter(quest => quest.state === 'completed');
    },
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
      } else if (quest.state === 'completed' && !quest.claimed) {
        this.claimRewardsAction(quest);
      }
    },
    async claimRewardsAction(quest) {
      const reactiveQuest = reactive(quest);
      if (!reactiveQuest.claimed && reactiveQuest.state === 'completed') {
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
        <p class="text-left fw-bold  mb-1">${reactiveQuest.name} completed!</p>
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
        this.saveQuests();
      }
    },
    getButtonText(quest) {
      if (quest.state === 'not-started') {
        return 'Start Quest';
      } else if (quest.state === 'in-progress') {
        return 'Please Wait';
      } else if (quest.state === 'completed' && !quest.claimed) {
        return 'Claim Rewards';
      } else {
        return 'Completed';
      }
    },
    getQuestDuration(quest) {
      const duration = quest.duration / 1000; // Convert milliseconds to seconds
      if (duration >= 60) {
        const minutes = Math.floor(duration / 60);
        return `${minutes} min`;
      } else {
        return `${duration} sec`;
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
          reactiveQuest.state = 'completed';
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
        this.saveQuests();
      }, 1000);
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

img {
  text-decoration: none;
  pointer-events: none;
}

.card-body {
  color: white;
  text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
}
.card-text {
  font-size: 0.655rem;
  font-weight: 400;
  text-decoration: none;
  pointer-events: none;
}
.card-text img {
  text-decoration: initial;
  pointer-events: auto;
}

.card-text-header {
  font-weight: 600;
  font-size: 1rem;
}
.card-text-desc {
  font-size: 0.8rem;
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
.alert-clear-text{
  font-size: 0.888rem!important;
}
</style>
