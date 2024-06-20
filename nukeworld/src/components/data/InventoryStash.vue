<template>
  <div class="text-white">
    <h2>Weapons</h2>
    <ul class="list-unstyled px-2">
      <li v-for="item in weapons" :key="item.uuid" class="d-flex align-items-center justify-content-between position-relative mb-3">
        <span v-if="isEquipped(item.uuid)" class="flex-grow-1 position-absolute active-equip translate-middle-y p-2 bg-success border border-light rounded-circle"></span>
        <span class="ms-4 col-6 fw-bold ">{{ item.name }}</span>
        <div class="d-flex col-6 flex-grow-1 align-items-center">
          <button class="btn btn-sm me-2 w-100" :class="isEquipped(item.uuid) ? 'btn-secondary' : 'btn-success'" @click="toggleEquipWeapon(item.uuid)">
            {{ isEquipped(item.uuid) ? 'Unequip' : 'Equip' }}
          </button>
          <button v-if="item.price === '-1'" class="btn btn-secondary btn-sm me-2 w-100" disabled>Not for Sale</button>
          <button v-else class="btn btn-danger btn-sm me-2 w-100" @click="sellWeapon(item.uuid)" :disabled="isEquipped(item.uuid)">Sell for {{ item.price }} Coins</button>
        </div>
      </li>
    </ul>
    <h2>Armor</h2>
    <ul class="list-unstyled px-2">
      <li v-for="item in armor" :key="item.uuid" class="d-flex align-items-center justify-content-between position-relative mb-3">
        <span v-if="isArmorEquipped(item.uuid)" class="flex-grow-1 position-absolute active-equip translate-middle-y p-2 bg-success border border-light rounded-circle"></span>
        <span class="ms-4 col-6 fw-bold">{{ item.name }}</span>
        <div class="d-flex col-6 flex-grow-1 align-items-center">
          <button class="btn btn-sm me-2 w-100" :class="isArmorEquipped(item.uuid) ? 'btn-secondary' : 'btn-success'" @click="toggleEquipArmor(item.uuid)">
            {{ isArmorEquipped(item.uuid) ? 'Unequip' : 'Equip' }}
          </button>
          <button v-if="item.price === '-1'" class="btn btn-secondary btn-sm me-2 w-100" disabled>Not for Sale</button>
          <button v-else class="btn btn-danger btn-sm me-2 w-100" @click="sellArmor(item.uuid)" :disabled="isArmorEquipped(item.uuid)">Sell for {{ item.price }} Coins</button>
        </div>
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
    weapons() {
      const handsWeapon = this.character.weapons.find(weapon => weapon.name === 'Hands');
      if (handsWeapon) {
        return [handsWeapon, ...this.character.weapons.filter(weapon => weapon.name !== 'Hands')];
      }
      return this.character.weapons;
    },
    armor() {
      return this.character.armor;
    },
  },
  methods: {
    ...mapActions(['equipWeapon', 'sellWeapon', 'equipArmor', 'sellArmor']),
    toggleEquipWeapon(itemUuid) {
      this.equipWeapon(itemUuid);
    },
    isEquipped(itemUuid) {
      return this.character.equippedWeapons.some(weapon => weapon.uuid === itemUuid);
    },
    toggleEquipArmor(itemUuid) {
      this.equipArmor(itemUuid);
    },
    isArmorEquipped(itemUuid) {
      return this.character.equippedArmor && this.character.equippedArmor.uuid === itemUuid;
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

.active-equip{
  top: 43%;
  scale: 0.7;
}
</style>
