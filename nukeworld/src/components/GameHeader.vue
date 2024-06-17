<template>
  <div class="d-flex flex-sm-column flex-md-row justify-content-between header p-2">
    <div v-if="equippedWeapons.length && equippedArmor" class="col-md-4 text-capitalize d-flex justify-content-start text-light text-center my-sm-1">
      <img :src="require(`@/assets/interface/icons/weapons/${equippedWeapons[0].name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedWeapons[0].name" style="width: 20px;" class="mx-2">
      <span class="mobile-text">Attack: {{ equippedWeapons[0].attack }}</span>
      <img :src="require(`@/assets/interface/icons/armor/${equippedArmor.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedArmor.name" style="width: 20px;" class="mx-2">
      <span class="mobile-text">Defence: {{ equippedArmor.defence }}</span>
    </div>
    <div v-else-if="equippedWeapons.length" class="col-md-4 text-capitalize d-flex justify-content-start text-light text-center my-sm-1">
      <img :src="require(`@/assets/interface/icons/weapons/${equippedWeapons[0].name.toLowerCase().replace(/ /g, '_')}.png`)" :title="equippedWeapons[0].name" style="width: 20px;" class="mx-2">
      <span class="mobile-text">Attack: {{ equippedWeapons[0].attack }}</span>
    </div>
    <div v-else class="col-md-4 text-capitalize d-flex justify-content-start text-light text-center my-sm-1">
    </div>
    <div class="col-md-4 text-capitalize d-flex justify-content-center text-light text-center my-sm-1">
      <HealthBar />
    </div>
    <div class="col-md-4 text-capitalize d-flex justify-content-end text-light text-center my-sm-1">
      <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money" class="me-1">
      <span class="mobile-text">{{ character.money }}</span>
    </div>
  </div>
  <ExpLvl />    
  <CharacterInfo />
</template>


<script>
import { mapState } from 'vuex';
import ExpLvl from './data/ExpLvl.vue';
import HealthBar from './data/HealthBar.vue';

export default {
  name: 'GameHeader',
  components: {
    ExpLvl,
    HealthBar,
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

@media screen and (max-width: 600px) {
  .header {
    flex-direction: row;
    align-items: center;
    padding: 5px;
  }

  .col-md-4 {
    margin-bottom: 0;
    justify-content: center;
  }

  .mobile-text {
    font-size: 0.666em;
  }
}
</style>
