<template>
  <div class="d-flex justify-content-between bg-primary bg-gradient p-2">
    <div v-if="equippedWeapons.length && equippedArmor" class="col-4 text-capitalize d-flex justify-content-start text-light text-center">
      <img :src="require(`@/assets/interface/icons/weapons/${equippedWeapons[0].name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedWeapons[0].name" style="width: 20px;" class="mx-2">
      Attack: {{ equippedWeapons[0].attack }}
      <img :src="require(`@/assets/interface/icons/armor/${equippedArmor.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedArmor.name" style="width: 20px;" class="mx-2">
      Defence: {{ equippedArmor.defence }}
    </div>
    <div v-else-if="equippedWeapons.length" class="col-4 text-capitalize d-flex justify-content-start text-light text-center">
      <img :src="require(`@/assets/interface/icons/weapons/${equippedWeapons[0].name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedWeapons[0].name" style="width: 20px;" class="mx-2">
      Attack: {{ equippedWeapons[0].attack }}
    </div>
    <div v-else class="col-4 text-capitalize d-flex justify-content-start text-light text-center">
    </div>
    <div class="col-4 text-capitalize d-flex justify-content-center text-light text-center">
      Health: {{ character.health }}/100
    </div>
    <div class="col-4 text-capitalize d-flex justify-content-end text-light text-center">
      Money: {{ character.money }}
    </div>
  </div>
  <div class="quick-bar">
    <div class="quick-bar-slot" v-for="(component, index) in components" :key="index">
      <div class="quick-bar-key">{{ component.name }}</div>
      <component :is="component.component" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ExpLvl from './data/ExpLvl.vue';
import QuestLog from './data/QuestLog.vue';
import InventoryLog from './data/InventoryLog.vue';
import EnemyEncounters from './data/EnemyEncounters.vue';

export default {
  name: 'GameHeader',
  components: {
    ExpLvl,
    QuestLog,
    InventoryLog,
    EnemyEncounters,
  },
  computed: {
    ...mapState(['character']),
    equippedWeapons() {
      return this.character.equippedWeapons;
    },
    equippedArmor() {
      return this.character.equippedArmor;
    },
  },
  data() {
    return {
      components: [
        { name: 'Quest Log', component: QuestLog },
        { name: 'Inventory Log', component: InventoryLog },
        { name: 'Enemy Encounters', component: EnemyEncounters },
      ],
    };
  },
};
</script>

<style scoped>
.quick-bar {
  position: fixed;
  top: 125px;
  left: 5px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

.quick-bar-slot {
  width: 250px; /* Adjusted width to fit the component names */
  height: 50px;
  margin: 5px 0;
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
