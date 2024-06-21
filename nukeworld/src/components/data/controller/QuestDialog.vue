<template>
    <div class="dialog-system">
      <div class="mb-1">
        <h6 class="mb-3 text-uppercase fw-bold text-start">Dialog</h6>
      </div>
      <div class="dialog-log border border-1 small">
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'QuestDialog',
    data() {
      return {
        battleLog: [],
        enemy: null,
        isBattleWon: false,
        isAutoAttackActive: false,
        autoAttackInterval: null,
      };
    },
    computed: {
      ...mapState(['character']),
      equippedWeapon() {
        return this.character.equippedWeapons[0];
      },
      equippedArmor() {
        return this.character.equippedArmor;
      },
    },
  };
  </script>
  
  <style scoped>
  div.modal-body {
    margin:0!important;
    padding:0!important;
  }
  div.modal-content {
    background-color: #f0f0f0!important;
    margin:0!important;
  }
  .dialog-system {
  }
  .dialog-system .icon{
    height: 20px;
    width: auto;
  }
  
  .dialog-log {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .dialog-log ul {
    list-style-type: none;
    padding: 0;
  }
  
  .dialog-log li {
    margin-bottom: 5px;
    padding: 5px;
    border-radius: 3px;
  }
  
  .player-action {
    background-color: #d4edda;
    color: #155724;
  }
  </style>
  