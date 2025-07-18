<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/inventory.png`)" title="Inventory Log">
  </button>
  <div v-if="showModal" class="shop-modal" tabindex="-1" @click.self="closeModal">
    <div class="shop-dialog">
      <div class="shop-content">
        <div class="shop-header">
          <div class="shop-title-wrapper">
            <img class="shop-logo" :src="require(`@/assets/interface/icons/inventory.png`)" alt="Inventory Icon">
            <h5 class="shop-title">Character Inventory</h5>
          </div>
          <div class="player-money">
            <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
            <span>{{ character.money }}</span>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <InventoryStash @close-modal="closeModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InventoryStash from './InventoryStash.vue';
import { mapState } from 'vuex';

export default {
  components: {
    InventoryStash,
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapState(['character']),
  },
  methods: {
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
  background: rgba(0, 0, 0, 0.9);
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
  padding: 15px;
}

.shop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
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
}

.player-money {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 0, 0.1);
  border: 1px solid #ffff00;
  border-radius: 4px;
  color: #ffff00;
  font-size: 14px;

  img {
    width: 16px;
    height: 16px;
  }
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  
  &:hover {
    color: #ff0000;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 0;
  height: calc(90vh - 70px);
  overflow: hidden;
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
    height: calc(100vh - 70px);
  }
}

@media (max-width: 480px) {
  .shop-content {
    padding: 10px;
  }
}
</style>
