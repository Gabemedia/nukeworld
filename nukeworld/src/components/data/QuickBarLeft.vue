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
    </div>
  </div>

  <!-- Character Modal - Teleported to body to escape z-index stacking context -->
  <Teleport to="body" v-if="showModal">
    <div class="character-modal-overlay" tabindex="-1" @click.self="closeModal">
      <div class="character-modal-dialog">
        <div class="character-modal-content">
          <div class="character-modal-header">
            <h5 class="character-modal-title">Character Information</h5>
            <button type="button" class="character-btn-close" @click="closeModal" aria-label="Close">&times;</button>
          </div>
          <div class="character-modal-body">
            <div class="character-section">
              <h6><img :src="require('@/assets/interface/icons/player.png')" alt="Character"> Basic Information</h6>
              <div class="info-row">Name: <strong>{{ character.name }}</strong></div>
              <div class="info-row">Level: <strong>{{ character.level }}</strong></div>
              <div class="info-row">Experience: <strong>{{ character.exp }} / {{ character.maxExp }}</strong></div>
              <div class="info-row">Skill Points: <strong class="skill-points">{{ character.skillPoints }}</strong></div>
            </div>

            <div class="character-section">
              <h6><img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Health"> Health & Combat</h6>
              <div class="info-row">Health: <strong>{{ character.health }} / {{ character.maxHealth }}</strong></div>
              <div class="info-row">Total Attack: <strong>{{ getTotalAttack() }}</strong></div>
              <div class="info-row">Total Defense: <strong>{{ getTotalDefense() }}</strong></div>
              <div class="info-row">Critical Hit: <strong>{{ (criticalHitChance * 100).toFixed(1) }}%</strong></div>
              <div class="info-row">Dodge Chance: <strong>{{ (dodgeChance * 100).toFixed(1) }}%</strong></div>
            </div>

            <div class="character-section">
              <h6><img :src="require('@/assets/interface/icons/gun.png')" alt="Equipment"> Equipment</h6>
              <div class="equipment-info">
                <div class="equipment-slot">
                  <span>Weapon: </span>
                  <div v-if="equippedWeapon" class="equipped-item">
                    <img :src="getWeaponIcon(equippedWeapon)" :alt="equippedWeapon.name">
                    <span><strong>{{ equippedWeapon.name }}</strong> (Attack: {{ equippedWeapon.attack }})</span>
                  </div>
                  <span v-else class="no-equipment">None equipped</span>
                </div>
                <div class="equipment-slot">
                  <span>Armor: </span>
                  <div v-if="equippedArmor" class="equipped-item">
                    <img :src="getArmorIcon(equippedArmor)" :alt="equippedArmor.name">
                    <span><strong>{{ equippedArmor.name }}</strong> (Defense: {{ equippedArmor.defence }})</span>
                  </div>
                  <span v-else class="no-equipment">None equipped</span>
                </div>
              </div>
            </div>

            <div class="character-section">
              <h6><img :src="require('@/assets/interface/icons/exp.png')" alt="SPECIAL"> SPECIAL Bonuses</h6>
              <div class="info-row">Attack Bonus: <strong class="bonus-value">+{{ totalAttackBonus }}</strong></div>
              <div class="info-row">Defense Bonus: <strong class="bonus-value">+{{ totalDefenseBonus }}</strong></div>
              <div class="info-row">Experience Bonus: <strong class="bonus-value">+{{ ((experienceMultiplier - 1) * 100).toFixed(1) }}%</strong></div>
              <div class="info-row">Money Bonus: <strong class="bonus-value">+{{ ((moneyMultiplier - 1) * 100).toFixed(1) }}%</strong></div>
              <div class="info-row">Shop Discount: <strong class="bonus-value">{{ ((1 - shopPriceMultiplier) * 100).toFixed(1) }}%</strong></div>
            </div>

            <div v-if="character.activePerks && character.activePerks.length > 0" class="character-section">
              <h6><img :src="require('@/assets/interface/icons/reward.png')" alt="Perks"> Active Perks</h6>
              <div v-for="perk in character.activePerks" :key="perk.id" class="perk-item">
                <strong class="perk-name">{{ perk.name }}:</strong> {{ perk.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'QuickBarLeft',
  data() {
    return {
      showModal: false
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
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getTotalAttack() {
      return this.totalAttackBonus + (this.equippedWeapon ? this.equippedWeapon.attack : 0);
    },
    getTotalDefense() {
      return this.totalDefenseBonus + (this.equippedArmor ? this.equippedArmor.defence : 0);
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

/* Character Modal Styles - Teleported to body with highest z-index */
.character-modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999999; /* Highest possible z-index */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
}

.character-modal-dialog {
  max-width: 600px;
  width: 90%;
  margin: 1.75rem auto;
}

.character-modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
}

.character-modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.character-modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
  margin: 0;
}

.character-btn-close {
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 1.5rem;
  cursor: pointer;
}

.character-btn-close:hover {
  color: #00cc00;
}

.character-modal-body {
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
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

@media (max-width: 576px) {
  .character-modal-dialog {
    width: 95%;
    margin: 1rem auto;
  }
  
  .character-modal-body {
    max-height: 80vh;
  }
  
  .character-section {
    padding: 10px;
    margin-bottom: 15px;
  }
  
  .character-section h6 {
    font-size: 0.9rem;

    img {
      width: 16px;
      height: 16px;
    }
  }
  
  .equipped-item img {
    width: 20px;
    height: 20px;
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
