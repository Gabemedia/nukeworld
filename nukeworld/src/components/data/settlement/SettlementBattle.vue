<template>
  <div class="settlement-battle-modal" v-if="currentEnemy" @click.self="$emit('close')">
    <div class="settlement-battle-dialog">
      <div class="settlement-battle-content">
        <!-- Header matching PlayerShop style -->
        <div class="settlement-battle-header">
          <div class="settlement-battle-title-wrapper">
            <img class="settlement-battle-logo" :src="require('@/assets/interface/icons/settlement.png')" alt="Settlement Icon">
            <h5 class="settlement-battle-title">Settlement Defense</h5>
          </div>
          <div class="settlement-battle-info">
            <span class="enemy-name">{{ currentEnemy.name }}</span> is attacking your settlement
          </div>
          <button class="close-button" @click="$emit('close')">&times;</button>
        </div>

        <!-- Battle Content Grid matching InventoryStash structure -->
        <div class="settlement-battle-container">
          <div class="settlement-battle-content-grid">
            <!-- Left Panel - Battle Stats (matching items grid area) -->
            <div class="settlement-battle-stats">
              <!-- Settlement Stats Card -->
              <div class="combatant-card settlement-card">
                <div class="combatant-header">
                  <img :src="require('@/assets/interface/icons/settlement.png')" alt="Settlement">
                  <div class="combatant-info">
                    <h4>Settlement</h4>
                    <div class="level-badge">Level {{ settlement.level }}</div>
                  </div>
                </div>
                
                <div class="stat-row">
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span>Attack: {{ settlementAttackPower }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                    <span>Defense: {{ settlementDefencePower }}</span>
                  </div>
                </div>

                <div class="health-section">
                  <div class="health-bar">
                    <div class="health-fill settlement-health" 
                         :style="{ width: (settlement.health / settlement.maxHealth * 100) + '%' }">
                    </div>
                    <span class="health-text">{{ settlement.health }}/{{ settlement.maxHealth }}</span>
                  </div>
                </div>
              </div>

              <!-- VS Separator -->
              <div class="vs-separator">
                <div class="vs-text">VS</div>
              </div>

              <!-- Enemy Stats Card -->
              <div class="combatant-card enemy-card">
                <div class="combatant-header">
                  <img :src="require('@/assets/interface/icons/encounter.png')" alt="Enemy">
                  <div class="combatant-info">
                    <h4>{{ currentEnemy.name }}</h4>
                    <div class="enemy-badge">Enemy</div>
                  </div>
                </div>
                
                <div class="stat-row">
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span>Attack: {{ currentEnemy.attack }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                    <span>Defense: {{ currentEnemy.defense }}</span>
                  </div>
                </div>

                <div class="health-section">
                  <div class="health-bar">
                    <div class="health-fill enemy-health" 
                         :style="{ width: (enemyHealth / currentEnemy.enemyHealth * 100) + '%' }">
                    </div>
                    <span class="health-text">{{ enemyHealth }}/{{ currentEnemy.enemyHealth }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel - Info Panel (matching PlayerShop info-panel) -->
            <div class="info-panel">
              <!-- Battle Log Section -->
              <div class="battle-info-section">
                <h3>Battle Log</h3>
                <div class="battle-log">
                  <div v-for="(log, index) in battleLog" :key="index" :class="['log-entry', log.type]">
                    {{ log.message }}
                  </div>
                </div>
              </div>

              <!-- Reward Info -->
              <div class="reward-info-section">
                <h4>Battle Rewards</h4>
                <div class="reward-stats">
                  <div class="reward-item">
                    <img :src="require('@/assets/interface/icons/exp.png')" alt="EXP">
                    <span>{{ currentEnemy.exp }} EXP</span>
                  </div>
                  <div class="reward-item">
                    <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                    <span>{{ currentEnemy.money }} Money</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <!-- Attack button - only show when battle is not over -->
                <button 
                  v-if="!isBattleOver"
                  @click="attack" 
                  class="action-button attack-btn"
                >
                  <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                  <span>Attack</span>
                </button>
                
                <!-- Auto Attack button - only show when battle is not over -->
                <button 
                  v-if="!isBattleOver"
                  @click="toggleAutoAttack" 
                  class="action-button auto-btn"
                  :class="{ 'auto-active': isAutoAttackActive }"
                >
                  <img :src="require('@/assets/interface/icons/reload.png')" alt="Auto">
                  <span>{{ isAutoAttackActive ? 'Stop Auto' : 'Auto Attack' }}</span>
                </button>
                
                <!-- Claim Rewards button - only show when victory -->
                <button 
                  v-if="isBattleOver && battleResult === 'victory'" 
                  @click="claimRewards" 
                  class="action-button reward-btn"
                >
                  <img :src="require('@/assets/interface/icons/reward.png')" alt="Rewards">
                  <span>Claim Rewards</span>
                </button>
                
                <!-- Close button - show when battle is over -->
                <button 
                  v-if="isBattleOver"
                  @click="$emit('close')" 
                  class="action-button close-btn"
                >
                  <img :src="require('@/assets/interface/icons/settings.png')" alt="Close">
                  <span>Close Battle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { toast } from "vue3-toastify";

export default {
  name: 'SettlementBattle',
  data() {
    return {
      enemyHealth: 0,
      initialSettlementHealth: 0,
      battleLog: [],
      isAutoAttackActive: false,
      autoAttackInterval: null,
      isBattleOver: false,
      battleResult: null,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      localEnemy: null
    };
  },
  computed: {
    ...mapState('settlement', ['settlement']),
    ...mapGetters('settlement', ['settlementAttackPower', 'settlementDefencePower']),
    currentEnemy() {
      if (!this.settlement.currentEnemyId) return null;
      return require('@/store/enemy').default.find(e => e.id === this.settlement.currentEnemyId);
    }
  },
  watch: {
    currentEnemy: {
      immediate: true,
      handler(enemy) {
        if (enemy) {
          this.localEnemy = JSON.parse(JSON.stringify(enemy));
          this.enemyHealth = this.localEnemy.enemyHealth;
          this.initialSettlementHealth = this.settlement.health;
          this.isBattleOver = false;
          this.battleResult = null;
          this.battleLog = [];
          this.totalDamageDealt = 0;
          this.totalDamageTaken = 0;
          this.addToLog(`A ${enemy.name} is attacking your settlement!`, 'enemy-action');
        }
      }
    }
  },
  methods: {
    ...mapMutations('settlement', ['updateSettlementHealth']),
    ...mapActions(['defeatEnemy', 'increaseExp', 'increaseMoney', 'addResource']),
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
      // Keep only last 15 entries for scrolling but limit visible height
      if (this.battleLog.length > 15) {
        this.battleLog = this.battleLog.slice(0, 15);
      }
    },
    calculateDamage(attack, defense) {
      const baseDamage = Math.max(attack - defense, 0);
      const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
      return Math.max(Math.floor(baseDamage * (1 + variation)), 1);
    },
    attack() {
      if (this.isBattleOver) return;

      // Settlement attacks enemy
      const settlementDamage = this.calculateDamage(this.settlementAttackPower, this.localEnemy.defense);
      const enemyDodgeChance = Math.random();
      
      // Dodge chance is capped at 25% based on defense (defense/500 for reasonable dodge rates)
      if (enemyDodgeChance <= Math.min(this.localEnemy.defense / 500, 0.25)) {
        this.addToLog(`The ${this.localEnemy.name} dodged the attack!`, 'dodge-action');
      } else {
        this.enemyHealth = Math.max(0, this.enemyHealth - settlementDamage);
        this.totalDamageDealt += settlementDamage;
        this.addToLog(`Settlement dealt ${settlementDamage} damage to ${this.localEnemy.name}`, 'player-action');
      }

      // Check if enemy is defeated
      if (this.enemyHealth <= 0) {
        this.battleVictory();
        return;
      }

      // Enemy attacks settlement
      const enemyDamage = this.calculateDamage(this.localEnemy.attack, this.settlementDefencePower);
      const settlementDodgeChance = Math.random();
      
      // Dodge chance is capped at 25% based on defense (defense/500 for reasonable dodge rates)
      if (settlementDodgeChance <= Math.min(this.settlementDefencePower / 500, 0.25)) {
        this.addToLog(`Settlement dodged the ${this.localEnemy.name}'s attack!`, 'dodge-action');
      } else {
        this.updateSettlementHealth(-enemyDamage);
        this.totalDamageTaken += enemyDamage;
        this.addToLog(`${this.localEnemy.name} dealt ${enemyDamage} damage to settlement`, 'enemy-action');
      }

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
    async battleVictory() {
      this.isBattleOver = true;
      this.battleResult = 'victory';
      this.addToLog(`Victory! The ${this.localEnemy.name} was defeated!`, 'victory-action');
      this.stopAutoAttack();
    },
    async battleDefeat() {
      this.isBattleOver = true;
      this.battleResult = 'defeat';
      this.addToLog('The settlement has fallen!', 'defeat-action');
      this.stopAutoAttack();
      
      // Clear settlement data first
      await this.$store.commit('settlement/setSettlement', {
        id: null,
        level: 1,
        health: 100,
        maxHealth: 100,
        inhabitants: 0,
        maxInhabitants: 10,
        defences: 0,
        maxDefences: 100,
        power: 0,
        maxPower: 100,
        radiation: 0,
        maxRadiation: 100,
        lastHealthUpdate: null,
        lastRadiationUpdate: null,
        lastAttack: null,
        currentEnemyId: null,
        upgrades: [],
        resources: [],
        position: null
      });
      
      // Then remove marker
      await this.$store.dispatch('updateSettlementMarker', null);
      
      // Clear from localStorage
      localStorage.removeItem('settlement');
      
      // Close modals
      this.$store.commit('setSettlementModalOpen', false);
      
      // Show defeat toast
      this.showDefeatToast();
      
      // Emit defeat results
      this.$emit('battle-ended', {
        enemy: this.localEnemy,
        damageDealt: this.totalDamageDealt,
        damageTaken: this.totalDamageTaken,
        survived: false,
        time: Date.now()
      });
    },
    async claimRewards() {
      if (this.battleResult === 'victory') {
        // Use predefined rewards from enemy
        const expReward = this.localEnemy.exp;
        const moneyReward = this.localEnemy.money;
        
        await this.increaseExp(expReward);
        await this.increaseMoney(moneyReward);
        
        this.addToLog(`Rewards claimed: ${expReward} EXP, ${moneyReward} Money`, 'reward-action');
        
        // Show reward toast
        this.showRewardToast(expReward, moneyReward);
        
        // Emit battle results with all required data
        this.$emit('battle-ended', {
          enemy: this.localEnemy,
          damageDealt: this.totalDamageDealt,
          damageTaken: this.totalDamageTaken,
          survived: true,
          time: Date.now()
        });
      }
    },
    showRewardToast(expReward, moneyReward) {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">Settlement Battle Victory!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
              <span>${expReward} exp</span>
            </div>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
              <span>${moneyReward} money</span>
            </div>
          </div>
        </div>
      `;

      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 10000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    },
    showDefeatToast() {
      let defeatMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">Settlement Defeated!</p>
          <p class="text-left fw-semi mb-2">Your settlement was destroyed by ${this.localEnemy.name}</p>
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/encounter.png')}" title="Enemy" style="width: 20px;" class="me-2">
            <span>Settlement was removed</span>
          </div>
        </div>
      `;

      toast.error(defeatMessage, {
        dangerouslyHTMLString: true,
        autoClose: 5000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    }
  },
  beforeUnmount() {
    this.stopAutoAttack();
  }
};
</script>

<style scoped lang="scss">
/* Modal Structure matching PlayerShop.vue exactly */
.settlement-battle-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settlement-battle-dialog {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.settlement-battle-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.settlement-battle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.settlement-battle-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.settlement-battle-logo {
  width: 24px;
  height: 24px;
}

.settlement-battle-title {
  color: #ff0000;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.settlement-battle-info {
  text-align: center;
  flex-grow: 1;
  color: #fff;
  font-size: 14px;
}

.enemy-name {
  color: #ff0000;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  
  &:hover {
    color: #ff0000;
  }
}

.settlement-battle-container {
  flex: 1;
  min-height: 0;
  margin-top: 15px;
}

.settlement-battle-content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px);
}

.settlement-battle-stats {
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
    
    &:hover {
      background: #444;
    }
  }
}

.combatant-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;

  &.settlement-card {
    border-left: 3px solid #1e90ff;
  }

  &.enemy-card {
    border-left: 3px solid #ff0000;
  }
}

.combatant-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  img {
    width: 24px;
    height: 24px;
  }

  .combatant-info {
    flex: 1;
  }

  h4 {
    margin: 0;
    color: #00ff00;
    font-size: 14px;
    text-transform: uppercase;
  }

  .level-badge, .enemy-badge {
    background: #333;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    margin-top: 4px;
  }

  .level-badge {
    background: #1e90ff;
  }

  .enemy-badge {
    background: #ff0000;
  }
}

.stat-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ccc;

  img {
    width: 14px;
    height: 14px;
  }
}

