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
          <div class="player-money">
            <img :src="require('@/assets/interface/icons/player.png')" alt="Skill Points">
            <span>{{ character.skillPoints }} Skill Points</span>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
        </div>

        <div class="shop-tabs">
          <button 
            v-for="category in ['special', 'perks']" 
            :key="category"
            class="tab-button"
            :class="{ active: activeCategory === category }"
            @click="changeCategory(category)"
          >
            <img :src="require(`@/assets/interface/icons/${category === 'special' ? 'player' : 'exp'}.png`)" :alt="category">
            {{ category.toUpperCase() }}
            <span class="item-count">
              {{ getItemCount(category) }}
            </span>
          </button>
        </div>

        <div class="shop-container">
          <div class="shop-content-grid">
            <div class="shop-items">
              <!-- SPECIAL Tab -->
              <div v-show="activeCategory === 'special'" class="items-grid">
                <div v-for="(value, stat) in character.special" 
                     :key="stat"
                     class="item-slot special-slot"
                     :class="{ 'selected': hoveredItem === stat }"
                     @click="showItemInfo(stat, 'special')"
                     :ref="'item-special-' + stat">
                  <div class="special-letter">{{ stat.charAt(0).toUpperCase() }}</div>
                  <div class="special-value">{{ value }}</div>
                  <div class="progress-mini">
                    <div class="progress-fill" :style="{ width: (value / 10) * 100 + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Perks Tab -->
              <div v-show="activeCategory === 'perks'" class="items-grid">
                <!-- Active Perks -->
                <div v-for="perk in character.activePerks" 
                     :key="'active-' + perk.id"
                     class="item-slot perk-slot active-perk"
                     :class="{ 'selected': hoveredItem === perk.id }"
                     @click="showItemInfo(perk, 'active-perk')"
                     :ref="'item-perk-' + perk.id">
                  <div class="perk-status">✓</div>
                  <div class="perk-name">{{ perk.name }}</div>
                </div>

                <!-- Available Perks -->
                <div v-for="perk in character.availablePerks" 
                     :key="'available-' + perk.id"
                     class="item-slot perk-slot available-perk"
                     :class="{ 'selected': hoveredItem === perk.id }"
                     @click="showItemInfo(perk, 'available-perk')"
                     :ref="'item-perk-' + perk.id">
                  <div class="perk-status">?</div>
                  <div class="perk-name">{{ perk.name }}</div>
                </div>
              </div>
            </div>

            <div class="info-panel">
              <div v-if="hoveredItem && hoveredItemType === 'special'" class="item-details special">
                <h3>{{ getStatDisplayName(hoveredItem) }} ({{ hoveredItem.charAt(0).toUpperCase() }})</h3>
                <div class="stats">
                  <div class="stat">
                    <img :src="require('@/assets/interface/icons/player.png')" alt="Level">
                    <span>Level: {{ character.special[hoveredItem] }}/10</span>
                  </div>
                  <div class="stat">
                    <img :src="require('@/assets/interface/icons/exp.png')" alt="Bonus">
                    <span>{{ getStatBonus(hoveredItem) }}</span>
                  </div>
                </div>
                <p class="description">{{ getStatDescription(hoveredItem) }}</p>
                
                <div class="progress-section">
                  <div class="progress-bar-large">
                    <div class="progress-fill" :style="{ width: (character.special[hoveredItem] / 10) * 100 + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ character.special[hoveredItem] }}/10</span>
                </div>

                <button 
                  class="buy-button upgrade-button" 
                  @click="upgradeSpecialStat(hoveredItem)"
                  :disabled="character.skillPoints <= 0 || character.special[hoveredItem] >= 10"
                  :class="{ 'can-afford': character.skillPoints > 0 && character.special[hoveredItem] < 10 }">
                  <span v-if="character.skillPoints > 0 && character.special[hoveredItem] < 10">
                    <img :src="require('@/assets/interface/icons/player.png')" alt="Skill Point">
                    Spend 1 Skill Point
                  </span>
                  <span v-else-if="character.special[hoveredItem] >= 10">Maximum Level Reached</span>
                  <span v-else>No Skill Points Available</span>
                </button>
              </div>

              <div v-else-if="hoveredItem && (hoveredItemType === 'active-perk' || hoveredItemType === 'available-perk')" class="item-details perks">
                <h3>{{ hoveredItemData.name }}</h3>
                <div class="stats">
                  <div class="stat">
                    <img :src="require('@/assets/interface/icons/exp.png')" alt="Effect">
                    <span>{{ hoveredItemData.description }}</span>
                  </div>
                  <div class="stat">
                    <img :src="require('@/assets/interface/icons/player.png')" alt="Requirement">
                    <span>{{ hoveredItemData.requirement }}</span>
                  </div>
                </div>
                <p class="description">{{ getPerkDetailedDescription(hoveredItemData) }}</p>

                <button 
                  v-if="hoveredItemType === 'available-perk'"
                  class="buy-button activate-button" 
                  @click="activateSelectedPerk(hoveredItemData)"
                  :class="{ 'can-afford': true }">
                  <img :src="require('@/assets/interface/icons/reward.png')" alt="Activate">
                  Activate Perk
                </button>
                <button 
                  v-else
                  class="buy-button activated-button" 
                  disabled>
                  <img :src="require('@/assets/interface/icons/reward.png')" alt="Active">
                  Perk Active
                </button>
              </div>

              <div v-else class="item-details-placeholder">
                <p>Select a {{ activeCategory === 'special' ? 'SPECIAL attribute' : 'perk' }} to view details</p>
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
      hoveredItem: null,
      hoveredItemType: null,
      hoveredItemData: null,
      activeCategory: 'special'
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
      this.hoveredItem = null;
      this.hoveredItemType = null;
      this.hoveredItemData = null;
    },

    changeCategory(category) {
      this.activeCategory = category;
      this.hoveredItem = null; // Clear hovered item when changing category
      this.hoveredItemType = null;
      this.hoveredItemData = null;
    },

    getItemCount(category) {
      if (category === 'special') {
        return Object.values(this.character.special).reduce((sum, value) => sum + value, 0);
      } else if (category === 'perks') {
        return (this.character.activePerks ? this.character.activePerks.length : 0) + 
               (this.character.availablePerks ? this.character.availablePerks.length : 0);
      }
      return 0;
    },
    
    showItemInfo(item, type) {
      this.hoveredItem = type === 'special' ? item : item.id;
      this.hoveredItemType = type;
      this.hoveredItemData = type === 'special' ? null : item;
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
        strength: 'Affects attack damage and carry capacity. Higher strength means more powerful melee attacks and the ability to wield heavier weapons effectively.',
        perception: 'Affects critical hit chance and accuracy. Better perception allows you to spot weaknesses in enemies and land more precise strikes.',
        endurance: 'Affects health points and resistance to damage. Higher endurance means you can survive longer in combat and resist environmental hazards.',
        charisma: 'Affects shop prices and dialog options. Better charisma gets you better deals from traders and opens up new conversation paths.',
        intelligence: 'Affects experience gained and skill points earned. Higher intelligence means you learn faster and gain more skill points when leveling up.',
        agility: 'Affects dodge chance and movement speed. Better agility allows you to avoid enemy attacks and move more quickly in combat.',
        luck: 'Affects critical hits and loot quality. Higher luck increases your chances of finding rare items and landing critical hits.'
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
          return `+${value} Defense, Health Bonus on Level Up`;
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

    getPerkDetailedDescription(perk) {
      const details = {
        'iron-fist': 'Your unarmed combat training pays off with devastating punches that can knock out enemies faster.',
        'better-criticals': 'Your keen eye for weak spots allows you to deal significantly more damage when you score critical hits.',
        'lifegiver': 'Your hardy constitution grants you additional health, making you more resilient in dangerous situations.',
        'negotiator': 'Your silver tongue and natural charisma help you get better deals from traders and merchants.',
        'educated': 'Your sharp mind allows you to learn from experiences more effectively, gaining knowledge faster than others.',
        'dodger': 'Your quick reflexes and agility training help you avoid incoming attacks more frequently.',
        'fortune-finder': 'Your luck seems to attract wealth, finding more valuable rewards in your adventures.'
      };
      return details[perk.id] || perk.description;
    },

    upgradeSpecialStat(stat) {
      this.spendSkillPoint(stat);
      this.animatePurchase(stat, 'special');
    },

    activateSelectedPerk(perk) {
      this.activatePerk(perk);
      this.calculatePerks(); // Recalculate available perks
      this.animatePurchase(perk.id, 'perk');
    },

    animatePurchase(itemId, category) {
      const element = this.$refs[`item-${category}-${itemId}`][0];
      if (element) {
        element.classList.add('purchase-success');
        setTimeout(() => element.classList.remove('purchase-success'), 500);
      }
    }
  }
};
</script>

