<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/settings.png`)" title="User Settings">
  </button>
  <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Game Settings</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body settings-modal-body">
          <div class="settings-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab" 
              @click="currentTab = tab"
              :class="['tab-button', { active: currentTab === tab }]"
            >
              {{ tab }}
            </button>
          </div>
          <div class="settings-content">
            <div v-if="currentTab === 'Display'" class="display-settings">
              <h6>Screen Size</h6>
              <div class="screen-size-buttons">
                <button 
                  v-for="size in screenSizes" 
                  :key="size.name"
                  @click="setScreenSize(size.width, size.height)"
                  class="btn btn-secondary"
                >
                  {{ size.name }}
                </button>
              </div>
            </div>
            <div v-if="currentTab === 'Audio'" class="audio-settings">
              <h6>Audio Settings</h6>
              <!-- Add audio settings here -->
            </div>
            <div v-if="currentTab === 'Gameplay'" class="gameplay-settings">
              <h6>Gameplay Settings</h6>
              <!-- Add gameplay settings here -->
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'UserSettings',
  
  data() {
    return {
      showModal: false,
      currentTab: 'Display',
      tabs: ['Display', 'Audio', 'Gameplay'],
      screenSizes: [
        { name: '1920x1080', width: 1920, height: 1080 },
        { name: '1600x900', width: 1600, height: 900 },
        { name: '1366x768', width: 1366, height: 768 },
        { name: '1280x720', width: 1280, height: 720 },
      ],
    };
  },
  computed: {
    ...mapState(['character']),
  },
  methods: {
    ...mapMutations(['updateCharacter']),
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    setScreenSize(width, height) {
      // This is a placeholder. In a real application, you'd need to implement
      // the actual screen size change logic here.
      console.log(`Setting screen size to ${width}x${height}`);
      // You might want to dispatch an action or commit a mutation here
      // to update the application state with the new screen size.
    },
    // You can add more methods for handling audio and gameplay settings here
  },
};
</script>

<style scoped>
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
  background-color: rgba(0, 0, 0, 0.7);
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
  color: #00ff00;
}

.modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 0.75rem 1rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1.2rem;
}

.settings-modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  border-top: 1px solid #00ff00;
  padding: 0.75rem;
}

.btn-secondary {
  background-color: #333;
  color: #00ff00;
  border: 1px solid #00ff00;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin: 0.25rem;
}

.btn-secondary:hover {
  background-color: #00ff00;
  color: #000;
}

.settings-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.tab-button {
  background-color: #333;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: #00ff00;
  color: #000;
}

.settings-content {
  background-color: #222;
  border: 1px solid #00ff00;
  padding: 1rem;
  border-radius: 5px;
}

.screen-size-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

h6 {
  color: #00ff00;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.sidebar-btn {
  background-color: rgba(0, 0, 0, 0.7);
  transition: all 0.3s ease;
}

.sidebar-btn:hover {
  background-color: rgba(0, 255, 0, 0.3);
}
</style>
