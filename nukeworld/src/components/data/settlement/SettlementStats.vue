<template>
  <div class="settlement-stats-container">
    <!-- Header matching PlayerShop style -->
        <!-- Tabs matching InventoryStash style -->
        <div class="settlement-tabs">
          <button 
            v-for="tab in ['overview', 'management', 'actions']" 
            :key="tab"
            class="tab-button"
            :class="{ active: activeTab === tab }"
            @click="changeTab(tab)"
          >
            <img :src="require(`@/assets/interface/icons/${tab === 'overview' ? 'settlement' : tab === 'management' ? 'exp' : 'settings'}.png`)" :alt="tab">
            {{ tab.toUpperCase() }}
          </button>
        </div>

        <!-- Content Grid matching PlayerShop structure -->
        <div class="settlement-container">
          <div class="settlement-content-grid">
            <!-- Left Panel - Stats Grid (matching items grid) -->
            <div class="settlement-stats-items">
              <!-- Overview Tab -->
              <div v-show="activeTab === 'overview'" class="stats-grid">
                <!-- Settlement Health Card -->
                <div class="stat-card main-health-card">
                  <div class="card-header">
                    <img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Health">
                    <h4>Settlement Health</h4>
                  </div>
                  <div class="health-section">
                    <div class="health-bar-large">
                      <div class="health-fill settlement-main-health" 
                           :style="{ width: (settlement.health / settlement.maxHealth * 100) + '%' }">
                      </div>
                      <span class="health-text">{{ settlement.health }}/{{ settlement.maxHealth }}</span>
                    </div>
                  </div>
                </div>

                <!-- Combat Stats Card -->
                <div class="stat-card combat-card">
                  <div class="card-header">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Combat">
                    <h4>Combat Stats</h4>
                  </div>
                  <div class="stat-list">
                    <div class="stat-item">
                      <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                      <span>Attack Power: {{ settlementAttackPower }}</span>
                    </div>
                    <div class="stat-breakdown">
                      <div class="breakdown-item">
                        <span class="breakdown-label">Base:</span>
                        <span class="breakdown-value">{{ settlementBaseAttack }}</span>
                      </div>
                      <div class="breakdown-item" v-if="settlementStrengthAttackBonus > 0">
                        <span class="breakdown-label">Strength:</span>
                        <span class="breakdown-value bonus">+{{ settlementStrengthAttackBonus }}</span>
                      </div>
                      <div class="breakdown-item" v-if="settlementPerkAttackBonus > 0">
                        <span class="breakdown-label">Perks:</span>
                        <span class="breakdown-value bonus">+{{ settlementPerkAttackBonus }}</span>
                      </div>
                    </div>
                    <div class="stat-item">
                      <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                      <span>Defence Power: {{ settlementDefencePower }}</span>
                    </div>
                    <div class="stat-breakdown">
                      <div class="breakdown-item">
                        <span class="breakdown-label">Base:</span>
                        <span class="breakdown-value">{{ settlementBaseDefense }}</span>
                      </div>
                      <div class="breakdown-item" v-if="settlementEnduranceDefenseBonus > 0">
                        <span class="breakdown-label">Endurance:</span>
                        <span class="breakdown-value bonus">+{{ settlementEnduranceDefenseBonus }}</span>
                      </div>
                      <div class="breakdown-item" v-if="settlementPerkDefenseBonus > 0">
                        <span class="breakdown-label">Perks:</span>
                        <span class="breakdown-value bonus">+{{ settlementPerkDefenseBonus }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                              <!-- Settlement Bonuses & SPECIAL Effects Card -->
              <div class="stat-card bonuses-card">
                <div class="card-header">
                  <img :src="require('@/assets/interface/icons/exp.png')" alt="Bonuses">
                  <h4>Settlement Bonuses & SPECIAL Effects</h4>
                </div>
                <div class="stat-list">
                  <!-- Attack Power -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span>Attack Power: +{{ settlementStrengthAttackBonus + settlementPerkAttackBonus }}</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementStrengthAttackBonus > 0">
                      <span class="breakdown-label">Strength ({{ character.special.strength }}):</span>
                      <span class="breakdown-value bonus">+{{ settlementStrengthAttackBonus }}</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkAttackBonus > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">+{{ settlementPerkAttackBonus }}</span>
                    </div>
                  </div>
                  
                  <!-- Defense Power -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                    <span>Defense Power: +{{ settlementEnduranceDefenseBonus + settlementPerkDefenseBonus }}</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementEnduranceDefenseBonus > 0">
                      <span class="breakdown-label">Endurance ({{ character.special.endurance }}):</span>
                      <span class="breakdown-value bonus">+{{ settlementEnduranceDefenseBonus }}</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkDefenseBonus > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">+{{ settlementPerkDefenseBonus }}</span>
                    </div>
                  </div>
                  
                  <!-- Auto-Heal -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Auto-Heal">
                    <span>Auto-Heal: +{{ (settlementAutoHeal * 100).toFixed(1) }}% Chance</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementIntelligenceHealBonus > 0">
                      <span class="breakdown-label">Intelligence ({{ character.special.intelligence }}):</span>
                      <span class="breakdown-value bonus">+{{ (settlementIntelligenceHealBonus * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkHealBonus > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">+{{ (settlementPerkHealBonus * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                  
                  <!-- Resource Generation -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/resources/fuel.png')" alt="Resource Gen">
                    <span>Resource Gen: +{{ (settlementResourceGen * 100).toFixed(1) }}% Chance</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementAgilityResourceBonus > 0">
                      <span class="breakdown-label">Agility ({{ character.special.agility }}):</span>
                      <span class="breakdown-value bonus">+{{ (settlementAgilityResourceBonus * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkResourceBonus > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">+{{ (settlementPerkResourceBonus * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                  
                  <!-- Gold Generation -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/money.png')" alt="Gold Gen">
                    <span>Gold Gen: +{{ (settlementGoldGen * 100).toFixed(1) }}% Chance</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementLuckGoldBonus > 0">
                      <span class="breakdown-label">Luck ({{ character.special.luck }}):</span>
                      <span class="breakdown-value bonus">+{{ (settlementLuckGoldBonus * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkGoldBonus > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">+{{ (settlementPerkGoldBonus * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                  
                  <!-- Upgrade Discount -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/shop.png')" alt="Upgrade Discount">
                    <span>Upgrade Discount: -{{ ((1 - settlementUpgradeDiscount) * 100).toFixed(1) }}%</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementCharismaDiscount > 0">
                      <span class="breakdown-label">Charisma ({{ character.special.charisma }}):</span>
                      <span class="breakdown-value bonus">-{{ (settlementCharismaDiscount * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkDiscount > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">-{{ (settlementPerkDiscount * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                  
                  <!-- Critical Hit -->
                  <div class="stat-item">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Critical Hit">
                    <span>Critical Hit: +{{ (settlementCriticalHitChance * 100).toFixed(1) }}%</span>
                  </div>
                  <div class="stat-breakdown">
                    <div class="breakdown-item" v-if="settlementPerceptionCritBonus > 0">
                      <span class="breakdown-label">Perception ({{ character.special.perception }}):</span>
                      <span class="breakdown-value bonus">+{{ (settlementPerceptionCritBonus * 100).toFixed(1) }}%</span>
                    </div>
                    <div class="breakdown-item" v-if="settlementPerkCritBonus > 0">
                      <span class="breakdown-label">Perks:</span>
                      <span class="breakdown-value bonus">+{{ (settlementPerkCritBonus * 100).toFixed(1) }}%</span>
                    </div>
                  </div>
                </div>
              </div>

                <!-- Take Rewards Card -->
                <div class="stat-card rewards-card" v-if="hasPendingRewards">
                  <div class="card-header">
                    <img :src="require('@/assets/interface/icons/reward.png')" alt="Rewards">
                    <h4>Pending Rewards</h4>
                  </div>
                  <div class="rewards-section">
                    <div class="rewards-display">
                      <!-- Gold Rewards -->
                      <div class="reward-item" v-if="settlement.pendingRewards?.gold > 0">
                        <img :src="require('@/assets/interface/icons/money.png')" alt="Gold">
                        <span>{{ settlement.pendingRewards.gold }} Gold</span>
                      </div>
                      
                      <!-- Experience Rewards -->
                      <div class="reward-item" v-if="settlement.pendingRewards?.experience > 0">
                        <img :src="require('@/assets/interface/icons/exp.png')" alt="Experience">
                        <span>{{ settlement.pendingRewards.experience }} Experience</span>
                      </div>
                      
                      <!-- Resource Rewards -->
                      <div class="reward-item" v-for="resource in settlement.pendingRewards?.resources" :key="resource.id">
                        <img :src="require(`@/assets/interface/icons/resources/${resource.img}`)" :alt="resource.name">
                        <span>{{ resource.amount }} {{ resource.name }}</span>
                      </div>
                    </div>
                    
                    <button 
                      @click="claimRewards" 
                      class="claim-rewards-button"
                      :disabled="!hasPendingRewards"
                    >
                      <img :src="require('@/assets/interface/icons/reward.png')" alt="Claim">
                      <span>Take Rewards</span>
                    </button>
                  </div>
                </div>

                <!-- Population Card -->
                <div class="stat-card population-card">
                  <div class="card-header">
                    <img :src="require('@/assets/interface/icons/player.png')" alt="Population">
                    <h4>Population</h4>
                  </div>
                  <div class="stat-list">
                    <div class="stat-item">
                      <img :src="require('@/assets/interface/icons/player.png')" alt="Inhabitants">
                      <span>Inhabitants: {{ settlement.inhabitants }}/{{ settlement.maxInhabitants }}</span>
                    </div>
                  </div>
                </div>

                <!-- Environment Card -->
                <div class="stat-card environment-card">
                  <div class="card-header">
                    <img :src="require('@/assets/interface/icons/resources/gasoline.png')" alt="Environment">
                    <h4>Environment</h4>
                  </div>
                  <div class="stat-list">
                    <div class="stat-item radiation-item">
                      <div class="radiation-display">
                        <span>Radiation: {{ settlement.radiation }}%</span>
                        <div class="radiation-bar">
                          <div class="radiation-fill" 
                               :style="{ width: (settlement.radiation / settlement.maxRadiation * 100) + '%' }">
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              <!-- Management Tab -->
              <div v-show="activeTab === 'management'" class="stats-grid">
                <!-- Level Upgrade Card -->
                <div class="stat-card upgrade-card">
                  <div class="card-header">
                    <div class="card-title">
                      <img :src="require('@/assets/interface/icons/exp.png')" alt="Level">
                      <h4>Settlement Level</h4>
                    </div>
                    <div v-if="settlementUpgradeDiscount < 1" class="discount-badge">
                      -{{ ((1 - settlementUpgradeDiscount) * 100).toFixed(1) }}% Discount
                    </div>
                  </div>
                  <div class="upgrade-section">
                    <div class="current-level">Level {{ settlement.level }}</div>
                    <button 
                      @click="upgradeLevel" 
                      :disabled="!canUpgradeLevel"
                      class="upgrade-button"
                      :class="{ 'can-upgrade': canUpgradeLevel }"
                    >
                      <span>Upgrade Settlement</span>
                    </button>
                    <div class="cost-display">
                      <span>Cost: {{ Math.floor((settings?.upgradeCosts?.level?.resource1Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.level?.resource1)?.img}`)" alt="Wood" class="resource-icon">
                      <span>{{ Math.floor((settings?.upgradeCosts?.level?.resource2Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.level?.resource2)?.img}`)" alt="Steel" class="resource-icon">
                      <span>${{ Math.floor((settings?.upgradeCosts?.level?.moneyCost || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require('@/assets/interface/icons/money.png')" alt="Money" class="resource-icon">
                    </div>
                  </div>
                </div>

                <!-- Population Management Card -->
                <div class="stat-card management-card">
                  <div class="card-header">
                    <div class="card-title">
                      <img :src="require('@/assets/interface/icons/player.png')" alt="Population">
                      <h4>Population Management</h4>
                    </div>
                    <div v-if="settlementUpgradeDiscount < 1" class="discount-badge">
                      -{{ ((1 - settlementUpgradeDiscount) * 100).toFixed(1) }}% Discount
                    </div>
                  </div>
                  <div class="management-section">
                    <div class="stat-row">
                      <span>Inhabitants: {{ settlement.inhabitants }}/{{ settlement.maxInhabitants }}</span>
                      <button 
                        @click="addInhabitant" 
                        :disabled="settlement.inhabitants >= settlement.maxInhabitants"
                        class="increment-button"
                        :class="{ 'can-use': settlement.inhabitants < settlement.maxInhabitants }"
                      >
                        Add +1
                      </button>
                    </div>
                    <div class="cost-display">
                      <span>Cost: {{ Math.floor((settings?.upgradeCosts?.inhabitant?.resource1Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.inhabitant?.resource1)?.img}`)" alt="Wood" class="resource-icon">
                      <span>{{ Math.floor((settings?.upgradeCosts?.inhabitant?.resource2Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.inhabitant?.resource2)?.img}`)" alt="Steel" class="resource-icon">
                      <span>${{ Math.floor((settings?.upgradeCosts?.inhabitant?.moneyCost || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require('@/assets/interface/icons/money.png')" alt="Money" class="resource-icon">
                    </div>
                  </div>
                </div>

                <!-- Infrastructure Management Cards -->
                <div class="stat-card management-card">
                  <div class="card-header">
                    <div class="card-title">
                      <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                      <h4>Defense Management</h4>
                    </div>
                    <div v-if="settlementUpgradeDiscount < 1" class="discount-badge">
                      -{{ ((1 - settlementUpgradeDiscount) * 100).toFixed(1) }}% Discount
                    </div>
                  </div>
                  <div class="management-section">
                    <div class="stat-row">
                      <span>Defense: {{ settlement.defences }}/{{ settlement.maxDefences }}</span>
                      <button 
                        @click="upgradeDefences" 
                        :disabled="settlement.defences >= settlement.maxDefences"
                        class="increment-button"
                        :class="{ 'can-use': settlement.defences < settlement.maxDefences }"
                      >
                        Upgrade +1
                      </button>
                    </div>
                    <div class="cost-display">
                      <span>Cost: {{ Math.floor((settings?.upgradeCosts?.defences?.resource1Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.defences?.resource1)?.img}`)" alt="Wood" class="resource-icon">
                      <span>{{ Math.floor((settings?.upgradeCosts?.defences?.resource2Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.defences?.resource2)?.img}`)" alt="Steel" class="resource-icon">
                      <span>${{ Math.floor((settings?.upgradeCosts?.defences?.moneyCost || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require('@/assets/interface/icons/money.png')" alt="Money" class="resource-icon">
                    </div>
                  </div>
                </div>

                <div class="stat-card management-card">
                  <div class="card-header">
                    <div class="card-title">
                      <img :src="require('@/assets/interface/icons/resources/fuel.png')" alt="Power">
                      <h4>Power Management</h4>
                    </div>
                    <div v-if="settlementUpgradeDiscount < 1" class="discount-badge">
                      -{{ ((1 - settlementUpgradeDiscount) * 100).toFixed(1) }}% Discount
                    </div>
                  </div>
                  <div class="management-section">
                    <div class="stat-row">
                      <span>Power: {{ settlement.power }}/{{ settlement.maxPower }}</span>
                      <button 
                        @click="upgradePower" 
                        :disabled="settlement.power >= settlement.maxPower"
                        class="increment-button"
                        :class="{ 'can-use': settlement.power < settlement.maxPower }"
                      >
                        Upgrade +1
                      </button>
                    </div>
                    <div class="cost-display">
                      <span>Cost: {{ Math.floor((settings?.upgradeCosts?.power?.resource1Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.power?.resource1)?.img}`)" alt="Wood" class="resource-icon">
                      <span>{{ Math.floor((settings?.upgradeCosts?.power?.resource2Amount || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === settings?.upgradeCosts?.power?.resource2)?.img}`)" alt="Steel" class="resource-icon">
                      <span>${{ Math.floor((settings?.upgradeCosts?.power?.moneyCost || 0) * settlementUpgradeDiscount) }}</span>
                      <img :src="require('@/assets/interface/icons/money.png')" alt="Money" class="resource-icon">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions Tab -->
              <div v-show="activeTab === 'actions'" class="stats-grid">
                <div class="action-cards">
                  <div class="action-card heal-card" 
                       :class="{ 'can-use': canHealSettlement }"
                       @click="canHealSettlement ? healSettlement() : null">
                    <div class="action-icon">
                      <img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Heal">
                    </div>
                    <div class="action-info">
                      <h4>Heal Settlement</h4>
                      <p>Restore 50 HP</p>
                      <div class="action-cost">
                        <span>100</span>
                        <img :src="require('@/assets/interface/icons/money.png')" alt="Money" class="resource-icon">
                      </div>
                    </div>
                  </div>

                  <div class="action-card radiation-card" 
                       :class="{ 'can-use': !settlement.radiationReductionActive && settlement.radiation > 0 }"
                       @click="(!settlement.radiationReductionActive && settlement.radiation > 0) ? reduceRadiation() : null">
                    <div class="action-icon">
                      <img :src="require('@/assets/interface/icons/resources/gasoline.png')" alt="Radiation">
                    </div>
                    <div class="action-info">
                      <h4>Reduce Radiation</h4>
                      <p>Cleanse environment</p>
                      <div class="action-cost">
                        <span>1</span>
                        <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === 1)?.img}`)" alt="Wood" class="resource-icon">
                        <span>1</span>
                        <img :src="require(`@/assets/interface/icons/resources/${resources.find(r => r.id === 2)?.img}`)" alt="Steel" class="resource-icon">
                      </div>
                    </div>
                  </div>

                  <div class="action-card log-card can-use" @click="$emit('open-log')">
                    <div class="action-icon">
                      <img :src="require('@/assets/interface/icons/quests.png')" alt="Log">
                    </div>
                    <div class="action-info">
                      <h4>View Attack Log</h4>
                      <p>Battle history</p>
                      <div class="action-cost">Free</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel - Info Panel (matching PlayerShop info-panel) -->
            <div class="info-panel">
              <div class="settlement-info-section">
                <h3>Settlement Information</h3>
                <div class="info-stats">
                  <div class="info-item">
                    <img :src="require('@/assets/interface/icons/settlement.png')" alt="Level">
                    <span>Level {{ settlement.level }} Settlement</span>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="quick-actions-section">
                <div class="quick-action-buttons">
                  <button 
                    @click="healSettlement" 
                    class="quick-action-btn heal-btn"
                    :class="{ 'can-use': canHealSettlement }"
                    :disabled="!canHealSettlement"
                  >
                    <img :src="require('@/assets/interface/icons/aid/medkit.png')" alt="Heal">
                    <span>Heal (100💰)</span>
                  </button>

                  <button 
                    @click="reduceRadiation" 
                    class="quick-action-btn radiation-btn"
                    :class="{ 'can-use': !settlement.radiationReductionActive && settlement.radiation > 0 }"
                    :disabled="settlement.radiation === 0 || settlement.radiationReductionActive"
                  >
                    <img :src="require('@/assets/interface/icons/resources/gasoline.png')" alt="Radiation">
                    <span>Clean (1🪵1⚙️)</span>
                  </button>

                  <button 
                    @click="$emit('open-log')" 
                    class="quick-action-btn log-btn can-use"
                  >
                    <img :src="require('@/assets/interface/icons/quests.png')" alt="Log">
                    <span>View Log</span>
                  </button>
                </div>
              </div>

              <!-- Settlement Status -->
              <div class="status-section">
                <div class="status-info">
                  <div class="status-item" :class="{ 'status-good': settlement.health > 50, 'status-warning': settlement.health <= 50 && settlement.health > 25, 'status-danger': settlement.health <= 25 }">
                    <span>Health: {{ settlement.health > 75 ? 'Excellent' : settlement.health > 50 ? 'Good' : settlement.health > 25 ? 'Poor' : 'Critical' }}</span>
                  </div>
                  <div class="status-item" :class="{ 'status-good': settlement.radiation < 25, 'status-warning': settlement.radiation >= 25 && settlement.radiation < 75, 'status-danger': settlement.radiation >= 75 }">
                    <span>Radiation: {{ settlement.radiation < 25 ? 'Safe' : settlement.radiation < 75 ? 'Moderate' : 'Dangerous' }}</span>
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
import { toast } from "vue3-toastify";

export default {
  name: 'SettlementStats',
  emits: ['open-log'],
  data() {
    return {
      activeTab: 'overview'
    };
  },
  computed: {
    ...mapState('settlement', ['settlement', 'settings']),
    ...mapState(['resources', 'character']),
    ...mapGetters('settlement', [
      'settlementAttackPower',
      'settlementDefencePower',
      'settlementUpgradeDiscount',
      'settlementAutoHeal',
      'settlementResourceGen',
      'settlementGoldGen',
      'settlementCriticalHitChance',
      'canUpgradeLevel',
      // Detailed breakdown getters
      'settlementBaseAttack',
      'settlementStrengthAttackBonus',
      'settlementPerkAttackBonus',
      'settlementBaseDefense',
      'settlementEnduranceDefenseBonus',
      'settlementPerkDefenseBonus',
      'settlementCharismaDiscount',
      'settlementPerkDiscount',
      'settlementIntelligenceHealBonus',
      'settlementPerkHealBonus',
      'settlementAgilityResourceBonus',
      'settlementPerkResourceBonus',
      'settlementLuckGoldBonus',
      'settlementPerkGoldBonus',
      'settlementPerceptionCritBonus',
      'settlementPerkCritBonus'
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
    },
    
    hasPendingRewards() {
      if (!this.settlement.pendingRewards) return false;
      return this.settlement.pendingRewards.gold > 0 || 
             this.settlement.pendingRewards.experience > 0 || 
             (this.settlement.pendingRewards.resources && this.settlement.pendingRewards.resources.length > 0);
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
    },
    'settlement.radiationReductionActive': {
      handler(newValue) {
        console.log('Radiation reduction active:', newValue);
      }
    }
  },
  methods: {
    ...mapActions('settlement', ['upgradeSettlement', 'claimPendingRewards']),
    changeTab(tab) {
      this.activeTab = tab;
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
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.level?.resource1)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.level?.resource1)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.level?.resource1Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.level?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.level?.resource2)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.level?.resource2)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.level?.resource2Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.level?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${Math.floor((this.settings?.upgradeCosts?.level?.moneyCost || 0) * this.settlementUpgradeDiscount)}</span>
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
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.defences?.resource1)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.defences?.resource1)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.defences?.resource1Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.defences?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.defences?.resource2)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.defences?.resource2)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.defences?.resource2Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.defences?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${Math.floor((this.settings?.upgradeCosts?.defences?.moneyCost || 0) * this.settlementUpgradeDiscount)}</span>
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
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.power?.resource1)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.power?.resource1)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.power?.resource1Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.power?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.power?.resource2)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.power?.resource2)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.power?.resource2Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.power?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${Math.floor((this.settings?.upgradeCosts?.power?.moneyCost || 0) * this.settlementUpgradeDiscount)}</span>
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
        const moneyCost = Math.floor((this.settings?.upgradeCosts?.inhabitant?.moneyCost || 0) * this.settlementUpgradeDiscount);
        const hasEnoughMoney = await this.$store.dispatch('checkMoney', moneyCost);
        if (!hasEnoughMoney) {
          throw new Error('Not enough money');
        }

        const resources = [
          { id: this.settings.upgradeCosts.inhabitant.resource1, amount: Math.floor(this.settings.upgradeCosts.inhabitant.resource1Amount * this.settlementUpgradeDiscount) },
          { id: this.settings.upgradeCosts.inhabitant.resource2, amount: Math.floor(this.settings.upgradeCosts.inhabitant.resource2Amount * this.settlementUpgradeDiscount) }
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
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.inhabitant?.resource1)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource1)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.inhabitant?.resource1Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource1)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${this.resources.find(r => r.id === this.settings?.upgradeCosts?.inhabitant?.resource2)?.img}`)}" title="${this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource2)}" style="width: 20px;" class="me-2">
                <span>${Math.floor((this.settings?.upgradeCosts?.inhabitant?.resource2Amount || 0) * this.settlementUpgradeDiscount)} ${this.getResourceName(this.settings?.upgradeCosts?.inhabitant?.resource2)}</span>
              </div>
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require('@/assets/interface/icons/money.png')}" title="Money" style="width: 20px;" class="me-2">
                <span>$${Math.floor((this.settings?.upgradeCosts?.inhabitant?.moneyCost || 0) * this.settlementUpgradeDiscount)}</span>
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
        
        // Clear radiation reduction after 5 minutes
        setTimeout(() => {
          this.$store.commit('settlement/clearRadiationReduction');
        }, 300000); // 5 minutes = 300,000 ms
        
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
    },
    
    async claimRewards() {
      try {
        // Store the rewards before claiming them
        const rewards = { ...this.settlement.pendingRewards };
        
        await this.claimPendingRewards();
        
        // Build detailed reward message
        let rewardItems = [];
        
        if (rewards.gold > 0) {
          rewardItems.push(`
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/money.png')}" title="Gold" style="width: 20px;" class="me-2">
              <span>${rewards.gold} Gold</span>
            </div>
          `);
        }
        
        if (rewards.experience > 0) {
          rewardItems.push(`
            <div class="d-flex align-items-start justify-content-start reward-info mb-2">
              <img src="${require('@/assets/interface/icons/exp.png')}" title="Experience" style="width: 20px;" class="me-2">
              <span>${rewards.experience} Experience</span>
            </div>
          `);
        }
        
        if (rewards.resources && rewards.resources.length > 0) {
          rewards.resources.forEach(resource => {
            rewardItems.push(`
              <div class="d-flex align-items-start justify-content-start reward-info mb-2">
                <img src="${require(`@/assets/interface/icons/resources/${resource.img}`)}" title="${resource.name}" style="width: 20px;" class="me-2">
                <span>${resource.amount} ${resource.name}</span>
              </div>
            `);
          });
        }
        
        const successMessage = `
          <div class="d-flex flex-column align-items-start justify-content-start h-100">
            <p class="text-left fw-bold mb-1">Rewards Claimed!</p>
            <p class="text-left fw-semi mb-2">Your settlement rewards have been added to your inventory:</p>
            ${rewardItems.join('')}
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
        console.error('Error claiming rewards:', error);
      }
    }
  }
}
</script>

<style scoped lang="scss">
/* Container Structure matching modal content */
.settlement-stats-container {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  padding: 15px;
  color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.settlement-stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.settlement-stats-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.settlement-stats-logo {
  width: 24px;
  height: 24px;
}

.settlement-stats-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.settlement-level-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
}

.level-badge {
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.health-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;

  img {
    width: 14px;
    height: 14px;
  }
}



/* Tabs matching InventoryStash style */
.settlement-tabs {
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
}

.settlement-container {
  flex: 1;
  min-height: 0;
  margin-top: 15px;
}

.settlement-content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px);
}

.settlement-stats-items {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  padding: 5px;
}

.stat-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 15px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #00ff00;
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  }

  &.main-health-card { border-left: 3px solid #00ff00; }
  &.combat-card { border-left: 3px solid #ff4444; }
  &.population-card { border-left: 3px solid #1e90ff; }
  &.environment-card { border-left: 3px solid #ffa500; }
  &.upgrade-card { border-left: 3px solid #ffd700; }
  &.management-card { border-left: 3px solid #9370db; }
  &.bonuses-card { border-left: 3px solid #00ffff; }
  &.rewards-card { border-left: 3px solid #ffd700; }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
  justify-content: space-between;

  img {
    width: 20px;
    height: 20px;
  }

  h4 {
    color: #00ff00;
    font-size: 14px;
    margin: 0;
    text-transform: uppercase;
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .discount-badge {
    background: rgba(0, 255, 0, 0.2);
    color: #00ff00;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: bold;
    margin-left: auto;
    border: 1px solid #00ff00;
  }
}

.health-section {
  margin-top: 10px;
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

  &.settlement-main-health {
    background: linear-gradient(90deg, #00ff00, #00cc00);
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ccc;

  img {
    width: 14px;
    height: 14px;
  }

  &.radiation-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}

.stat-breakdown {
  margin-left: 22px;
  margin-top: 4px;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  margin-bottom: 2px;
  
  .breakdown-label {
    color: #aaa;
    font-style: italic;
  }
  
  .breakdown-value {
    color: #fff;
    font-weight: bold;
    
    &.bonus {
      color: #00ff00;
    }
  }
}

.rewards-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rewards-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  
  img {
    width: 16px;
    height: 16px;
  }
}

.claim-rewards-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: none;
  border-radius: 6px;
  color: #000;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  img {
    width: 16px;
    height: 16px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.radiation-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radiation-bar {
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #333;
}

.radiation-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ff4500);
  border-radius: 6px;
  transition: width 0.3s ease;
}



.upgrade-section, .management-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.current-level {
  font-size: 18px;
  font-weight: bold;
  color: #00ff00;
  text-align: center;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.upgrade-button, .increment-button {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #444;
  color: #888;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  font-weight: bold;

  &.can-upgrade, &.can-use {
    border-color: #00ff00;
    color: #00ff00;
    background: rgba(0, 255, 0, 0.1);

    &:hover {
      background: #00ff00;
      color: #000;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 255, 0, 0.2);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.cost-display {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #aaa;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;

  .resource-icon {
    width: 12px;
    height: 12px;
  }
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-card {
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &.can-use {
    border-color: #00ff00;
    color: #00ff00;

    &:hover {
      background: rgba(0, 255, 0, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    }
  }

  &:not(.can-use) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-icon {
    img {
      width: 24px;
      height: 24px;
    }
  }

  .action-info {
    h4 {
      margin: 0 0 4px 0;
      font-size: 12px;
      color: inherit;
    }

    p {
      margin: 0 0 6px 0;
      font-size: 10px;
      color: #aaa;
    }
  }

  .action-cost {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;

    .resource-icon {
      width: 12px;
      height: 12px;
    }
  }
}

/* Info Panel matching PlayerShop.vue structure */
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

.settlement-info-section, .quick-actions-section, .status-section {
  padding: 15px;

  h3, h4 {
    color: #00ff00;
    margin: 0 0 10px 0;
    font-size: 14px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  h4 {
    font-size: 12px;
  }
}

.info-stats, .status-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #fff;

  img {
    width: 14px;
    height: 14px;
  }
}

.quick-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #444;
  color: #888;

  img {
    width: 14px;
    height: 14px;
  }

  &.can-use:not(:disabled) {
    border-color: #00ff00;
    color: #00ff00;

    &:hover {
      background: rgba(0, 255, 0, 0.1);
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 255, 0, 0.2);
    }
  }

  &.heal-btn.can-use {
    border-color: #28a745;
    color: #28a745;

    &:hover {
      background: rgba(40, 167, 69, 0.1);
      box-shadow: 0 2px 6px rgba(40, 167, 69, 0.2);
    }
  }

  &.radiation-btn.can-use {
    border-color: #ff6b35;
    color: #ff6b35;

    &:hover {
      background: rgba(255, 107, 53, 0.1);
      box-shadow: 0 2px 6px rgba(255, 107, 53, 0.2);
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.status-item {
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;

  &.status-good {
    background: rgba(40, 167, 69, 0.2);
    color: #28a745;
  }

  &.status-warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
  }

  &.status-danger {
    background: rgba(220, 53, 69, 0.2);
    color: #dc3545;
  }
}



@media (max-width: 1024px) {
  .settlement-content-grid {
    grid-template-columns: 1fr 250px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .settlement-stats-container {
    padding: 10px;
  }

  .settlement-content-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .settlement-tabs {
    overflow-x: auto;
    padding-bottom: 5px;
    -webkit-overflow-scrolling: touch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .settlement-stats-container {
    padding: 8px;
  }

  .settlement-stats-header {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .settlement-level-info {
    gap: 10px;
  }
 }
</style>