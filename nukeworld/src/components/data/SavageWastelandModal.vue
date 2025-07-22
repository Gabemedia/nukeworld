<template>
  <div v-if="showModal" class="survival-modal" tabindex="-1" @click.self="closeModal">
    <div class="survival-dialog card-style">
      <!-- HEADER -->
      <div class="survival-header">
        <div class="survival-title-wrapper">
          <img class="survival-logo" :src="require('@/assets/interface/icons/encounter.png')" alt="Survival Icon">
          <h5 class="survival-title">Survival in the Wasteland</h5>
        </div>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="survival-info-panel">
          <!-- STARTBOKS: Shop/quest-lignende UI for indsats -->
          <div v-if="!runStarted" class="survival-start-box">
            <!-- GOLD INDSATS -->
            <div class="stake-gold-box card-style">
              <label class="stake-label">Nuka Coins to risk:</label>
              <div class="stake-gold-row">
                <button class="stake-stepper" @click="changeGold(-100)" :disabled="goldStake <= 500">-</button>
                <span class="stake-gold-value">{{ goldStake }}</span>
                <button class="stake-stepper" @click="changeGold(100)" :disabled="goldStake + 100 > playerGold">+</button>
              </div>
              <div class="stake-gold-info">(Min: 500, You have: {{ playerGold }})</div>
            </div>
            <!-- RESSOURCE GRID MED STEPPER DIREKTE I GRID -->
            <div class="stake-resource-box card-style">
              <label class="stake-label">Add resources (bonus loot):</label>
              <div class="resource-grid">
                <div v-for="res in availableResources" :key="res.id" class="resource-tile" :class="{ 'disabled': getResourceAmount(res.id) === 0 }">
                  <img :src="require(`@/assets/interface/icons/resources/${res.img}`)" :alt="res.name">
                  <span class="resource-name">{{ res.name }}</span>
                  <span class="resource-amount">x{{ getResourceAmount(res.id) }}</span>
                  <div class="resource-stepper-row">
                    <button class="resource-stepper" @click="decrementResource(res.id)" :disabled="getStakeAmount(res.id) === 0">-</button>
                    <span class="resource-stake-value">{{ getStakeAmount(res.id) }}</span>
                    <button class="resource-stepper" @click="incrementResource(res.id)" :disabled="getStakeAmount(res.id) >= getResourceAmount(res.id)">+</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- REWARD PREVIEW -->
            <div class="reward-preview-box card-style">
              <strong>Expected rewards:</strong>
              <div class="reward-preview-grid">
                <div class="reward-item">
                  <img :src="require('@/assets/interface/icons/money.png')" alt="Gold">
                  <span>{{ previewGoldReward }} Nuka Coins</span>
                </div>
                <div class="reward-item">
                  <img :src="require('@/assets/interface/icons/exp.png')" alt="Exp">
                  <span>{{ previewExpReward }} EXP</span>
                </div>
                <div v-for="res in previewResourceRewards" :key="res.id" class="reward-item">
                  <img :src="require(`@/assets/interface/icons/resources/${res.img}`)" :alt="res.name">
                  <span>{{ res.chance }}% chance for {{ res.name }}</span>
                </div>
              </div>
              <div class="reward-note mt-2"><small>Resource rewards are not guaranteed. Each has a {{ resourceRewardChance }}% chance per day.</small></div>
            </div>
            <button class="btn btn-success mt-3 big-btn" @click="startSurvival" :disabled="!canStart">Start Survival</button>
          </div>

          <!-- SURVIVAL GAME FLOW -->
          <div v-else class="card-style survival-run-box">
            <div class="survival-progress">
              <div class="progress-header">
                <span class="progress-label">Days Survived in Wasteland:</span>
                <span class="progress-value">{{ days }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: Math.min((days / 10) * 100, 100) + '%' }"></div>
              </div>
            </div>
            <div class="survival-rewards">
              <span class="rewards-label">Current Rewards:</span>
              <div class="rewards-grid">
                <div class="reward-item">
                  <img :src="require('@/assets/interface/icons/money.png')" alt="Gold">
                  <span>{{ moneyReward }} Nuka Coins</span>
                </div>
                <div class="reward-item">
                  <img :src="require('@/assets/interface/icons/exp.png')" alt="Exp">
                  <span>{{ expReward }} EXP</span>
                </div>
                <div v-for="(res, idx) in resourceRewards" :key="idx" class="reward-item">
                  <img :src="require(`@/assets/interface/icons/resources/${res.img}`)" :alt="res.name">
                  <span>{{ res.amount }} {{ res.name }}</span>
                </div>
              </div>
              <div v-if="days === 1 && moneyReward === previewGoldReward && expReward === previewExpReward && resourceRewards.length === 0" class="rewards-note">
                <small>Start your journey to earn rewards!</small>
              </div>
              <div v-if="moneyReward === 0 && expReward === 0 && resourceRewards.length === 0 && days > 1" class="rewards-note rewards-lost">
                <small>You fled and lost most of your rewards!</small>
              </div>
            </div>
            <div v-if="enemyEncounter" class="survival-enemy-encounter">
              <div class="enemy-warning">
                <img :src="require('@/assets/interface/icons/encounter.png')" alt="Enemy">
                <span>An enemy appears! You must fight or flee.</span>
              </div>
              <div class="enemy-actions">
                <button class="btn btn-danger big-btn" @click="$emit('start-battle')">Fight</button>
                <button class="btn btn-secondary big-btn" @click="flee">Flee (Lose 80% of rewards)</button>
              </div>
            </div>
            <div v-else class="survival-actions">
              <button class="btn btn-success big-btn" @click="continueSurvival">Continue (Next Day)</button>
              <button class="btn btn-secondary big-btn" @click="claimRewards">Claim Rewards & Leave</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapActions } from 'vuex';

