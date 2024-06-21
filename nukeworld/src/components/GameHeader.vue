<template>
  <div class="d-sm-none col-12">
    <div class="d-flex flex-row justify-content-between header p-2">
      <div class="col-md-6 text-capitalize d-flex justify-content-center text-light text-center my-sm-1">
        <HealthBar />
      </div>
      <div class="col-md-6 text-capitalize d-flex justify-content-end text-light text-center my-sm-1">
        <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money" class="me-1">
        <span class="mobile-text fw-bold fs-6">{{ character.money }}</span>
      </div>
    </div>
    <ExpLvl />    
    <CharacterInfo />
  </div>
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
    flex-direction:column;
    align-items: center;
    padding: 5px;
    gap: 12px;
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
