<template>
  <div>
    <div v-if="isSettlementModalOpen" class="modal" tabindex="-1" @click.self="closeSettlementModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title-container">
              <h5 class="modal-title">
                Settlement: {{ settlementMarker?.latlng ? `${settlementMarker.latlng.lat.toFixed(2)}, ${settlementMarker.latlng.lng.toFixed(2)}` : 'Not placed' }}
              </h5>
            </div>
            <button type="button" class="btn-close" @click="closeSettlementModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="isUnderAttack" class="mb-4">
              <SettlementBattle @battle-ended="onBattleEnded" />
            </div>
            <div v-else>
              <SettlementStats />
            </div>
          </div>
          <div class="modal-footer">
            <template v-if="settlementMarker">
              <button @click="confirmRemoveSettlement" class="btn btn-danger">Remove Settlement</button>
              <button @click="openLogModal" class="btn btn-success">View Attack Log</button>
            </template>
            <template v-else>
              <p>You haven't placed a settlement yet.</p>
            </template>
            <button type="button" class="btn btn-secondary" @click="closeSettlementModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Modal -->
    <div v-if="isLogModalOpen" class="modal" tabindex="-1" @click.self="closeLogModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Settlement Attack Log</h5>
            <button type="button" class="btn-close" @click="closeLogModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="log-container">
              <div v-for="(log, index) in attackLogs" :key="index" class="log-entry">
                <span class="log-time">{{ new Date(log.time).toLocaleString() }}</span>
                <div class="log-details">
                  <div class="enemy-info">
                    Enemy: <span class="enemy-name">{{ log.enemy.name }}</span> (Level {{ log.enemy.level }})
                  </div>
                  <div class="battle-stats">
                    <span class="stat">Health: {{ log.enemy.enemyHealth }}</span>
                    <span class="stat">Attack: {{ log.enemy.attack }}</span>
                    <span class="stat">Defense: {{ log.enemy.defense }}</span>
                  </div>
                  <div class="battle-result">
                    <span class="damage">Damage Dealt: {{ log.damageDealt }}</span>
                    <span class="damage">Damage Taken: {{ log.damageTaken }}</span>
                    <span :class="log.survived ? 'result-success' : 'result-failure'">
                      {{ log.survived ? 'Victory!' : 'Defeat' }}
                    </span>
                  </div>
                  <div class="rewards" v-if="log.survived">
                    Rewards: {{ log.enemy.exp }} EXP, {{ log.enemy.money }} Money
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeLogModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isSettlementConfirmationModalOpen" class="modal" tabindex="-1" @click.self="closeConfirmationModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Settlement Placement</h5>
            <button type="button" class="btn-close" @click="closeConfirmationModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>It costs 20 Wood & Steel Scrap to place a settlement. Do you want to continue?</p>
            <div class="button-group">
              <button @click="confirmPlaceSettlement" class="btn btn-primary">Yes</button>
              <button @click="cancelPlaceSettlement" class="btn btn-secondary">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import SettlementStats from './settlement/SettlementStats.vue';
import SettlementBattle from './settlement/SettlementBattle.vue';

