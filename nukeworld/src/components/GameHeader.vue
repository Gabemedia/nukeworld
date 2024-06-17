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
  <ExpLvl />    
  <CharacterInfo />
</template>

<script>
import { mapState } from 'vuex';
import ExpLvl from './data/ExpLvl.vue';

export default {
  name: 'GameHeader',
  components: {
    ExpLvl,
  },
  data() {
    return {
      sidebarOpen: false,
    };
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
};
</script>

<style scoped>
</style>