.health-section {
  margin-top: 10px;
}

.health-bar {
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #333;
  position: relative;
}

.health-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;

  &.settlement-health {
    background: linear-gradient(90deg, #1e90ff, #0066cc);
  }

  &.enemy-health {
    background: linear-gradient(90deg, #ff0000, #cc0000);
  }
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  font-size: 11px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.vs-separator {
  text-align: center;
  margin: 15px 0;
}

.vs-text {
  color: #00ff00;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

/* Info Panel matching PlayerShop.vue structure */
.info-panel {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
    
    &:hover {
      background: #444;
    }
  }
}

.battle-info-section {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    color: #00ff00;
    font-size: 16px;
    margin: 0 0 15px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
}

.battle-log {
  max-height: 150px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
  }
}

.log-entry {
  margin-bottom: 6px;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 1.3;

  &.player-action {
    color: #1e90ff;
    background-color: rgba(30, 144, 255, 0.1);
  }

  &.enemy-action {
    color: #ff6b6b;
    background-color: rgba(255, 0, 0, 0.1);
  }

  &.victory-action {
    color: #00ff00;
    background-color: rgba(0, 255, 0, 0.1);
    font-weight: bold;
  }

  &.defeat-action {
    color: #ff0000;
    background-color: rgba(255, 0, 0, 0.1);
    font-weight: bold;
  }

  &.dodge-action {
    color: #ffd700;
    background-color: rgba(255, 215, 0, 0.1);
  }

  &.reward-action {
    color: #00ff00;
    background-color: rgba(0, 255, 0, 0.1);
  }
}

.reward-info-section {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    color: #00ff00;
    font-size: 14px;
    margin: 0 0 10px 0;
  }
}

