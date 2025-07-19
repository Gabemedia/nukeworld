<template>
  <div class="battle-system">
    <div class="mb-1">
      <h6 class="mb-3 text-uppercase fw-bold text-start text-success">Enemy Encounters</h6>
      <div class="player-info d-flex justify-content-between align-items-center">
        <div class="player-name">{{ character.name }}</div>
        <div class="player-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ character.health }}/{{ character.maxHealth }}</span>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <div class="player-equipment d-flex justify-content-between align-items-center">
        <div class="equipment-item">
          <img :src="require('@/assets/interface/icons/gun.png')" alt="Weapon" class="icon">
          <span class="ms-2">{{ equippedWeapon ? equippedWeapon.name : 'None' }}: {{ (equippedWeapon ? equippedWeapon.attack : 0) + totalAttackBonus }} ({{ equippedWeapon ? equippedWeapon.attack : 0 }}+{{ totalAttackBonus }})</span>
        </div>
        <div class="equipment-item">
          <img :src="require('@/assets/interface/icons/shield.png')" alt="Armor" class="icon me-2">
          <span>{{ equippedArmor ? equippedArmor.name : 'None' }}: {{ (equippedArmor ? equippedArmor.defence : 0) + totalDefenseBonus }} ({{ equippedArmor ? equippedArmor.defence : 0 }}+{{ totalDefenseBonus }})</span>
        </div>
      </div>
    </div>
    <div class="my-4 border border-2 border-primary"></div>
    <div v-if="enemy" class="mb-1">
      <div class="enemy-info d-flex justify-content-between align-items-center">
        <div class="enemy-name">{{ enemy.name }}</div>
        <div class="enemy-health">
          <img :src="require('@/assets/interface/icons/exp.png')" alt="Health" class="icon me-2">
          <span>{{ enemy.enemyHealth }}/{{ enemy.enemyHealth }}</span>
        </div>
      </div>
    </div>
    <div v-if="enemy" class="mb-4">
      <div class="enemy-stats d-flex justify-content-between align-items-center">
        <div class="stat-item">
          <img :src="require('@/assets/interface/icons/gun.png')" alt="Weapon" class="icon">
          <span class="ms-2">Attack: {{ enemy.attack }}</span>
        </div>
        <div class="stat-item">
          <img :src="require('@/assets/interface/icons/shield.png')" alt="Armor" class="icon me-2">
          <span>Defence: {{ enemy.defense }}</span>
        </div>
      </div>
    </div>
    <div class="mb-0">
      <div class="battle-actions d-flex justify-content-center mb-3">
        <button @click="singleAttack" :disabled="isBattleWon || character.health <= 0 || !enemy" class="btn btn-primary attack-button me-2">
          Attack
        </button>
        <button @click="toggleAutoAttack" :disabled="isBattleWon || character.health <= 0 || !enemy" :class="['btn', 'me-2', isAutoAttackActive ? 'btn-warning' : 'btn-primary']">
          {{ isAutoAttackActive ? 'Stop Attack' : 'Auto Attack' }}
        </button>
        <button @click="cancelBattle" class="btn btn-danger cancel-button me-2">
          Cancel
        </button>
        <button @click="claimRewards" :disabled="!isBattleWon" class="btn btn-info claim-rewards-button">
          Claim Rewards
        </button>
      </div>
    </div>
    <div class="battle-log border border-1 small">
      <ul>
        <li v-for="(log, index) in battleLog" :key="index" :class="log.type">{{ log.message }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import enemies from '@/store/enemy';
import confetti from 'canvas-confetti';

export default {
  name: 'BattleSystem',
  data() {
    return {
      battleLog: [],
      isBattleWon: false,
      isAutoAttackActive: false,
      autoAttackInterval: null,
      localEnemy: null,
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
      return this.character.equippedWeapons[0];
    },
    equippedArmor() {
      return this.character.equippedArmor;
    },
    enemy() {
      return this.localEnemy || this.currentEnemy;
    },
  },
  watch: {
    currentEnemy: {
      immediate: true,
      handler(newEnemy) {
        if (newEnemy) {
          this.localEnemy = JSON.parse(JSON.stringify(newEnemy));
        } else {
          this.getRandomEnemy();
        }
      },
    },
  },
  created() {
    if (!this.currentEnemy) {
      this.getRandomEnemy();
    }
  },
  methods: {
    ...mapActions(['handleQuest', 'defeatEnemy', 'increaseExp', 'increaseMoney', 'addItemToWeapons', 'addItemToArmor', 'addResource', 'addItemToAid', 'updateCharacter']),
    getRandomEnemy() {
      if (enemies && enemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * enemies.length);
        this.localEnemy = JSON.parse(JSON.stringify(enemies[randomIndex]));
      }
    },
    singleAttack() {
      this.attack();
      if (this.enemy && this.enemy.enemyHealth > 0) {
        this.enemyAttack();
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
      if (!this.isAutoAttackActive && this.enemy && this.character.health > 0) {
        this.isAutoAttackActive = true;
        this.autoAttackInterval = setInterval(() => {
          this.attack();
          if (this.isBattleWon || this.character.health <= 0) {
            this.stopAutoAttack();
          } else {
            this.enemyAttack();
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
    cancelBattle() {
      this.stopAutoAttack();
      this.$emit('battle-cancelled');
    },
    attack() {
      if (this.equippedWeapon && this.enemy) {
        // Calculate base damage with SPECIAL bonus
        const baseDamage = this.equippedWeapon.attack + this.totalAttackBonus;
        
        // Check for critical hit
        const critRoll = Math.random();
        const isCritical = critRoll <= this.criticalHitChance;
        
        // Apply critical multiplier if critical hit
        let finalDamage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;
        
        // Apply enemy defense
        finalDamage = this.calculateDamage(finalDamage, this.enemy.defense);
        
        const dodgeChance = Math.random();
        
        if (dodgeChance <= this.enemy.defense / 100) {
          this.addToLog(`The ${this.enemy.name} dodged your attack!`, 'dodge-action');
        } else {
          this.enemy.enemyHealth = Math.max(this.enemy.enemyHealth - finalDamage, 0);
          const critText = isCritical ? ' (CRITICAL HIT!)' : '';
          this.addToLog(`You attacked the ${this.enemy.name} with your ${this.equippedWeapon.name} for ${finalDamage} damage${critText}`, 'player-action');
        }

        if (this.enemy.enemyHealth <= 0) {
          this.addToLog(`You defeated the ${this.enemy.name}!`, 'player-action');
          this.checkBattleEnd();
        }
      } else {
        this.addToLog('You have no weapon equipped or no enemy to fight!', 'player-action');
        this.stopAutoAttack();
      }
    },
    enemyAttack() {
      // Calculate defense with SPECIAL bonus
      const totalDefense = (this.equippedArmor ? this.equippedArmor.defence : 0) + this.totalDefenseBonus;
      const enemyDamage = this.calculateDamage(this.enemy.attack, totalDefense);
      
      // Use SPECIAL-based dodge chance instead of armor-based
      const dodgeRoll = Math.random();
      
      if (dodgeRoll <= this.dodgeChance) {
        this.addToLog(`You dodged the ${this.enemy.name}'s attack!`, 'dodge-action');
      } else {
        this.$store.commit('updateCharacter', { health: Math.max(this.character.health - enemyDamage, 0) });
        this.addToLog(`The ${this.enemy.name} attacked you for ${enemyDamage} damage.`, 'enemy-action');
      }
      if (this.character.health <= 0) {
        this.addToLog('You were defeated!', 'enemy-action');
        this.stopAutoAttack();
        this.$emit('game-over');
      }
    },
    calculateDamage(attack, defense) {
      return Math.max(attack - defense, 0);
    },
    checkBattleEnd() {
      if (this.enemy.enemyHealth <= 0) {
        this.isBattleWon = true;
        this.stopAutoAttack();
        this.showVictoryConfetti();
      }
    },
    async claimRewards() {
      if (this.isBattleWon && this.enemy) {
        try {
          const result = await this.defeatEnemy();
          this.showRewardConfetti();
          
          this.$store.commit('setEnemyEncounterOpen', false);
          this.$emit('battle-ended');
          
          if (result) {
            const storyRewards = await this.claimStoryRewards();
            const battleRewards = this.generateBattleRewards();

            this.applyRewards(storyRewards);
            this.applyRewards(battleRewards);

            console.log('Story Rewards:', storyRewards);
            console.log('Battle Rewards:', battleRewards);
          }
          
          this.resetBattleState();
        } catch (error) {
          console.error('Error claiming rewards:', error);
        }
      }
    },
    async claimStoryRewards() {
      if (this.currentStoryLine && this.$store.state.currentStoryLineId) {
        const storyResult = await this.$store.dispatch('completeStoryLine', {
          storyLineId: this.$store.state.currentStoryLineId,
          giveReward: true
        });
        return storyResult && storyResult.rewards ? storyResult.rewards : [];
      }
      return [];
    },
    generateBattleRewards() {
      const rewards = [
        { type: 'exp', amount: this.enemy.exp },
        { type: 'money', amount: this.enemy.money }
      ];

      this.addRandomReward(rewards, 'weapon', this.enemy.rewardChance, this.enemy.reward, this.$store.state.items);
      this.addRandomReward(rewards, 'armor', this.enemy.armorRewardChance, this.enemy.armorReward, this.$store.state.armor);

      const totalRewardChance = (this.enemy.rewardChance || 0) + (this.enemy.armorRewardChance || 0);
      if (Math.random() <= totalRewardChance) {
        const validResources = this.$store.state.resources.filter(r => r.id === 1 || r.id === 2);
        const randomResource = validResources[Math.floor(Math.random() * validResources.length)];
        rewards.push({ type: 'resource', item: randomResource, amount: 1 });
      }

      return rewards;
    },
    addRandomReward(rewards, type, chance, rewardPool, itemPool) {
      if (Math.random() <= chance && rewardPool && rewardPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * rewardPool.length);
        const rewardId = rewardPool[randomIndex];
        const rewardItem = itemPool.find((item) => item.id === rewardId);
        if (rewardItem) {
          rewards.push({ type, item: rewardItem });
        }
      }
    },
    applyRewards(rewards) {
      rewards.forEach(reward => {
        switch(reward.type) {
          case 'exp': {
            // Apply SPECIAL bonuses to exp rewards
            const actualExpGained = Math.floor(reward.amount * this.experienceMultiplier);
            this.increaseExp(reward.amount);
            // Update reward object to show actual amount gained
            reward.actualAmount = actualExpGained;
            break;
          }
          case 'money': {
            // Apply SPECIAL bonuses to money rewards
            const actualMoneyGained = Math.floor(reward.amount * this.moneyMultiplier);
            this.increaseMoney(reward.amount);
            // Update reward object to show actual amount gained
            reward.actualAmount = actualMoneyGained;
            break;
          }
          case 'weapon':
            this.addItemToWeapons(reward.item.id);
            break;
          case 'armor':
            this.addItemToArmor(reward.item.id);
            break;
          case 'resource':
            for (let i = 0; i < reward.amount; i++) {
              this.addResource(reward.item.id);
            }
            break;
          case 'aid':
            this.addItemToAid(reward.item.id);
            break;
        }
      });
      this.updateCharacter(this.character);
    },
    resetBattleState() {
      this.isBattleWon = false;
      this.$store.commit('updateCharacter');
      this.localEnemy = null;
      this.getRandomEnemy();
      this.battleLog = [];
    },
    addToLog(message, type) {
      this.battleLog.unshift({ message, type });
    },
    showVictoryConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    },
    showRewardConfetti() {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        zIndex: 9999,
      });
    },
  },
};
</script>

<style scoped>
.battle-system {
  background-color: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.battle-system .icon {
  height: 20px;
  width: auto;
}

.player-info, .enemy-info, .player-equipment, .enemy-stats {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.player-name, .enemy-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.equipment-item, .stat-item {
  display: flex;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.attack-button {
  background-color: #00ff00;
  color: #000000;
}

.attack-button:hover {
  background-color: #00cc00;
}

.btn-warning {
  background-color: #ffc107;
  color: #000000;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.cancel-button {
  background-color: #dc3545;
  color: #ffffff;
}

.cancel-button:hover {
  background-color: #c82333;
}

.claim-rewards-button {
  background-color: #17a2b8;
  color: #ffffff;
}

.claim-rewards-button:hover {
  background-color: #138496;
}

.battle-log {
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 0.5rem;
}

.battle-log ul {
  list-style-type: none;
  padding: 0;
}

.battle-log li {
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
}

.player-action {
  background-color: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.enemy-action {
  background-color: rgba(255, 0, 0, 0.2);
  color: #ff0000;
}

.dodge-action {
  background-color: rgba(255, 255, 0, 0.5);
  color: #ffffff;
}

@media (max-width: 768px) {
  .battle-actions {
    flex-direction: column;
  }

  .battle-actions button {
    margin-bottom: 0.5rem;
  }
}
</style>
