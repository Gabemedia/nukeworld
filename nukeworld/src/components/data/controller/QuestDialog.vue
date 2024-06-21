<template>
  <div class="dialog-system">
    <div class="mb-1">
      <h6 class="mb-3 text-uppercase fw-bold text-start">Dialog</h6>
    </div>
    <div class="dialog-log small">
      <!-- NPC conversation box -->
      <div class="conversation-box npc-box mb-4">
        <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="NPC">
        <div class="message-box npc-message">
          smg is a powerful ranged weapon. It is used for short-range combat. smg is a powerful ranged weapon. It is used for short-range combat. smg is a powerful ranged weapon. It is used for short-range combat.
        </div>
      </div>
      <!-- Player conversation box -->
      <div class="conversation-box player-box">
        <div class="message-box player-message">
          smg is a powerful ranged weapon. It is used for short-range combat. smg is a powerful ranged weapon. It is used for short-range combat. smg is a powerful ranged weapon. It is used for short-range combat.
        </div>
        <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="Player">
      </div>
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
  
  <style lang="scss" scoped>
  .dialog-system {
    border-radius: 5px;
    color: white;
    text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
    font-size: 0.8rem;
  }
  
  .dialog-log {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .conversation-box {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  
  .npc-box {
    flex-direction: row;
  }
  
  .player-box .sidebar-icon{ 
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

  
  .sidebar-icon {
    width: 35px;
    height: 35px;
    margin: 0 10px;
  }
  
  .message-box {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 10px;
    flex-grow: 1;
  }
  
  .npc-message {
    margin-right: 15px;
  }
  
  .player-message {
    margin-left: 15px;
  }
  </style>
    