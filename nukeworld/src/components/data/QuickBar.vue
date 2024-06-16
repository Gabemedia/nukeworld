<!-- QuickBar.vue -->
<template>
  <div class="quick-bar">
    <div class="quick-bar-slot" v-for="(slot, index) in slots" :key="index">
      <div class="quick-bar-key">{{ index + 1 }}</div>
      <div class="quick-bar-item" v-if="getEquippedItem(index)" @click="toggleDropdown(index)">
        <img v-if="index === 0" :src="require(`@/assets/interface/icons/weapons/${getEquippedItem(index).name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="getEquippedItem(index).name" />
        <img v-else-if="index === 1" :src="require(`@/assets/interface/icons/armor/${getEquippedItem(index).name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="getEquippedItem(index).name" />
      </div>
      <div class="dropdown-menu" v-show="showDropdown[index]">
        <div v-for="item in getItems(index)" :key="item.uuid" @click="handleSelectItem(index, item)">
          <img :src="require(`@/assets/interface/icons/${index === 0 ? 'weapons' : 'armor'}/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="item.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'QuickBar',
  data() {
    return {
      slots: Array(10).fill({ item: null }),
      showDropdown: Array(10).fill(false),
    };
  },
  computed: {
    ...mapState(['character']),
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    ...mapActions(['equipWeapon', 'equipArmor']),
    toggleDropdown(index) {
      this.showDropdown = this.showDropdown.map((show, i) => i === index ? !show : false);
    },
    getItems(index) {
      if (index === 0) {
        return this.character.weapons;
      } else if (index === 1) {
        return this.character.armor;
      }
      return [];
    },
    handleSelectItem(index, item) {
      this.selectItem(index, item);
      this.closeDropdown(index);
    },
    selectItem(index, item) {
      this.slots[index].item = item;
      if (index === 0) {
        this.equipWeapon(item.uuid);
      } else if (index === 1) {
        this.equipArmor(item.uuid);
      }
    },
    getEquippedItem(index) {
      if (index === 0) {
        return this.character.equippedWeapons[0];
      } else if (index === 1) {
        return this.character.equippedArmor;
      }
      return null;
    },
    handleKeyDown(event) {
      const key = event.key;
      if (key >= '1' && key <= '9') {
        event.preventDefault();
        const index = parseInt(key) - 1;
        this.toggleDropdown(index);
      }
    },
    closeDropdown(index) {
      this.showDropdown[index] = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.quick-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

.quick-bar-slot {
  width: 50px;
  height: 50px;
  margin: 0 5px;
  border: 2px solid #ccc;
  border-radius: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quick-bar-key {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000;
  color: #fff;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
}

.quick-bar-item img {
  max-width: 100%;
  max-height: 100%;
}

.dropdown-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.dropdown-menu img {
  width: 40px;
  height: 40px;
  margin: 5px;
  cursor: pointer;
}
</style>
