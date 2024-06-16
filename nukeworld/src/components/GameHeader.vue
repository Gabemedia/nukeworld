<template>
  <div class="d-flex justify-content-between bg-primary bg-gradient p-2">
    <div v-if="equippedWeapons.length && equippedArmor" class="col-4 text-capitalize d-flex justify-content-start text-light text-center">
      <img :src="require('@/assets/interface/icons/gun.png')" title="Exp" style="width: 20px;" class="mx-2">
      Attack: {{ equippedWeapons[0].attack }}
      <img :src="require('@/assets/interface/icons/shield.png')" title="Exp" style="width: 20px;" class="mx-2">
      Defence: {{ equippedArmor.defence }}
    </div>
    <div v-else-if="equippedWeapons.length" class="col-4 text-capitalize d-flex justify-content-start text-light text-center">
      <img :src="require('@/assets/interface/icons/gun.png')" title="Exp" style="width: 20px;" class="mx-2">
      Attack: {{ equippedWeapons[0].attack }}
    </div>
    <div v-else class="col-4 text-capitalize d-flex justify-content-start text-light text-center">
´    </div>
    <div class="col-4 text-capitalize d-flex justify-content-center text-light text-center">
      Health: {{ character.health }}/100
    </div>
    <div class="col-4 text-capitalize d-flex justify-content-end text-light text-center">
      Money: {{ character.money }}
    </div>
  </div>
  <ExpLvl />    
    <!-- <CharacterInfo /> -->
    <QuestLog />
    <InventoryLog />
    <EnemyEncounters />
</template>

<script>
import { mapState } from 'vuex';
// import CharacterInfo from './data/CharacterInfo.vue';
import ExpLvl from './data/ExpLvl.vue';
import QuestLog from './data/QuestLog.vue';
import InventoryLog from './data/InventoryLog.vue';
import EnemyEncounters from './data/EnemyEncounters.vue';

export default {
  name: 'GameHeader',
  components: {
    // CharacterInfo,
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
  methods: {
    toggleMap() {
      this.$emit('toggleMap');
    },
    toggleMap2() {
      this.$emit('toggleMap2');
    },
  },
};
</script>

<style scoped>

</style>
