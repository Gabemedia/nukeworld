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
        strength: 'Increases your attack power in battles and settlement attack power. Each point adds +1 to your total attack damage and +2 to settlement attack power.',
        perception: 'Improves your critical hit chance in combat and settlement critical hit chance. Each point adds +2% chance to deal critical hits to enemies and +2% settlement critical hit chance.',
        endurance: 'Increases your defense, health gained per level, and settlement defense. Each point adds +1 defense, +5 health when leveling up, and +2 to settlement defense power.',
        charisma: 'Reduces prices when shopping for items and settlement upgrade costs. Each point gives -2% discount at traders, player shop, and settlement upgrades.',
        intelligence: 'Increases experience gained from all sources and settlement automatic healing chance. Each point adds +5% bonus EXP from quests, battles, and stories, and +5% chance for settlement automatic healing.',
        agility: 'Improves your dodge chance in combat and settlement automatic resource generation chance. Each point adds +2% chance to avoid enemy attacks completely and +5% chance for automatic resource generation.',
        luck: 'Increases critical hits, money rewards, and settlement automatic gold generation chance. Each point adds +1% crit chance, +3% bonus money from all activities, and +5% chance for automatic gold generation.'
      };
      return descriptions[stat] || '';
    },

    getStatBonus(stat) {
      const value = this.character.special[stat];
      switch(stat) {
        case 'strength':
          return `+${value} Attack Power, +${value * 2} Settlement Attack Power`;
        case 'perception':
          return `+${(value * 2).toFixed(1)}% Critical Hit Chance, +${(value * 2).toFixed(1)}% Settlement Critical Hit`;
        case 'endurance':
          return `+${value} Defense, +${value * 5} Health per Level, +${value * 2} Settlement Defense Power`;
        case 'charisma':
          return `-${(value * 2).toFixed(1)}% Shop Prices, -${(value * 2).toFixed(1)}% Settlement Upgrade Costs`;
        case 'intelligence':
          return `+${(value * 5).toFixed(1)}% Experience Gained, +${(value * 5).toFixed(1)}% Settlement Auto-Heal Chance`;
        case 'agility':
          return `+${(value * 2).toFixed(1)}% Dodge Chance, +${(value * 5).toFixed(1)}% Settlement Resource Generation Chance`;
        case 'luck':
          return `+${(value * 1).toFixed(1)}% Crit, +${(value * 3).toFixed(1)}% Money, +${(value * 5).toFixed(1)}% Settlement Gold Generation Chance`;
        default:
          return '';
      }
    },

    getPerkDetailedDescription(perk) {
      const details = {
        // Original perks
        'warrior': 'Your basic combat training increases your attack power in all battles, making you deal more damage to enemies in combat.',
        'berserker': 'Your fierce and reckless fighting style grants you significant attack power bonuses, overwhelming enemies with brute force.',
        'lifegiver': 'Your hardy constitution grants you additional maximum health, making you more resilient in dangerous combat situations.',
        'survivalist': 'Your wilderness training and tough endurance grants you substantial additional health to survive the harsh wasteland.',
        'negotiator': 'Your silver tongue and natural charisma help you get better deals from traders and merchants when shopping.',
        'merchant': 'Your trading expertise and business knowledge gets you significantly better prices when dealing with all merchants.',
        'master-trader': 'Your exceptional negotiation skills and market knowledge get you the best possible deals from all traders.',
        'student': 'Your natural learning ability and curiosity helps you gain more experience from quests, battles, and all activities.',
        'educated': 'Your sharp mind and educational background allows you to learn significantly more from all experiences.',
        'scholar': 'Your dedication to knowledge and learning grants you massive experience bonuses from all encounters and activities.',
        'dodger': 'Your quick reflexes and basic evasion training help you avoid incoming attacks more frequently in combat.',
        'evasion-expert': 'Your masterful evasion techniques and combat agility make you extremely difficult to hit in any battle.',
        'fortune-finder': 'Your luck and keen eye for valuable items helps you find significantly more money from all activities.',
        'wealthy': 'Your business acumen and incredible luck ensure you earn substantially more money from quests, battles, and rewards.',
        'battle-veteran': 'Your extensive combat experience from multiple battles increases your attack power through hard-earned expertise.',
        
        // Perception-based perks
        'keen-eye': 'Your sharp perception helps you spot valuable opportunities and resources, increasing your money rewards from all sources.',
        'sharp-shooter': 'Your excellent aim and focus in combat increases your attack precision, dealing more damage to enemies.',
        'treasure-hunter': 'Your combined perception and luck make you exceptional at finding hidden treasures and valuable rewards.',
        
        // Advanced strength perks
        'iron-muscles': 'Your incredible physical strength helps you learn combat techniques faster, gaining more experience from training.',
        'unstoppable-force': 'Your legendary strength makes you a devastating force in combat, overwhelming even the toughest enemies.',
        
        // Advanced endurance perks
        'iron-skin': 'Your tough constitution and training help you avoid damage through natural resilience and positioning.',
        'wasteland-survivor': 'Your mastery of survival in harsh environments grants you exceptional health and resistance to damage.',
        
        // Advanced intelligence perks
        'quick-learner': 'Your natural intelligence and curiosity help you absorb knowledge quickly from every experience.',
        'genius': 'Your exceptional intellectual capacity allows you to learn and understand at an extraordinary rate.',
        'combat-analyst': 'Your analytical mind helps you identify enemy weaknesses and optimize your combat effectiveness.',
        
        // Advanced agility perks
        'nimble': 'Your basic agility training helps you move quickly and avoid some enemy attacks through better positioning.',
        'untouchable': 'Your legendary speed and evasion skills make you nearly impossible for enemies to hit in combat.',
        
        // Advanced luck perks
        'lucky-break': 'Your natural luck occasionally helps you get better deals when negotiating with traders and merchants.',
        'golden-touch': 'Your incredible luck seems to turn everything you touch into gold, dramatically increasing your wealth.',
        
        // Elite multi-stat perks
        'renaissance-man': 'Your combination of intelligence and charisma makes you exceptionally well-rounded in all learning endeavors.',
        'jack-of-all-trades': 'Your diverse skills and knowledge help you succeed in multiple areas, increasing your overall rewards.',
        'ultimate-warrior': 'Your perfect combination of strength, endurance, and agility makes you the ultimate combat machine.',
        'master-negotiator': 'Your exceptional charisma and intelligence make you unmatched in negotiation and trade dealings.',
        'legendary-survivor': 'Your perfect combination of strength and endurance makes you nearly indestructible in the wasteland.',
        
        // Early game helper perks
        'beginner-luck': 'Your natural good fortune helps you find a little extra money in your early adventures.',
        'tough-skin': 'Your naturally tough constitution provides some extra protection against the dangers of the wasteland.',
        'penny-pincher': 'Your careful spending habits help you get slightly better deals when shopping for supplies.',
        
        // Specialist combat perks
        'combat-expert': 'Your specialized combat training combining strength and perception makes you deadly in battle.',
        'defensive-stance': 'Your combined agility and endurance training helps you avoid enemy attacks through superior positioning.',
        'wealthy-merchant': 'Your combination of charisma and luck makes you exceptionally successful in all business dealings.',
        
        // Legendary tier perks (Level 30-50)
        'apex-predator': 'You have become the ultimate hunter in the wasteland, with unmatched combat prowess that makes you feared by all enemies.',
        'immortal': 'Your incredible endurance and survival instincts have made you nearly impossible to kill, surviving wounds that would fell any normal person.',
        'mastermind': 'Your intellect has reached legendary levels, allowing you to learn and understand at a rate that defies human comprehension.',
        'phantom': 'Your agility has reached supernatural levels, making you appear and disappear like a ghost, untouchable in combat.',
        'midas': 'Your luck has reached mythical proportions - everything you touch seems to turn to gold, bringing incredible wealth.',
        'merchant-king': 'You have become the ultimate trader, commanding respect and getting unbeatable deals from every merchant in the wasteland.',
        
        // Ultimate tier perks (Level 45-50)
        'god-of-war': 'You have transcended mortal combat limitations, becoming a true god of war with unmatched strength and battle prowess.',
        'perfect-being': 'You represent the pinnacle of human development, combining intelligence, charisma, and luck in perfect harmony.',
        'wasteland-emperor': 'You rule the wasteland economy with unmatched charisma and business acumen, accumulating wealth beyond imagination.',
        'legend': 'You have become a living legend, possessing incredible health and resilience that will be spoken of for generations.',
        
        // Settlement-specific perks
        'settlement-commander': 'Your leadership skills and combat experience directly enhance your settlement\'s attack capabilities, making it more effective in defending against threats.',
        'fortress-builder': 'Your knowledge of defensive structures and fortifications significantly improves your settlement\'s ability to withstand enemy attacks.',
        'settlement-architect': 'Your expertise in construction and planning allows you to build settlement upgrades more efficiently, reducing costs significantly.',
        'settlement-healer': 'Your medical knowledge and healing techniques give your settlement a chance to automatically recover health over time.',
        'resource-master': 'Your resource management skills and efficiency give your settlement a chance to automatically generate additional resources.',
        'settlement-economist': 'Your economic expertise and business acumen give your settlement a chance to automatically generate additional gold income.',
        
        // Advanced settlement perks
        'warlord': 'Your legendary combat leadership transforms your settlement into a military powerhouse with devastating attack capabilities.',
        'defensive-master': 'Your mastery of defensive warfare makes your settlement nearly impregnable against all forms of attack.',
        'settlement-tycoon': 'Your exceptional business skills allow you to build and upgrade settlement structures at dramatically reduced costs.',
        'settlement-sage': 'Your advanced healing knowledge gives your settlement a higher chance to recover health automatically.',
        'resource-tycoon': 'Your exceptional resource management skills give your settlement a higher chance to generate resources automatically.',
        'gold-magnate': 'Your mastery of economics gives your settlement a higher chance to generate substantial gold income automatically.',
        
        // Legendary settlement perks
        'settlement-legend': 'Your legendary status as a warrior directly empowers your settlement with unmatched attack capabilities.',
        'imperial-fortress': 'Your settlement has become an imperial fortress, nearly impossible to breach with its legendary defensive capabilities.',
        'settlement-emperor': 'Your imperial authority allows you to build and upgrade settlement structures at minimal cost.',
        'settlement-immortal': 'Your settlement has achieved near-immortality through your legendary healing knowledge, with a very high chance to recover health automatically.',
        'resource-emperor': 'Your settlement has become a resource empire, with a very high chance to generate vast amounts of materials automatically.',
        'gold-emperor': 'Your settlement has become a gold empire, with a very high chance to generate massive wealth automatically through your economic mastery.',
        
        // Settlement critical hit perks
        'settlement-scout': 'Your keen perception and scouting skills help your settlement identify enemy weak points, increasing critical hit chances in battle.',
        'settlement-sniper': 'Your exceptional accuracy and precision training enable your settlement to land devastating critical hits on enemies.',
        'settlement-legendary-scout': 'Your legendary perception and scouting mastery make your settlement nearly unstoppable with incredibly high critical hit rates.'
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