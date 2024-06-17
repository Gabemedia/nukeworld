<template>
  <button class="btn btn-main btn-primary m-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasInventoryInfo">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/inventory.png`)" title="Quest Log">
  </button>
  <div style="width:500px" class="offcanvas offcanvas-start inventory-log-container" tabindex="-1" id="offcanvasInventoryInfo" aria-labelledby="offcanvasInventoryLabel">
    <div class="offcanvas-header card-text-header text-light bg-primary bg-gradient d-flex justify-content-between align-items-center">
      <h5 class="flex-grow-1">Inventory Log</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body inventory-log-body">
      <InventoryStash />
      <EquippedWeaponInfo />
      <EquippedArmorInfo /> 
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
};

</script>

<style scoped>
.card-text-header {
  font-weight: 600;
  font-size: 1rem;
}
</style>