export default {
  name: 'SurvivalWastelandModal',
  props: {
    showModal: { type: Boolean, default: false },
    days: { type: Number, default: 1 },
    moneyReward: { type: Number, default: 0 },
    expReward: { type: Number, default: 0 },
    resourceRewards: { type: Array, default: () => [] },
    enemyEncounter: { type: Boolean, default: false },
    playerGold: { type: Number, default: 0 },
    availableResources: { type: Array, default: () => [] },
    savageWastelandActive: { type: Boolean, default: false }, // NY PROP
    fleeRewards: { type: Object, default: null }, // NY PROP
  },
  emits: ['close', 'continue', 'claim', 'start-battle', 'flee', 'start-survival'],
  data() {
    return {
      runStarted: false,
      goldStake: 500,
      resourceStake: [], // [{id, name, img, amount}]
    };
  },
  computed: {
    canStart() {
      return this.goldStake >= 500 && this.goldStake <= this.playerGold;
    },
    previewGoldReward() {
      const baseReward = 20 + (1 * 15); // Day 1
      const goldMultiplier = this.goldStake / 500;
      return Math.floor(baseReward * goldMultiplier);
    },
    previewExpReward() {
      const baseReward = 15 + (1 * 10); // Day 1
      const goldMultiplier = this.goldStake / 500;
      const resourceBonus = this.resourceStake.reduce((sum, r) => sum + r.amount * 5, 0);
      return Math.floor(baseReward * goldMultiplier) + resourceBonus;
    },
    previewResourceRewards() {
      // For hver ressource: chance = 5% * amount
      return this.resourceStake.map(r => ({
        ...r,
        chance: Math.min(r.amount * 5, 100) // max 100%
      }));
    },
    resourceRewardChance() {
      return 5; // 5% chance pr. ressource
    }
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.runStarted = this.savageWastelandActive;
        // Nulstil stake hvis run ikke er aktivt
        if (!this.savageWastelandActive) {
          this.goldStake = 500;
          this.resourceStake = [];
        }
      }
    },
    savageWastelandActive(newVal) {
      this.runStarted = newVal;
    },
    days() {
      this.runStarted = this.savageWastelandActive;
    },
    moneyReward() {
      this.runStarted = this.savageWastelandActive;
    },
    expReward() {
      this.runStarted = this.savageWastelandActive;
    },
    runStarted(newVal) {
      if (!newVal) {
        this.goldStake = 500;
        this.resourceStake = [];
      }
    }
  },
  methods: {
    ...mapActions(['decreaseMoney']),
    closeModal() {
      this.$emit('close');
    },
    changeGold(delta) {
      let newVal = this.goldStake + delta;
      if (newVal < 500) newVal = 500;
      if (newVal > this.playerGold) newVal = this.playerGold;
      this.goldStake = newVal;
    },
    // Direkte stepper i grid:
    incrementResource(resourceId) {
      const max = this.getResourceAmount(resourceId);
      const existing = this.resourceStake.find(r => r.id === resourceId);
      if (existing) {
        if (existing.amount < max) existing.amount++;
      } else if (max > 0) {
        const res = this.availableResources.find(r => r.id === resourceId);
        this.resourceStake.push({ id: res.id, name: res.name, img: res.img, amount: 1 });
      }
    },
    decrementResource(resourceId) {
      const idx = this.resourceStake.findIndex(r => r.id === resourceId);
      if (idx !== -1) {
        if (this.resourceStake[idx].amount > 1) {
          this.resourceStake[idx].amount--;
        } else {
          this.resourceStake.splice(idx, 1);
        }
      }
    },
    getResourceAmount(resourceId) {
      const res = this.availableResources.find(r => r.id === resourceId);
      return res ? res.playerAmount : 0;
    },
    getStakeAmount(resourceId) {
      const res = this.resourceStake.find(r => r.id === resourceId);
      return res ? res.amount : 0;
    },
    async startSurvival() {
      // Træk penge idiotsikkert via $store.dispatch (action)
      await this.$store.dispatch('decreaseMoney', this.goldStake);
      this.runStarted = true;
      this.$emit('start-survival', {
        gold: this.goldStake,
        resources: this.resourceStake
      });
    },
    continueSurvival() {
      this.$emit('continue');
    },
    claimRewards() {
      this.showClaimToast();
      this.resetSurvival();
      this.$emit('claim');
    },
    async flee() {
      // showFleeToast fjernes herfra for at undgå dobbelt-toast!
      // Det er nu parent/GameWorld der styrer visning af toast og rewards.
      // Hvis du ønsker at trække penge for at flygte, indsæt beløb her:
      // await this.$store.dispatch('decreaseMoney', FLEE_COST);
      this.$emit('flee');
    },
    resetSurvival() {
      this.runStarted = false;
      this.goldStake = 500;
      this.resourceStake = [];
    },
    showClaimToast() {
      let rewardMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">Survival rewards claimed!</p>
          <p class="text-left fw-semi mb-2">You earned:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;
      if (this.moneyReward > 0) {
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
            <span>${this.moneyReward} Nuka Coins</span>
          </div>
        `;
      }
      if (this.expReward > 0) {
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
            <span>${this.expReward} EXP</span>
          </div>
        `;
      }
      this.resourceRewards.forEach(res => {
        rewardMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require(`@/assets/interface/icons/resources/${res.img}`)}" title="${res.name}" style="width: 20px;" class="me-2">
            <span>${res.amount} x ${res.name}</span>
          </div>
        `;
      });
      rewardMessage += `
          </div>
        </div>
      `;
      toast.success(rewardMessage, {
        dangerouslyHTMLString: true,
        autoClose: 5000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    },
    showFleeToast() {
      // ALTID vis 20% af de aktuelle rewards (uanset hvor Flee trykkes)
      const money = Math.floor(this.moneyReward * 0.2);
      const exp = Math.floor(this.expReward * 0.2);
      const resources = (this.resourceRewards || []).map(res => ({ ...res, amount: Math.ceil(res.amount * 0.2) }));
      let fleeMessage = `
        <div class="d-flex flex-column align-items-start justify-content-start h-100">
          <p class="text-left fw-bold mb-1">You fled from the wasteland!</p>
          <p class="text-left fw-semi mb-2">Lost 80% of your rewards</p>
          <p class="text-left fw-semi mb-2">You kept:</p>
          <div class="d-flex flex-column align-items-start justify-content-start mb-1 flex-grow-1">
      `;
      if (money > 0) {
        fleeMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
            <span>${money} Nuka Coins</span>
          </div>
        `;
      }
      if (exp > 0) {
        fleeMessage += `
          <div class="d-flex align-items-start justify-content-start reward-info mb-2">
            <img src="${require('@/assets/interface/icons/exp.png')}" title="Exp" style="width: 20px;" class="me-2">
            <span>${exp} EXP</span>
          </div>
        `;
      }
      (resources || []).forEach(res => {
        if (res.amount > 0) {
          fleeMessage += `
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require(`@/assets/interface/icons/resources/${res.img}`)}" title="${res.name}" style="width: 20px;" class="me-2">
              <span>${res.amount} x ${res.name}</span>
            </div>
          `;
        }
      });
      fleeMessage += `
          </div>
        </div>
      `;
      toast.error(fleeMessage, {
        dangerouslyHTMLString: true,
        autoClose: 4000,
        hideProgressBar: false,
        icon: false,
        toastClassName: 'quest-toast-container',
        bodyClassName: 'quest-toast-body quest-toast'
      });
    }
  }
};
</script>

