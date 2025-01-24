<template>
  <div>
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
            <div class="menu-button">SETTLEMENT</div>
            <div class="icon-box" @click="openSettlementModal">
              <img :src="require('@/assets/interface/icons/settlement.png')" alt="Settlement">
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
          <div class="nav-item-name price-box">Settlement</div>
          <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openSettlementModal">
            <img class="sidebar-icon" :src="require(`@/assets/interface/icons/settlement.png`)" title="Settlement">
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
import { mapState, mapActions } from 'vuex';
import QuestLog from './data/QuestLog.vue';
import InventoryLog from './data/InventoryLog.vue';
import StoryLog from './data/StoryLog.vue';
import PlayerShop from './data/PlayerShop.vue';

export default {
  name: 'SideBar',
  components: {
    QuestLog,
    InventoryLog,
    StoryLog,
    PlayerShop,
  },
  computed: {
    ...mapState(['settlementMarker']),
    hasNewStory() {
      return this.$store.getters.availableStoryLines.length > 0;
    },
  },
  data() {
    return {
      sidebarOpen: false,
    };
  },
  methods: {
    ...mapActions(['attemptPlaceSettlement']),
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    openSettlementModal() {
      this.$store.commit('setSettlementModalOpen', true);
    },
  },
};
</script>

<style scoped>
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
</style>
