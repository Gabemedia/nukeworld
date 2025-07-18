<template>
  <div>
    <!-- Initial Settlement Placement Modal -->
    <div v-if="showPlacementModal" class="shop-modal" tabindex="-1" @click.self="closePlacementModal">
      <div class="shop-dialog">
        <div class="shop-content">
          <div class="shop-header">
            <div class="shop-title-wrapper">
              <img class="shop-logo" :src="require(`@/assets/interface/icons/settlement.png`)" alt="Settlement Icon">
              <h5 class="shop-title">SETTLEMENT PLACEMENT</h5>
            </div>
            <button class="close-button" @click="closePlacementModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="resource-requirements">
              <div class="resource-item">
                <img :src="require('@/assets/interface/icons/resources/wood_scrap.png')" alt="Wood Scrap">
                <span>20 Wood Scrap</span>
              </div>
              <div class="resource-item">
                <img :src="require('@/assets/interface/icons/resources/steel_scrap.png')" alt="Steel Scrap">
                <span>20 Steel Scrap</span>
              </div>
            </div>
            <div class="message-container">
              <p class="message-text">It costs 20 Wood & Steel Scrap to place a settlement.</p>
              <p class="instruction-text">Click anywhere on the map to confirm the location.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closePlacementModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isSettlementModalOpen" class="shop-modal" tabindex="-1" @click.self="closeSettlementModal">
      <div class="shop-dialog">
        <div class="shop-content">
          <div class="shop-header">
            <div class="shop-title-wrapper">
              <img class="shop-logo" :src="require(`@/assets/interface/icons/settlement.png`)" alt="Settlement Icon">
              <h5 class="shop-title">
                Settlement: {{ settlementMarker?.latlng ? `${settlementMarker.latlng.lat.toFixed(2)}, ${settlementMarker.latlng.lng.toFixed(2)}` : 'Not placed' }}
              </h5>
            </div>
            <button class="close-button" @click="closeSettlementModal">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="isUnderAttack" class="mb-4">
              <SettlementBattle @battle-ended="onBattleEnded" />
            </div>
            <div v-else>
              <SettlementStats @open-log="openLogModal" />
            </div>
          </div>
          <div class="modal-footer">
            <template v-if="settlementMarker">
              <button @click="confirmRemoveSettlement" class="btn btn-danger">Remove Settlement</button>
            </template>
            <button type="button" class="btn btn-secondary" @click="closeSettlementModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Modal -->
    <div v-if="isLogModalOpen" class="shop-modal" tabindex="-1" @click.self="closeLogModal">
      <div class="shop-dialog">
        <div class="shop-content">
          <div class="shop-header">
            <div class="shop-title-wrapper">
              <img class="shop-logo" :src="require(`@/assets/interface/icons/settlement.png`)" alt="Settlement Icon">
              <h5 class="shop-title">Settlement Attack Log</h5>
            </div>
            <button class="close-button" @click="closeLogModal">&times;</button>
          </div>
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
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeLogModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="isSettlementConfirmationModalOpen" class="shop-modal" tabindex="-1" @click.self="closeConfirmationModal">
      <div class="shop-dialog confirmation-dialog">
        <div class="shop-content">
          <div class="shop-header">
            <div class="shop-title-wrapper">
              <img class="shop-logo" :src="require(`@/assets/interface/icons/settlement.png`)" alt="Settlement Icon">
              <h5 class="shop-title">Confirm Settlement Placement</h5>
            </div>
            <button class="close-button" @click="closeConfirmationModal">&times;</button>
          </div>
          <div class="confirmation-body">
            <div class="resource-requirements">
              <div class="resource-item">
                <img :src="require('@/assets/interface/icons/resources/wood_scrap.png')" alt="Wood Scrap">
                <span>20 Wood Scrap</span>
              </div>
              <div class="resource-item">
                <img :src="require('@/assets/interface/icons/resources/steel_scrap.png')" alt="Steel Scrap">
                <span>20 Steel Scrap</span>
              </div>
            </div>
            <p class="confirmation-text">It costs 20 Wood & Steel Scrap to place a settlement.</p>
            <p class="instruction-text">Click anywhere on the map to confirm the location.</p>
            <div class="button-group">
              <button @click="confirmPlaceSettlement" class="btn btn-primary">Confirm Placement</button>
              <button @click="cancelPlaceSettlement" class="btn btn-secondary">Cancel</button>
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
      showPlacementModal: false,
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
        if (newSettlement?.id) {
          // Load attack logs when settlement is loaded
          const savedLogs = localStorage.getItem('settlementAttackLogs');
          if (savedLogs) {
            try {
              this.attackLogs = JSON.parse(savedLogs);
            } catch (error) {
              console.error('Error parsing saved logs:', error);
            }
          }
        } else {
          this.attackLogs = [];
          localStorage.removeItem('settlementAttackLogs');
        }
      }
    },
    attackLogs: {
      handler() {
        // Watch for changes in attack logs
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
    },
    showInitialPlacement() {
      this.showPlacementModal = true;
    },
    closePlacementModal() {
      this.showPlacementModal = false;
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

<style scoped lang="scss">
.shop-modal {
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

.shop-dialog {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.shop-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.shop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.shop-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-logo {
  width: 24px;
  height: 24px;
}

.shop-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  
  &:hover {
    color: #ff0000;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  color: #fff;

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

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid #2a2a2a;
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

  &:hover {
    background-color: #00cc00;
  }
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;

  &:hover {
    background-color: #00ff00;
    color: #000;
  }
}

.btn-danger {
  background-color: #ff0000;
  color: #ffffff;

  &:hover {
    background-color: #cc0000;
  }
}

.log-container {
  max-height: 60vh;
  overflow-y: auto;
  padding: 15px;

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

.log-entry {
  padding: 1rem;
  border-bottom: 1px solid #00ff00;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
  border-radius: 4px;
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
  flex-wrap: wrap;
}

.stat {
  background: rgba(0, 255, 0, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.battle-result {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
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

.confirmation-body {
  padding: 15px;
  color: #fff;
  text-align: center;

  p {
    margin-bottom: 15px;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }
}

.confirmation-dialog {
  max-width: 500px;
  min-height: 300px;
}

.confirmation-body {
  padding: 20px;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  min-height: 200px;

  .resource-requirements {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 10px;
  }

  .resource-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 255, 0, 0.1);
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid rgba(0, 255, 0, 0.2);

    img {
      width: 24px;
      height: 24px;
      image-rendering: pixelated;
    }

    span {
      color: #00ff00;
      font-weight: bold;
    }
  }

  .confirmation-text {
    font-size: 1.1rem;
    color: #fff;
    margin: 0;
  }

  .instruction-text {
    font-size: 1rem;
    color: #00ff00;
    margin: 0;
    font-style: italic;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;

    .btn {
      min-width: 150px;
      padding: 10px 20px;
    }
  }
}

.message-container {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 255, 0, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 0, 0.1);
}

.message-text {
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.instruction-text {
  font-size: 1rem;
  color: #00ff00;
  margin: 0;
  font-style: italic;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.resource-requirements {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 255, 0, 0.1);
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 0, 0.2);

  img {
    width: 24px;
    height: 24px;
    image-rendering: pixelated;
  }

  span {
    color: #00ff00;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }
}

@media (max-width: 768px) {
  .shop-dialog {
    padding: 10px;
    max-height: 100vh;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .modal-body {
    max-height: calc(100vh - 120px);
  }

  .log-container {
    max-height: calc(100vh - 180px);
  }

  .battle-stats,
  .battle-result {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat {
    width: 100%;
    text-align: center;
  }

  .confirmation-dialog {
    width: 95%;
    min-height: auto;
  }

  .confirmation-body {
    padding: 15px;
    min-height: 150px;

    .resource-requirements {
      flex-direction: column;
      gap: 10px;
    }

    .resource-item {
      width: 100%;
      justify-content: center;
    }

    .confirmation-text,
    .instruction-text {
      font-size: 0.9rem;
    }

    .button-group {
      flex-direction: column;
      width: 100%;

      .btn {
        width: 100%;
      }
    }
  }

  .message-container {
    padding: 15px;
    margin: 15px 0;
  }

  .message-text {
    font-size: 1rem;
  }

  .instruction-text {
    font-size: 0.9rem;
  }

  .resource-requirements {
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
  }

  .resource-item {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .shop-content {
    padding: 10px;
  }

  .shop-title {
    font-size: 14px;
  }

  .log-entry {
    padding: 0.75rem;
  }

  .enemy-info {
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .message-container {
    padding: 10px;
    margin: 10px 0;
  }

  .message-text,
  .instruction-text {
    font-size: 0.9rem;
  }
}
</style>
