<template>
  <div>
    <!-- Add confirmation modal -->
    <div v-if="isSettlementConfirmationModalOpen" class="modal" tabindex="-1" @click.self="closeConfirmationModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Settlement Placement</h5>
            <button type="button" class="btn-close" @click="closeConfirmationModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="resource-requirements">
              <div class="resource-item">
                <img :src="require('@/assets/interface/icons/resources/wood_scrap.png')" alt="Wood Scrap">
                <span>{{ settlementSettings.placementCosts.resource1Amount }} Wood Scrap</span>
              </div>
              <div class="resource-item">
                <img :src="require('@/assets/interface/icons/resources/steel_scrap.png')" alt="Steel Scrap">
                <span>{{ settlementSettings.placementCosts.resource2Amount }} Steel Scrap</span>
              </div>
            </div>
            <div class="message-container">
              <p class="message-text">It costs {{ settlementSettings.placementCosts.resource1Amount }} Wood & {{ settlementSettings.placementCosts.resource2Amount }} Steel Scrap to place a settlement.</p>
              <p class="instruction-text">Click anywhere on the map to confirm the location.</p>
            </div>
            <div class="button-group pb-2">
              <button @click="closeConfirmationModal" class="btn btn-primary">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Settlement Modal -->
    <SettlementModal ref="settlementModal" />
    
    <!-- Mobile Offcanvas -->
    <div class="offcanvas offcanvas-start w-25 d-md-none" tabindex="-1" id="sidebarOffcanvas">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title text-white">Game Menu</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div class="mobile-grid">
          <div class="menu-item">
            <div class="menu-button">STORY</div>
            <div class="icon-box">
              <StoryLog />
            </div>
          </div>

          <div class="menu-item">
            <div class="menu-button">QUESTS</div>
            <div class="icon-box">
              <QuestLog />
            </div>
          </div>

          <div class="menu-item">
            <div class="menu-button">INVENTORY</div>
            <div class="icon-box">
              <InventoryLog />
            </div>
          </div>

          <div class="menu-item">
            <div class="menu-button">SHOP</div>
            <div class="icon-box">
              <PlayerShop />
            </div>
          </div>

          <div class="menu-item">
            <div class="menu-button">SPECIAL</div>
            <div class="icon-box">
              <SpecialManager />
            </div>
          </div>

          <div class="menu-item">
            <div class="menu-button">SETTLEMENT</div>
            <div class="icon-box" @click="openSettlementModal">
              <img :src="require('@/assets/interface/icons/settlement.png')" alt="Settlement">
            </div>
          </div>

          <div class="menu-item">
            <div class="menu-button">SAVAGE</div>
            <div class="icon-box" @click="openSavageModal">
              <img :src="require('@/assets/interface/icons/encounter.png')" alt="Savage in the Wasteland">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <div class="d-none d-md-flex flex-row flex-shrink-0 sidebar" :class="{ 'show': sidebarOpen }">
      <ul class="nav nav-pills nav-flush flex-row mb-auto text-center">
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box position-relative" :class="{ 'new-story': hasNewStory }">
            Story
          </div>
          <StoryLog />
        </li>
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box">Quests</div>
          <QuestLog />
        </li>
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box">Inventory</div>
          <InventoryLog />
        </li>
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box">Shop</div>
          <PlayerShop />
        </li>
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box">SPECIAL</div>
          <SpecialManager />
        </li>
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box">Settlement</div>
          <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openSettlementModal">
            <img class="sidebar-icon" :src="require(`@/assets/interface/icons/settlement.png`)" title="Settlement">
          </button>
        </li>
        <li class="nav-item mx-2">
          <div class="nav-item-name price-box">Savage</div>
          <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openSavageModal">
            <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="Savage in the Wasteland">
          </button>
        </li>
      </ul>
    </div>
    
    <!-- Mobile Toggle Button -->
    <button class="toggle-btn d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas">
      <span class="toggle-arrow">&lt;</span>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import QuestLog from './data/QuestLog.vue';
import InventoryLog from './data/InventoryLog.vue';
import StoryLog from './data/StoryLog.vue';
import PlayerShop from './data/PlayerShop.vue';
import SpecialManager from './data/SpecialManager.vue';
import SettlementModal from './data/SettlementModal.vue';

