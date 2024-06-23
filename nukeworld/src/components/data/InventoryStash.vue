<template>
  <div class="text-white">
    <div class="shop">
      <div class="shop-section">
        <h6 class="mb-3 text-uppercase fw-bold">Inventory</h6>
        <div class="shop-items d-flex flex-row">
          <div v-for="item in weapons" :key="item.uuid" class="shop-item position-relative" @click="toggleEquipWeapon(item.uuid)" @mouseover="showItemInfo(item, 'weapon')" @mouseleave="hideItemInfo">
            <span v-if="isEquipped(item.uuid)" class="position-absolute active-equip translate-middle p-2 bg-success border border-light rounded-circle"></span>
            <img :src="require(`@/assets/interface/icons/weapons/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
            <div class="item-actions">
              <button v-if="item.price !== '-1'" class="btn btn-danger btn-sm position-absolute top-100 start-100 translate-middle py-0 px-1" @click.stop="sellWeapon(item.uuid)" :disabled="isEquipped(item.uuid)">
                <p class="card-text m-0">{{ Math.floor(item.price * 0.1) }}</p>
              </button>
            </div>
            <div v-if="hoveredItem === item" class="item-info">
              <p class="mb-1 fw-bold small"><strong>Name:</strong> {{ item.name }}</p>
              <p class="mb-1 small"><strong>Attack:</strong> {{ item.attack }}</p>
              <p class="mb-1 small"><strong>Defence:</strong> {{ item.defence }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-section">
        <div class="shop-items d-flex flex-row">
          <div v-for="item in armor" :key="item.uuid" class="shop-item position-relative" @click="toggleEquipArmor(item.uuid)" @mouseover="showItemInfo(item, 'armor')" @mouseleave="hideItemInfo">
            <span v-if="isArmorEquipped(item.uuid)" class="position-absolute active-equip translate-middle p-2 bg-success border border-light rounded-circle"></span>
            <img :src="require(`@/assets/interface/icons/armor/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
            <div class="item-actions">
              <button v-if="item.price !== '-1'" class="btn btn-danger btn-sm position-absolute top-100 start-100 translate-middle py-0 px-1" @click.stop="sellArmor(item.uuid)" :disabled="isArmorEquipped(item.uuid)">
                <p class="card-text m-0">{{ Math.floor(item.price * 0.1) }}</p>
              </button>
            </div>
            <div v-if="hoveredItem === item" class="item-info">
              <p class="fw-bold"><strong>Name:</strong> {{ item.name }}</p>
              <p><strong>Attack:</strong> {{ item.attack }}</p>
              <p><strong>Defence:</strong> {{ item.defence }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-section">
        <div class="shop-items d-flex flex-row">
          <div v-for="item in aid" :key="item.uuid" class="shop-item position-relative">
            <img :src="require(`@/assets/interface/icons/aid/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
            <div class="item-actions">
              <button class="btn btn-success btn-sm position-absolute top-0 start-100 translate-middle py-0 px-1" @click="useAid(item.uuid)">
                <p class="card-text m-0">+</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'InventoryStash',
  data() {
    return {
      hoveredItem: null,
    };
  },
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
    aid() {
      return this.character.aid;
    },
  },
  methods: {
    ...mapActions(['equipWeapon', 'sellWeapon', 'equipArmor', 'sellArmor', 'useAid']),
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
    showItemInfo(item) {
      this.hoveredItem = item;
    },
    hideItemInfo() {
      this.hoveredItem = null;
    },
  },
};
</script>

<style scoped>
.active-equip {
  top: 0px;
  right: -15px;
  scale: 0.8;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
}

.shop-item {
  width: 70px;
  height: 70px;
  border: 1px solid #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 3px 6px;
  margin: 12px 12px 12px 0;
}

.shop-item img {
  max-width: 90%;
  max-height: 90%;
  scale: 1;
}
.card-text{
  font-size: 0.666rem;
}
.item-info {
  position: absolute;
  top: -50%;
  left: 150%;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1;
  width: 200px;
  text-align: left;
}
.item-info p{
  font-size: 0.8rem!important;
}
</style>
