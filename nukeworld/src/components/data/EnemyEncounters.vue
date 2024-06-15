<!-- src/components/data/EnemyEncounters.vue -->
<template>
      <button @click="openModal" class="btn btn-main btn-danger m-2" type="button">Enemy Encounters</button>
      <div v-if="showModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <BattleSystem @close="closeModal" />
        </div>
      </div>
  </template>
  
  <script>
  import BattleSystem from './controller/BattleSystem.vue';
  
  export default {
    name: 'EnemyEncounters',
    components: {
      BattleSystem,
    },
    data() {
      return {
        showModal: false,
      };
    },
    methods: {
      openModal() {
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
      },
    },
  };
  </script>
  