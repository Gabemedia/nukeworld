<!-- src/components/data/controller/BattleSystem.vue -->
<template>
  <div class="battle-system">
    <!-- Display player and enemy health, actions, and battle log -->
    <div class="player-info">
      <!-- Display player information, health, equipped weapons, and armor -->
      <p>Player: {{ character.name }}</p>
      <p>Health: {{ playerHealth }}</p>
      <p>Equipped Weapon: {{ equippedWeapon ? equippedWeapon.name : 'None' }}</p>
      <p>Equipped Armor: {{ equippedArmor ? equippedArmor.name : 'None' }}</p>
    </div>
    <div class="enemy-info">
      <!-- Display enemy information and health -->
      <p>Enemy: {{ enemy.name }}</p>
      <p>Health: {{ enemyHealth }}</p>
    </div>
    <div class="battle-actions">
      <!-- Display available actions (e.g., attack, defend, use item) -->
      <button @click="attack" class="btn btn-primary">Attack</button>
      <button @click="defend" class="btn btn-secondary">Defend</button>
      <button @click="useItem" class="btn btn-info">Use Item</button>
    </div>
    <div class="battle-log">
      <!-- Display battle log -->
      <ul>
        <li v-for="(log, index) in battleLog" :key="index">{{ log }}</li>
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
      const damage = this.calculateDamage(this.equippedWeapon.attack, this.enemy.defense);
      this.enemyHealth -= damage;
      this.battleLog.push(`You attacked the ${this.enemy.name} for ${damage} damage.`);
      this.checkBattleEnd();
    },
    defend() {
      this.battleLog.push('You defended against the enemy attack.');
    },
    useItem() {
      this.battleLog.push('You used an item.');
    },
    calculateDamage(attack, defense) {
      return Math.max(attack - defense, 0);
    },
    checkBattleEnd() {
      if (this.enemyHealth <= 0) {
        this.battleLog.push(`You defeated the ${this.enemy.name}!`);
        // Trigger battle end logic, rewards, etc.
      }
    },
  },
};
</script>
