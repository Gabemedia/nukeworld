<template>
  <div class="settlement-stats">
    <div class="stat-row">
      <div class="stat-label">Level:</div>
      <div class="stat-value">{{ settlement.level }}</div>
      <button 
        @click="upgradeLevel" 
        class="btn btn-success btn-sm"
        :disabled="!canUpgradeLevel"
        v-tooltip="getLevelUpgradeTooltip()"
      >
        Upgrade
      </button>
    </div>

    <div class="stat-row">
      <div class="stat-label">Health:</div>
      <div class="stat-value">
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

    <div class="stat-row">
      <div class="stat-label">Inhabitants:</div>
      <div class="stat-value">{{ settlement.inhabitants }}/{{ settlement.maxInhabitants }}</div>
      <button 
        @click="addInhabitant" 
        class="btn btn-primary btn-sm"
        :disabled="settlement.inhabitants >= settlement.maxInhabitants"
        v-tooltip="'Costs: 50 Wood Scrap, 30 Steel Scrap'"
      >
        Add
      </button>
    </div>

    <div class="stat-row">
      <div class="stat-label">Defences:</div>
      <div class="stat-value">
        <div class="progress">
          <div 
            class="progress-bar bg-info" 
            :style="{ width: (settlement.defences / settlement.maxDefences * 100) + '%' }"
          >
            {{ settlement.defences }}/{{ settlement.maxDefences }}
          </div>
        </div>
      </div>
      <button 
        @click="upgradeDefences" 
        class="btn btn-info btn-sm"
        :disabled="settlement.defences >= settlement.maxDefences"
        v-tooltip="'Costs: 30 Wood Scrap, 50 Steel Scrap'"
      >
        Upgrade
      </button>
    </div>

    <div class="stat-row">
      <div class="stat-label">Power:</div>
      <div class="stat-value">
        <div class="progress">
          <div 
            class="progress-bar bg-warning" 
            :style="{ width: (settlement.power / settlement.maxPower * 100) + '%' }"
          >
            {{ settlement.power }}/{{ settlement.maxPower }}
          </div>
        </div>
      </div>
      <button 
        @click="upgradePower" 
        class="btn btn-warning btn-sm"
        :disabled="settlement.power >= settlement.maxPower"
        v-tooltip="'Costs: 40 Wood Scrap, 40 Steel Scrap'"
      >
        Upgrade
      </button>
    </div>

    <div class="stat-row">
      <div class="stat-label">Radiation:</div>
      <div class="stat-value">
        <div class="progress">
          <div 
            class="progress-bar bg-danger" 
            :style="{ width: (settlement.radiation / settlement.maxRadiation * 100) + '%' }"
          >
            {{ settlement.radiation }}/{{ settlement.maxRadiation }}
          </div>
        </div>
      </div>
    </div>

    <div class="stat-info mt-3">
      <div><strong>Attack Power:</strong> {{ settlementAttackPower }}</div>
      <div><strong>Defence Power:</strong> {{ settlementDefencePower }}</div>
      <div v-if="settlement.lastAttack">
        <strong>Last Attack:</strong> {{ formatLastAttack }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'SettlementStats',
  computed: {
    ...mapState('settlement', ['settlement']),
    ...mapGetters('settlement', [
      'settlementAttackPower',
      'settlementDefencePower',
      'canUpgradeLevel'
    ]),
    formatLastAttack() {
      if (!this.settlement.lastAttack) return 'Never';
      const date = new Date(this.settlement.lastAttack);
      return date.toLocaleString();
    }
  },
  methods: {
    ...mapActions('settlement', ['upgradeSettlement']),
    getHealthBarClass() {
      const healthPercent = (this.settlement.health / this.settlement.maxHealth) * 100;
      if (healthPercent > 66) return 'bg-success';
      if (healthPercent > 33) return 'bg-warning';
      return 'bg-danger';
    },
    getLevelUpgradeTooltip() {
      if (!this.canUpgradeLevel) {
        return 'Requirements: Settlement Health > 50% and Inhabitants >= ' + (this.settlement.level * 5);
      }
      return 'Upgrade to Level ' + (this.settlement.level + 1);
    },
    async upgradeLevel() {
      try {
        await this.upgradeSettlement({
          type: 'level',
          resources: [
            { id: 1, amount: 100 }, // Wood Scrap
            { id: 2, amount: 100 }  // Steel Scrap
          ]
        });
      } catch (error) {
        alert('Not enough resources to upgrade level');
      }
    },
    async upgradeDefences() {
      try {
        await this.upgradeSettlement({
          type: 'defences',
          amount: 10,
          resources: [
            { id: 1, amount: 30 }, // Wood Scrap
            { id: 2, amount: 50 }  // Steel Scrap
          ]
        });
      } catch (error) {
        alert('Not enough resources to upgrade defences');
      }
    },
    async upgradePower() {
      try {
        await this.upgradeSettlement({
          type: 'power',
          amount: 10,
          resources: [
            { id: 1, amount: 40 }, // Wood Scrap
            { id: 2, amount: 40 }  // Steel Scrap
          ]
        });
      } catch (error) {
        alert('Not enough resources to upgrade power');
      }
    },
    async addInhabitant() {
      try {
        const resources = [
          { id: 1, amount: 50 }, // Wood Scrap
          { id: 2, amount: 30 }  // Steel Scrap
        ];
        const hasResources = await this.$store.dispatch('checkRequiredResources', resources);
        if (!hasResources) {
          throw new Error('Not enough resources');
        }
        await this.$store.dispatch('useRequiredResources', resources);
        this.$store.commit('settlement/addInhabitant');
      } catch (error) {
        alert('Not enough resources to add inhabitant');
      }
    }
  }
};
</script>

<style scoped>
.settlement-stats {
  padding: 1rem;
  color: #00ff00;
}

.stat-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.stat-label {
  width: 100px;
  font-weight: bold;
}

.stat-value {
  flex-grow: 1;
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

.btn {
  min-width: 80px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stat-info {
  border-top: 1px solid #00ff00;
  padding-top: 1rem;
}

.stat-info > div {
  margin-bottom: 0.5rem;
}
</style> 