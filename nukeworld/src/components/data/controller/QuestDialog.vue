<template>
  <EnemyEncounters ref="enemyEncounters" @show-reward-toast="showRewardToast"/>
  <div class="dialog-system" ref="dialogSystem">
    <!-- Conversation window - only shown when a story is selected -->
    <div v-if="currentStoryLine && currentStoryStep" class="conversation-container">
      <div class="dialog-header">
        <div class="dialog-title-wrapper">
          <img class="dialog-logo" :src="require(`@/assets/interface/icons/encounter.png`)" alt="Story Icon">
          <h5 class="dialog-title">{{ currentStoryLine.name }}</h5>
        </div>
        <button v-if="isSpeaking" @click="stopSpeaking" class="stop-speaking-btn" title="Stop speaking">
          <i class="bi bi-stop-fill"></i>
        </button>
      </div>
      
      <div class="dialog-content">
        <div class="conversation-wrapper">
          <div class="conversation-box npc-box">
            <div class="speaker-avatar">
              <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="NPC">
              <div class="speaker-badge">NPC</div>
            </div>
            <div class="message-box npc-message">
              <div class="message-content">
                {{ currentStoryStep.npcMessage.replace(/{PlayerName}/g, $store.state.character.name) }}
              </div>
            </div>
          </div>
          
          <div class="conversation-box player-box">
            <div class="message-box player-message">
              <div class="player-options">
                <button @click="selectOption(option)" class="option-btn" v-for="option in currentStoryStep.playerOptions" :key="option.text">
                  <div class="option-content">
                    <template v-if="option.requiredResources">
                      <div class="resource-requirements">
                        <span v-for="resource in option.requiredResources" :key="resource.id" class="resource-item">
                          <img :src="getResourceIcon(resource.id)" :alt="getResourceName(resource.id)" class="resource-icon" />
                          <span class="resource-amount">{{ resource.amount }}</span>
                        </span>
                      </div>
                    </template>
                    <span class="option-text">{{ option.text }}</span>
                  </div>
                </button>
                <button @click="cancelStory" class="option-btn cancel-btn">
                  <span class="option-text">Go back</span>
                </button>
              </div>
            </div>
            <div class="speaker-avatar player-avatar">
              <img class="sidebar-icon" :src="require(`@/assets/interface/icons/player.png`)" title="Player">
              <div class="speaker-badge">YOU</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List of available stories - only shown when no story is selected -->
    <div v-else class="storylines-container">
      <div class="dialog-header">
        <div class="dialog-title-wrapper">
          <img class="dialog-logo" :src="require(`@/assets/interface/icons/quests.png`)" alt="Storylines Icon">
          <h5 class="dialog-title">Available Storylines</h5>
        </div>
      </div>
      
      <div class="dialog-content">
        <div class="storylines-wrapper">
          <div v-if="availableStoryLines.length > 0" class="storylines-content">
            <div class="storyline-grid">
              <div v-for="storyLine in availableStoryLines" :key="storyLine.id" class="storyline-card" @click="startStoryLine(storyLine.id)">
                <div class="storyline-header">
                  <div class="storyline-title">{{ storyLine.name }}</div>
                  <div class="storyline-level-badge">Lv.{{ storyLine.levelRequirement }}</div>
                </div>
                <div class="storyline-level">Level Requirement: {{ storyLine.levelRequirement }}</div>
              </div>
            </div>
          </div>
          <div v-else class="no-storylines">
            <div class="empty-state">
              <h6 class="empty-title">No Storylines Available</h6>
              <p class="empty-text">Come back later for more adventures!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import EnemyEncounters from '../EnemyEncounters.vue';
