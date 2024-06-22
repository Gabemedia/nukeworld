<template>
  <div class="d-flex flex-column flex-shrink-0 sidebar ms-2" :class="{ 'show': sidebarOpen }">
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item mb-1">
        <div class="nav-item-name price-box position-relative">
          Story
          <div v-if="hasNewStory" class="new-story-indicator"></div>
        </div>
        <StoryLog />
      </li>
      <li class="nav-item mb-1">
        <div class="nav-item-name price-box">Quests</div>
        <QuestLog />
      </li>
      <li class="nav-item mb-1">
        <div class="nav-item-name price-box">Inventory</div>
        <InventoryLog />
      </li>
      <li class="nav-item mb-1">
        <div class="nav-item-name price-box">Enemies</div>
        <EnemyEncounters />
      </li>
      <li class="nav-item mb-1">
        <div class="nav-item-name price-box">Shop</div>
        <PlayerShop />
      </li>
    </ul>
  </div>
</template>

<script>
import QuestLog from './data/QuestLog.vue';
import InventoryLog from './data/InventoryLog.vue';
import EnemyEncounters from './data/EnemyEncounters.vue';
import StoryLog from './data/StoryLog.vue';
import PlayerShop from './data/PlayerShop.vue';

export default {
  name: 'SideBar',
  components: {
    QuestLog,
    InventoryLog,
    EnemyEncounters,
    StoryLog,
    PlayerShop,
  },
  computed: {
    hasNewStory() {
      return this.$store.getters.availableStoryLines.length > 0;
    }
  },
  data() {
    return {
      sidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
};
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 4.5rem;
  transition: width 0.3s ease-in-out;
  z-index: -1;
}

.sidebar.show {
  width: 280px;
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

.new-story-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: #00ff00;
  border-radius: 50%;
}
</style>
