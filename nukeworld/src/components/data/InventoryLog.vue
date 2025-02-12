<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/inventory.png`)" title="Inventory Log">
  </button>
  <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Inventory</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <InventoryStash />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InventoryStash from './InventoryStash.vue';

export default {
  components: {
    InventoryStash,
  },
  data() {
    return {
      showModal: false,
    };
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
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem!important;
  max-height: 70vh;
  overflow-y: auto;
  color: #fff;
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
</style>
