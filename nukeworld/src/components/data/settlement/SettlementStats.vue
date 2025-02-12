<template>
  <div class="settlement-stats">
    <!-- Main Stats -->
    <div class="main-stats">
      <div class="header-stats">
        <div class="level-display">
          <span class="level-badge">Level {{ settlement.level }}</span>
          <button 
            @click="upgradeLevel" 
            :disabled="!canUpgradeLevel"
            class="btn btn-success btn-sm"
          >
            Upgrade
            <span class="upgrade-cost">
              <span>{{ settings?.upgradeCosts?.level?.resource1Amount || 0 }}</span>
              <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.level?.resource1)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.level?.resource1)" class="resource-icon">
              <span>{{ settings?.upgradeCosts?.level?.resource2Amount || 0 }}</span>
              <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.level?.resource2)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.level?.resource2)" class="resource-icon">
              <span>${{ settings?.upgradeCosts?.level?.moneyCost || 0 }}</span>
              <img src="@/assets/interface/icons/money.png" alt="Money" class="resource-icon">
            </span>
          </button>
        </div>
        <div class="health-display">
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
      </div>

      <div class="stats-container">
        <!-- Left Column -->
        <div class="stats-column">
          <div class="stat-group">
            <div class="stat-header" :data-cost="`${settings?.upgradeCosts?.inhabitant?.resource1Amount || 0} ${getResourceName(settings?.upgradeCosts?.inhabitant?.resource1)}, ${settings?.upgradeCosts?.inhabitant?.resource2Amount || 0} ${getResourceName(settings?.upgradeCosts?.inhabitant?.resource2)}, $${settings?.upgradeCosts?.inhabitant?.moneyCost || 0} per Inhabitant`">Population</div>
            <div class="stat-row">
              <span>Inhabitants</span>
              <div class="cost-info">
                <span>{{ settings?.upgradeCosts?.inhabitant?.resource1Amount || 0 }}</span>
                <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.inhabitant?.resource1)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.inhabitant?.resource1)" class="resource-icon">
                <span>{{ settings?.upgradeCosts?.inhabitant?.resource2Amount || 0 }}</span>
                <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.inhabitant?.resource2)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.inhabitant?.resource2)" class="resource-icon">
                <span>${{ settings?.upgradeCosts?.inhabitant?.moneyCost || 0 }}</span>
                <img src="@/assets/interface/icons/money.png" alt="Money" class="resource-icon">
              </div>
              <div class="stat-value">
                {{ settlement.inhabitants }}/{{ settlement.maxInhabitants }}
                <button 
                  @click="addInhabitant" 
                  :disabled="settlement.inhabitants >= settlement.maxInhabitants"
                  class="btn btn-success btn-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="stat-group">
            <div class="stat-header">Combat Stats</div>
            <div class="stat-row">
              <span>Attack Power</span>
              <div class="stat-value highlight">{{ settlementAttackPower }}</div>
            </div>
            <div class="stat-row">
              <span>Defence Power</span>
              <div class="stat-value highlight">{{ settlementDefencePower }}</div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="stats-column">
          <div class="stat-group">
            <div class="stat-header" :data-cost="`${settings?.upgradeCosts?.defences?.resource1Amount || 0} ${getResourceName(settings?.upgradeCosts?.defences?.resource1)}, ${settings?.upgradeCosts?.defences?.resource2Amount || 0} ${getResourceName(settings?.upgradeCosts?.defences?.resource2)}, $${settings?.upgradeCosts?.defences?.moneyCost || 0}`">Infrastructure</div>
            <div class="stat-row">
              <div class="stat-label">Defence</div>
              <div class="cost-info">
                <span>{{ settings?.upgradeCosts?.defences?.resource1Amount || 0 }}</span>
                <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.defences?.resource1)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.defences?.resource1)" class="resource-icon">
                <span>{{ settings?.upgradeCosts?.defences?.resource2Amount || 0 }}</span>
                <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.defences?.resource2)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.defences?.resource2)" class="resource-icon">
                <span>${{ settings?.upgradeCosts?.defences?.moneyCost || 0 }}</span>
                <img src="@/assets/interface/icons/money.png" alt="Money" class="resource-icon">
              </div>
              <div class="stat-value">
                {{ settlement.defences }}/{{ settlement.maxDefences }}
                <button 
                  @click="upgradeDefences" 
                  :disabled="settlement.defences >= settlement.maxDefences"
                  class="btn btn-success btn-xs"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="stat-row">
              <div class="stat-label">Power</div>
              <div class="cost-info">
                <span>{{ settings?.upgradeCosts?.power?.resource1Amount || 0 }}</span>
                <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.power?.resource1)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.power?.resource1)" class="resource-icon">
                <span>{{ settings?.upgradeCosts?.power?.resource2Amount || 0 }}</span>
                <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.power?.resource2)?.img}`)" :alt="getResourceName(settings?.upgradeCosts?.power?.resource2)" class="resource-icon">
                <span>${{ settings?.upgradeCosts?.power?.moneyCost || 0 }}</span>
                <img src="@/assets/interface/icons/money.png" alt="Money" class="resource-icon">
              </div>
              <div class="stat-value">
                {{ settlement.power }}/{{ settlement.maxPower }}
                <button 
                  @click="upgradePower" 
                  :disabled="settlement.power >= settlement.maxPower"
                  class="btn btn-success btn-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="stat-group">
            <div class="stat-header">Environment</div>
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
              <div class="stat-value">{{ formatLastAttack }}</div>
            </div>
          </div>
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
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.main-stats {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #00ff00;
  border-radius: 10px;
  padding: 1rem;
}

.header-stats {
  margin-bottom: 1.5rem;
}

.level-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.level-badge {
  font-size: 1.2rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.health-display .progress {
  height: 25px;
  background-color: #1a1a1a;
  border: 1px solid #00ff00;
}

.health-display .progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stats-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-group {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 5px;
  padding: 0.8rem;
}

.stat-header {
  color: #00ff00;
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
}

.stat-header::after {
  content: attr(data-cost);
  color: #888;
  font-size: 0.65rem;
  font-style: italic;
  text-transform: none;
  letter-spacing: normal;
  margin-top: 0.2rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  padding: 3px 0;
  font-size: 0.9rem;
}

.stat-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.highlight {
  color: #ffff00;
  font-weight: bold;
}

.radiation-value {
  flex: 1;
  margin-left: 1rem;
}

.radiation-value .progress {
  height: 20px;
  margin: 0;
  background-color: #1a1a1a;
  border: 1px solid #00ff00;
}

.btn-xs {
  padding: 0.1rem 0.3rem;
  font-size: 0.8rem;
  min-width: 24px;
}

.btn-success {
  background-color: #00ff00;
  border: none;
  color: #000;
}

.btn-success:hover:not(:disabled) {
  background-color: #00cc00;
}

.btn-success:disabled {
  background-color: #004400;
  opacity: 0.5;
}

.cost-info {
  color: #888;
  font-size: 0.6rem;
  font-style: italic;
  margin-top: 0.2rem;
  margin-left: 0.5rem;
  text-align: left;
  width: 100%;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.resource-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.stat-label {
  color: #00ff00;
}

@media (max-width: 576px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .stat-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stat-value {
    width: 100%;
    justify-content: space-between;
  }
}

.upgrade-cost {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: 0.3rem;
}
</style>