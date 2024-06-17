<!-- src/components/data/EnemyEncounters.vue -->
<template>
    <button class="btn btn-main btn-primary m-2" type="button" >
      <img @click="openModal"  class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="Enemy Encounter">
    </button>
      <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Battle System</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <BattleSystem />
            </div>
          </div>
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
  
  <style scoped>
  .modal {
    display: block;
    position: fixed;
    z-index: 1050;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
  }
  
  .modal-content {
    position: relative;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
  }
  
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
  }
  
  .modal-title {
    margin-bottom: 0;
    line-height: 1.5;
  }
  
  .modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1rem;
  }
  </style>
