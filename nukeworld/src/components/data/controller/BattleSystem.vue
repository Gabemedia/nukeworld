<template>
  <div class="battle-system">
    <div class="mb-1">
      <h6 class="mb-3 text-uppercase fw-bold text-start">Enemy Encounters</h6>
      <div class="player-info d-flex justify-content-between align-items-center">
        <div class="player-name">{{ character.name }}</div>
        <div class="player-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ character.health }}/{{ character.maxHealth }}</span>
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
        <button @click="startAutoAttack" :disabled="isAutoAttackActive || isBattleWon || character.health <= 0 || !enemy" class="btn btn-primary attack-button me-2">
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
import { mapState, mapGetters } from 'vuex';
import enemies from '@/store/enemy';
import confetti from 'canvas-confetti';

export default {
  name: 'BattleSystem',
  data() {
    return {
      battleLog: [],
      isBattleWon: false,
      isAutoAttackActive: false,
      autoAttackInterval: null,
      localEnemy: null,
    };
  },
  computed: {
    ...mapState(['character']),
    ...mapGetters(['currentEnemy']),
    equippedWeapon() {
      return this.character.equippedWeapons[0];
    },
    equippedArmor() {
      return this.character.equippedArmor;
    },
    enemy() {
      return this.localEnemy || this.currentEnemy;
    },
  },
  watch: {
    currentEnemy: {
      immediate: true,
      handler(newEnemy) {
        if (newEnemy) {
          this.localEnemy = JSON.parse(JSON.stringify(newEnemy));
        } else {
          this.getRandomEnemy();
        }
      },
    },
  },
  created() {
    if (!this.currentEnemy) {
      this.getRandomEnemy();
    }
  },
  methods: {
    getRandomEnemy() {
      if (enemies && enemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * enemies.length);
        this.localEnemy = JSON.parse(JSON.stringify(enemies[randomIndex]));
      }
    },
    startAutoAttack() {
      if (!this.isAutoAttackActive && this.enemy && this.character.health > 0) {
        this.isAutoAttackActive = true;
        this.autoAttackInterval = setInterval(() => {
          this.attack();
          if (this.isBattleWon || this.character.health <= 0) {
            this.stopAutoAttack();
          }
        }, 1000);
      }
    },
    stopAutoAttack() {
      if (this.isAutoAttackActive) {
        this.isAutoAttackActive = false;
        clearInterval(this.autoAttackInterval);
      }
    },
    attack() {
      if (this.equippedWeapon && this.enemy) {
        const playerDamage = this.calculateDamage(this.equippedWeapon.attack, this.enemy.defense);
        const dodgeChance = Math.random();
        
        if (dodgeChance <= this.enemy.defense / 100) {
          this.addToLog(`The ${this.enemy.name} dodged your attack!`, 'enemy-action');
        } else {
          this.enemy.enemyHealth = Math.max(this.enemy.enemyHealth - playerDamage, 0);
          this.addToLog(`You attacked the ${this.enemy.name} with your ${this.equippedWeapon.name} for ${playerDamage} damage.`, 'player-action');
        }

        if (this.enemy.enemyHealth <= 0) {
          this.addToLog(`You defeated the ${this.enemy.name}!`, 'player-action');
          this.checkBattleEnd();
        } else {
          this.enemyAttack();
        }
      } else {
        this.addToLog('You have no weapon equipped or no enemy to fight!', 'player-action');
        this.stopAutoAttack();
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
        this.stopAutoAttack();
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
      if (this.isBattleWon && this.currentEnemy) {
        this.$store.dispatch('claimRewards', this.currentEnemy);
        this.$store.dispatch('defeatEnemy');
        this.showRewardConfetti();
        this.resetBattleState();
        this.$emit('battle-ended');
      }
    },
    resetBattleState() {
      this.isBattleWon = false;
      this.$store.commit('updateCharacter');
      this.localEnemy = null;
      this.getRandomEnemy();
      this.battleLog = [];
    },
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
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
.battle-system {
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
