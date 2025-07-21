<template>
  <div class="quick-bar-left">
    <div class="character-info" @click="openModal">
      <div class="character-avatar">
        <img :src="require('@/assets/interface/icons/player.png')" alt="Character Avatar">
      </div>
      <div class="character-level">
        <span class="level-number">{{ character.level }}</span>
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-item">
        <img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Health">
        <div class="stat-info">
          <div class="stat-bar health-bar">
            <div class="stat-fill" :style="{ width: (character.health / character.maxHealth) * 100 + '%' }"></div>
          </div>
          <div class="stat-text">{{ character.health }}/{{ character.maxHealth }}</div>
        </div>
      </div>

      <div class="stat-item">
        <img :src="require('@/assets/interface/icons/exp.png')" alt="Experience">
        <div class="stat-info">
          <div class="stat-bar exp-bar">
            <div class="stat-fill" :style="{ width: (character.exp / character.maxExp) * 100 + '%' }"></div>
          </div>
          <div class="stat-text">{{ character.exp }}/{{ character.maxExp }}</div>
        </div>
      </div>
      
      <div class="stat-item music-control">
        <img :src="require('@/assets/interface/icons/settings.png')" alt="Music" @click="openMusicPlayer">
        <div class="stat-info">
          <div class="music-status">{{ isMusicPlaying ? 'Playing' : 'Paused' }}</div>
          <div class="music-track">{{ currentTrackName }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Character Modal - Teleported to body to escape z-index stacking context -->
  <Teleport to="body" v-if="showModal">
    <div class="character-modal" tabindex="-1" @click.self="closeModal">
      <div class="character-dialog">
        <div class="character-content">
          <div class="character-header">
            <div class="character-title-wrapper">
              <img class="character-logo" :src="require(`@/assets/interface/icons/player.png`)" alt="Character Icon">
              <h5 class="character-title">Character Information</h5>
            </div>
            <div class="character-level-display">
              <img :src="require('@/assets/interface/icons/exp.png')" alt="Level">
              <span>Level {{ character.level }}</span>
              <button class="close-button" @click="closeModal">&times;</button>
            </div>
          </div>

          <div class="character-tabs">
            <button 
              v-for="category in ['stats', 'combat', 'equipment', 'perks', 'special']" 
              :key="category"
              class="tab-button"
              :class="{ active: activeTab === category }"
              @click="changeTab(category)"
            >
              <img :src="require(`@/assets/interface/icons/${getTabIcon(category)}.png`)" :alt="category">
              {{ category.toUpperCase() }}
              <span class="item-count">
                {{ getTabCount(category) }}
              </span>
            </button>
          </div>

          <div class="character-container">
            <div class="character-content-grid">
              <div class="character-main">
                
                <!-- STATS TAB -->
                <div v-show="activeTab === 'stats'" class="tab-content">
                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/player.png')" alt="Character"> Basic Information</h6>
                    <div class="info-row">Name: <strong>{{ character.name }}</strong></div>
                    <div class="info-row">Level: <strong>{{ character.level }}</strong></div>
                    <div class="info-row">Experience: <strong>{{ character.exp }} / {{ character.maxExp }}</strong></div>
                    <div class="info-row">Skill Points: <strong class="skill-points">{{ character.skillPoints }}</strong></div>
                    <div class="info-row">Money: <strong class="money-value">${{ character.money }}</strong></div>
                  </div>
                  
                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Health"> Health Status</h6>
                    <div class="stat-bar-large">
                      <div class="stat-fill health-fill" :style="{ width: (character.health / character.maxHealth) * 100 + '%' }"></div>
                      <span class="stat-text">{{ character.health }} / {{ character.maxHealth }} HP</span>
                    </div>
                    <div class="stat-bar-large">
                      <div class="stat-fill exp-fill" :style="{ width: (character.exp / character.maxExp) * 100 + '%' }"></div>
                      <span class="stat-text">{{ character.exp }} / {{ character.maxExp }} EXP</span>
                    </div>
                  </div>
                </div>

                <!-- COMBAT TAB -->
                <div v-show="activeTab === 'combat'" class="tab-content">
                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/gun.png')" alt="Combat"> Combat Stats</h6>
                    <div class="info-row">Total Attack: <strong class="attack-value">{{ getTotalAttack() }}</strong></div>
                    <div class="info-row">Total Defense: <strong class="defense-value">{{ getTotalDefense() }}</strong></div>
                    <div class="info-row">Critical Hit Chance: <strong class="crit-value">{{ (criticalHitChance * 100).toFixed(1) }}%</strong></div>
                    <div class="info-row">Dodge Chance: <strong class="dodge-value">{{ (dodgeChance * 100).toFixed(1) }}%</strong></div>
                  </div>

                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/exp.png')" alt="Bonuses"> Bonus Modifiers</h6>
                    <div class="info-row">Attack Bonus: <strong class="bonus-value">+{{ totalAttackBonus }}</strong></div>
                    <div class="info-row">Defense Bonus: <strong class="bonus-value">+{{ totalDefenseBonus }}</strong></div>
                    <div class="info-row">Experience Bonus: <strong class="bonus-value">+{{ ((experienceMultiplier - 1) * 100).toFixed(1) }}%</strong></div>
                    <div class="info-row">Money Bonus: <strong class="bonus-value">+{{ ((moneyMultiplier - 1) * 100).toFixed(1) }}%</strong></div>
                    <div class="info-row">Shop Discount: <strong class="bonus-value">{{ ((1 - shopPriceMultiplier) * 100).toFixed(1) }}%</strong></div>
                  </div>
                </div>

                <!-- EQUIPMENT TAB -->
                <div v-show="activeTab === 'equipment'" class="tab-content">
                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/gun.png')" alt="Equipment"> Current Equipment</h6>
                    <div class="equipment-grid">
                      <div class="equipment-slot">
                        <div class="equipment-label">Weapon</div>
                        <div v-if="equippedWeapon" class="equipped-item">
                          <img :src="getWeaponIcon(equippedWeapon)" :alt="equippedWeapon.name">
                          <div class="item-info">
                            <strong>{{ equippedWeapon.name }}</strong>
                            <span>Attack: {{ equippedWeapon.attack }}</span>
                          </div>
                        </div>
                        <div v-else class="no-equipment">
                          <img :src="require('@/assets/interface/icons/weapons/hands.png')" alt="No weapon">
                          <div class="item-info">
                            <strong>Hands</strong>
                            <span>Attack: 1</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="equipment-slot">
                        <div class="equipment-label">Armor</div>
                        <div v-if="equippedArmor" class="equipped-item">
                          <img :src="getArmorIcon(equippedArmor)" :alt="equippedArmor.name">
                          <div class="item-info">
                            <strong>{{ equippedArmor.name }}</strong>
                            <span>Defense: {{ equippedArmor.defence }}</span>
                          </div>
                        </div>
                        <div v-else class="no-equipment">
                          <img :src="require('@/assets/interface/icons/armor/rags.png')" alt="No armor">
                          <div class="item-info">
                            <strong>Rags</strong>
                            <span>Defense: 1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- PERKS TAB -->
                <div v-show="activeTab === 'perks'" class="tab-content">
                  <div v-if="character.activePerks && character.activePerks.length > 0" class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/reward.png')" alt="Perks"> Active Perks ({{ character.activePerks.length }})</h6>
                    <div class="perks-grid">
                      <div v-for="perk in character.activePerks" :key="perk.id" class="perk-item">
                        <div class="perk-icon">✓</div>
                        <div class="perk-info">
                          <strong class="perk-name">{{ perk.name }}</strong>
                          <span class="perk-description">{{ perk.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/reward.png')" alt="Perks"> No Active Perks</h6>
                    <div class="info-row">Visit the SPECIAL & Perks menu to activate perks and enhance your character!</div>
                  </div>

                  <div v-if="character.availablePerks && character.availablePerks.length > 0" class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/exp.png')" alt="Available"> Available Perks ({{ character.availablePerks.length }})</h6>
                    <div class="available-perks-note">
                      {{ character.availablePerks.length }} perk{{ character.availablePerks.length !== 1 ? 's' : '' }} available for activation
                    </div>
                  </div>
                </div>

                <!-- SPECIAL TAB -->
                <div v-show="activeTab === 'special'" class="tab-content">
                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/player.png')" alt="SPECIAL"> S.P.E.C.I.A.L. Stats</h6>
                    <div class="special-grid">
                      <div v-for="(value, stat) in character.special" :key="stat" class="special-item">
                        <div class="special-letter">{{ stat.charAt(0).toUpperCase() }}</div>
                        <div class="special-info">
                          <div class="special-name">{{ getStatDisplayName(stat) }}</div>
                          <div class="special-value">{{ value }}/10</div>
                          <div class="special-bonus">{{ getStatBonus(stat) }}</div>
                        </div>
                        <div class="special-bar">
                          <div class="special-fill" :style="{ width: (value / 10) * 100 + '%' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="character-section">
                    <h6><img :src="require('@/assets/interface/icons/exp.png')" alt="Total"> Total SPECIAL Points</h6>
                    <div class="info-row">Total Points Spent: <strong class="bonus-value">{{ getTotalSpecialPoints() }}/70</strong></div>
                    <div class="info-row">Available Skill Points: <strong class="skill-points">{{ character.skillPoints }}</strong></div>
                  </div>
                </div>

                             </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </Teleport>
   
   <!-- Music Player Component -->
   <MusicPlayer ref="musicPlayer" @music-status-updated="updateMusicStatus" />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import MusicPlayer from '../MusicPlayer.vue';

export default {
  name: 'QuickBarLeft',
  components: {
    MusicPlayer
  },
  data() {
    return {
      showModal: false,
      activeTab: 'stats',
      isMusicPlaying: false,
      currentTrackName: ''
    };
  },
  computed: {
    ...mapState(['character']),
    ...mapGetters([
      'totalAttackBonus', 
      'totalDefenseBonus', 
      'criticalHitChance', 
      'experienceMultiplier',
      'dodgeChance',
      'moneyMultiplier',
      'shopPriceMultiplier'
    ]),
    equippedWeapon() {
      return this.character.equippedWeapons && this.character.equippedWeapons.length > 0 
        ? this.character.equippedWeapons[0] 
        : null;
    },
    equippedArmor() {
      return this.character.equippedArmor || null;
    }
  },
  methods: {
    ...mapActions(['calculatePerks']),
    openModal() {
      this.showModal = true;
      // Calculate available perks when modal opens
      this.calculatePerks();
    },
    closeModal() {
      this.showModal = false;
      this.activeTab = 'stats'; // Reset to first tab when closing
    },
    changeTab(tab) {
      this.activeTab = tab;
    },
    getTabIcon(category) {
      const icons = {
        stats: 'player',
        combat: 'gun',
        equipment: 'shield',
        perks: 'reward', 
        special: 'exp'
      };
      return icons[category] || 'player';
    },
    getTabCount(category) {
      switch(category) {
        case 'stats': 
          return '5'; // Basic stats count
        case 'combat': 
          return '9'; // Combat related stats
        case 'equipment': 
          return '2'; // Weapon + Armor
        case 'perks': 
          return this.character.activePerks ? this.character.activePerks.length : 0;
        case 'special': 
          return Object.keys(this.character.special || {}).length;
        default: 
          return '0';
      }
    },
    getTotalAttack() {
      return this.totalAttackBonus + (this.equippedWeapon ? this.equippedWeapon.attack : 1);
    },
    getTotalDefense() {
      return this.totalDefenseBonus + (this.equippedArmor ? this.equippedArmor.defence : 1);
    },
    getTotalSpecialPoints() {
      return Object.values(this.character.special || {}).reduce((sum, value) => sum + value, 0);
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
    getStatBonus(stat) {
      const value = this.character.special ? this.character.special[stat] || 0 : 0;
      switch(stat) {
        case 'strength':
          return `+${value} Attack Power`;
        case 'perception':
          return `+${(value * 2).toFixed(1)}% Critical Hit Chance`;
        case 'endurance':
          return `+${value} Defense, +${value * 5} Health per Level`;
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
    getWeaponIcon(item) {
      try {
        return require(`@/assets/interface/icons/weapons/${item.img}`);
      } catch {
        return require('@/assets/interface/icons/gun.png');
      }
    },
    getArmorIcon(item) {
      try {
        if (item.img.includes('hl_')) {
          return require(`@/assets/interface/icons/helmets/${item.img}`);
        }
        return require(`@/assets/interface/icons/armor/${item.img}`);
      } catch {
        return require('@/assets/interface/icons/shield.png');
      }
    },
    
    openMusicPlayer() {
      if (this.$refs.musicPlayer) {
        this.$refs.musicPlayer.openMusicPlayer();
      }
    },
    
    updateMusicStatus(isPlaying, trackName) {
      this.isMusicPlaying = isPlaying;
      this.currentTrackName = trackName;
    }
  }
};
</script>

<style lang="scss" scoped>
.quick-bar-left {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff00;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  display: flex;
  align-items: center;
  z-index: 1000;
}

.character-info {
  position: relative;
  margin-right: 15px;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
}

.character-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.character-level {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: #00ff00;
  color: #000;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;

  img {
    width: 25px;
    height: 25px;
    filter: drop-shadow(0 0 2px rgba(0, 255, 0, 0.7));
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-bar {
  width: 150px;
  height: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.health-bar .stat-fill {
  background: linear-gradient(to right, #ff3e3e, #ff7f7f);
  height: 100%;
  transition: width 0.3s ease;
}

.exp-bar .stat-fill {
  background: linear-gradient(to right, #3e84ff, #7fa8ff);
  height: 100%;
  transition: width 0.3s ease;
}

.stat-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.7rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}

.money-text {
  color: #ffd700;
  text-shadow: 1px 1px 2px rgba(255, 215, 0, 0.7);
  font-weight: bold;
  font-size: 0.8rem;
}

.music-control {
  cursor: pointer;
  
  img {
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.8));
    }
  }
  
  .music-status {
    color: #00ff00;
    font-size: 0.7rem;
    font-weight: bold;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  }
  
  .music-track {
    color: #ccc;
    font-size: 0.6rem;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* Character Modal Styles - Modern design matching PlayerShop */
.character-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}

.character-dialog {
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

.character-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.character-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.character-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.character-logo {
  width: 24px;
  height: 24px;
}

.character-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.character-level-display {
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

.character-tabs {
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

.character-container {
  flex: 1;
  min-height: 0;
  margin-top: 15px;
}

.character-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px);
}

.character-main {
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

.tab-content {
  padding: 5px;
}

.character-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 255, 0, 0.05);
}

.character-section h6 {
  color: #00ff00;
  margin-bottom: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 20px;
    height: 20px;
  }
}

.info-row {
  margin-bottom: 8px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: #fff;
}

.info-row strong {
  color: #fff;
}

.skill-points {
  color: #ffd700 !important;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.bonus-value {
  color: #00ff00 !important;
  text-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.equipment-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.equipped-item {
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 24px;
    height: 24px;
    border: 1px solid #00ff00;
    border-radius: 2px;
  }
}

.no-equipment {
  color: #888;
  font-style: italic;
}

.perk-item {
  margin-bottom: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: #fff;
}

.perk-name {
  color: #00ff00;
}

/* New Styles for Updated Modal */
.stat-bar-large {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #333;
  margin-bottom: 15px;
  position: relative;

  .stat-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 12px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    white-space: nowrap;
  }
}

.health-fill {
  background: linear-gradient(to right, #ff3e3e, #ff7f7f);
  height: 100%;
  transition: width 0.3s ease;
}

.exp-fill {
  background: linear-gradient(to right, #3e84ff, #7fa8ff);
  height: 100%;
  transition: width 0.3s ease;
}

.equipment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 10px;
}

.equipment-slot {
  border: 1px solid #333;
  border-radius: 6px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);

  .equipment-label {
    color: #00ff00;
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 12px;
    text-transform: uppercase;
  }
}

.equipped-item, .no-equipment {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border: 1px solid #00ff00;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.5);
  }

  .item-info {
    display: flex;
    flex-direction: column;

    strong {
      color: #fff;
      font-size: 13px;
    }

    span {
      color: #00ff00;
      font-size: 11px;
    }
  }
}

.perks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.perk-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 0, 0.2);

  .perk-icon {
    background: #00ff00;
    color: #000;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    flex-shrink: 0;
  }

  .perk-info {
    display: flex;
    flex-direction: column;

    .perk-name {
      color: #00ff00;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .perk-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;
      line-height: 1.3;
    }
  }
}

.available-perks-note {
  color: #ffd700;
  font-style: italic;
  text-align: center;
  padding: 10px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 4px;
}

.special-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.special-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border: 1px solid #333;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);

  .special-letter {
    background: #00ff00;
    color: #000;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .special-info {
    flex: 1;

    .special-name {
      color: #fff;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .special-value {
      color: #00ff00;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .special-bonus {
      color: rgba(255, 255, 255, 0.8);
      font-size: 11px;
    }
  }

  .special-bar {
    width: 80px;
    height: 8px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    overflow: hidden;

    .special-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff00, #00cc00);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  }
}

.attack-value { color: #ff6b6b; }
.defense-value { color: #4ecdc4; }
.crit-value { color: #ffa500; }
.dodge-value { color: #9b59b6; }
.money-value { color: #ffd700; }

@media (max-width: 768px) {
  .character-dialog {
    width: 95%;
    max-height: 100vh;
    margin: 0;
    border-radius: 0;
  }
  
  .character-content {
    padding: 10px;
  }
  
  .character-tabs {
    flex-wrap: wrap;
    gap: 3px;
  }
  
  .tab-button {
    padding: 6px 12px;
    font-size: 12px;
    flex: 1;
    min-width: auto;
    
    img {
      width: 14px;
      height: 14px;
    }
  }
  
  .equipment-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .special-grid {
    gap: 8px;
  }
  
  .special-item {
    padding: 8px;
    gap: 10px;
    
    .special-letter {
      width: 30px;
      height: 30px;
      font-size: 1rem;
    }
  }
}

@media (max-width: 576px) {
  .character-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .character-level-display {
    justify-content: center;
    
    .close-button {
      position: absolute;
      right: 15px;
      top: 15px;
    }
  }
  
  .character-section {
    padding: 8px;
    margin-bottom: 10px;
  }
  
  .character-section h6 {
    font-size: 0.9rem;

    img {
      width: 16px;
      height: 16px;
    }
  }
  
  .equipped-item, .no-equipment {
    img {
      width: 28px;
      height: 28px;
    }
    
    .item-info {
      strong {
        font-size: 12px;
      }
      
      span {
        font-size: 10px;
      }
    }
  }
  
  .special-item {
    .special-info {
      .special-name {
        font-size: 13px;
      }
      
      .special-value {
        font-size: 12px;
      }
      
      .special-bonus {
        font-size: 10px;
      }
    }
    
    .special-bar {
      width: 60px;
      height: 6px;
    }
  }
}

@media screen and (max-width: 1024px) {
  .character-dialog {
    max-width: 900px;
  }
  
  .special-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .quick-bar-left {
    bottom: 10px;
    left: 10px;
    flex-direction: column;
    align-items: flex-start;
  }

  .character-info {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .character-avatar {
    width: 50px;
    height: 50px;
  }

  .stat-bar {
    width: 120px;
  }
}
</style>
