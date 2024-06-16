<template>
  <div class="battle-system">
    <div class="mb-1">
      <div class="player-info d-flex justify-content-between align-items-center">
        <div class="player-name">{{ character.name }}</div>
        <div class="player-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ character.health }}/100</span>
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
    <div v-if="enemy" class="mb-1">
      <div class="enemy-info d-flex justify-content-between align-items-center">
        <div class="enemy-name">{{ enemy.name }}</div>
        <div class="enemy-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ enemy.enemyHealth }}/{{ enemy.enemyHealth }}</span>
        </div>
      </div>
    </div>
    <div v-if="enemy" class="mb-4">
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
      <div class="battle-actions d-flex justify-content-center mb-3">
        <button @click="startAutoAttack" :disabled="isAutoAttackActive || isBattleWon || character.health === 0" class="btn btn-primary attack-button me-2">
          <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack" class="icon">
          {{ isAutoAttackActive ? 'Attacking...' : 'Auto Attack' }}
        </button>
        <button @click="claimRewards" :disabled="!isBattleWon" class="btn btn-info claim-rewards-button">
          <img :src="require('@/assets/interface/icons/reload2.png')" alt="Claim Rewards" class="icon">
          Claim Rewards
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
import confetti from 'canvas-confetti';
import enemies from '@/store/enemy';

export default {
  name: 'BattleSystem',
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
  created() {
    this.getRandomEnemy();
  },
  methods: {
    getRandomEnemy() {
      if (enemies && enemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * enemies.length);
        this.enemy = { ...enemies[randomIndex] };
      }
    },
    attack() {
      if (this.equippedWeapon) {
        const playerDamage = this.calculateDamage(this.equippedWeapon.attack, this.enemy.defense);
        const dodgeChance = Math.random();
        
        if (dodgeChance <= this.enemy.defense / 100) {
          this.addToLog(`The ${this.enemy.name} dodged your attack!`, 'enemy-action');
        } else {
          this.enemy.enemyHealth = Math.max(this.enemy.enemyHealth - playerDamage, 0);
          this.addToLog(`You attacked the ${this.enemy.name} with your ${this.equippedWeapon.name} for ${playerDamage} damage.`, 'player-action');
        }
      } else {
        this.addToLog('You have no weapon equipped!', 'player-action');
      }

      if (this.enemy.enemyHealth <= 0) {
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
        this.$store.commit('updateCharacter', { health: Math.max(this.character.health - enemyDamage, 0) });
        this.addToLog(`The ${this.enemy.name} attacked you for ${enemyDamage} damage.`, 'enemy-action');
      }
      if (this.character.health <= 0) {
        this.addToLog('You were defeated!', 'enemy-action');
        this.stopAutoAttack(); // Tilføj denne linje for at stoppe auto-angreb
        this.$emit('game-over');
      }
    },
    calculateDamage(attack, defense) {
      return Math.max(attack - defense, 0);
    },
    checkBattleEnd() {
      if (this.enemy.enemyHealth <= 0) {
        this.isBattleWon = true;
        this.stopAutoAttack();
        this.showVictoryConfetti();
      }
    },
    claimRewards() {
      if (this.isBattleWon) {
        this.$store.dispatch('claimRewards', this.enemy);
        this.showRewardConfetti();
        this.resetBattleState();
      }
    },
    resetBattleState() {
      this.isBattleWon = false;
      this.$store.commit('updateCharacter', { health: 100 });
      this.getRandomEnemy();
      this.battleLog = [];
    },
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
    },
    startAutoAttack() {
      if (!this.isAutoAttackActive) {
        if (this.character.health < 50) {
          if (confirm('Your health is low. Are you sure you want to auto-attack?')) {
            this.isAutoAttackActive = true;
            this.autoAttackInterval = setInterval(() => {
              this.attack();
            }, 500);
          }
        } else {
          this.isAutoAttackActive = true;
          this.autoAttackInterval = setInterval(() => {
            this.attack();
          }, 500);
        }
      }
    },
    stopAutoAttack() {
      if (this.isAutoAttackActive) {
        this.isAutoAttackActive = false;
        clearInterval(this.autoAttackInterval);
      }
    },
    showVictoryConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    },
    showRewardConfetti() {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        zIndex: 9999,
      });
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
