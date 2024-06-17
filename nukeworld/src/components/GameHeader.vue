<template>
  <div class="d-flex flex-column flex-md-row justify-content-between header p-2">
    <div v-if="equippedWeapons.length && equippedArmor" class="col-md-4 text-capitalize d-flex justify-content-start text-light text-center mb-2 mb-md-0">
      <img :src="require(`@/assets/interface/icons/weapons/${equippedWeapons[0].name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedWeapons[0].name" style="width: 20px;" class="mx-2">
      Attack: {{ equippedWeapons[0].attack }}
      <img :src="require(`@/assets/interface/icons/armor/${equippedArmor.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedArmor.name" style="width: 20px;" class="mx-2">
      Defence: {{ equippedArmor.defence }}
    </div>
    <div v-else-if="equippedWeapons.length" class="col-md-4 text-capitalize d-flex justify-content-start text-light text-center mb-2 mb-md-0">
      <img :src="require(`@/assets/interface/icons/weapons/${equippedWeapons[0].name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedWeapons[0].name" style="width: 20px;" class="mx-2">
      Attack: {{ equippedWeapons[0].attack }}
    </div>
    <div v-else class="col-md-4 text-capitalize d-flex justify-content-start text-light text-center mb-2 mb-md-0">
    </div>
    <div class="col-auto text-capitalize d-flex justify-content-center text-light text-center mb-2 mb-md-0">
      <img style="width:20px;" :src="require(`@/assets/interface/icons/health.png`)" title="HealthBar" class="me-1"> {{ character.health }} / 100
    </div>
    <div class="col-md-4 text-capitalize d-flex justify-content-end text-light text-center">
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
.header {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
