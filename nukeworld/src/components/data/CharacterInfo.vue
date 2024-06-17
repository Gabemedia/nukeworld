<template>
<button class="btn btn-main border border-1 border-white m-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCharacterInfo">
    Character Info
  </button>
    <div style="width:600px;" class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasCharacterInfo" aria-labelledby="offcanvasCharacterInfoLabel">
      <div class="offcanvas-body">
        <div class="col-12" v-for="(value, key) in character" :key="key">
          <div class="card my-2">
            <div class="card-header">
              <strong class="text-capitalize">{{ key.replace('_', ' ') }}</strong>
            </div>
            <div class="card-body">
              <span>{{ value }}</span>
            </div>
          </div>
        </div>
        <ExpController />
        <MoneyController />
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  import ExpController from './controller/ExpController.vue';
  import MoneyController from './controller/MoneyController.vue';
  
  export default {
    name: 'CharacterInfo',
    components: {
      ExpController,
      MoneyController,
    },
    computed: {
      ...mapState(['character'])
    },
  };
  </script>
  
  <style scoped>
  
  /* Add styles for your character info offcanvas */
  .offcanvas {
    font-family: Arial, sans-serif;
  }
  
  .card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    font-weight: bold;
    color: #666;
    font-size: 1.2em;
  }
  
  .card-body > .row > .col-md-4 > .card {
    margin-bottom: 20px;
  }
  </style>