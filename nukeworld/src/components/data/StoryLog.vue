<template>
  <button 
    class="btn btn-main sidebar-btn border border-1 border-white m-2" 
    :class="{ 'new-story': hasNewStory }" 
    type="button" 
    @click="openModal"
  >
    <div class="icon-wrapper">
      <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" alt="Storyline">
      <span v-if="hasNewStory" class="new-story-badge">New</span>
    </div>
  </button>
  <div class="story-log-container">
    <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Story Log</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="!currentStoryLine" class="story-intro">
              <p>Welcome to your story log, survivor. Here you can track your progress and embark on new adventures in the wasteland.</p>
            </div>
            <div v-if="currentStoryLine" class="active-story">
              <h6 class="mb-3 text-uppercase fw-bold text-start">Active Story</h6>
              <div class="story-item">
                <div class="story-title">{{ currentStoryLine.name }}</div>
                <div class="story-progress">Progress: {{ currentStoryLine.currentStepIndex + 1 }} / {{ currentStoryLine.steps.length }}</div>
              </div>
            </div>
            <div v-if="!currentStoryLine">
              <div v-if="availableStoryLines.length > 0">
                <h6 class="mb-3 text-uppercase fw-bold text-start">Available Storylines</h6>
                <div class="storyline-grid">
                  <div v-for="storyLine in sortedAvailableStoryLines" :key="storyLine.id" class="story-item" @click="startStoryLine(storyLine.id)">
                    <div class="story-title">{{ storyLine.name }}</div>
                    <div class="story-level">Level Req: {{ storyLine.levelRequirement }}</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <h6 class="m-0 text-uppercase fw-bold text-start">Come back later for more Storylines</h6>
              </div>
            </div>
            <QuestDialog v-if="currentStoryLine" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestDialog from './controller/QuestDialog.vue';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'StoryLog',
  components: {
    QuestDialog,
  },
  data() {
    return {
      showModal: false,
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
    }
  },
  methods: {
    ...mapActions(['startStoryLine']),
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
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
  top: -10px;
  right: -10px;
  background-color: #00ff00;
  color: #000;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 800px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
}

.modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 1rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  color: #fff;
}

.story-intro {
  background-color: rgba(0, 255, 0, 0.1);
  border-left: 4px solid #00ff00;
  padding: 10px;
  margin-bottom: 20px;
}

.modal-footer {
  border-top: 1px solid #00ff00;
  padding: 1rem;
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00ff00;
    color: #000;
  }
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem auto;
  }
}

.active-story {
  margin-bottom: 20px;
}

.storyline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.story-item {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 255, 0, 0.2);
  }
}

.story-title {
  font-weight: bold;
  color: #00ff00;
  font-size: 0.9rem;
}

.story-level, .story-progress {
  font-size: 0.8rem;
  color: #aaa;
}
</style>