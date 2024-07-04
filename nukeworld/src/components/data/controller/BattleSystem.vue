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
          <span class="ms-2">{{ equippedWeapon ? equippedWeapon.name : 'None' }}: {{ equippedWeapon ? equippedWeapon.attack : 0 }}</span>
        </div>
        <div class="equipment-item">
          <img :src="require('@/assets/interface/icons/shield.png')" alt="Armor" class="icon me-2">
          <span>{{ equippedArmor ? equippedArmor.name : 'None' }}: {{ equippedArmor ? equippedArmor.defence : 0 }}</span>
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
import { toast } from "vue3-toastify";

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
    ...mapGetters(['currentEnemy', 'currentStoryLine']),
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
        const playerDamage = this.calculateDamage(this.equippedWeapon.attack, this.enemy.defense);
        const dodgeChance = Math.random();
        
        if (dodgeChance <= this.enemy.defense / 100) {
          this.addToLog(`The ${this.enemy.name} dodged your attack!`, 'dodge-action');
        } else {
          this.enemy.enemyHealth = Math.max(this.enemy.enemyHealth - playerDamage, 0);
          this.addToLog(`You attacked the ${this.enemy.name} with your ${this.equippedWeapon.name} for ${playerDamage} damage.`, 'player-action');
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
      const enemyDamage = this.calculateDamage(this.enemy.attack, this.equippedArmor ? this.equippedArmor.defence : 0);
      const dodgeChance = Math.random();
      
      if (dodgeChance <= (this.equippedArmor ? this.equippedArmor.defence : 0) / 100) {
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
            console.log('Current story line:', this.currentStoryLine);
            
            let storyRewards = [];
            if (this.currentStoryLine && this.$store.state.currentStoryLineId) {
              // Claim story rewards
              const storyResult = await this.$store.dispatch('completeStoryLine', {
                storyLineId: this.$store.state.currentStoryLineId,
                giveReward: true
              });
              if (storyResult && storyResult.rewards) {
                storyRewards = storyResult.rewards;
              }
            }
            console.log('Story rewards:', storyRewards);

            // Generate standard battle rewards
            const battleRewards = this.generateBattleRewards();
            console.log('Battle rewards:', battleRewards);

            // Combine story and battle rewards
            const combinedRewards = {
              storyRewards: storyRewards,
              battleRewards: battleRewards
            };
            console.log('Combined rewards:', combinedRewards);

            // Apply all rewards
            this.applyRewards(combinedRewards.storyRewards);
            this.applyRewards(combinedRewards.battleRewards);

            // Show combined rewards toast
            this.showCombinedRewardsToast(combinedRewards);
          }
          
          this.resetBattleState();
        } catch (error) {
          console.error('Error claiming rewards:', error);
        }
      }
    },
    generateBattleRewards() {
      const rewards = [
        { type: 'exp', amount: this.enemy.exp },
        { type: 'money', amount: this.enemy.money }
      ];

      if (Math.random() <= this.enemy.rewardChance && this.enemy.reward && this.enemy.reward.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.enemy.reward.length);
        const rewardId = this.enemy.reward[randomIndex];
        const rewardItem = this.$store.state.items.find((item) => item.id === rewardId);
        if (rewardItem) {
          rewards.push({ type: 'weapon', item: rewardItem });
        }
      }

      if (Math.random() <= this.enemy.armorRewardChance && this.enemy.armorReward && this.enemy.armorReward.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.enemy.armorReward.length);
        const rewardId = this.enemy.armorReward[randomIndex];
        const rewardItem = this.$store.state.armor.find((item) => item.id === rewardId);
        if (rewardItem) {
          rewards.push({ type: 'armor', item: rewardItem });
        }
      }

      const totalRewardChance = (this.enemy.rewardChance || 0) + (this.enemy.armorRewardChance || 0);
      if (Math.random() <= totalRewardChance) {
        const validResources = this.$store.state.resources.filter(r => r.id === 1 || r.id === 2);
        const randomResource = validResources[Math.floor(Math.random() * validResources.length)];
        rewards.push({ type: 'resource', item: randomResource, amount: 1 });
      }

      return rewards;
    },
    applyRewards(rewards) {
      rewards.forEach(reward => {
        switch(reward.type) {
          case 'exp':
            this.increaseExp(reward.amount);
            break;
          case 'money':
            this.increaseMoney(reward.amount);
            break;
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
      // Update the character in the store
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
    showCombinedRewardsToast(combinedRewards) {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
        <p class="text-left fw-bold mb-1">Battle Rewards</p>
        <p class="text-left fw-semi mb-2">You earned:</p>
        <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;

      if (combinedRewards.storyRewards && combinedRewards.storyRewards.length > 0) {
        rewardMessage += `<p class="text-left fw-bold mb-1">Story Rewards:</p>`;
        rewardMessage += this.generateRewardHTML(combinedRewards.storyRewards);
      }

      rewardMessage += `<p class="text-left fw-bold mb-1">Enemy Rewards:</p>`;
      rewardMessage += this.generateRewardHTML(combinedRewards.battleRewards);

      rewardMessage += '</div></div>';

      console.log('Combined Rewards Message:', rewardMessage); // For debugging

      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 10000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast',
      });
    },
    generateRewardHTML(rewards) {
      let html = '';
      rewards.forEach(reward => {
        switch(reward.type) {
          case 'exp':
            html += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
                <span>${reward.amount} exp</span>
              </div>
            `;
            break;
          case 'money':
            html += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>${reward.amount} money</span>
              </div>
            `;
            break;
          case 'resource':
            html += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/resources/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.amount}x ${reward.item.name}</span>
              </div>
            `;
            break;
          case 'weapon':
            html += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/weapons/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
          case 'armor':
            html += `
              <div class="d-flex align-items-start justify-content-start reward-info mb-1">
                <img src="${require(`@/assets/interface/icons/armor/${reward.item.name.toLowerCase().replace(/ /g, '_')}.png`)}" title="${reward.item.name}" style="width: 20px;" class="me-2">
                <span>${reward.item.name}</span>
              </div>
            `;
            break;
        }
      });
      return html;
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

/* Tilføj disse styles for at sikre, at toast-beskeden vises korrekt */
:global(.quest-toast-container) {
  background-color: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
}

:global(.quest-toast-body) {
  font-size: 14px !important;
}

:global(.quest-toast) {
  max-width: 350px !important;
}
</style>
