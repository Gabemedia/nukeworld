<template>
  <div class="settlement-battle" v-if="currentEnemy">
    <div class="battle-header">
      <h3>Settlement Under Attack!</h3>
      <div class="enemy-info">
        <span class="enemy-name">{{ currentEnemy.name }}</span> is attacking your settlement
      </div>
    </div>

    <div class="battle-stats">
      <div class="settlement-stats">
        <h4>Settlement</h4>
        <div class="stat">Attack: {{ settlementAttackPower }}</div>
        <div class="stat">Defense: {{ settlementDefencePower }}</div>
        <div class="health-bar">
          <div class="progress">
            <div 
              class="progress-bar" 
              :class="getHealthBarClass()"
              :style="{ width: (settlement.health / settlement.maxHealth * 100) + '%' }"
            >
              {{ settlement.health }}/{{ settlement.maxHealth }}
            </div>
          </div>
        </div>
      </div>

      <div class="enemy-stats">
        <h4>{{ currentEnemy.name }}</h4>
        <div class="stat">Attack: {{ currentEnemy.attack }}</div>
        <div class="stat">Defense: {{ currentEnemy.defense }}</div>
        <div class="health-bar">
          <div class="progress">
            <div 
              class="progress-bar bg-danger"
              :style="{ width: (enemyHealth / currentEnemy.enemyHealth * 100) + '%' }"
            >
              {{ enemyHealth }}/{{ currentEnemy.enemyHealth }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="battle-log">
      <div v-for="(log, index) in battleLog" :key="index" :class="log.type">
        {{ log.message }}
      </div>
    </div>

    <div class="battle-actions">
      <button 
        @click="attack" 
        class="btn btn-danger"
        :disabled="isBattleOver"
      >
        Attack
      </button>
      <button 
        @click="toggleAutoAttack" 
        class="btn"
        :class="isAutoAttackActive ? 'btn-warning' : 'btn-primary'"
        :disabled="isBattleOver"
      >
        {{ isAutoAttackActive ? 'Stop Auto Attack' : 'Auto Attack' }}
      </button>
      <button 
        v-if="isBattleOver" 
        @click="claimRewards" 
        class="btn btn-success"
      >
        Claim Rewards
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'SettlementBattle',
  data() {
    return {
      enemyHealth: 0,
      battleLog: [],
      isAutoAttackActive: false,
      autoAttackInterval: null,
      isBattleOver: false,
      battleResult: null
    };
  },
  computed: {
    ...mapState('settlement', ['settlement']),
    ...mapGetters('settlement', ['settlementAttackPower', 'settlementDefencePower']),
    ...mapState(['currentEnemyId']),
    currentEnemy() {
      return this.$store.getters.currentEnemy;
    }
  },
  watch: {
    currentEnemy: {
      immediate: true,
      handler(enemy) {
        if (enemy) {
          this.enemyHealth = enemy.enemyHealth;
          this.isBattleOver = false;
          this.battleResult = null;
          this.battleLog = [];
          this.addToLog(`A ${enemy.name} is attacking your settlement!`, 'enemy-action');
        }
      }
    }
  },
  methods: {
    ...mapMutations('settlement', ['updateSettlementHealth']),
    ...mapActions(['defeatEnemy', 'increaseExp', 'increaseMoney', 'addResource']),
    getHealthBarClass() {
      const healthPercent = (this.settlement.health / this.settlement.maxHealth) * 100;
      if (healthPercent > 66) return 'bg-success';
      if (healthPercent > 33) return 'bg-warning';
      return 'bg-danger';
    },
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
    },
    calculateDamage(attack, defense) {
      const baseDamage = Math.max(attack - defense, 0);
      const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
      return Math.max(Math.floor(baseDamage * (1 + variation)), 1);
    },
    attack() {
      if (this.isBattleOver) return;

      // Settlement attacks enemy
      const settlementDamage = this.calculateDamage(this.settlementAttackPower, this.currentEnemy.defense);
      this.enemyHealth = Math.max(0, this.enemyHealth - settlementDamage);
      this.addToLog(`Settlement dealt ${settlementDamage} damage to ${this.currentEnemy.name}`, 'player-action');

      // Check if enemy is defeated
      if (this.enemyHealth <= 0) {
        this.battleVictory();
        return;
      }

      // Enemy attacks settlement
      const enemyDamage = this.calculateDamage(this.currentEnemy.attack, this.settlementDefencePower);
      this.updateSettlementHealth(-enemyDamage);
      this.addToLog(`${this.currentEnemy.name} dealt ${enemyDamage} damage to settlement`, 'enemy-action');

      // Check if settlement is defeated
      if (this.settlement.health <= 0) {
        this.battleDefeat();
      }
    },
    toggleAutoAttack() {
      if (this.isAutoAttackActive) {
        this.stopAutoAttack();
      } else {
        this.startAutoAttack();
      }
    },
    startAutoAttack() {
      if (!this.isAutoAttackActive && !this.isBattleOver) {
        this.isAutoAttackActive = true;
        this.autoAttackInterval = setInterval(() => {
          this.attack();
          if (this.isBattleOver) {
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
    battleVictory() {
      this.isBattleOver = true;
      this.battleResult = 'victory';
      this.addToLog(`Victory! The ${this.currentEnemy.name} was defeated!`, 'victory-action');
      this.stopAutoAttack();
    },
    battleDefeat() {
      this.isBattleOver = true;
      this.battleResult = 'defeat';
      this.addToLog('The settlement has fallen!', 'defeat-action');
      this.stopAutoAttack();
    },
    async claimRewards() {
      if (this.battleResult === 'victory') {
        // Base rewards
        const expReward = this.currentEnemy.exp * 2;
        const moneyReward = this.currentEnemy.money * 2;
        
        await this.increaseExp(expReward);
        await this.increaseMoney(moneyReward);
        
        // Random resource rewards
        const resourceTypes = [1, 2]; // Wood and Steel Scrap
        const resourceAmount = Math.floor(Math.random() * 3) + 1;
        const resourceId = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
        
        for (let i = 0; i < resourceAmount; i++) {
          await this.addResource(resourceId);
        }
        
        this.addToLog(`Rewards claimed: ${expReward} EXP, ${moneyReward} Money, ${resourceAmount} resources`, 'reward-action');
        
        // Close battle window
        this.$emit('battle-ended');
      }
    }
  },
  beforeUnmount() {
    this.stopAutoAttack();
  }
};
</script>

<style scoped>
.settlement-battle {
  padding: 1rem;
  color: #00ff00;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 10px;
}

.battle-header {
  text-align: center;
  margin-bottom: 1rem;
}

.battle-header h3 {
  color: #ff0000;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.enemy-info {
  font-size: 1.1rem;
}

.enemy-name {
  color: #ff0000;
  font-weight: bold;
}

.battle-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.settlement-stats, .enemy-stats {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff00;
  border-radius: 5px;
}

.enemy-stats {
  border-color: #ff0000;
}

h4 {
  margin-bottom: 1rem;
  text-align: center;
}

.stat {
  margin-bottom: 0.5rem;
}

.health-bar {
  margin-top: 1rem;
}

.progress {
  height: 25px;
  background-color: #1a1a1a;
  border: 1px solid #00ff00;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  transition: width 0.3s ease;
}

.battle-log {
  height: 150px;
  overflow-y: auto;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff00;
  border-radius: 5px;
}

.battle-log > div {
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  border-radius: 3px;
}

.player-action {
  color: #00ff00;
  background-color: rgba(0, 255, 0, 0.1);
}

.enemy-action {
  color: #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
}

.victory-action {
  color: #00ff00;
  background-color: rgba(0, 255, 0, 0.2);
  font-weight: bold;
}

.defeat-action {
  color: #ff0000;
  background-color: rgba(255, 0, 0, 0.2);
  font-weight: bold;
}

.reward-action {
  color: #ffff00;
  background-color: rgba(255, 255, 0, 0.1);
}

.battle-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  min-width: 120px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 