<template>
  <div class="settlement-stats">
    <div class="main-stats">
      <!-- Level and Health Section -->
      <div class="stats-section">
        <div class="level-badge">Level {{ settlement.level }}</div>
        
        <div class="health-container">
          <div class="progress">
            <div 
              class="progress-bar" 
              :class="getHealthBarClass()"
              :style="{ width: (settlement.health / settlement.maxHealth * 100) + '%' }"
            >
              {{ settlement.health }}/{{ settlement.maxHealth }} HP
            </div>
          </div>
        </div>

        <div class="upgrade-container">
          <button 
            @click="upgradeLevel" 
            :disabled="!canUpgradeLevel"
            class="btn btn-success btn-sm"
          >
            Upgrade Level
          </button>
          <div class="cost-info">
            {{ settings?.upgradeCosts?.level?.resource1Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.level?.resource1) }}, 
            {{ settings?.upgradeCosts?.level?.resource2Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.level?.resource2) }},
            ${{ settings?.upgradeCosts?.level?.moneyCost || 0 }}
          </div>
          <div class="requirements">Requires: Health > 50% and {{ settlement.level * 5 }} Inhabitants</div>
        </div>
      </div>

      <!-- Population Section -->
      <div class="stats-section">
        <div class="section-header">Population</div>
        <div class="stat-row">
          <span>Inhabitants</span>
          <div class="stat-value">
            <span>{{ settlement.inhabitants }}/{{ settlement.maxInhabitants }}</span>
            <button 
              @click="addInhabitant" 
              :disabled="settlement.inhabitants >= settlement.maxInhabitants"
              class="btn btn-xs"
            >
              +
            </button>
          </div>
        </div>
        <div class="cost-info small">
          {{ settings?.upgradeCosts?.inhabitant?.resource1Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.inhabitant?.resource1) }}, 
          {{ settings?.upgradeCosts?.inhabitant?.resource2Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.inhabitant?.resource2) }},
          ${{ settings?.upgradeCosts?.inhabitant?.moneyCost || 0 }}
        </div>
      </div>

      <!-- Combat Section -->
      <div class="stats-section">
        <div class="section-header">Combat Stats</div>
        <div class="stat-row">
          <span>Attack Power</span>
          <span class="highlight">{{ settlementAttackPower }}</span>
        </div>
        <div class="stat-row">
          <span>Defence Power</span>
          <span class="highlight">{{ settlementDefencePower }}</span>
        </div>
      </div>

      <!-- Infrastructure Section -->
      <div class="stats-section">
        <div class="section-header">Infrastructure</div>
        <div class="stat-row">
          <span>Defence</span>
          <div class="stat-value">
            <span>{{ settlement.defences }}/{{ settlement.maxDefences }}</span>
            <button 
              @click="upgradeDefences" 
              :disabled="settlement.defences >= settlement.maxDefences"
              class="btn btn-xs"
            >
              +
            </button>
          </div>
        </div>
        <div class="cost-info small">
          {{ settings?.upgradeCosts?.defences?.resource1Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.defences?.resource1) }}, 
          {{ settings?.upgradeCosts?.defences?.resource2Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.defences?.resource2) }},
          ${{ settings?.upgradeCosts?.defences?.moneyCost || 0 }}
        </div>

        <div class="stat-row mt-2">
          <span>Power</span>
          <div class="stat-value">
            <span>{{ settlement.power }}/{{ settlement.maxPower }}</span>
            <button 
              @click="upgradePower" 
              :disabled="settlement.power >= settlement.maxPower"
              class="btn btn-xs"
            >
              +
            </button>
          </div>
        </div>
        <div class="cost-info small">
          {{ settings?.upgradeCosts?.power?.resource1Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.power?.resource1) }}, 
          {{ settings?.upgradeCosts?.power?.resource2Amount || 0 }} {{ getResourceName(settings?.upgradeCosts?.power?.resource2) }},
          ${{ settings?.upgradeCosts?.power?.moneyCost || 0 }}
        </div>
      </div>

      <!-- Environment Section -->
      <div class="stats-section">
        <div class="section-header">Environment</div>
        <div class="stat-row">
          <span>Radiation</span>
          <div class="radiation-value">
            <div class="progress">
              <div 
                class="progress-bar bg-warning" 
                :style="{ width: (settlement.radiation / settlement.maxRadiation * 100) + '%' }"
              >
                {{ settlement.radiation }}%
              </div>
            </div>
          </div>
        </div>
        <div class="stat-row" v-if="settlement.lastAttack">
          <span>Last Attack</span>
          <span>{{ formatLastAttack }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { toast } from "vue3-toastify";

export default {
  name: 'SettlementStats',
  computed: {
    ...mapState('settlement', ['settlement', 'settings']),
    ...mapState(['resources']),
    ...mapGetters('settlement', [
      'settlementAttackPower',
      'settlementDefencePower',
      'canUpgradeLevel'
    ]),
    formatLastAttack() {
      if (!this.settlement.lastAttack) return 'Never';
      const date = new Date(this.settlement.lastAttack);
      return date.toLocaleString();
    },
    getResourceName() {
      return (resourceId) => {
        const resource = this.resources.find(r => r.id === resourceId);
        return resource ? resource.name : 'Unknown Resource';
      }
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
    async upgradeLevel() {
      try {
        await this.upgradeSettlement({ type: 'level' });
      } catch (error) {
        const requirements = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Cannot Upgrade Level</p>
            <p class="text-left fw-semi mb-2">Missing requirements:</p>
            <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.level?.resource1)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.level?.resource1)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.level?.resource1Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.level?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.level?.resource2)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.level?.resource2)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.level?.resource2Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.level?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${this.settings?.upgradeCosts?.level?.moneyCost || 0}</span>
              </div>
            </div>
          </div>`;

        toast.error(requirements, {
          dangerouslyHTMLString: true,
          autoClose: 5000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      }
    },
    async upgradeDefences() {
      try {
        await this.upgradeSettlement({ type: 'defences' });
      } catch (error) {
        const requirements = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Cannot Upgrade Defences</p>
            <p class="text-left fw-semi mb-2">Missing requirements:</p>
            <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.defences?.resource1)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.defences?.resource1)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.defences?.resource1Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.defences?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.defences?.resource2)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.defences?.resource2)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.defences?.resource2Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.defences?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${this.settings?.upgradeCosts?.defences?.moneyCost || 0}</span>
              </div>
            </div>
          </div>`;

        toast.error(requirements, {
          dangerouslyHTMLString: true,
          autoClose: 5000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      }
    },
    async upgradePower() {
      try {
        await this.upgradeSettlement({ type: 'power' });
      } catch (error) {
        const requirements = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Cannot Upgrade Power</p>
            <p class="text-left fw-semi mb-2">Missing requirements:</p>
            <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.power?.resource1)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.power?.resource1)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.power?.resource1Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.power?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.power?.resource2)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.power?.resource2)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.power?.resource2Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.power?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${this.settings?.upgradeCosts?.power?.moneyCost || 0}</span>
              </div>
            </div>
          </div>`;

        toast.error(requirements, {
          dangerouslyHTMLString: true,
          autoClose: 5000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      }
    },
    async addInhabitant() {
      try {
        const moneyCost = this.settings?.upgradeCosts?.inhabitant?.moneyCost || 0;
        const hasEnoughMoney = await this.$store.dispatch('checkMoney', moneyCost);
        if (!hasEnoughMoney) {
          throw new Error('Not enough money');
        }

        const resources = [
          { id: this.settings.upgradeCosts.inhabitant.resource1, amount: this.settings.upgradeCosts.inhabitant.resource1Amount },
          { id: this.settings.upgradeCosts.inhabitant.resource2, amount: this.settings.upgradeCosts.inhabitant.resource2Amount }
        ];

        const hasResources = await this.$store.dispatch('checkRequiredResources', resources);
        if (!hasResources) {
          throw new Error('Not enough resources');
        }

        await this.$store.dispatch('decreaseMoney', moneyCost);
        await this.$store.dispatch('useRequiredResources', resources);
        this.$store.commit('settlement/addInhabitant');
      } catch (error) {
        const requirements = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Cannot Add Inhabitant</p>
            <p class="text-left fw-semi mb-2">Missing requirements:</p>
            <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.inhabitant?.resource1)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource1)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.inhabitant?.resource1Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.inhabitant?.resource2)?.img}`)}" :title="this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource2)" style="width: 20px;" class="me-2">
                <span>${this.settings?.upgradeCosts?.inhabitant?.resource2Amount || 0} ${this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${this.settings?.upgradeCosts?.inhabitant?.moneyCost || 0}</span>
              </div>
            </div>
          </div>`;

        toast.error(requirements, {
          dangerouslyHTMLString: true,
          autoClose: 5000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      }
    }
  }
}
</script>

<style scoped>
.settlement-stats {
  color: #00ff00;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0.5rem;
}

.main-stats {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stats-section {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 6px;
  padding: 0.75rem;
}

.level-badge {
  font-size: 1.1rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  text-align: center;
  margin-bottom: 0.5rem;
}

.health-container {
  margin-bottom: 0.75rem;
}

.upgrade-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.section-header {
  font-size: 1rem;
  font-weight: bold;
  color: #00ff00;
  margin-bottom: 0.75rem;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  font-size: 0.9rem;
}

.stat-value {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.progress {
  width: 100%;
  height: 1.25rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: width 0.3s ease;
  font-size: 0.85rem;
}

.radiation-value {
  flex-grow: 1;
  margin-left: 0.5rem;
}

.btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 4px;
  background: rgba(0, 255, 0, 0.1);
  color: #00ff00;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  min-width: 60px;
}

.btn:hover:not(:disabled) {
  background: rgba(0, 255, 0, 0.2);
  border-color: rgba(0, 255, 0, 0.5);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-xs {
  padding: 0.15rem 0.35rem;
  font-size: 0.8rem;
  min-width: 30px;
}

.cost-info {
  font-size: 0.8rem;
  color: rgba(0, 255, 0, 0.7);
  text-align: center;
}

.cost-info.small {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.requirements {
  font-size: 0.8rem;
  color: rgba(0, 255, 0, 0.7);
  text-align: center;
}

.highlight {
  color: #00ff00;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.mt-2 {
  margin-top: 0.75rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .settlement-stats {
    padding: 0.75rem;
  }
  
  .btn {
    min-width: 80px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .main-stats {
    gap: 1rem;
  }
  
  .stats-section {
    padding: 1rem;
  }
}
</style>
