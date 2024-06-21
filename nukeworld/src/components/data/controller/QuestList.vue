<template>
  <div class="quest-list">
    <div class="quest-card" v-for="quest in quests" :key="quest.name">
      <div class="quest-image" :style="{
        backgroundImage: `url(${require(`@/assets/quests/bg/${quest.id}.jpg`)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }"></div>
      <div class="quest-details">
        <span v-if="quest.state !== 'completed'" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fst-italic" title="Quest Duration">
          <p class="card-text m-0">{{ getQuestDuration(quest) }}</p>
        </span>
        <div class="card">
          <div class="card-header p-0">
              <h5 class="card-text-header text-capitalize p-2 m-0">{{ quest.name }}</h5>
              <p class="card-text card-text-desc px-2 pb-2">{{ quest.desc }}</p>
          </div>
          <div class="progress rounded-0 p-0 m-0">
            <div class="progress-bar p-0 m-0" :style="{ width: quest.progress + '%' }"></div>
          </div>
          <div class="card-body bg-secondary bg-gradient px-2">
            <div class="d-flex align-items-center justify-content-between py-1">
              <p class="card-text" v-if="quest.state === 'in-progress'">Remaining Time: {{ formatTime(quest.remainingTime) }}</p>
            </div>
            <div class="d-flex justify-content-around flex-grow-1 text-center">
              <div class="card-text d-block fw-bold">
                <img style="width:40px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Exp"><br/>
                <span class="position-absolute start-25 translate-middle badge rounded-pill bg-danger fst-italic">
                  <p class="card-text m-0"> {{ quest.exp }} </p>
                </span>
              </div>
              <div class="card-text d-block fw-bold">
                <img style="width:40px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money"><br/>
                <span class="position-absolute start-25 translate-middle badge rounded-pill bg-danger fst-italic"> 
                  <p class="card-text m-0">{{ quest.money }}</p>
                </span>
              </div>
              <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                <img v-if="hasWeaponReward(quest)" :src="require('@/assets/interface/icons/gun.png')" alt="Attack" :title="'Weapon Reward Chance: ' + (quest.rewardChance * 100) + '%'" style="width:40px;" class="me-2"><br/>
                <span v-if="hasWeaponReward(quest)" class="position-absolute start-25 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                  <p class="card-text m-0">{{ quest.rewardChance * 100 }}%</p>
                </span>
              </div>
              <div v-if="hasWeaponReward(quest) || hasArmorReward(quest)" class="card-text d-block fw-bold">
                <img v-if="hasArmorReward(quest)" :src="require('@/assets/interface/icons/shield.png')" alt="Defence" :title="'Armor Reward Chance: ' + (quest.armorRewardChance * 100) + '%'" style="width: 40px;" class="me-2"><br/>
                <span v-if="hasArmorReward(quest)" class="position-absolute start-75 translate-middle badge rounded-pill bg-danger fst-italic" title="Reward Drop Chance">
                  <p class="card-text m-0">{{ quest.armorRewardChance * 100 }}%</p>
                </span>
              </div>
            </div>
            <div class="mt-3 text-center">
              <div class="text-center">
                <button type="button" class="btn btn-success bg-gradient w-100 no-margin no-border" :disabled="isButtonDisabled(quest)" @click="handleQuestAction(quest)">
                  {{ getButtonText(quest) }}
                </button>
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
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
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
    ...mapMutations(['completeQuest', 'updateQuestState']),
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
    async claimRewardsAction(quest) {
      const obtainedReward = await this.claimRewards(quest);
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
      quest.claimed = true;
      quest.state = 'completed';
      this.saveQuests();
    },
    getButtonText(quest) {
      if (quest.state === 'not-started') {
        return 'Start Quest';
      } else if (quest.state === 'in-progress') {
        return 'Please Wait';
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
    startQuestProgress(quest) {
      quest.state = 'in-progress';
      quest.claimed = false;
      quest.startTime = Date.now();
      quest.remainingTime = quest.duration;
      quest.progress = 0;
      quest.intervalId = setInterval(() => {
        if (quest.remainingTime > 0) {
          quest.remainingTime -= 1000;
          const elapsedTime = Date.now() - quest.startTime;
          const progress = Math.min((elapsedTime / quest.duration) * 100, 100);
          const questIndex = this.quests.findIndex(q => q.id === quest.id);
          if (questIndex !== -1) {
            this.$store.commit('updateQuestProgress', { questIndex, progress, remainingTime: quest.remainingTime });
            quest.progress = progress;
          }
        } else {
          clearInterval(quest.intervalId);
          if (quest.state !== 'ready-to-claim') {
            quest.state = 'ready-to-claim';
            quest.progress = 100;
            setTimeout(() => {
              toast.success(`<strong>${quest.name} completed!</strong> <br>Claim your rewards!`, {
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
    saveQuests() {
      localStorage.setItem('quests', JSON.stringify(this.quests));
    },
  },
};
</script>

<style scoped>
.quest-list {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content:center;

}

@media (max-width: 767px) {
  .quest-card {
    width: calc(100% - 25px); /* 5 quests per row with 10px gap */
    display: flex;
    flex-direction: column;
    scale:1;
  }
  .quest-image {
    height: 125px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}

@media (max-width: 1200px) and (min-width: 676px) {
  .quest-card {
    width: calc(50% - 25px); /* 5 quests per row with 10px gap */
    display: flex;
    flex-direction: column;
    scale:1;
  }
  .quest-image {
    height: 125px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}


@media (min-width: 1200px) {
  .quest-card {
    width: calc(33% - 25px); /* 5 quests per row with 10px gap */
    display: flex;
    flex-direction: column;
    scale:1;
  }
  .quest-image {
    height: 170px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
}

.quest-details {
  flex-grow: 1;
}

img {
  text-decoration: none;
  pointer-events: none;
}

.card-header {
text-align: left;
height: 80px;
}

.card-body {
  color: white;
  text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
}
.card-text {
  font-size: 0.755rem;
  font-weight: 400;
  text-decoration: none;
  pointer-events: none;
}
.card-text img {
  text-decoration: initial;
  pointer-events: auto;
}

.card-text-header {
  font-weight: 700;
  font-size: 1rem;
}
.card-text-desc {
  font-size: 0.777rem;
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