.reward-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  img {
    width: 16px;
    height: 16px;
  }

  span {
    color: #fff;
  }
}

.action-buttons {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(26, 26, 26, 0.95);
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
  }

  &.attack-btn {
    color: #ff4444;
    border: 1px solid #ff4444;

    &:hover {
      background: #ff4444;
      color: #000;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(255, 68, 68, 0.2);
    }
  }

  &.auto-btn {
    color: #00ff00;
    border: 1px solid #00ff00;

    &:hover {
      background: #00ff00;
      color: #000;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 255, 0, 0.2);
    }

    &.auto-active {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
      border-color: #ffc107;
    }
  }

  &.reward-btn {
    color: #28a745;
    border: 1px solid #28a745;

    &:hover {
      background: #28a745;
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
    }
  }

  &.close-btn {
    color: #6c757d;
    border: 1px solid #6c757d;

    &:hover {
      background: #6c757d;
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);
    }
  }
}

@media (max-width: 1024px) {
  .settlement-battle-content-grid {
    grid-template-columns: 1fr 250px;
  }
}

@media (max-width: 768px) {
  .settlement-battle-dialog {
    width: 98%;
    max-height: 98vh;
  }

  .settlement-battle-content-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .info-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-height: 40vh;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }

  .battle-log {
    max-height: 100px;
  }

  .action-button {
    padding: 6px 10px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .settlement-battle-content {
    padding: 10px;
  }

  .settlement-battle-header {
    flex-direction: column;
    gap: 8px;
    align-items: center;

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  .combatant-card {
    padding: 10px;
  }
}
</style> 