<style scoped lang="scss">
// Use same modal styles as PlayerShop.vue
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
  max-width: 1200px;
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

.shop-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.tab-button {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #888;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #222;
    color: #fff;
  }

  &.active {
    background: #333;
    color: #00ff00;
    border-color: #00ff00;
  }

  .item-count {
    display: inline-block;
    background: #333;
    color: #fff;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    margin-left: 8px;
  }
}

.shop-container {
  flex: 1;
  min-height: 0;
  margin-top: 15px;
}

.shop-content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px);
}

.shop-items {
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

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  padding: 5px;
}

.item-slot {
  width: 100px;
  height: 100px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #00ff00;
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  }

  &.selected {
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }
}

.special-slot {
  .special-letter {
    background: #00ff00;
    color: #000;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 8px;
  }

  .special-value {
    font-size: 1.4rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8px;
  }

  .progress-mini {
    width: 80%;
    height: 4px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff00, #00cc00);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }
}

.perk-slot {
  padding: 8px;

  &.active-perk {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.1);
  }

  &.available-perk {
    border-color: #ffc107;
    background: rgba(255, 193, 7, 0.1);
  }

  .perk-status {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &.active-perk .perk-status {
    background: #00ff00;
    color: #000;
  }

  &.available-perk .perk-status {
    background: #ffc107;
    color: #000;
  }

  .perk-name {
    font-size: 0.7rem;
    color: #fff;
    text-align: center;
    line-height: 1.2;
  }
}

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

.item-details {
  padding: 15px;
  height: 100%;

  &.special { border-left: 2px solid rgba(0, 255, 0, 0.3); }
  &.perks { border-left: 2px solid rgba(255, 193, 7, 0.3); }

  h3 {
    color: #00ff00;
    font-size: 18px;
    margin: 0 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .stats {
    margin-bottom: 15px;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 14px;

    img {
      width: 18px;
      height: 18px;
    }

    span {
      color: #fff;
    }
  }

  .description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 15px;
    line-height: 1.6;
  }

  .progress-section {
    margin-bottom: 15px;
    
    .progress-bar-large {
      height: 12px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #333;
      margin-bottom: 8px;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #00cc00);
        border-radius: 6px;
        transition: width 0.3s ease;
      }
    }
    
    .progress-text {
      display: block;
      text-align: center;
      color: #aaa;
      font-size: 12px;
    }
  }
}

.item-details-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  padding: 20px;
  text-align: center;
}

.buy-button {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(26, 26, 26, 0.95);
  color: #ff4444;
  border: 1px solid #ff4444;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  img {
    width: 16px;
    height: 16px;
  }

  &.can-afford, &.activate-button {
    background: rgba(0, 255, 0, 0.1);
    color: #00ff00;
    border-color: #00ff00;

    &:hover {
      background: #00ff00;
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    }
  }

  &.activated-button {
    background: rgba(0, 255, 0, 0.2);
    color: #00ff00;
    border-color: #00ff00;
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

@keyframes purchaseSuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); background: rgba(0, 255, 0, 0.2); }
  100% { transform: scale(1); }
}

.purchase-success {
  animation: purchaseSuccess 0.5s ease;
}

@media (max-width: 1024px) {
  .shop-content-grid {
    grid-template-columns: 1fr 250px;
  }
}

@media (max-width: 768px) {
  .shop-content-grid {
    grid-template-columns: 1fr;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
  
  .item-slot {
    width: 80px;
    height: 80px;
  }
}
</style> 