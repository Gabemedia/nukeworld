<template>
  <div>
    <h2>Inventory</h2>
    <ul>
      <li v-for="item in inventory" :key="item.uuid">
        {{ item.name }}
        <button @click="toggleEquipWeapon(item.uuid)">
          {{ isEquipped(item.uuid) ? 'Unequip' : 'Equip' }}
        </button>
        <span v-if="isEquipped(item.uuid)" class="equipped-badge">Equipped</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'InventoryStash',
  computed: {
    ...mapState(['character']),
    inventory() {
      return this.character.inventory;
    },
  },
  methods: {
    ...mapActions(['equipWeapon']),
    toggleEquipWeapon(itemUuid) {
      this.equipWeapon(itemUuid);
    },
    isEquipped(itemUuid) {
      return this.character.equippedWeapons.some(weapon => weapon.uuid === itemUuid);
    },
  },
};
</script>

<style scoped>
.equipped-badge {
  background-color: green;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 8px;
}
</style>