import { ref, onUnmounted } from 'vue';
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
    const availableVoices = ref([]);
    const selectedVoice = ref(null);
    const speechVolume = ref(1.0);
    const speechRate = ref(1.0);
    const speechPitch = ref(1.0);
    const dialogSystem = ref(null);
    let voicesLoaded = false;

    // Load available voices - only once to prevent conflicts
    const loadVoices = () => {
      if (voicesLoaded) return; // Prevent infinite loop
      
      try {
        availableVoices.value = speechSynthesis.getVoices();
        if (availableVoices.value.length > 0) {
          // Default to first English voice, fallback to first available
          selectedVoice.value = availableVoices.value.find(voice => voice.lang.includes('en')) || availableVoices.value[0];
        }
        voicesLoaded = true;
      } catch (error) {
        console.error('Error loading voices in QuestDialog:', error);
        voicesLoaded = true; // Prevent infinite retries
      }
    };

    // Initial voice loading - only if voices are available
    if (speechSynthesis && speechSynthesis.getVoices().length > 0) {
      loadVoices();
    }
    
    // Don't set onvoiceschanged here to avoid conflicts with main.js and GameSettings.vue

    const toggleStoryLineDetails = (storyLineId) => {
      expandedStoryLines.value[storyLineId] = !expandedStoryLines.value[storyLineId];
    };

    // Add cleanup on component unmount
    onUnmounted(() => {
      window.speechSynthesis.cancel();
    });

    return {
      expandedStoryLines,
      toggleStoryLineDetails,
      isSpeaking,
      speechSynthesis,
      currentUtterance,
      availableVoices,
      selectedVoice,
      speechVolume,
      speechRate,
      speechPitch,
      dialogSystem
    };
  },
  mounted() {
    // Add event listeners for ESC key and click outside
    document.addEventListener('keydown', this.handleEscKey);
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    // Remove event listeners and stop speech
    document.removeEventListener('keydown', this.handleEscKey);
    document.removeEventListener('click', this.handleOutsideClick);
    this.stopSpeaking();
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
      // Stop speaking when user makes a choice
      this.stopSpeaking();
      
      if (option.requiredResources && !this.checkResources(option.requiredResources)) {
        return;
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
      
      // Only speak if there's a next step and speech is enabled
      if (option.nextId !== null) {
        // Add a small delay to ensure previous speech is fully stopped
        setTimeout(() => {
          this.speakNpcMessage();
        }, 100);
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
      this.stopSpeaking();
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
      
      // Check if speech synthesis is available
      if (typeof window.speechSynthesis === 'undefined') {
        console.warn('Speech synthesis not available');
        return;
      }
      
      // Get speech settings from localStorage
      const speechSettings = JSON.parse(localStorage.getItem('speechSettings') || '{}');
      if (!speechSettings.enabled) return;
      
      // Replace {PlayerName} with actual name before speaking
      const textToSpeak = this.currentStoryStep.npcMessage.replace(/{PlayerName}/g, this.$store.state.character.name);
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Find the saved voice by URI if it exists
      let selectedVoice = null;
      if (speechSettings.selectedVoiceURI && voices.length > 0) {
        selectedVoice = voices.find(voice => voice.voiceURI === speechSettings.selectedVoiceURI);
      }
      
      // If no saved voice found, try to find Daniel (clear male voice)
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.name === 'Daniel');
      }
      
      // If Daniel not found, try other clear male voices
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('daniel') || 
          voice.name.toLowerCase().includes('alex') ||
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('james') ||
          voice.name.toLowerCase().includes('john') ||
          voice.name.toLowerCase().includes('michael') ||
          voice.name.toLowerCase().includes('robert') ||
          voice.name.toLowerCase().includes('thomas') ||
          voice.name.toLowerCase().includes('mark') ||
          voice.name.toLowerCase().includes('peter') ||
          voice.name.toLowerCase().includes('william')
        );
      }
      
      // If still no voice found, try any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
      }
      
      // Last resort: use first available voice
      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Apply other speech settings
      utterance.volume = speechSettings.volume || 1.0;
      utterance.rate = speechSettings.rate || 1.0;
      utterance.pitch = speechSettings.pitch || 1.0;
      
      utterance.onstart = () => {
        this.isSpeaking = true;
      };
      
      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.isSpeaking = false;
        this.currentUtterance = null;
      };
      
      try {
        // Ensure any previous speech is cancelled
        window.speechSynthesis.cancel();
        
        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to initialize speech:', error);
      }
    },
    
    stopSpeaking() {
      if (this.isSpeaking) {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
        this.currentUtterance = null;
      }
    },

    // New method to change voice
    setVoice(voice) {
      this.selectedVoice = voice;
    },
    
    // New method to update speech parameters
    updateSpeechParams(params) {
      if (params.volume !== undefined) this.speechVolume = params.volume;
      if (params.rate !== undefined) this.speechRate = params.rate;
      if (params.pitch !== undefined) this.speechPitch = params.pitch;
    },

    handleEscKey(event) {
      if (event.key === 'Escape') {
        this.stopSpeaking();
      }
    },

    handleOutsideClick(event) {
      // Check if click is outside the dialog
      const dialogElement = this.$refs.dialogSystem;
      if (dialogElement && !dialogElement.contains(event.target)) {
        this.stopSpeaking();
      }
    },

    async startStoryLine(id) {
      await this.$store.dispatch('startStoryLine', id);
      // Start speaking when a new storyline is started
      if (this.currentStoryStep) {
        setTimeout(() => {
          this.speakNpcMessage();
        }, 100);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-system {
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  padding: 15px;
  color: white;
  text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
  font-size: 1rem;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.dialog-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dialog-logo {
  width: 24px;
  height: 24px;
}

.dialog-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  font-weight: bold;
}

.stop-speaking-btn {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #ff4444;
    color: #000;
    transform: scale(1.05);
  }
}

.dialog-content {
  flex: 1;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 6px;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
    
    &:hover {
      background: #444;
    }
  }
}

