<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/player.png`)" title="SPECIAL & Perks">
  </button>

  <div v-if="showModal" class="shop-modal" tabindex="-1" @click.self="closeModal">
    <div class="shop-dialog">
      <div class="shop-content">
        <div class="shop-header">
          <div class="shop-title-wrapper">
            <img class="shop-logo" :src="require(`@/assets/interface/icons/player.png`)" alt="SPECIAL Icon">
            <h5 class="shop-title">S.P.E.C.I.A.L. & Perks</h5>
          </div>
          <div class="header-controls">
            <div class="player-money">
              <img :src="require('@/assets/interface/icons/player.png')" alt="Skill Points">
              <span>{{ character.skillPoints }} Skill Points</span>
              <button class="close-button" @click="closeModal">&times;</button>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <!-- SPECIAL Attributes -->
          <div class="special-container mb-4">
            <div class="card bg-dark border-success">
              <div class="card-header text-success">
                <strong>S.P.E.C.I.A.L. Attributes</strong>
              </div>
              <div class="card-body">
                <div class="special-grid">
                  <div 
                    v-for="(value, stat) in character.special" 
                    :key="stat" 
                    class="special-stat-card"
                    @mouseover="showSpecialInfo(stat)"
                    @mouseleave="hideSpecialInfo"
                  >
                    <div class="special-stat-header">
                      <div class="special-stat-name">{{ getStatDisplayName(stat) }}</div>
                      <div class="special-stat-letter">{{ stat.charAt(0).toUpperCase() }}</div>
                    </div>
                    
                    <div class="special-stat-value">
                      <span class="current-value">{{ value }}</span>
                      <span class="max-value">/10</span>
                    </div>
                    
                    <div class="special-stat-progress">
                      <div class="progress-bar" :style="{ width: (value / 10) * 100 + '%' }"></div>
                    </div>
                    
                    <div class="special-stat-controls">
                      <button 
                        class="btn btn-success btn-sm" 
                        @click="spendSkillPoint(stat)"
                        :disabled="character.skillPoints <= 0 || value >= 10"
                        title="Spend 1 skill point"
                      >
                        +
                      </button>
                    </div>
                    
                    <!-- Tooltip with stat information -->
                    <div v-if="hoveredStat === stat" class="special-tooltip">
                      <p class="tooltip-title">{{ getStatDisplayName(stat) }}</p>
                      <p class="tooltip-description">{{ getStatDescription(stat) }}</p>
                      <p class="tooltip-bonus">Current Bonus: {{ getStatBonus(stat) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Perks -->
          <div class="active-perks-container mb-4" v-if="character.activePerks && character.activePerks.length > 0">
            <div class="card bg-dark border-success">
              <div class="card-header text-success">
                <strong>Active Perks</strong>
              </div>
              <div class="card-body">
                <div class="perks-grid">
                  <div 
                    v-for="perk in character.activePerks" 
                    :key="perk.id" 
                    class="perk-card active-perk"
                    @mouseover="showPerkInfo(perk)"
                    @mouseleave="hidePerkInfo"
                  >
                    <div class="perk-name">{{ perk.name }}</div>
                    <div class="perk-description">{{ perk.description }}</div>
                    
                    <div v-if="hoveredPerk && hoveredPerk.id === perk.id" class="perk-tooltip">
                      <p class="tooltip-title">{{ perk.name }}</p>
                      <p class="tooltip-description">{{ perk.description }}</p>
                      <p class="tooltip-requirement">{{ perk.requirement }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Available Perks -->
          <div class="available-perks-container mb-4" v-if="character.availablePerks && character.availablePerks.length > 0">
            <div class="card bg-dark border-warning">
              <div class="card-header text-warning">
                <strong>Available Perks</strong>
              </div>
              <div class="card-body">
                <div class="perks-grid">
                  <div 
                    v-for="perk in character.availablePerks" 
                    :key="perk.id" 
                    class="perk-card available-perk"
                    @mouseover="showPerkInfo(perk)"
                    @mouseleave="hidePerkInfo"
                    @click="activatePerk(perk)"
                  >
                    <div class="perk-name">{{ perk.name }}</div>
                    <div class="perk-description">{{ perk.description }}</div>
                    <div class="perk-requirement">{{ perk.requirement }}</div>
                    
                    <div v-if="hoveredPerk && hoveredPerk.id === perk.id" class="perk-tooltip">
                      <p class="tooltip-title">{{ perk.name }}</p>
                      <p class="tooltip-description">{{ perk.description }}</p>
                      <p class="tooltip-requirement">{{ perk.requirement }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Available Perks Message -->
          <div v-if="!character.availablePerks || character.availablePerks.length === 0" class="no-perks-message mb-4">
            <div class="card bg-dark border-secondary">
              <div class="card-body text-center text-muted">
                <p>No perks currently available.</p>
                <p class="small">Level up and increase your SPECIAL stats to unlock perks!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'SpecialManager',
  data() {
    return {
      showModal: false,
      hoveredStat: null,
      hoveredPerk: null
    };
  },
  computed: {
    ...mapState(['character']),
    ...mapGetters([
      'totalAttackBonus', 
      'totalDefenseBonus', 
      'criticalHitChance', 
      'dodgeChance', 
      'experienceMultiplier', 
      'shopPriceMultiplier',
      'moneyMultiplier'
    ])
  },
  methods: {
    ...mapActions(['spendSkillPoint', 'activatePerk', 'calculatePerks']),
    
    openModal() {
      this.showModal = true;
      // Calculate available perks when modal opens
      this.calculatePerks();
    },
    
    closeModal() {
      this.showModal = false;
      this.hoveredStat = null;
      this.hoveredPerk = null;
    },
    
    getStatDisplayName(stat) {
      const displayNames = {
        strength: 'Strength',
        perception: 'Perception',
        endurance: 'Endurance',
        charisma: 'Charisma',
        intelligence: 'Intelligence',
        agility: 'Agility',
        luck: 'Luck'
      };
      return displayNames[stat] || stat;
    },

    getStatDescription(stat) {
      const descriptions = {
        strength: 'Affects attack damage and carry capacity',
        perception: 'Affects critical hit chance and accuracy',
        endurance: 'Affects health points and resistance',
        charisma: 'Affects shop prices and dialog options',
        intelligence: 'Affects experience gained and skill points',
        agility: 'Affects dodge chance and movement speed',
        luck: 'Affects critical hits and loot quality'
      };
      return descriptions[stat] || '';
    },

    getStatBonus(stat) {
      const value = this.character.special[stat];
      switch(stat) {
        case 'strength':
          return `+${Math.floor(value / 2)} Attack Damage`;
        case 'perception':
          return `+${(value * 2).toFixed(1)}% Critical Hit Chance`;
        case 'endurance':
          return `+${Math.floor(value / 3)} Defense, Health Bonus on Level Up`;
        case 'charisma':
          return `-${(value * 2).toFixed(1)}% Shop Prices`;
        case 'intelligence':
          return `+${(value * 5).toFixed(1)}% Experience Gained`;
        case 'agility':
          return `+${(value * 2).toFixed(1)}% Dodge Chance`;
        case 'luck':
          return `+${(value * 1).toFixed(1)}% Crit, +${(value * 3).toFixed(1)}% Money`;
        default:
          return '';
      }
    },

    showSpecialInfo(stat) {
      this.hoveredStat = stat;
    },

    hideSpecialInfo() {
      this.hoveredStat = null;
    },

    showPerkInfo(perk) {
      this.hoveredPerk = perk;
    },

    hidePerkInfo() {
      this.hoveredPerk = null;
    }
  }
};
</script>

<style lang="scss" scoped>
// Use same modal styles as other components
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

.header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-money {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 4px;
  color: #00ff00;
  font-size: 14px;

  img {
    width: 16px;
    height: 16px;
  }
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

.modal-body {
  flex: 1;
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

.special-container {
  .special-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 15px;
  }
}

.special-stat-card {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 15px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
  }
}

.special-stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .special-stat-name {
    font-weight: bold;
    color: #00ff00;
    font-size: 1.1rem;
  }

  .special-stat-letter {
    background: #00ff00;
    color: #000;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
  }
}

.special-stat-value {
  text-align: center;
  margin-bottom: 10px;

  .current-value {
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
  }

  .max-value {
    font-size: 1rem;
    color: #aaa;
  }
}

.special-stat-progress {
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #00ff00, #00cc00);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
}

.special-stat-controls {
  text-align: center;

  .btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.2rem;
    font-weight: bold;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.special-tooltip {
  position: absolute;
  top: -10px;
  left: 110%;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 10px;
  min-width: 250px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  .tooltip-title {
    color: #00ff00;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .tooltip-description {
    color: #fff;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .tooltip-bonus {
    color: #ffff00;
    font-size: 0.8rem;
    font-weight: bold;
  }
}

.perks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
}

.perk-card {
  border-radius: 8px;
  padding: 12px;
  position: relative;
  transition: all 0.3s ease;

  &.active-perk {
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid #00ff00;
    
    &:hover {
      background: rgba(0, 255, 0, 0.2);
    }
  }

  &.available-perk {
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid #ffc107;
    cursor: pointer;
    
    &:hover {
      background: rgba(255, 193, 7, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
    }
  }

  .perk-name {
    font-weight: bold;
    color: #fff;
    margin-bottom: 5px;
  }

  .perk-description {
    font-size: 0.9rem;
    color: #ccc;
    margin-bottom: 5px;
  }

  .perk-requirement {
    font-size: 0.8rem;
    color: #aaa;
    font-style: italic;
  }
}

.perk-tooltip {
  position: absolute;
  top: -10px;
  left: 110%;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 10px;
  min-width: 250px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  .tooltip-title {
    color: #ffc107;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .tooltip-description {
    color: #fff;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .tooltip-requirement {
    color: #aaa;
    font-size: 0.8rem;
    font-style: italic;
  }
}

.no-perks-message {
  .card {
    text-align: center;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .special-tooltip,
  .perk-tooltip {
    left: -250px;
    top: 100%;
  }
  
  .special-grid {
    grid-template-columns: 1fr;
  }
  
  .perks-grid {
    grid-template-columns: 1fr;
  }
}
</style> 