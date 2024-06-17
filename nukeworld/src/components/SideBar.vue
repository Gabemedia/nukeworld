<template>
  <div class="d-flex flex-column flex-shrink-0 sidebar" :class="{ 'show': sidebarOpen }">
    <div class="d-block p-3 link-dark text-decoration-none" style="height:70px;"></div>
    <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
      <li class="nav-item">
        <QuestLog />
      </li>
      <li class="nav-item">
        <InventoryLog />
      </li>
      <li class="nav-item">
        <EnemyEncounters />
      </li>
      <li class="nav-item">
        <PlayerShop />
      </li>
    </ul>
  </div>
</template>

<script>
import QuestLog from './data/QuestLog.vue';
import InventoryLog from './data/InventoryLog.vue';
import EnemyEncounters from './data/EnemyEncounters.vue';
import PlayerShop from './data/PlayerShop.vue';

export default {
  name: 'SideBar',
  components: {
    QuestLog,
    InventoryLog,
    EnemyEncounters,
    PlayerShop,
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

</style>
