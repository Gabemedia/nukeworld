<template>
  <div class="text-white">
    <div class="shop">
      <div class="shop-section">
        <h6 class="mb-3 text-uppercase fw-bold text-start text-success">Weapons</h6>
        <div class="shop-items d-flex flex-row flex-wrap">
          <div v-for="item in weapons" :key="item.uuid" class="shop-item position-relative" @click="toggleEquipWeapon(item.uuid)" @mouseover="showItemInfo(item, 'weapon')" @mouseleave="hideItemInfo">
            <span v-if="isEquipped(item.uuid)" class="active-equip"></span>
            <img :src="require(`@/assets/interface/icons/weapons/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
            <div class="item-actions">
              <button v-if="item.price !== '-1'" class="btn btn-danger btn-sm position-absolute top-100 start-100 translate-middle py-0 px-1" @click.stop="sellWeapon(item.uuid)" :disabled="isEquipped(item.uuid)">
                <p class="card-text m-0">{{ Math.floor(item.price * 0.1) }}</p>
              </button>
            </div>
            <div v-if="hoveredItem === item" class="item-info">
              <p class="mb-1 fw-bold small">Name: {{ item.name }}</p>
              <p class="mb-1 small">Attack: {{ item.attack }}</p>
              <p class="mb-1 small">Defence: {{ item.defence }}</p>
              <p class="mb-1 small">Description: {{ item.desc }}</p>
              <p class="mb-1 small">Price: {{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-section">
        <h6 class="mb-3 text-uppercase fw-bold text-start text-success">Armor</h6>
        <div class="shop-items d-flex flex-row flex-wrap">
          <div v-for="item in armor" :key="item.uuid" class="shop-item position-relative" @click="toggleEquipArmor(item.uuid)" @mouseover="showItemInfo(item, 'armor')" @mouseleave="hideItemInfo">
            <span v-if="isArmorEquipped(item.uuid)" class="active-equip"></span>
            <img :src="require(`@/assets/interface/icons/armor/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
            <div class="item-actions">
              <button v-if="item.price !== '-1'" class="btn btn-danger btn-sm position-absolute top-100 start-100 translate-middle py-0 px-1" @click.stop="sellArmor(item.uuid)" :disabled="isArmorEquipped(item.uuid)">
                <p class="card-text m-0">{{ Math.floor(item.price * 0.1) }}</p>
              </button>
            </div>
            <div v-if="hoveredItem === item" class="item-info">
              <p class="mb-1 fw-bold small">Name: {{ item.name }}</p>
              <p class="mb-1 small">Defence: {{ item.defence }}</p>
              <p class="mb-1 small">Description: {{ item.desc }}</p>
              <p class="mb-1 small">Price: {{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-section">
        <h6 class="mb-3 text-uppercase fw-bold text-start text-success">Aid</h6>
        <div class="shop-items d-flex flex-row flex-wrap">
          <div v-for="item in aid" :key="item.uuid" class="shop-item position-relative" @mouseover="showItemInfo(item, 'aid')" @mouseleave="hideItemInfo">
            <img :src="require(`@/assets/interface/icons/aid/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
            <div class="item-actions">
              <button class="btn btn-success btn-sm position-absolute top-0 start-100 translate-middle py-0 px-1" @click="useAid(item.uuid)">
                <p class="card-text m-0">+</p>
              </button>
            </div>
            <div v-if="hoveredItem === item" class="item-info">
              <p class="mb-1 fw-bold small">Name: {{ item.name }}</p>
              <p class="mb-1 small">Health: {{ item.health }}</p>
              <p class="mb-1 small">Description: {{ item.desc }}</p>
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

<style scoped lang="scss">
.item-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
}

.shop-section {
  margin-bottom: 20px;
}

.shop-items {
  gap: 12px;
}

.shop-item {
  width: 70px;
  height: 70px;
  border: 1px solid #00ff00;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 3px 6px;
  position: relative;
  background-color: rgba(0, 255, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 255, 0, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }

  img {
    max-width: 90%;
    max-height: 90%;
    scale: 1;
  }
}

.active-equip {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  background-color: #00ff00;
  border: 2px solid #000000;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00 inset;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00 inset;
  }
  50% {
    box-shadow: 0 0 20px #00ff00, 0 0 10px #00ff00 inset;
  }
  100% {
    box-shadow: 0 0 10px #00ff00, 0 0 5px #00ff00 inset;
  }
}

.card-text {
  font-size: 0.666rem;
}

.item-info {
  position: absolute;
  top: 100%;
  left: 182%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1;
  width: 250px;
  text-align: left;
  color: #fff;
  font-size: 0.8rem!important;
  border: 1px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.item-info p {
  margin-bottom: 2px;
}

.btn-danger, .btn-success {
  background-color: #333;
  border: 1px solid #00ff00;
  color: #00ff00;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #00ff00;
    color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .shop-item {
    width: 60px;
    height: 60px;
    margin: 8px 8px 8px 0;
  }

  .item-info {
    width: 120px;
    font-size: 0.7rem;
  }
}
</style>