export default {
  name: 'SideBar',
  components: {
    QuestLog,
    InventoryLog,
    StoryLog,
    PlayerShop,
    SpecialManager,
    SettlementModal,
  },
  computed: {
    ...mapState(['settlementMarker']),
    ...mapGetters('settlement', ['settings']),
    settlementSettings() {
      return this.settings;
    },
    hasNewStory() {
      return this.$store.getters.availableStoryLines.length > 0;
    },
    woodScrap() {
      return this.$store.state.inventory?.resources?.[1] || 0;
    },
    steelScrap() {
      return this.$store.state.inventory?.resources?.[2] || 0;
    },
  },
  data() {
    return {
      sidebarOpen: false,
      isSettlementConfirmationModalOpen: false,
    };
  },
  methods: {
    ...mapActions(['attemptPlaceSettlement', 'checkRequiredResources', 'useRequiredResources']),
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    async openSettlementModal() {
      if (this.settlementMarker) {
        // Call the settlement modal's openModal method directly
        this.$refs.settlementModal.openModal();
      } else {
        this.isSettlementConfirmationModalOpen = true;
      }
    },
    openSavageModal() {
      this.$emit('open-savage-modal');
    },
    closeConfirmationModal() {
      this.isSettlementConfirmationModalOpen = false;
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 4.5rem;
  width: 100%;
  transition: height 0.3s ease-in-out;
  z-index: 1000;
}

.sidebar-btn {
  background-color: rgba(0, 0, 0, 0.7);
}

.sidebar.show {
  height: auto;
}

.nav-item-name {
  font-size: 0.7rem;
  color: #fff;
  font-weight: 700;
  box-shadow: 0px 0px 10px 10px rgba(0,0,0,0.1);
  text-transform: uppercase;
}

.price-box {
  transform: translateY(60%);
  background-color: #000;
  color: #fff;
  border: 1px #fff solid;
  padding: 3px 6px;
  border-radius: 6px;
}

.position-relative {
  position: relative;
}

.nav-item-name.price-box {
  border: 2px solid #fff;
  transition: border-color 0.3s ease;
}

.nav-item-name.price-box.new-story {
  border-color: #28a745;
}

.offcanvas-start {
  width: 85% !important;
  max-width: 300px;
  background-color: rgba(0, 0, 0, 0.95);
  border-right: 2px solid rgba(255, 255, 255, 0.3);
}

.offcanvas-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem;
}

.offcanvas-title {
  font-size: 1.2rem;
  margin: 0;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* Mobile Menu Grid Layout */
.mobile-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;
}

.menu-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-button {
  background-color: transparent;
  border: 2px solid #ffffff;
  border-radius: 4px;
  color: #ffffff;
  padding: 10px 20px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 1rem;
  text-transform: uppercase;
  min-width: 200px;
}

.icon-box {
  width: 64px;
  height: 64px;
  background-color: transparent;
  border: 2px solid #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
}

.icon-box img,
.icon-box :deep(img),
.icon-box :deep(.sidebar-icon) {
  width: 50px !important;
  height: 50px !important;
  object-fit: contain;
}

/* Settlement specific styles to match others */
.menu-item:last-child {
  margin-top: 15px; /* Extra space for Settlement */
}

.menu-item:last-child .menu-button {
  margin-bottom: 12px;
}

.menu-item:last-child .icon-box {
  width: 64px;
  height: 64px;
}

.menu-item:last-child .icon-box img {
  width: 100%;
  height: 100%;
}

/* Toggle Button */
.toggle-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  z-index: 1050;
  width: 32px;
  height: 64px;
  background-color: #000000;
  border: 2px solid #ffffff;
  border-left: none;
  border-radius: 0 32px 32px 0;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.toggle-arrow {
  font-size: 1.2rem;
  font-weight: bold;
  transform: rotate(180deg);
}

.offcanvas.show ~ .toggle-btn {
  opacity: 0;
  visibility: hidden;
}

@media (min-width: 768px) {
  .toggle-btn {
    display: none;
  }
  .sidebar-icon {
    width: 35px;
    height: 35px;
  }
}

/* Add confirmation modal styles */
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
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem auto;
  }
}

.modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
  color: #fff;
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
  font-size: 1rem;
}

.modal-body {
  padding: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-close:hover {
  color: #00cc00;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #00cc00;
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #00ff00;
  color: #000;
}

.message-container {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 255, 0, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 0, 0.1);
}

.message-text {
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.instruction-text {
  font-size: 1rem;
  color: #00ff00;
  margin: 0;
  font-style: italic;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.resource-requirements {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 255, 0, 0.1);
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 0, 0.2);

  img {
    width: 24px;
    height: 24px;
    image-rendering: pixelated;
  }

  span {
    color: #00ff00;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;

  .btn {
    min-width: 150px;
    padding: 10px 20px;
  }
}

@media (max-width: 768px) {
  .message-container {
    padding: 15px;
    margin: 15px 0;
  }

  .message-text {
    font-size: 1rem;
  }

  .instruction-text {
    font-size: 0.9rem;
  }

  .resource-requirements {
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
  }

  .resource-item {
    width: 100%;
    justify-content: center;
  }

  .button-group {
    margin-top: 15px;
    
    .btn {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .message-container {
    padding: 10px;
    margin: 10px 0;
  }

  .message-text,
  .instruction-text {
    font-size: 0.9rem;
  }
}
</style>
