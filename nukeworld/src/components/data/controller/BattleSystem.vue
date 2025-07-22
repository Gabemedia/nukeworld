<template>
  <div class="battle-modal" v-if="currentEnemy">
    <div class="battle-dialog">
      <div class="battle-content">
        <!-- Header -->
        <div class="battle-header">
          <div class="battle-title-wrapper">
            <img class="battle-logo" :src="require('@/assets/interface/icons/gun.png')" alt="Battle Icon">
            <h5 class="battle-title">Combat Encounter</h5>
          </div>
          <div class="battle-info">
            <span class="enemy-name">{{ currentEnemy.name }}</span> blocks your path
          </div>
          <button class="close-button" @click="endBattle">&times;</button>
        </div>

        <!-- Battle Content Grid -->
        <div class="battle-container">
          <div class="battle-content-grid">
            <!-- Left Panel - Combat Stats -->
            <div class="battle-stats-panel">
              <div class="combatant-stats player-stats">
                <div class="combatant-header">
                  <img :src="require('@/assets/interface/icons/player.png')" alt="Player">
                  <h4>{{ character.name }}</h4>
                  <div class="level-badge">Lv.{{ character.level }}</div>
                </div>
                
                <div class="stat-grid">
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span class="stat-label">Attack:</span>
                    <span class="stat-value">{{ totalPlayerAttack }}</span>
                    <span v-if="totalAttackBonus > 0" class="stat-bonus">+{{ totalAttackBonus }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                    <span class="stat-label">Defense:</span>
                    <span class="stat-value">{{ totalPlayerDefense }}</span>
                    <span v-if="totalDefenseBonus > 0" class="stat-bonus">+{{ totalDefenseBonus }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/exp.png')" alt="Crit">
                    <span class="stat-label">Crit Chance:</span>
                    <span class="stat-value">{{ (criticalHitChance * 100).toFixed(1) }}%</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/reload.png')" alt="Dodge">
                    <span class="stat-label">Dodge:</span>
                    <span class="stat-value">{{ (dodgeChance * 100).toFixed(1) }}%</span>
                  </div>
                </div>

                <div class="health-section">
                  <div class="health-bar-large">
                    <div class="health-fill player-health" 
                         :style="{ width: (character.health / character.maxHealth * 100) + '%' }">
                    </div>
                    <span class="health-text">{{ character.health }}/{{ character.maxHealth }}</span>
                  </div>
                </div>
              </div>

              <div class="vs-divider">
                <div class="vs-text">VS</div>
              </div>

              <div class="combatant-stats enemy-stats">
                <div class="combatant-header enemy-header">
                  <img :src="require('@/assets/interface/icons/encounter.png')" alt="Enemy">
                  <h4>{{ currentEnemy.name }}</h4>
                  <div class="enemy-badge">Enemy</div>
                </div>
                
                <div class="stat-grid">
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span class="stat-label">Attack:</span>
                    <span class="stat-value">{{ currentEnemy.attack }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                    <span class="stat-label">Defense:</span>
                    <span class="stat-value">{{ currentEnemy.defense }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/money.png')" alt="Reward">
                    <span class="stat-label">Money:</span>
                    <span class="stat-value">{{ Math.floor((currentEnemy.money || 25) * moneyMultiplier) }}</span>
                  </div>
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/exp.png')" alt="EXP">
                    <span class="stat-label">Experience:</span>
                    <span class="stat-value">{{ Math.floor((currentEnemy.exp || 50) * experienceMultiplier) }}</span>
                  </div>
                </div>

                <div class="health-section">
                  <div class="health-bar-large">
                    <div class="health-fill enemy-health" 
                         :style="{ width: (enemyHealth / currentEnemy.enemyHealth * 100) + '%' }">
                    </div>
                    <span class="health-text">{{ enemyHealth }}/{{ currentEnemy.enemyHealth }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel - Battle Log & Actions -->
            <div class="battle-actions-panel">
              <!-- Battle Log -->
              <div class="battle-log-section">
                <div class="log-header">
                  <img :src="require('@/assets/interface/icons/quests.png')" alt="Log">
                  <h6>Battle Log</h6>
                </div>
                <div class="battle-log">
                  <div v-for="(log, index) in battleLog" :key="index" :class="['log-entry', log.type]">
                    <span class="log-message">{{ log.message }}</span>
                  </div>
                </div>
              </div>

              <!-- Battle Actions -->
              <div class="actions-section">
                <div class="actions-header">
                  <img :src="require('@/assets/interface/icons/gun.png')" alt="Actions">
                  <h6>Battle Actions</h6>
                </div>
                
                <div class="action-buttons">
                  <!-- Attack button - only show when battle is not over -->
                  <button 
                    v-if="!isBattleOver"
                    @click="attack" 
                    class="action-btn primary-action can-use"
                  >
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span>Attack</span>
                    <div class="action-details">Deal {{ totalPlayerAttack }} damage</div>
                  </button>
                  
                  <!-- Auto Attack button - only show when battle is not over -->
                  <button 
                    v-if="!isBattleOver"
                    @click="toggleAutoAttack" 
                    class="action-btn auto-action"
                    :class="{ 
                      'auto-active': isAutoAttackActive, 
                      'can-use': true
                    }"
                  >
                    <img :src="require('@/assets/interface/icons/reload.png')" alt="Auto">
                    <span>{{ isAutoAttackActive ? 'Stop Auto' : 'Auto Attack' }}</span>
                    <div class="action-details">{{ isAutoAttackActive ? 'Click to stop' : 'Auto attack every 1s' }}</div>
                  </button>
                  
                  <!-- Claim Rewards button - only show when victory -->
                  <button 
                    v-if="isBattleOver && battleResult === 'victory'" 
                    @click="claimRewards" 
                    class="action-btn reward-action"
                    :disabled="rewardsClaimed"
                    :class="{ 'can-use': !rewardsClaimed }"
                  >
                    <img :src="require('@/assets/interface/icons/reward.png')" alt="Rewards">
                    <span>{{ rewardsClaimed ? 'Claimed' : 'Claim Rewards' }}</span>
                    <div class="action-details">
                      <template v-if="$store.state.currentBattleStoryLineId">
                        Story Rewards
                      </template>
                      <template v-else>
                        {{ Math.floor((currentEnemy.exp || 50) * experienceMultiplier) }} EXP, 
                        {{ Math.floor((currentEnemy.money || 25) * moneyMultiplier) }} Money
                      </template>
                    </div>
                  </button>
                  
                  <!-- Flee/Close button - show when not victory or when battle not over -->
                  <button 
                    v-if="!isBattleOver || (isBattleOver && battleResult !== 'victory')"
                    @click="endBattle" 
                    class="action-btn flee-action"
                  >
                    <img :src="require('@/assets/interface/icons/settings.png')" alt="Flee">
                    <span>{{ isBattleOver ? 'Close Battle' : 'Flee Combat' }}</span>
                    <div class="action-details">{{ isBattleOver ? 'Exit battle screen' : 'Escape from combat' }}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import enemies from '@/store/enemy';
import confetti from 'canvas-confetti';
import { toast } from "vue3-toastify";

export default {
  name: 'BattleSystem',
  data() {
    return {
      enemyHealth: 0,
      battleLog: [],
      isAutoAttackActive: false,
      autoAttackInterval: null,
      isBattleOver: false,
      battleResult: null,
      rewardsClaimed: false,
      localEnemy: null,
      totalDamageDealt: 0,
      totalDamageTaken: 0
    };
  },
  computed: {
    ...mapState(['character']),
    ...mapGetters([
      'currentEnemy', 
      'currentStoryLine',
      'totalAttackBonus', 
      'totalDefenseBonus', 
      'criticalHitChance', 
      'dodgeChance', 
      'experienceMultiplier', 
      'moneyMultiplier'
    ]),
    
    equippedWeapon() {
      return this.character.equippedWeapons && this.character.equippedWeapons.length > 0 
        ? this.character.equippedWeapons[0] 
        : null;
    },
    
    equippedArmor() {
      return this.character.equippedArmor || null;
    },
    
    totalPlayerAttack() {
      const weaponAttack = this.equippedWeapon ? this.equippedWeapon.attack : 1;
      const bonus = this.totalAttackBonus;
      return weaponAttack + bonus;
    },
    
    totalPlayerDefense() {
      return (this.equippedArmor ? this.equippedArmor.defence : 0) + this.totalDefenseBonus;
    }
  },
  watch: {
    currentEnemy: {
      immediate: true,
      handler(newEnemy) {
        if (newEnemy) {
          this.initializeEnemy(newEnemy);
        } else {
          this.getRandomEnemy();
        }
      }
    }
  },
  created() {
    if (!this.currentEnemy) {
      this.getRandomEnemy();
    }
  },
  methods: {
    ...mapActions([
      'defeatEnemy', 
      'increaseExp', 
      'increaseMoney', 
      'addItemToWeapons', 
      'addItemToArmor', 
      'addResource', 
      'addItemToAid', 
      'updateCharacter'
    ]),
    
    initializeEnemy(enemyData) {
      this.localEnemy = JSON.parse(JSON.stringify(enemyData));
      this.enemyHealth = this.localEnemy.enemyHealth;
      this.isBattleOver = false;
      this.battleResult = null;
      this.rewardsClaimed = false;
      this.totalDamageDealt = 0;
      this.totalDamageTaken = 0;
      this.battleLog = [];
      this.addToLog(`A ${enemyData.name} appears!`, 'enemy-action');
    },
    
    getRandomEnemy() {
      if (enemies && enemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * enemies.length);
        this.initializeEnemy(enemies[randomIndex]);
      }
    },
    
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
      // Keep only last 15 entries for scrolling but limit visible height
      if (this.battleLog.length > 15) {
        this.battleLog = this.battleLog.slice(0, 15);
      }
    },
    
    calculateDamage(attack, defense) {
      // Ensure minimum damage even if defense is higher than attack
      const baseDamage = Math.max(attack - defense, Math.floor(attack * 0.1)); // Minimum 10% of attack
      const variation = Math.random() * 0.2 - 0.1; // -10% to +10%
      return Math.max(Math.floor(baseDamage * (1 + variation)), 1);
    },
    
    attack() {
      if (this.isBattleOver) return;

      // Player attacks enemy
      const baseDamage = this.totalPlayerAttack;
      const isCritical = Math.random() <= this.criticalHitChance;
      let finalDamage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;
      finalDamage = this.calculateDamage(finalDamage, this.localEnemy.defense);
      
      const dodgeChance = Math.random();
      
      if (dodgeChance <= this.localEnemy.defense / 100) {
        this.addToLog(`The ${this.localEnemy.name} dodged your attack!`, 'dodge-action');
      } else {
        this.enemyHealth = Math.max(0, this.enemyHealth - finalDamage);
        this.totalDamageDealt += finalDamage;
        const critText = isCritical ? ' (CRITICAL HIT!)' : '';
        this.addToLog(`You dealt ${finalDamage} damage to ${this.localEnemy.name}${critText}`, 'player-action');
      }

      // Check if enemy is defeated
      if (this.enemyHealth <= 0) {
        this.battleVictory();
        return;
      }

      // Enemy attacks player
      const enemyDamage = this.calculateDamage(this.localEnemy.attack, this.totalPlayerDefense);
      const playerDodgeChance = Math.random();
      
      if (playerDodgeChance <= this.dodgeChance) {
        this.addToLog(`You dodged the ${this.localEnemy.name}'s attack!`, 'dodge-action');
      } else {
        this.$store.commit('updateCharacter', { 
          health: Math.max(0, this.character.health - enemyDamage) 
        });
        this.totalDamageTaken += enemyDamage;
        this.addToLog(`${this.localEnemy.name} dealt ${enemyDamage} damage to you`, 'enemy-action');
      }

      // Check if player is defeated
      if (this.character.health <= 0) {
        this.battleDefeat();
      }
    },
    
    toggleAutoAttack() {
      if (this.isAutoAttackActive) {
        this.stopAutoAttack();
      } else {
        this.startAutoAttack();
      }
    },
    
    startAutoAttack() {
      if (!this.isAutoAttackActive && !this.isBattleOver) {
        this.isAutoAttackActive = true;
        this.autoAttackInterval = setInterval(() => {
          this.attack();
          if (this.isBattleOver) {
            this.stopAutoAttack();
          }
        }, 1000);
      }
    },
    
    stopAutoAttack() {
      if (this.isAutoAttackActive) {
        this.isAutoAttackActive = false;
        clearInterval(this.autoAttackInterval);
      }
    },
    
    battleVictory() {
      this.isBattleOver = true;
      this.battleResult = 'victory';
      this.addToLog(`Victory! The ${this.localEnemy.name} was defeated!`, 'victory-action');
      this.stopAutoAttack();
      this.showVictoryConfetti();
    },
    
    battleDefeat() {
      this.isBattleOver = true;
      this.battleResult = 'defeat';
      this.addToLog('You have been defeated!', 'defeat-action');
      this.stopAutoAttack();
    },
    
    async claimRewards() {
      if (this.battleResult !== 'victory' || this.rewardsClaimed) return;
      
      this.rewardsClaimed = true;
      
      try {
        // Check if this is a story battle
        const isStoryBattle = this.$store.state.currentBattleStoryLineId;
        
        if (isStoryBattle) {
          // For story battles, only handle story completion - rewards are handled by the story system
          const storyResult = await this.defeatEnemy();
          this.addToLog('Story battle completed!', 'victory-action');
          
          // Show story rewards if they exist
          if (storyResult && storyResult.rewards) {
            this.showStoryRewardToast(storyResult.storyLineName, storyResult.rewards);
          }
        } else {
          // For regular battles, handle battle-specific rewards
          const expReward = this.localEnemy.exp || 50;
          const moneyReward = this.localEnemy.money || 25;
          
          // Apply SPECIAL multipliers like SettlementBattle but let store actions handle it
          await this.increaseExp(expReward);
          await this.increaseMoney(moneyReward);
          
          this.addToLog(`Rewards claimed: ${Math.floor(expReward * this.experienceMultiplier)} EXP, ${Math.floor(moneyReward * this.moneyMultiplier)} Money`, 'victory-action');
          
          // Show reward toast like SettlementBattle
          this.showRewardToast(
            Math.floor(expReward * this.experienceMultiplier), 
            Math.floor(moneyReward * this.moneyMultiplier)
          );
        }
        
        // Show reward confetti
        this.showRewardConfetti();
        
        // Emit battle results with all required data like SettlementBattle
        this.$emit('battle-ended', {
          enemy: this.localEnemy,
          damageDealt: this.totalDamageDealt,
          damageTaken: this.totalDamageTaken,
          survived: true,
          time: Date.now()
        });
        
      } catch (error) {
        console.error('Error claiming rewards:', error);
        this.rewardsClaimed = false; // Allow retry on error
      }
    },
    
    showRewardToast(expReward, moneyReward) {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">Battle Victory!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
              <span>${expReward} exp</span>
            </div>
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
              <span>${moneyReward} money</span>
            </div>
          </div>
        </div>
      `;

      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 10000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    },
    
    showStoryRewardToast(storyLineName, rewards) {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">${storyLineName} completed!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;

      rewards.forEach(reward => {
        switch(reward.type) {
          case 'exp':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
                <span>${reward.amount} exp</span>
              </div>
            `;
            break;
          case 'money':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>${reward.amount} money</span>
              </div>
            `;
            break;
          case 'resource':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/resources/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.amount}x ${reward.item.name}</span>
              </div>
            `;
            break;
          case 'weapon':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/weapons/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
          case 'armor':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/armor/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
          case 'aid':
            rewardMessage += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/aid/${reward.item.img}`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
        }
      });

      rewardMessage += `
          </div>
        </div>
      `;

      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 10000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    },
    
    showVictoryConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 }
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 }
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.9 }
      });
    },

    showRewardConfetti() {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.7 }
      });
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.8 }
      });
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.9 }
      });
    },
    
    endBattle() {
      this.stopAutoAttack();
      this.$emit('battle-ended', {
        enemy: this.localEnemy,
        damageDealt: this.totalDamageDealt,
        damageTaken: this.totalDamageTaken,
        survived: this.battleResult === 'victory',
        time: Date.now()
      });
      // NYT: Emit 'flee-battle' hvis spilleren flygter/taber
      if (this.battleResult !== 'victory') {
        this.$emit('flee-battle');
      }
    }
  },
  
  beforeUnmount() {
    this.stopAutoAttack();
  }
};
</script>

<style scoped lang="scss">
/* Battle Modal - Same structure as PlayerShop.vue */
.battle-modal {
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

.battle-dialog {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  width: 95%;
  max-width: 1400px;
  max-height: 95vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.battle-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.battle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.battle-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.battle-logo {
  width: 24px;
  height: 24px;
}

.battle-title {
  color: #ff0000;
  margin: 0;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  font-weight: bold;
  text-transform: uppercase;
}

.battle-info {
  text-align: center;
  flex-grow: 1;
}

.enemy-name {
  color: #ff0000;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
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

.battle-container {
  flex: 1;
  min-height: 0;
}

.battle-content-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  height: 100%;
  max-height: calc(95vh - 120px);
}

.battle-stats-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.combatant-stats {
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 15px;

  &.enemy-stats {
    border-color: #ff0000;
  }
}

.combatant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);

  &.enemy-header {
    border-color: rgba(255, 0, 0, 0.3);
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #00ff00;
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }

  .enemy-header img {
    border-color: #ff0000;
    box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
  }

  h4 {
    color: #00ff00;
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  .enemy-header h4 {
    color: #ff0000;
  }
}

.level-badge, .enemy-badge {
  background: #00ff00;
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
}

.enemy-badge {
  background: #ff0000;
  color: #fff;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  img {
    width: 16px;
    height: 16px;
  }

  .stat-label {
    color: #ccc;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .stat-value {
    color: #fff;
    font-weight: bold;
    margin-left: auto;
  }

  .stat-bonus {
    color: #00ff00;
    font-size: 0.7rem;
    font-weight: bold;
    text-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
  }
}

.health-section {
  margin-top: 10px;
}

.health-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #ccc;
  font-weight: bold;

  img {
    width: 18px;
    height: 18px;
  }
}

.health-bar-large {
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
  position: relative;
}

.health-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease;

  &.player-health {
    background: linear-gradient(90deg, #00ff00, #00cc00);
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }

  &.enemy-health {
    background: linear-gradient(90deg, #ff0000, #cc0000);
    box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
  }
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.vs-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  .vs-text {
    color: #00ff00;
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    margin-bottom: 8px;
  }

  img {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 4px rgba(0, 255, 0, 0.5));
  }
}

.battle-actions-panel {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.battle-log-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.log-header, .actions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  border-bottom: 1px solid #333;
  background: rgba(0, 0, 0, 0.3);

  img {
    width: 16px;
    height: 16px;
  }

  h6 {
    color: #00ff00;
    margin: 0;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
  }
}

.battle-log {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px;
  min-height: 175px;
  max-height: 175px; /* Height for exactly 5 entries */

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
    
    &:hover {
      background: #444;
    }
  }
}

.log-entry {
  margin-bottom: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  line-height: 1.3;

  &.player-action {
    color: #00ff00;
    background-color: rgba(0, 255, 0, 0.1);
    border-left: 3px solid #00ff00;
  }

  &.enemy-action {
    color: #ff6b6b;
    background-color: rgba(255, 0, 0, 0.1);
    border-left: 3px solid #ff0000;
  }

  &.victory-action {
    color: #00ff00;
    background-color: rgba(0, 255, 0, 0.2);
    border-left: 3px solid #00ff00;
    font-weight: bold;
  }

  &.defeat-action {
    color: #ff0000;
    background-color: rgba(255, 0, 0, 0.2);
    border-left: 3px solid #ff0000;
    font-weight: bold;
  }

  &.dodge-action {
    color: #ffd700;
    background-color: rgba(255, 215, 0, 0.1);
    border-left: 3px solid #ffd700;
  }
}

.actions-section {
  border-top: 1px solid #333;
}

.action-buttons {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(26, 26, 26, 0.95);
  color: #888;
  border: 1px solid #444;
  position: relative;
  overflow: hidden;

  img {
    width: 20px;
    height: 20px;
  }

  span {
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  .action-details {
    font-size: 0.7rem;
    color: #aaa;
    text-transform: none;
    text-align: center;
    line-height: 1.2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.can-use:not(:disabled) {
    border-color: #00ff00;
    color: #00ff00;
    background: rgba(0, 255, 0, 0.1);

    .action-details {
      color: #ccc;
    }

    &:hover {
      background: rgba(0, 255, 0, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    }
  }

  &.primary-action.can-use {
    border-color: #ff4444;
    color: #ff4444;
    background: rgba(255, 68, 68, 0.1);

    &:hover {
      background: rgba(255, 68, 68, 0.15);
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
    }
  }

  &.auto-active {
    border-color: #ffc107;
    color: #ffc107;
    background: rgba(255, 193, 7, 0.1);

    &:hover {
      background: rgba(255, 193, 7, 0.15);
      box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
    }
  }

  &.reward-action.can-use {
    border-color: #28a745;
    color: #28a745;
    background: rgba(40, 167, 69, 0.1);

    &:hover {
      background: rgba(40, 167, 69, 0.15);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
    }
  }

  &.flee-action {
    border-color: #6c757d;
    color: #6c757d;
    background: rgba(108, 117, 125, 0.1);

    &:hover:not(:disabled) {
      background: rgba(108, 117, 125, 0.15);
      box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
    }
  }
}

@media (max-width: 1200px) {
  .battle-content-grid {
    grid-template-columns: 1fr 300px;
  }
}

@media (max-width: 768px) {
  .battle-dialog {
    width: 98%;
    max-height: 98vh;
  }

  .battle-content-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .battle-stats-panel {
    max-height: 40vh;
  }

  .battle-log {
    max-height: 140px; /* Slightly smaller on mobile */
    min-height: 140px;
  }

  .stat-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .combatant-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;

    img {
      width: 28px;
      height: 28px;
    }
  }

  .vs-divider {
    padding: 10px 0;

    .vs-text {
      font-size: 1.2rem;
    }
  }

  .action-buttons {
    gap: 8px;
  }

  .action-btn {
    padding: 10px;
    
    span {
      font-size: 0.8rem;
    }

    .action-details {
      font-size: 0.65rem;
    }
  }
}

@media (max-width: 480px) {
  .battle-content {
    padding: 10px;
  }

  .battle-header {
    flex-direction: column;
    gap: 10px;
    align-items: center;

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  .battle-title {
    font-size: 1rem;
  }

  .stat-item {
    padding: 6px 8px;
    font-size: 0.8rem;

    .stat-label {
      font-size: 0.7rem;
    }
  }

  .health-bar-large {
    height: 20px;
  }

  .health-text {
    font-size: 0.8rem;
  }
}
</style>
