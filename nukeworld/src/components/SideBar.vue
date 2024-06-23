<template>
  <div class="d-flex flex-row flex-shrink-0 sidebar" :class="{ 'show': sidebarOpen }">
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
        <div class="nav-item-name price-box">Enemies</div>
        <EnemyEncounters />
      </li>
      <li class="nav-item mx-2">
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
  height: 4.5rem;
  width: 100%;
  transition: height 0.3s ease-in-out;
  z-index: 1000;
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
  border: 2px solid #fff; /* Standard grænsefarve */
  transition: border-color 0.3s ease; /* Tilføjer en blød overgang for farveændringen */
}

.nav-item-name.price-box.new-story {
  border-color: #28a745; /* Success farve (grøn) når der er en ny historie */
}
</style>