export default {
  name: 'SettlementModal',
  components: {
    SettlementStats,
    SettlementBattle
  },
  computed: {
    ...mapState(['settlementMarker', 'isSettlementModalOpen']),
    ...mapState('settlement', ['settlement']),
    woodScrap() {
      return this.$store.state.inventory?.resources?.[1] || 0;
    },
    steelScrap() {
      return this.$store.state.inventory?.resources?.[2] || 0;
    },
    currentEnemy() {
      if (!this.settlement.currentEnemyId) return null;
      return require('@/store/enemy').default.find(e => e.id === this.settlement.currentEnemyId);
    },
    isUnderAttack() {
      return this.settlement.currentEnemyId !== null;
    }
  },
  data() {
    return {
      isSettlementConfirmationModalOpen: false,
      isLogModalOpen: false,
      pendingSettlementLocation: null,
      updateInterval: null,
      attackLogs: []
    };
  },
  watch: {
    settlement: {
      immediate: true,
      handler(newSettlement) {
        console.log('Settlement changed:', newSettlement); // Debug log
        if (newSettlement?.id) {
          // Load attack logs when settlement is loaded
          const savedLogs = localStorage.getItem('settlementAttackLogs');
          console.log('Loaded saved logs:', savedLogs); // Debug log
          if (savedLogs) {
            try {
              this.attackLogs = JSON.parse(savedLogs);
              console.log('Parsed attack logs:', this.attackLogs); // Debug log
            } catch (error) {
              console.error('Error parsing saved logs:', error);
            }
          }
        } else {
          console.log('Clearing attack logs'); // Debug log
          this.attackLogs = [];
          localStorage.removeItem('settlementAttackLogs');
        }
      }
    },
    attackLogs: {
      handler(newLogs) {
        console.log('Attack logs changed:', newLogs); // Debug log
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['updateSettlementMarker', 'checkRequiredResources', 'useRequiredResources']),
    ...mapActions('settlement', ['initializeSettlement', 'updateSettlement']),
    ...mapMutations(['setSettlementModalOpen']),
    openSettlementModal() {
      this.setSettlementModalOpen(true);
    },
    closeSettlementModal() {
      this.setSettlementModalOpen(false);
    },
    openConfirmationModal() {
      this.isSettlementConfirmationModalOpen = true;
    },
    closeConfirmationModal() {
      this.isSettlementConfirmationModalOpen = false;
      this.pendingSettlementLocation = null;
    },
    async confirmRemoveSettlement() {
      if (confirm('Are you sure you want to remove your settlement?')) {
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
          upgrades: [],
          resources: [],
          position: null
        });
        
        // Then remove marker
        await this.updateSettlementMarker(null);
        
        // Clear from localStorage
        localStorage.removeItem('settlement');
        
        this.closeSettlementModal();
      }
    },
    async attemptPlaceSettlement(latlng) {
      const requiredResources = [{ id: 1, amount: 20 }, { id: 2, amount: 20 }];
      const hasEnoughResources = await this.checkRequiredResources(requiredResources);
      if (hasEnoughResources) {
        this.pendingSettlementLocation = latlng;
        this.openConfirmationModal();
      } else {
        alert('You don\'t have enough resources to place a settlement. You need 20 Wood & Steel Scrap.');
      }
    },
    async confirmPlaceSettlement() {
      try {
        const requiredResources = [{ id: 1, amount: 20 }, { id: 2, amount: 20 }];
        await this.useRequiredResources(requiredResources);
        
        // Initialize settlement in store
        await this.initializeSettlement(this.pendingSettlementLocation);
        
        // Update marker
        await this.updateSettlementMarker({
          latlng: this.pendingSettlementLocation,
          name: ''
        });
        
        this.closeConfirmationModal();
        this.startSettlementUpdates();
      } catch (error) {
        console.error('Error placing settlement:', error);
        alert('Failed to place settlement. Please try again.');
      }
    },
    cancelPlaceSettlement() {
      this.closeConfirmationModal();
    },
    onBattleEnded(battleResult) {
      if (!battleResult) return;
      
      // Get the enemy data
      const enemy = battleResult.enemy;
      if (!enemy) return;
      
      // Create log entry
      const logEntry = {
        time: Date.now(),
        enemy: {
          name: enemy.name,
          level: enemy.level || 1,
          attack: enemy.attack,
          defense: enemy.defense,
          enemyHealth: enemy.enemyHealth,
          exp: enemy.exp,
          money: enemy.money
        },
        damageDealt: battleResult.damageDealt || 0,
        damageTaken: battleResult.damageTaken || 0,
        survived: battleResult.survived || false
      };
      
      // Initialize attackLogs if needed
      if (!this.attackLogs) {
        this.attackLogs = [];
      }
      
      // Add new log entry at the beginning
      this.attackLogs.unshift(logEntry);
      
      // Keep only last 10 entries
      if (this.attackLogs.length > 10) {
        this.attackLogs.pop();
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('settlementAttackLogs', JSON.stringify(this.attackLogs));
      } catch (error) {
        console.error('Failed to save attack logs:', error);
      }
      
      // Clear current enemy
      this.$store.commit('settlement/setCurrentEnemyId', null);
    },
    startSettlementUpdates() {
      // Clear any existing interval
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      
      // Wait 1 second before starting updates
      setTimeout(() => {
        // Start new update interval
        this.updateInterval = setInterval(() => {
          if (this.settlement && this.settlement.id) {
            this.updateSettlement();
          }
        }, 1000); // Update every second
        
        // Do first update after 1 second
        if (this.settlement && this.settlement.id) {
          this.updateSettlement();
        }
      }, 1000); // Wait 1 second
    },
    openLogModal() {
      this.isLogModalOpen = true;
    },
    closeLogModal() {
      this.isLogModalOpen = false;
    }
  },
  mounted() {
    if (this.settlementMarker) {
      this.startSettlementUpdates();
    }
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
  color: #fff;
}

.modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 0.75rem 1rem;
}

.modal-title-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
}

.settlement-stats-header {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #00ff00;
}

.stat-item {
  background: rgba(0, 255, 0, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #00ff00;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid #00ff00;
  padding: 0.75rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  background-color: #00cc00;
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;
}

.btn-secondary:hover {
  background-color: #00ff00;
  color: #000;
}

.btn-danger {
  background-color: #ff0000;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #cc0000;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-close:hover {
  color: #00cc00;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem auto;
  }
}

.attack-log {
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 1rem;
  margin-top: 1rem;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  padding: 1rem;
  border-bottom: 1px solid #00ff00;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
}

.log-time {
  color: #00ff00;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 0.5rem;
}

.log-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.enemy-info {
  font-size: 1.1rem;
}

.enemy-name {
  color: #ff0000;
  font-weight: bold;
}

.battle-stats {
  display: flex;
  gap: 1rem;
  color: #888;
}

.stat {
  background: rgba(0, 255, 0, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.battle-result {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.damage {
  color: #ffff00;
}

.result-success {
  color: #00ff00;
  font-weight: bold;
}

.result-failure {
  color: #ff0000;
  font-weight: bold;
}

.rewards {
  color: #00ff00;
  font-style: italic;
}
</style>
