<template>
  <EnemyEncounters ref="enemyEncounters" @show-reward-toast="showRewardToast"/>
  <div class="dialog-system">
    <!-- Conversation window - only shown when a story is selected -->
    <div v-if="currentStoryLine && currentStoryStep" class="mb-3">
      <h6 class="mb-3 text-uppercase fw-bold text-start text-success">
        {{ currentStoryLine.name }}
        <button v-if="isSpeaking" @click="stopSpeaking" class="btn btn-sm btn-outline-danger ms-2" title="Stop speaking">
          <i class="bi bi-stop-fill"></i>
        </button>
      </h6>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'QuestDialog',
  components: {
    EnemyEncounters,
  },
  setup() {
    const expandedStoryLines = ref({});
    const isSpeaking = ref(false);
    const speechSynthesis = window.speechSynthesis;
    const currentUtterance = ref(null);

    const toggleStoryLineDetails = (storyLineId) => {
      expandedStoryLines.value[storyLineId] = !expandedStoryLines.value[storyLineId];
    };

    return {
      expandedStoryLines,
      toggleStoryLineDetails,
      isSpeaking,
      speechSynthesis,
      currentUtterance
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
      return resource ? require(`@/assets/interface/icons/resources/${resource.img}`) : '';
    },

    getResourceName(resourceId) {
      const resource = this.$store.state.resources.find(r => r.id === resourceId);
      return resource ? resource.name : '';
    },

    async selectOption(option) {
      if (option.requiredResources && !this.checkResources(option.requiredResources)) {
        return;
      }
      
      // Stop any current speech if this is the last choice
      if (option.nextId === null && this.isSpeaking) {
        this.stopSpeaking();
      }
      
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
          return;
        }
      }

      const result = await this.$store.dispatch('progressStory', { 
        nextId: option.nextId, 
        choiceText: option.text,
        giveReward: option.giveReward !== undefined ? option.giveReward : true
      });
      
      // Only speak if there's a next step (not on the last choice)
      if (option.nextId !== null) {
        this.speakNpcMessage();
      }
      
      if (result && result.rewards) {
        this.showRewardToast({
          storyLineName: this.currentStoryLine.name,
          rewards: result.rewards
        });
        this.updateCharacter(this.$store.state.character);
      }
    },

    cancelStory() {
      this.$store.dispatch('cancelCurrentStoryLine');
    },

    showRewardToast(data) {
      const { storyLineName, rewards } = data;
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">${storyLineName} completed!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;

      rewards.forEach(reward => {
        switch(reward.type) {
          case 'exp':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
                <span>${reward.amount} exp</span>
              </div>
            `;
            break;
          case 'money':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>${reward.amount} money</span>
              </div>
            `;
            break;
          case 'resource':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/resources/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.amount}x ${reward.item.name}</span>
              </div>
            `;
            break;
          case 'weapon':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/weapons/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
          case 'armor':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/armor/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
          case 'aid':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/aid/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
        }
      });

      rewardMessage += `
          </div>
        </div>
      `;

      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 10000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast',
      });
    },
    
    speakNpcMessage() {
      this.stopSpeaking();
      
      if (!this.currentStoryStep?.npcMessage) return;
      
      // Get voice settings from localStorage
      const settings = JSON.parse(localStorage.getItem('settings') || '[]')[0]?.voiceSettings;
      
      // Don't speak if voice is disabled in settings
      if (!settings?.enabled) return;
      
      // Replace {PlayerName} with actual name before speaking
      const textToSpeak = this.currentStoryStep.npcMessage.replace(/{PlayerName}/g, this.$store.state.character.name);
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Apply voice settings
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.lang = settings.language;
      
      // Handle voice selection
      if (settings.selectedVoice) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.voiceURI === settings.selectedVoice);
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        } else if (settings.useNativeVoice) {
          // Try to find a native voice for the language
          const nativeVoice = voices.find(v => 
            v.lang.startsWith(settings.language) && 
            v.localService
          );
          if (nativeVoice) {
            utterance.voice = nativeVoice;
          }
        }
      }
      
      // Mobile handling
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && settings.forceVoiceOnMobile) {
        // Force voice selection on mobile
        if (!utterance.voice) {
          const voices = speechSynthesis.getVoices();
          const mobileVoice = voices.find(v => 
            v.lang.startsWith(settings.language) &&
            !v.name.includes('Siri')
          );
          if (mobileVoice) {
            utterance.voice = mobileVoice;
          }
        }
      }
      
      // Event handlers
      utterance.onstart = () => {
        this.isSpeaking = true;
      };
      
      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        this.isSpeaking = false;
        this.currentUtterance = null;
      };
      
      // Store current utterance
      this.currentUtterance = utterance;
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    },
    
    stopSpeaking() {
      if (this.isSpeaking) {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
        this.currentUtterance = null;
      }
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

/* Tilføj disse styles for at sikre, at toast-beskeden vises korrekt */
:global(.quest-toast-container) {
  background-color: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
}

:global(.quest-toast-body) {
  font-size: 14px !important;
}

:global(.quest-toast) {
  max-width: 350px !important;
}
</style>
