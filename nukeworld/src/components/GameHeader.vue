<template>
  <div class="d-flex justify-content-between bg-primary bg-gradient p-2">
    <div class="col-4 text-capitalize d-flex justify-content-start text-light text-center">Player: {{ character.name }}</div>
    <div class="col-4 text-capitalize d-flex justify-content-center text-light text-center">Money: {{ character.money }}</div>
    <div class="col-4 text-capitalize d-flex justify-content-end text-light text-center">
      Level: {{ character.level }}
    </div>
  </div>
  <ExpLvl />
  <CharacterInfo />
  <QuestsLines />
  <button @click="toggleMap" class="btn btn-primary m-2" type="button">Toggle Map</button>

</template>

<script>
import { mapState } from 'vuex';
import CharacterInfo from './data/CharacterInfo.vue';
import ExpLvl from './data/ExpLvl.vue';
import QuestsLines from './data/QuestsLines.vue';

export default {
  name: 'GameHeader',
  components: {
    CharacterInfo,
    ExpLvl,
    QuestsLines,
  },
  computed: {
    ...mapState(['character']),
  },
  methods: {
    toggleMap() {
      this.$emit('toggleMap');
    },
  },
};
</script>

<style scoped>
/* Your component's styles go here */
</style>
