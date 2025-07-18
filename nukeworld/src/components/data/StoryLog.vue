<template>
  <button 
    class="btn btn-main sidebar-btn border border-1 border-white m-2" 
    :class="{ 'new-story': hasNewStory }" 
    type="button" 
    @click="openModal"
  >
    <div class="icon-wrapper">
      <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" alt="Storyline">
      <div v-if="hasNewStory" class="new-story-badge">NEW</div>
    </div>
  </button>
  
  <div v-if="showModal" class="shop-modal" tabindex="-1" @click.self="closeModal">
    <div class="shop-dialog">
      <div class="shop-content">
        <div class="shop-header">
          <div class="shop-title-wrapper">
            <img class="shop-logo" :src="require(`@/assets/interface/icons/encounter.png`)" alt="Story Log Icon">
            <h5 class="shop-title">Story Log</h5>
          </div>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="story-content">
            <div v-if="!currentStoryLine" class="story-intro">
              <div class="intro-header">
                <span class="intro-title">Did you know?</span>
              </div>
              <p class="intro-text" v-html="currentRandomMessage"></p>
            </div>
            
            <div v-if="currentStoryLine" class="active-story">
              <div class="section-header">
                <h6 class="section-title">Active Story</h6>
              </div>
              <div class="story-item active-story-item">
                <div class="story-title">{{ currentStoryLine.name }}</div>
                <div class="story-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${(currentStoryLine.currentStepIndex + 1) / currentStoryLine.steps.length * 100}%` }"></div>
                  </div>
                  <span class="progress-text">Progress: {{ currentStoryLine.currentStepIndex + 1 }} / {{ currentStoryLine.steps.length }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="!currentStoryLine">
              <div v-if="availableStoryLines.length > 0">
                <div class="section-header">
                  <h6 class="section-title">Available Storylines</h6>
                </div>
                <div class="storyline-grid">
                  <div v-for="storyLine in sortedAvailableStoryLines" :key="storyLine.id" class="story-item" @click="startStoryLineAndSpeak(storyLine.id)">
                    <div class="story-header">
                      <div class="story-title">{{ storyLine.name }}</div>
                      <div class="story-level-badge">Lv.{{ storyLine.levelRequirement }}</div>
                    </div>
                    <div class="story-level">Level Requirement: {{ storyLine.levelRequirement }}</div>
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
            
            <QuestDialog ref="questDialog" v-if="currentStoryLine" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestDialog from './controller/QuestDialog.vue';
import { mapGetters, mapState, mapActions } from 'vuex';
import helpMessages from '@/store/helpMessages';
import { ref } from 'vue';

export default {
  name: 'StoryLog',
  components: {
    QuestDialog,
  },
  setup() {
    const questDialog = ref(null);
    return { questDialog };
  },
  data() {
    return {
      showModal: false,
      helpMessages: helpMessages,
      currentRandomMessage: '',
    };
  },
  computed: {
    ...mapGetters(['availableStoryLines']),
    ...mapState(['currentStoryLineId', 'storyLines']),
    hasNewStory() {
      return this.availableStoryLines.length > 0;
    },
    currentStoryLine() {
      return this.storyLines.find(story => story.id === this.currentStoryLineId);
    },
    sortedAvailableStoryLines() {
      return [...this.availableStoryLines].sort((a, b) => a.levelRequirement - b.levelRequirement);
    },
  },
  methods: {
    ...mapActions(['startStoryLine']),
    openModal() {
      this.showModal = true;
      this.setRandomMessage();
    },
    closeModal() {
      this.showModal = false;
    },
    setRandomMessage() {
      const randomIndex = Math.floor(Math.random() * this.helpMessages.length);
      let message = this.helpMessages[randomIndex].message;
      this.currentRandomMessage = message.replace(/{MyName}/g, this.$store.state.character.name);
    },
    async startStoryLineAndSpeak(storyLineId) {
      await this.startStoryLine(storyLineId);
      // Use the template ref to access QuestDialog
      this.$nextTick(() => {
        if (this.$refs.questDialog) {
          this.$refs.questDialog.speakNpcMessage();
        }
      });
    }
  },
};
</script>

<style scoped lang="scss">
.story-log-container {
  position: relative;
}

.icon-wrapper {
  position: relative;
  display: inline-block;
}

.sidebar-btn {
  border: 1px solid #fff !important;
  transition: all 0.3s ease !important;

  &.new-story {
    border-color: #00ff00 !important;
    box-shadow: 0 0 10px #00ff00;
  }
}

.new-story-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.shop-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shop-dialog {
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.shop-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.shop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding: 15px 15px 10px 15px;
}

.shop-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-logo {
  width: 24px;
  height: 24px;
}

.shop-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff0000;
    transform: scale(1.1);
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 0;
  height: calc(90vh - 120px);
  overflow: hidden;
}

.story-content {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 6px;
  height: 100%;
  overflow-y: auto;
  padding: 15px;

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

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
}

.section-title {
  color: #00ff00;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.story-intro {
  background: rgba(0, 255, 0, 0.1);
  border-left: 4px solid #00ff00;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}

.intro-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.intro-title {
  color: #00ff00;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.intro-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.active-story {
  margin-bottom: 20px;
}

.active-story-item {
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  border-radius: 6px;
  padding: 15px;
}

.storyline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.story-item {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  }
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.story-title {
  font-weight: bold;
  color: #00ff00;
  font-size: 0.9rem;
  text-shadow: 0 0 4px rgba(0, 255, 0, 0.3);
}

.story-level-badge {
  background: #ff4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
}

.story-level, .story-progress {
  font-size: 0.8rem;
  color: #aaa;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #00ff00;
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
}

.progress-text {
  font-size: 0.7rem;
  color: #00ff00;
  font-weight: bold;
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

@media (max-width: 768px) {
  .shop-dialog {
    padding: 10px;
    max-height: 100vh;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .modal-body {
    height: calc(100vh - 120px);
  }

  .shop-header {
    padding: 10px 10px 8px 10px;
  }

  .story-content {
    padding: 10px;
  }

  .storyline-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .story-item {
    padding: 12px;
  }

  .story-intro {
    padding: 12px;
  }

  .active-story-item {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .shop-header {
    padding: 8px 8px 6px 8px;
  }

  .story-content {
    padding: 8px;
  }

  .storyline-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .story-item {
    padding: 10px;
  }

  .story-intro {
    padding: 10px;
  }

  .active-story-item {
    padding: 10px;
  }
}
</style>