.conversation-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.conversation-wrapper {
  padding: 15px;
  height: 100%;
}

.conversation-box {
  display: flex;
  align-items: flex-start;
  margin: 15px 0px;
  gap: 10px;
}

.npc-box {
  flex-direction: row;
}

.player-box {
  flex-direction: row-reverse;
}

.speaker-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 60px;
}

.speaker-badge {
  font-size: 0.7rem;
  color: #00ff00;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 4px rgba(0, 255, 0, 0.3);
  background: rgba(0, 255, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.player-avatar .sidebar-icon {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.sidebar-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #00ff00;
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px rgba(0, 255, 0, 0.5);
  }
}

.message-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  flex-grow: 1;
  border: 1px solid rgba(0, 255, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00ff00, #00cc00);
    opacity: 0.7;
  }
}

.npc-message {
  margin-right: 15px;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.player-message {
  margin-left: 15px;
  text-align: right;
}

.player-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-btn {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 6px;
  padding: 10px 15px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: rgba(0, 255, 0, 0.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    border-color: #00ff00;

    &::before {
      left: 100%;
    }
  }

  &.cancel-btn {
    background: rgba(255, 68, 68, 0.1);
    border-color: #ff4444;
    color: #ff4444;

    &:hover {
      background: rgba(255, 68, 68, 0.15);
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
    }
  }
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.resource-requirements {
  display: flex;
  gap: 8px;
  margin-bottom: 5px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.resource-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.resource-amount {
  font-size: 0.7rem;
  color: #00ff00;
  font-weight: bold;
}

.option-text {
  font-size: 0.8rem;
  line-height: 1.3;
}

.storylines-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.storylines-wrapper {
  padding: 15px;
  height: 100%;
}

.storylines-content {
  height: 100%;
}

.storyline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.storyline-card {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: rgba(0, 255, 0, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 255, 0, 0.3);
    border-color: #00ff00;

    &::before {
      left: 100%;
    }
  }
}

.storyline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.storyline-title {
  font-size: 0.8rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 4px rgba(0, 255, 0, 0.3);
}

.storyline-level-badge {
  background: #ff4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}

.storyline-level {
  font-size: 0.6rem;
  font-weight: bold;
  color: #aaa;
}

.no-storylines {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-title {
  color: #00ff00;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.empty-text {
  font-size: 13px;
  margin: 0;
  font-style: italic;
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

@media (max-width: 768px) {
  .dialog-system {
    padding: 10px;
  }

  .conversation-wrapper {
    padding: 10px;
  }

  .storylines-wrapper {
    padding: 10px;
  }

  .sidebar-icon {
    width: 40px;
    height: 40px;
  }

  .message-box {
    padding: 12px;
  }

  .npc-message,
  .player-message {
    font-size: 0.9rem;
  }

  .option-btn {
    padding: 8px 12px;
    font-size: 0.7rem;
  }

  .storyline-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .storyline-card {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .dialog-system {
    padding: 8px;
  }

  .conversation-wrapper {
    padding: 8px;
  }

  .storylines-wrapper {
    padding: 8px;
  }

  .sidebar-icon {
    width: 35px;
    height: 35px;
  }

  .message-box {
    padding: 10px;
  }

  .npc-message,
  .player-message {
    font-size: 0.8rem;
  }

  .option-btn {
    padding: 6px 10px;
    font-size: 0.6rem;
  }

  .storyline-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .storyline-card {
    padding: 10px;
  }
}
</style>
