<template>
  <div class="battle-system">
    <div class="mb-1">
      <div class="player-info d-flex justify-content-between align-items-center">
        <div class="player-name">{{ character.name }}</div>
        <div class="player-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ playerHealth }}/100</span>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <div class="player-equipment d-flex justify-content-between align-items-center">
        <div class="equipment-item">
          <img :src="require('@/assets/interface/icons/gun.png')" alt="Weapon" class="icon">
          <span class="ms-2">{{ equippedWeapon ? equippedWeapon.name : 'None' }}: {{ equippedWeapon ? equippedWeapon.attack : 0 }}</span>
        </div>
        <div class="equipment-item">
          <img :src="require('@/assets/interface/icons/shield.png')" alt="Armor" class="icon me-2">
          <span>{{ equippedArmor ? equippedArmor.name : 'None' }}: {{ equippedArmor ? equippedArmor.defence : 0 }}</span>
        </div>
      </div>
    </div>
    <div class="my-4 border border-2 border-primary"></div>
    <div class="mb-1">
      <div class="enemy-info d-flex justify-content-between align-items-center">
        <div class="enemy-name">{{ enemy.name }}</div>
        <div class="enemy-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ enemyHealth }}/50</span>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <div class="enemy-stats d-flex justify-content-between align-items-center">
        <div class="stat-item">
          <img :src="require('@/assets/interface/icons/gun.png')" alt="Weapon" class="icon">
          <span class="ms-2">Attack: {{ enemy.attack }}</span>
        </div>
        <div class="stat-item">
          <img :src="require('@/assets/interface/icons/shield.png')" alt="Armor" class="icon me-2">
          <span>Defence: {{ enemy.defense }}</span>
        </div>
      </div>
    </div>
    <div class="mb-0">
      <div class="battle-actions d-flex justify-content-between align-items-center mb-3">
        <button @click="attack" class="btn btn-primary attack-button me-2">
          <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack" class="icon">
          Attack
        </button>
        <button @click="useItem" class="btn btn-info use-item-button">
          <img :src="require('@/assets/interface/icons/reload2.png')" alt="Item" class="icon">
          Use Item
        </button>
      </div>
    </div>
    <div class="battle-log border border-1 small">
      <ul>
        <li v-for="(log, index) in battleLog" :key="index" :class="log.type">{{ log.message }}</li>
      </ul>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex';

export default {
  name: 'BattleSystem',
  data() {
    return {
      playerHealth: 100,
      enemyHealth: 50,
      battleLog: [],
      enemy: {
        name: 'Goblin',
        attack: 10,
        defense: 5,
        exp: 10000,
        money: 50000,
      },
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

  methods: {
    attack() {
      if (this.equippedWeapon) {
        const playerDamage = this.calculateDamage(this.equippedWeapon.attack, this.enemy.defense);
        const dodgeChance = Math.random();
        
        if (dodgeChance <= this.enemy.defense / 100) {
          this.addToLog(`The ${this.enemy.name} dodged your attack!`, 'enemy-action');
        } else {
          this.enemyHealth = Math.max(this.enemyHealth - playerDamage, 0);
          this.addToLog(`You attacked the ${this.enemy.name} with your ${this.equippedWeapon.name} for ${playerDamage} damage.`, 'player-action');
        }
      } else {
        this.addToLog('You have no weapon equipped!', 'player-action');
      }

      if (this.enemyHealth <= 0) {
        this.addToLog(`You defeated the ${this.enemy.name}!`, 'player-action');
        this.checkBattleEnd();
      } else {
        this.enemyAttack();
      }
    },

    enemyAttack() {
      const enemyDamage = this.calculateDamage(this.enemy.attack, this.equippedArmor ? this.equippedArmor.defence : 0);
      const dodgeChance = Math.random();
      
      if (dodgeChance <= (this.equippedArmor ? this.equippedArmor.defence : 0) / 100) {
        this.addToLog(`You dodged the ${this.enemy.name}'s attack!`, 'player-action');
      } else {
        this.playerHealth = Math.max(this.playerHealth - enemyDamage, 0);
        this.addToLog(`The ${this.enemy.name} attacked you for ${enemyDamage} damage.`, 'enemy-action');
      }
      
      if (this.playerHealth <= 0) {
        this.addToLog('You were defeated!', 'enemy-action');
        this.checkBattleEnd();
      }
    },
    useItem() {
      this.addToLog('You used an item.', 'player-action');
    },
    calculateDamage(attack, defense) {
      return Math.max(attack - defense, 0);
    },
    checkBattleEnd() {
      // Trigger battle end logic, rewards, etc.
    },
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
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
.battle-system {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.battle-system .icon{
  height: 20px;
  width: auto;
}

.attack-button {
  background-color: #dc3545;
  border-color: #dc3545;
}

.use-item-button {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.battle-log {
  max-height: 200px;
  overflow-y: auto;
}

.battle-log ul {
  list-style-type: none;
  padding: 0;
}

.battle-log li {
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
}

.player-action {
  background-color: #d4edda;
  color: #155724;
}

.enemy-action {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
