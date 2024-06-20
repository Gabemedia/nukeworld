<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/inventory.png`)" title="Inventory Log">
  </button>
  <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body inventory-log-body">
          <InventoryStash />
          <EquippedWeaponInfo />
          <EquippedArmorInfo /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InventoryStash from './InventoryStash.vue';
import EquippedWeaponInfo from './controller/EquippedWeaponInfo.vue';
import EquippedArmorInfo from './controller/EquippedArmorInfo.vue';

export default {
  components: {
    InventoryStash,
    EquippedWeaponInfo,
    EquippedArmorInfo,
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

<style scoped>
.card-text-header {
  font-weight: 600;
  font-size: 1rem;
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
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 100%;
    margin: 1.75rem auto;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 300px;
  overflow-y: scroll;
}
.modal-content {
  position: relative;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}
</style>
