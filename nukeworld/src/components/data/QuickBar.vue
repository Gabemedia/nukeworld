<template>
  <div class="quick-bar">
    <div class="quick-bar-slot" v-for="(slot, index) in slots" :key="index">
      <div class="quick-bar-key">{{ index + 1 }}</div>
      <div class="quick-bar-item" v-if="getEquippedItem(index)" @click="toggleDropdown(index)">
        <img v-if="index === 0" :src="require(`@/assets/interface/icons/weapons/${getEquippedItem(index).name.toLowerCase().replace(/ /g, '_')}.png`)" :title="getEquippedItem(index).name" />
        <img v-else-if="index === 1" :src="require(`@/assets/interface/icons/armor/${getEquippedItem(index).name.toLowerCase().replace(/ /g, '_')}.png`)" :title="getEquippedItem(index).name" />
        <img v-else-if="index === 2" :src="require(`@/assets/interface/icons/aid/${getEquippedItem(index).img}`)" :title="getEquippedItem(index).name" />
        <span v-if="index === 2" class="use-aid-button" title="Use Aid Item" @click.stop="useEquippedAidItem">
          +
        </span>
      </div>
      <div class="dropdown-menu-hotbar" v-show="showDropdown[index]">
        <div class="dropdown-item" v-for="item in getItems(index)" :key="item.uuid" @click="handleSelectItem(index, item)">
          <img v-if="index === 0" :src="require(`@/assets/interface/icons/weapons/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
          <img v-else-if="index === 1" :src="require(`@/assets/interface/icons/armor/${item.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="item.name" />
          <img v-else-if="index === 2" :src="require(`@/assets/interface/icons/aid/${item.img}`)" :title="item.name" />
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
    ...mapActions(['equipWeapon', 'equipArmor', 'useAid']),
    toggleDropdown(index) {
      this.showDropdown = this.showDropdown.map((show, i) => i === index ? !show : false);
    },
    getItems(index) {
      if (index === 0) {
        return this.character.weapons;
      } else if (index === 1) {
        return this.character.armor;
      } else if (index === 2) {
        return this.character.aid;
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
      } else if (index === 2) {
        this.$store.commit('setFirstAidItem', item);
      }
    },
    getEquippedItem(index) {
      if (index === 0) {
        return this.character.equippedWeapons[0];
      } else if (index === 1) {
        return this.character.equippedArmor;
      } else if (index === 2) {
        return this.character.aid.length > 0 ? this.character.aid[0] : null;
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
    useEquippedAidItem() {
      const equippedAidItem = this.getEquippedItem(2);
      if (equippedAidItem) {
        this.useAid(equippedAidItem.uuid);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.quick-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  z-index: 9999;
}

.quick-bar-slot {
  width: 50px;
  height: 50px;
  margin: 0 5px;
  border: 1px solid #00ff00;
  border-radius: 5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 255, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 255, 0, 0.2);
  }
}

.quick-bar-key {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000;
  color: #00ff00;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid #00ff00;
}

.quick-bar-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
}

.use-aid-button {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #00ff00;
  color: #000;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00cc00;
  }
}

.dropdown-menu-hotbar {
  position: absolute;
  bottom: 55px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.dropdown-item {
  width: 40px;
  height: 40px;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ff00;
    background-color: rgba(0, 255, 0, 0.1);
  }

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
}

@media screen and (max-width: 768px) {
  .quick-bar {
    width: 90%;
    justify-content: space-around;
  }

  .quick-bar-slot {
    width: 40px;
    height: 40px;
  }

  .quick-bar-slot:nth-child(n+6) {
    display: none;
  }
}
</style>