<style scoped lang="scss">
.survival-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.survival-dialog {
  background: #181818;
  border: 2px solid #00ff00;
  border-radius: 12px;
  width: 95%;
  max-width: 650px;
  max-height: 95vh;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px #00ff0033;
}
.survival-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 18px;
}
.survival-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #00ff00;
  padding-bottom: 10px;
}
.survival-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
.survival-logo {
  width: 28px;
  height: 28px;
}
.survival-title {
  color: #00ff00;
  margin: 0;
  font-size: 18px;
  text-shadow: 0 0 10px #00ff00;
  font-weight: bold;
  text-transform: uppercase;
}
.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  padding: 0 8px;
  &:hover {
    color: #ff0000;
  }
}
.card-style {
  background: rgba(0,0,0,0.92);
  border: 1.5px solid #00ff00;
  border-radius: 10px;
  box-shadow: 0 0 10px #00ff0033;
  padding: 18px 18px 12px 18px;
  margin-bottom: 18px;
}
.big-btn {
  font-size: 1.1rem;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 8px;
}
.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem!important;
  max-height: 70vh;
  overflow-y: auto;
  color: #fff;
}
.survival-info-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.survival-start-box {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  h4 {
    color: #00ff00;
    margin-bottom: 15px;
  }
  .input-group {
    margin-bottom: 15px;
    label {
      display: block;
      margin-bottom: 5px;
      color: #fff;
    }
    input[type="number"] {
      width: 100px;
      padding: 8px;
      border: 1px solid #555;
      border-radius: 4px;
      background: #222;
      color: #fff;
      text-align: center;
      &:focus {
        outline: none;
        border-color: #00cc00;
      }
    }
    .current-gold {
      display: block;
      margin-top: 10px;
      font-size: 0.9rem;
      color: #888;
    }
  }
  .resource-select-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    .btn {
      min-width: 80px;
    }
  }
  .resource-stake-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
    .resource-stake-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: rgba(0, 255, 0, 0.1);
      border: 1px solid rgba(0, 255, 0, 0.3);
      border-radius: 6px;
      font-size: 0.9rem;
      img {
        width: 16px;
        height: 16px;
      }
      .btn-sm {
        padding: 4px 8px;
      }
    }
  }
  .stake-summary {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #888;
    strong {
      color: #00ff00;
      font-weight: bold;
    }
  }
}
.survival-progress {
  font-size: 1.1rem;
  color: #00ff00;
  font-weight: bold;
  width: 100%;
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .progress-bar {
    height: 20px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #333;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff00, #00cc00);
    border-radius: 10px;
    transition: width 0.3s ease;
  }
}
.survival-rewards {
  font-size: 1rem;
  color: #fff;
  width: 100%;
  .rewards-label {
    display: block;
    margin-bottom: 10px;
    color: #00ff00;
    font-weight: bold;
  }
  .rewards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 10px;
  }
  .reward-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    border-radius: 6px;
    font-size: 0.9rem;
    img {
      width: 18px;
      height: 18px;
    }
  }
  .rewards-note {
    text-align: center;
    color: #888;
    font-style: italic;
    margin-top: 10px;
    &.rewards-lost {
      color: #ff4444;
      font-weight: bold;
    }
  }
}
.survival-enemy-encounter {
  background: rgba(255,0,0,0.08);
  border: 1.5px solid #ff0000;
  border-radius: 8px;
  padding: 12px 16px;
  text-align: center;
  .enemy-warning {
    color: #ff4444;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 28px;
      height: 28px;
    }
  }
  .enemy-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 10px;
    .btn {
      min-width: 120px;
    }
  }
}
.survival-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
  .btn {
    min-width: 120px;
  }
}
.stake-section {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.stake-gold-box {
  background: rgba(255,255,0,0.05);
  border: 1px solid #ffff00;
  border-radius: 8px;
  padding: 15px;
  min-width: 220px;
  text-align: center;
}
.stake-label {
  color: #00ff00;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}
.stake-gold-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}
.stake-gold-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffff00;
  min-width: 60px;
  text-align: center;
}
.stake-stepper {
  background: #222;
  color: #ffff00;
  border: 1px solid #ffff00;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #ffff00;
    color: #222;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.stake-gold-info {
  color: #888;
  font-size: 0.9rem;
}
.stake-resource-box {
  background: rgba(0,255,0,0.05);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 15px;
  min-width: 260px;
}
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
}
.resource-tile {
  background: #222;
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 10px 5px 5px 5px;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  position: relative;
  &:hover:not(.disabled) {
    box-shadow: 0 0 10px #00ff00;
    border-color: #ffff00;
  }
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  img {
    width: 36px;
    height: 36px;
    margin-bottom: 4px;
  }
  .resource-name {
    color: #00ff00;
    font-size: 0.95rem;
    display: block;
  }
  .resource-amount {
    color: #fff;
    font-size: 0.85rem;
    display: block;
  }
}
.resource-stake-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  .resource-stake-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    border-radius: 6px;
    font-size: 0.9rem;
    img {
      width: 16px;
      height: 16px;
    }
    .btn-sm {
      padding: 4px 8px;
    }
  }
}
.reward-preview-box {
  margin-top: 15px;
  background: rgba(0,0,0,0.1);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
}
.reward-preview-grid {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  img {
    width: 18px;
    height: 18px;
  }
}
/* Resource picker popup */
.resource-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.resource-picker-dialog {
  background: #181818;
  border: 2px solid #00ff00;
  border-radius: 10px;
  padding: 30px 30px 20px 30px;
  min-width: 260px;
  text-align: center;
  color: #fff;
}
.picker-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}
.picker-stepper {
  background: #222;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #00ff00;
    color: #222;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.picker-info {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 10px;
}
.resource-stepper-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 6px;
}
.resource-stepper {
  background: #222;
  color: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #00ff00;
    color: #222;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.resource-stake-value {
  color: #fff;
  font-size: 1rem;
  min-width: 18px;
  text-align: center;
}
</style> 