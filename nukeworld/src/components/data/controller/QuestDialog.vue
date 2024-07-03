<template>
  <EnemyEncounters ref="enemyEncounters" @show-reward-toast="showRewardToast"/>
  <div class="dialog-system">
    <!-- Conversation window - only shown when a story is selected -->
    <div v-if="currentStoryLine && currentStoryStep" class="mb-3">
      <h6 class="mb-3 text-uppercase fw-bold text-start text-success">{{ currentStoryLine.name }}</h6>
      <div class="dialog-log border border-1 small">
        <div class="conversation-box npc-box">
          <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="Todd Wimsey">
          <div class="message-box npc-message">
            {{ currentStoryStep.npcMessage.replace(/{PlayerName}/g, $store.state.character.name) }}
          </div>
        </div>
        <div class="conversation-box player-box">
          <div class="message-box player-message">
            <button @click="selectOption(option)" class="btn btn-lg fw-bold btn-outline-light m-1" v-for="option in currentStoryStep.playerOptions" :key="option.text">
              <template v-if="option.requiredResources">
                <span v-for="resource in option.requiredResources" :key="resource.id" class="me-1">
                  <img :src="getResourceIcon(resource.id)" :alt="getResourceName(resource.id)" class="resource-icon" />
                  {{ resource.amount }}
                </span>
              </template>
              {{ option.text }}
            </button>
            <button @click="cancelStory" class="btn btn-lg btn-danger fw-bold btn-outline-light m-1">
              Go back
            </button>
          </div>
          <img class="sidebar-icon" :src="require(`@/assets/interface/icons/player.png`)" title="Hail to the King Baby!">
        </div>
      </div>
    </div>

    <!-- List of available stories - only shown when no story is selected -->
    <div v-else>
      <div v-if="availableStoryLines.length > 0">
        <h6 class="mb-3 text-uppercase fw-bold text-start text-success">Available Storylines</h6>
        <div class="storyline-grid">
          <div v-for="storyLine in availableStoryLines" :key="storyLine.id" class="storyline-card" @click="startStoryLine(storyLine.id)">
            <div class="storyline-title">{{ storyLine.name }}</div>
            <div class="storyline-level">Level Req: {{ storyLine.levelRequirement }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <h6 class="m-0 text-uppercase fw-bold text-start">Come back later for more Storylines</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EnemyEncounters from '../EnemyEncounters.vue';
import { ref } from 'vue';
import { toast } from "vue3-toastify";

export default {
  name: 'QuestDialog',
  components: {
    EnemyEncounters,
  },
  setup() {
    const expandedStoryLines = ref({});

    const toggleStoryLineDetails = (storyLineId) => {
      expandedStoryLines.value[storyLineId] = !expandedStoryLines.value[storyLineId];
    };

    return {
      expandedStoryLines,
      toggleStoryLineDetails
    };
  },
  computed: {
    ...mapGetters(['currentStoryLine', 'currentStoryStep', 'availableStoryLines', 'completedStoryLines']),
  },
  methods: {
    ...mapActions(['startStoryLine', 'progressStory', 'claimStoryRewards', 'updateCharacter']),
    checkResources(requiredResources) {
      return requiredResources.every(req => {
        return this.$store.state.character.resources.filter(r => r.id === req.id).length >= req.amount;
      });
    },

    getResourceIcon(resourceId) {
      const resource = this.$store.state.resources.find(r => r.id === resourceId);
      return resource ? require(`@/assets/interface/icons/resources/${resource.name.toLowerCase().replace(/ /g, '_')}.png`) : '';
    },

    getResourceName(resourceId) {
      const resource = this.$store.state.resources.find(r => r.id === resourceId);
      return resource ? resource.name : '';
    },

    async selectOption(option) {
      if (option.requiredResources && !this.checkResources(option.requiredResources)) {
        // Show a message about missing resources
        return;
      }
      // Remove resources if necessary
      if (option.requiredResources) {
        option.requiredResources.forEach(req => {
          for (let i = 0; i < req.amount; i++) {
            const resourceToRemove = this.$store.state.character.resources.find(r => r.id === req.id);
            if (resourceToRemove) {
              this.$store.dispatch('removeResource', resourceToRemove.uuid);
            }
          }
        });
      }
      if (option.action) {
        await this.$store.dispatch(option.action, option.actionParams);
        if (option.action === 'startEnemyBattle') {
          // If it's a battle, we shouldn't continue the story yet
          return;
        }
      }
      const result = await this.$store.dispatch('progressStory', { 
        nextId: option.nextId, 
        choiceText: option.text,
        giveReward: option.giveReward !== undefined ? option.giveReward : true
      });
      
      if (result && result.rewards) {
        this.showRewardToast(this.currentStoryLine.name, result.rewards);
        this.updateCharacter(this.$store.state.character); // Save character state
      }
    },

    cancelStory() {
      this.$store.dispatch('cancelCurrentStoryLine');
    },

    showRewardToast(storyLineName, rewards) {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
        <p class="text-left fw-bold mb-1">${storyLineName} completed!</p>
        <p class="text-left fw-semi mb-2">You earned:</p>
        <div id="rewardMessage"></div>
        <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;
      console.log('Rewards:', rewards);

      if (rewards.exp > 0) {
        console.log('Adding exp reward');
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
            <span>${rewards.exp} exp</span>
          </div>
        `;
      }

      if (rewards.money > 0) {
        console.log('Adding money reward');
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
            <span>${rewards.money} money</span>
          </div>
        `;
      }

      // Handle weapons
      if (rewards.weapons && rewards.weapons.length > 0) {
        console.log('Adding weapon rewards');
        rewards.weapons.forEach(weapon => {
          rewardMessage += `
            <div class="d-flex align-items-start justify-content-start reward-info mb-1">
              <img src="${require(`@/assets/interface/icons/weapons/${weapon.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${weapon.name}" style="width: 20px;" class="me-2">
              <span>${weapon.name}</span>
            </div>
          `;
        });
      }

      // Handle armor
      if (rewards.armor && rewards.armor.length > 0) {
        console.log('Adding armor rewards');
        rewards.armor.forEach(armorItem => {
          rewardMessage += `
            <div class="d-flex align-items-start justify-content-start reward-info mb-1">
              <img src="${require(`@/assets/interface/icons/armor/${armorItem.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${armorItem.name}" style="width: 20px;" class="me-2">
              <span>${armorItem.name}</span>
            </div>
          `;
        });
      }

      // Handle resources
      if (rewards.resources && rewards.resources.length > 0) {
        console.log('Adding resource rewards');
        const resourceCounts = rewards.resources.reduce((acc, resource) => {
          acc[resource.id] = (acc[resource.id] || 0) + 1;
          return acc;
        }, {});

        Object.entries(resourceCounts).forEach(([resourceId, count]) => {
          const resource = rewards.resources.find(r => r.id === parseInt(resourceId));
          rewardMessage += `
            <div class="d-flex align-items-start justify-content-start reward-info mb-1">
              <img src="${require(`@/assets/interface/icons/resources/${resource.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${resource.name}" style="width: 20px;" class="me-2">
              <span>${count}x ${resource.name}</span>
            </div>
          `;
        });
      }

      // Handle aid
      if (rewards.aid && rewards.aid.length > 0) {
        console.log('Adding aid rewards');
        rewards.aid.forEach(aidItem => {
          rewardMessage += `
            <div class="d-flex align-items-start justify-content-start reward-info mb-1">
              <img src="${require(`@/assets/interface/icons/aid/${aidItem.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${aidItem.name}" style="width: 20px;" class="me-2">
              <span>${aidItem.name}</span>
            </div>
          `;
        });
      }

      console.log('Final reward message:', rewardMessage);
      document.getElementById('rewardMessage').innerHTML = rewardMessage;
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

  },
};
</script>

<style lang="scss" scoped>
.dialog-system {
  border-radius: 5px;
  color: white;
  text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
  font-size: 1rem;
}

.dialog-log {
  max-height: 200px;
  overflow-y: auto;
}

.conversation-box {
  display: flex;
  align-items: flex-start;
  margin: 10px 0px;
}

.npc-box {
  flex-direction: row;
}

.player-box .sidebar-icon{ 
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.sidebar-icon {
  width: 50px;
  height: 50px;
  margin: 0 10px;
}

.message-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 10px;
  flex-grow: 1;
}

.npc-message {
  margin-right: 15px;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
}

.player-message {
  margin-left: 15px;
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
}

.player-message .btn{
  font-size: 0.7rem;
}

.resource-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 2px;
}

.storyline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.storyline-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.storyline-title {
  font-size: 0.8rem;
  font-weight: bold;
}

.storyline-level {
  font-size: 0.6rem;
  font-weight: bold;
  color: #aaa;
}

.reward-info {
  font-size: 14px;
}

.reward-info img {
  vertical-align: middle;
}

.reward-info span {
  vertical-align: middle;
}

</style>
