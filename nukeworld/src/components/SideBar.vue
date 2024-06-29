<template>
  <div class="sidebar" :style="{ transform: `scale(${uiScale})`, transformOrigin: 'top left' }">
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
    uiScale() {
      const width = window.innerWidth;
      if (width <= 1280) return 0.8;
      if (width <= 1440) return 1;
      if (width <= 1920) return 1.2;
      if (width <= 2880) return 1.5;
      if (width <= 3840) return 1.8;
      return 1;
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

.nav-item {
  position: relative;
  z-index: 1001;
}

.sidebar-btn,
.nav-item > * {
  pointer-events: auto;
}
</style>
