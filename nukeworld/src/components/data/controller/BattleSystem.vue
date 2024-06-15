<template>
  <div class="battle-system">
    <div class="player-info">
      <p>Player: {{ character.name }}</p>
      <p>Health: {{ playerHealth }}</p>
      <p>Equipped Weapon: {{ equippedWeapon ? equippedWeapon.name : 'None' }}</p>
      <p>Equipped Armor: {{ equippedArmor ? equippedArmor.name : 'None' }}</p>
    </div>
    <div class="enemy-info">
      <p>Enemy: {{ enemy.name }}</p>
      <p>Health: {{ enemyHealth }}</p>
    </div>
    <div class="battle-actions">
      <button @click="attack" class="btn btn-primary attack-button">Attack</button>
      <button @click="useItem" class="btn btn-info use-item-button">Use Item</button>
    </div>
    <div class="battle-log">
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
        this.enemyHealth = Math.max(this.enemyHealth - playerDamage, 0);
        this.addToLog(`You attacked the ${this.enemy.name} with your ${this.equippedWeapon.name} for ${playerDamage} damage.`, 'player-action');
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
      this.playerHealth = Math.max(this.playerHealth - enemyDamage, 0);
      this.addToLog(`The ${this.enemy.name} attacked you for ${enemyDamage} damage.`, 'enemy-action');
      
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
.battle-system {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.player-info,
.enemy-info {
  margin-bottom: 20px;
}

.battle-actions {
  margin-bottom: 20px;
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
