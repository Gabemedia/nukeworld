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

      <!-- Action Buttons -->
      <div class="stat-group mt-4 p-0">
        <div class="action-buttons m-0">
          <button 
            @click="healSettlement" 
            class="btn btn-success"
            :class="{ 'btn-active': canHealSettlement }"
            :disabled="!canHealSettlement"
          >
            <span class="btn-text">Heal Settlement</span>
            <span class="cost-info">
              <span>100</span>
              <img src="@/assets/interface/icons/money.png" alt="Money" class="resource-icon">
            </span>
          </button>

          <button 
            @click="reduceRadiation" 
            class="btn btn-success"
            :class="{ 'btn-active': !settlement.radiationReductionActive && settlement.radiation > 0 }"
            :disabled="settlement.radiation === 0 || settlement.radiationReductionActive"
          >
            <span class="btn-text">Reduce Radiation</span>
            <span class="cost-info">
              <span>1</span>
              <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === 1)?.img}`)" alt="Wood" class="resource-icon">
              <span>1</span>
              <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === 2)?.img}`)" alt="Steel" class="resource-icon">
            </span>
          </button>

          <button 
            @click="$emit('open-log')" 
            class="btn btn-success btn-active"
          >
            <span class="btn-text">View Attack Log</span>
          </button>
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
  emits: ['open-log'],
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
    },
    canHealSettlement() {
      return this.settlement.health < this.settlement.maxHealth && this.$store.state.character.money >= 100;
    }
  },
  watch: {
    'settlement.health': {
      immediate: true,
      handler() {
        // Force re-evaluation of canHealSettlement when health changes
        this.$nextTick(() => {
          this.$forceUpdate();
        });
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
    },
    async healSettlement() {
      try {
        await this.$store.dispatch('settlement/healSettlementAction', {
          amount: 50,
          cost: 100
        });
        
        const successMessage = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Settlement Healed!</p>
            <p class="text-left fw-semi mb-2">Your settlement was healed for 50 HP</p>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/money.png')}" title="Cost" style="width: 20px;" class="me-2">
              <span>-100 money spent</span>
            </div>
          </div>
        `;
        
        toast.success(successMessage, {
          dangerouslyHTMLString: true,
          autoClose: 3000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      } catch (error) {
        const errorMessage = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Cannot Heal Settlement</p>
            <p class="text-left fw-semi mb-2">Not enough money!</p>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/money.png')}" title="Required" style="width: 20px;" class="me-2">
              <span>100 money required</span>
            </div>
          </div>
        `;

        toast.error(errorMessage, {
          dangerouslyHTMLString: true,
          autoClose: 3000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      }
    },
    
    async reduceRadiation() {
      try {
        // Check resources
        const resources = [
          { id: 1, amount: 1 }, // 1 Wood
          { id: 2, amount: 1 }  // 1 Steel
        ];

        const hasResources = await this.$store.dispatch('checkRequiredResources', resources);
        if (!hasResources) {
          throw new Error('Not enough resources');
        }

        // Use resources
        await this.$store.dispatch('useRequiredResources', resources);
        
        // Start radiation reduction
        await this.$store.commit('settlement/startRadiationReduction');
        
        const successMessage = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Radiation Reduction Started!</p>
            <p class="text-left fw-semi mb-2">Duration: 5 minutes</p>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === 1)?.img}`)}" title="Wood Used" style="width: 20px;" class="me-2">
              <span>1 Wood used</span>
            </div>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === 2)?.img}`)}" title="Steel Used" style="width: 20px;" class="me-2">
              <span>1 Steel used</span>
            </div>
          </div>
        `;
        
        toast.success(successMessage, {
          dangerouslyHTMLString: true,
          autoClose: 3000,
          hideProgressBar: false,
          icon: false,
          toastClassName: 'quest-toast-container',
          bodyClassName: 'quest-toast-body quest-toast'
        });
      } catch (error) {
        const errorMessage = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Cannot Reduce Radiation</p>
            <p class="text-left fw-semi mb-2">Not enough resources!</p>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === 1)?.img}`)}" title="Wood Required" style="width: 20px;" class="me-2">
              <span>1 Wood required</span>
            </div>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === 2)?.img}`)}" title="Steel Required" style="width: 20px;" class="me-2">
              <span>1 Steel required</span>
            </div>
          </div>
        `;

        toast.error(errorMessage, {
          dangerouslyHTMLString: true,
          autoClose: 3000,
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
  font-size: 1rem;
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
  font-size: 0.8rem;
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
  color: #fff;
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

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.action-buttons .btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  font-size: 0.7rem;
  padding: 0.3rem;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  min-height: 45px;
  text-align: center;
}

.action-buttons .btn.btn-active {
  background-color: #00ff00;
  color: #000;
  border-color: #00ff00;
}

.action-buttons .btn.btn-active:hover:not(:disabled) {
  background-color: #00cc00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
}

.action-buttons .btn:disabled {
  background-color: rgba(0, 255, 0, 0.05);
  border-color: rgba(0, 255, 0, 0.2);
  color: rgba(0, 255, 0, 0.3);
  cursor: not-allowed;
}

.btn-text {
  font-size: 0.7rem;
  margin-bottom: 0.1rem;
}

.btn-subtext {
  font-size: 0.6rem;
  opacity: 0.8;
  font-weight: normal;
}

.cost-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  margin-top: 0.1rem;
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  width: auto;
}

.resource-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .action-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.2rem;
  }
  
  .action-buttons .btn {
    min-height: 40px;
    padding: 0.2rem;
    font-size: 0.65rem;
  }

  .btn-text {
    font-size: 0.65rem;
  }

  .btn-subtext {
    font-size: 0.55rem;
  }

  .cost-info {
    font-size: 0.6rem;
    padding: 0.1rem 0.2rem;
  }

  .resource-icon {
    width: 10px;
    height: 10px;
  }
}
</style>