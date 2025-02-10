<template>
  <div class="settings-container">
    <StoryTemplates 
      v-if="showStoryTemplates"
      :show="showStoryTemplates"
      @close="showStoryTemplates = false"
      @select-template="handleTemplateSelect"
    />
    
    <QuestTemplates 
      v-if="showQuestTemplates"
      :show="showQuestTemplates"
      @close="showQuestTemplates = false"
      @select-template="handleQuestTemplateSelect"
    />
    
    <EnemyTemplates 
      v-if="showEnemyTemplates"
      :show="showEnemyTemplates"
      @close="showEnemyTemplates = false"
      @select-template="handleEnemyTemplateSelect"
    />
    
    <ResourceTemplates 
      v-if="showResourceTemplates"
      :show="showResourceTemplates"
      @close="showResourceTemplates = false"
      @select-template="handleResourceTemplateSelect"
    />
    
    <AidTemplates 
      v-if="showAidTemplates"
      :show="showAidTemplates"
      @close="showAidTemplates = false"
      @select-template="handleAidTemplateSelect"
    />
    
    <ArmorTemplates 
      v-if="showArmorTemplates"
      :show="showArmorTemplates"
      @close="showArmorTemplates = false"
      @select-template="handleArmorTemplateSelect"
    />
    
    <WeaponTemplates 
      v-if="showWeaponTemplates"
      :show="showWeaponTemplates"
      @close="showWeaponTemplates = false"
      @select-template="handleWeaponTemplateSelect"
    />
    
    <div class="settings-content">
      <div class="settings-header">
        <h1 class="game-title">Settings</h1>
        <button @click="goToMainMenu" class="btn btn-outline-primary me-2 mt-2">Back to Main Menu</button>
      </div>
      <div class="settings-menu">
        <button 
          class="btn btn-outline-primary" 
          v-for="section in sections" 
          :key="section" 
          @click="changeSection(section)"
          :class="{ active: activeSection === section }"
        >
          {{ section }}
        </button>
      </div>

      <div class="action-buttons">
        <button type="button" class="btn btn-success" @click="addNewItem">Add New</button>
        <button type="button" class="btn btn-primary" @click="saveChanges">Save Changes</button>
        <button type="button" class="btn btn-danger" @click="deleteItem">Delete</button>
        <button type="button" class="btn btn-info" @click="exportChanges">Export {{ activeSection }}</button>
        <button type="button" class="btn btn-warning" @click="resetData">Reset Data</button>
      </div>

      <div class="data-container">
        <div class="data-display">
          <h3 class="subsection-title">{{ activeSection }} Data</h3>
          <div v-if="activeSection === 'speech'" class="speech-settings">
            <div class="form-group">
              <label class="form-check-label">
                <input type="checkbox" v-model="speechSettings.enabled" @change="updateSpeechSettings" class="form-check-input">
                Enable Speech Synthesis
              </label>
            </div>
            
            <div class="form-group" v-if="speechSettings.enabled">
              <label>Voice Selection</label>
              <select v-model="speechSettings.selectedVoice" @change="updateSpeechSettings" class="form-control">
                <option v-for="voice in speechSettings.availableVoices" :key="voice.voiceURI" :value="voice">
                  {{ voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>
            
            <div class="form-group" v-if="speechSettings.enabled">
              <label>Volume ({{ speechSettings.volume }})</label>
              <input type="range" v-model="speechSettings.volume" @change="updateSpeechSettings" 
                     min="0" max="1" step="0.1" class="form-control">
            </div>
            
            <div class="form-group" v-if="speechSettings.enabled">
              <label>Speech Rate ({{ speechSettings.rate }})</label>
              <input type="range" v-model="speechSettings.rate" @change="updateSpeechSettings"
                     min="0.1" max="2" step="0.1" class="form-control">
            </div>
            
            <div class="form-group" v-if="speechSettings.enabled">
              <label>Pitch ({{ speechSettings.pitch }})</label>
              <input type="range" v-model="speechSettings.pitch" @change="updateSpeechSettings"
                     min="0.1" max="2" step="0.1" class="form-control">
            </div>
            
            <button @click="testSpeechSettings" class="btn btn-primary" v-if="speechSettings.enabled">
              Test Speech Settings
            </button>
          </div>
          <div v-else-if="activeSection === 'settlement'" class="settlement-settings">
            <h3 class="settings-title">Settlement Settings</h3>
            
            <div class="settings-group">
              <h4 class="group-title">Attack Settings</h4>
              <div class="form-group">
                <label>Attack Interval (minutes)</label>
                <div class="input-group">
                  <input type="number" v-model.number="settlement.attackInterval" @change="saveToLocalStorage" class="form-control" min="1">
                  <div class="input-group-append">
                    <span class="input-group-text">min</span>
                  </div>
                </div>
                <small class="form-text text-muted">How often settlements are attacked</small>
              </div>
              
              <div class="form-group">
                <label>Attack Chance (%)</label>
                <div class="input-group">
                  <input type="number" v-model.number="settlement.attackChance" @change="saveToLocalStorage" class="form-control" min="0" max="100">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
                <small class="form-text text-muted">Chance of being attacked when the interval expires</small>
              </div>
            </div>
            
            <div class="settings-group">
              <h4 class="group-title">Health Settings</h4>
              <div class="form-group">
                <label>Health Loss Per Hour</label>
                <div class="input-group">
                  <input type="number" v-model.number="settlement.healthLossPerHour" @change="saveToLocalStorage" class="form-control" min="0">
                  <div class="input-group-append">
                    <span class="input-group-text">HP/h</span>
                  </div>
                </div>
                <small class="form-text text-muted">Base health loss per hour</small>
              </div>
              
              <div class="form-group">
                <label>Radiation Damage Multiplier</label>
                <div class="input-group">
                  <input type="number" v-model.number="settlement.radiationDamageMultiplier" @change="saveToLocalStorage" class="form-control" min="0" step="0.1">
                  <div class="input-group-append">
                    <span class="input-group-text">x</span>
                  </div>
                </div>
                <small class="form-text text-muted">Multiplier for radiation damage (1 = normal)</small>
              </div>
            </div>
            
            <div class="settings-group">
              <h4 class="group-title">Resource Settings</h4>
              <div class="form-group">
                <label>Starting Resources</label>
                <input type="number" v-model.number="settlement.startingResources" @change="saveToLocalStorage" class="form-control" min="0">
                <small class="form-text text-muted">Resources given to new settlements</small>
              </div>
              
              <div class="form-group">
                <label>Max Resources</label>
                <input type="number" v-model.number="settlement.maxResources" @change="saveToLocalStorage" class="form-control" min="1">
                <small class="form-text text-muted">Maximum resources a settlement can hold</small>
              </div>
            </div>
            
            <div class="settings-group">
              <h4 class="group-title">Health Limits</h4>
              <div class="form-group">
                <label>Starting Health</label>
                <div class="input-group">
                  <input type="number" v-model.number="settlement.startingHealth" @change="saveToLocalStorage" class="form-control" min="1">
                  <div class="input-group-append">
                    <span class="input-group-text">HP</span>
                  </div>
                </div>
                <small class="form-text text-muted">Starting health for new settlements</small>
              </div>
              
              <div class="form-group">
                <label>Max Health</label>
                <div class="input-group">
                  <input type="number" v-model.number="settlement.maxHealth" @change="saveToLocalStorage" class="form-control" min="1">
                  <div class="input-group-append">
                    <span class="input-group-text">HP</span>
                  </div>
                </div>
                <small class="form-text text-muted">Maximum health for settlements</small>
              </div>
            </div>

            <div class="settings-group">
              <h4 class="group-title">Upgrade Costs</h4>
              
              <div class="upgrade-section">
                <h5 class="upgrade-title">Defence Upgrade</h5>
                <div class="form-group">
                  <label>Resource Type 1</label>
                  <select v-model="settlement.upgradeCosts.defences.resource1" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.defences.resource1Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Resource Type 2</label>
                  <select v-model="settlement.upgradeCosts.defences.resource2" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.defences.resource2Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Defence Increase Amount</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.defences.amount" class="form-control" min="1">
                </div>
                <div class="form-group">
                  <label>Money Cost</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.defences.moneyCost" class="form-control" min="0" placeholder="Money Cost">
                </div>
              </div>

              <div class="upgrade-section">
                <h5 class="upgrade-title">Power Upgrade</h5>
                <div class="form-group">
                  <label>Resource Type 1</label>
                  <select v-model="settlement.upgradeCosts.power.resource1" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.power.resource1Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Resource Type 2</label>
                  <select v-model="settlement.upgradeCosts.power.resource2" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.power.resource2Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Power Increase Amount</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.power.amount" class="form-control" min="1">
                </div>
                <div class="form-group">
                  <label>Money Cost</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.power.moneyCost" class="form-control" min="0" placeholder="Money Cost">
                </div>
              </div>

              <div class="upgrade-section">
                <h5 class="upgrade-title">Level Upgrade</h5>
                <div class="form-group">
                  <label>Resource Type 1</label>
                  <select v-model="settlement.upgradeCosts.level.resource1" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.level.resource1Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Resource Type 2</label>
                  <select v-model="settlement.upgradeCosts.level.resource2" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.level.resource2Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Health Increase</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.level.healthIncrease" class="form-control" min="1">
                </div>
                <div class="form-group">
                  <label>Inhabitants Increase</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.level.inhabitantsIncrease" class="form-control" min="1">
                </div>
                <div class="form-group">
                  <label>Defences Increase</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.level.defencesIncrease" class="form-control" min="1">
                </div>
                <div class="form-group">
                  <label>Power Increase</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.level.powerIncrease" class="form-control" min="1">
                </div>
                <div class="form-group">
                  <label>Money Cost</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.level.moneyCost" class="form-control" min="0" placeholder="Money Cost">
                </div>
              </div>

              <div class="upgrade-section">
                <h5 class="upgrade-title">Inhabitant Cost</h5>
                <div class="form-group">
                  <label>Resource Type 1</label>
                  <select v-model="settlement.upgradeCosts.inhabitant.resource1" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.inhabitant.resource1Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Resource Type 2</label>
                  <select v-model="settlement.upgradeCosts.inhabitant.resource2" class="form-control">
                    <option v-for="resource in availableResources" :key="resource.id" :value="resource.id">
                      {{ resource.name }}
                    </option>
                  </select>
                  <input type="number" v-model="settlement.upgradeCosts.inhabitant.resource2Amount" class="form-control" min="0" placeholder="Amount">
                </div>
                <div class="form-group">
                  <label>Money Cost</label>
                  <input type="number" v-model.number="settlement.upgradeCosts.inhabitant.moneyCost" class="form-control" min="0" placeholder="Money Cost">
                </div>
              </div>
            </div>
            
            <div class="settings-actions">
              <button @click="applySettlementSettings" class="btn btn-success">
                <i class="fas fa-save"></i> Apply Settings
              </button>
              <button @click="resetSectionData('settlement')" class="btn btn-danger">
                <i class="fas fa-undo"></i> Reset to Default
              </button>
            </div>
          </div>
          <div v-else class="data-navigation">
            <button class="btn btn-outline-primary" @click="prevItem" :disabled="currentIndex === 0">&lt;</button>
            <span>Item {{ currentIndex + 1 }} of {{ getActiveData.length }}</span>
            <button class="btn btn-outline-primary" @click="nextItem" :disabled="currentIndex === getActiveData.length - 1">&gt;</button>
          </div>
          <div v-if="activeSection !== 'speech' && activeSection !== 'settlement'" class="data-content">
            <pre>{{ JSON.stringify(currentItem, null, 2) }}</pre>
          </div>
        </div>
        <div class="data-form" v-if="activeSection !== 'speech' && activeSection !== 'settlement'">
          <h3 class="subsection-title">Edit {{ activeSection }}</h3>
          <form @submit.prevent="saveChanges">
            <div class="form-group" v-for="(value, key) in currentItem" :key="key">
              <label :for="key">{{ key }}</label>
              <template v-if="activeSection === 'quests' && (key === 'reward' || key === 'armorReward')">
                <div class="reward-list">
                  <div v-for="(itemId, index) in currentItem[key]" :key="index" class="reward-item">
                    {{ getItemName(key, itemId) }}
                    <button @click="removeReward(key, index)" class="btn btn-danger btn-sm">Remove</button>
                  </div>
                </div>
                <select v-model.number="selectedReward[key]" class="form-control">
                  <option value="">Select a reward</option>
                  <option v-for="option in getItemOptions(key)" :key="option.id" :value="option.id">
                    {{ option.name }}
                  </option>
                </select>
                <button @click="addReward(key)" class="btn btn-primary btn-sm">Add reward</button>
              </template>
              <template v-else-if="activeSection === 'story' && key === 'requiredEnemyDefeat'">
                <div class="enemy-defeat-container">
                  <div class="row">
                    <div class="col-md-8">
                      <label class="form-label">Required Enemy:</label>
                      <select v-model.number="getOrCreateEnemyDefeat(currentItem[key]).id" class="form-control">
                        <option value="">Select an enemy</option>
                        <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                          {{ enemy.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Count:</label>
                      <input v-model.number="getOrCreateEnemyDefeat(currentItem[key]).count" class="form-control" type="number" min="0" placeholder="Number of defeats">
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="activeSection === 'story' && key === 'steps'">
                <div class="story-steps-container">
                  <div v-for="(step, stepIndex) in ensureArray(currentItem[key])" :key="stepIndex" class="story-step mb-4">
                    <div class="step-header">
                      <h4 class="step-title">Step {{ stepIndex + 1 }}</h4>
                      <button v-if="stepIndex > 0" @click="removeStep(stepIndex)" class="btn btn-danger btn-sm">Remove Step</button>
                    </div>
                    
                    <div class="step-content">
                      <div class="npc-message mb-3">
                        <label class="form-label">NPC Message:</label>
                        <textarea v-model="step.npcMessage" class="form-control" rows="2" placeholder="Enter NPC's message"></textarea>
                      </div>
                      
                      <div class="player-options">
                        <h5 class="options-title mb-2">Player Options</h5>
                        <div v-for="(option, optionIndex) in ensureArray(step.playerOptions)" :key="optionIndex" class="player-option mb-3">
                          <div class="option-header d-flex justify-content-between align-items-center mb-2">
                            <h6 class="option-number mb-0">Option {{ optionIndex + 1 }}</h6>
                            <button v-if="step.playerOptions.length > 1" @click="removePlayerOption(stepIndex, optionIndex)" class="btn btn-danger btn-sm">Remove Option</button>
                          </div>
                          
                          <div class="option-content">
                            <div class="mb-2">
                              <label class="form-label">Option Text:</label>
                              <input v-model="option.text" class="form-control" placeholder="Enter player's response">
                            </div>
                            
                            <div class="mb-2">
                              <label class="form-label">Next Step ID:</label>
                              <input v-model.number="option.nextId" class="form-control" type="number" placeholder="Enter next step ID or leave empty for end">
                            </div>
                            
                            <div class="option-actions d-flex gap-2 mb-2">
                              <div class="form-check">
                                <input type="checkbox" v-model="option.giveReward" :id="'giveReward-' + stepIndex + '-' + optionIndex" class="form-check-input">
                                <label class="form-check-label" :for="'giveReward-' + stepIndex + '-' + optionIndex">Give Reward</label>
                              </div>
                              
                              <div class="form-check">
                                <input type="checkbox" 
                                       v-model="option.action" 
                                       :true-value="'startEnemyBattle'" 
                                       :false-value="null" 
                                       :id="'action-' + stepIndex + '-' + optionIndex" 
                                       class="form-check-input"
                                       @change="handleActionChange(option)">
                                <label class="form-check-label" :for="'action-' + stepIndex + '-' + optionIndex">Start Enemy Battle</label>
                              </div>
                            </div>
                            
                            <div v-if="option.action === 'startEnemyBattle'" class="mb-2">
                              <label class="form-label">Select Enemy:</label>
                              <select 
                                v-model.number="getOrCreateActionParams(option).enemyId" 
                                class="form-control">
                                <option value="">Select an enemy</option>
                                <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                                  {{ enemy.name }}
                                </option>
                              </select>
                            </div>
                            
                            <div class="required-resources">
                              <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="mb-0">Required Resources</h6>
                                <button @click="addRequiredResource(option)" class="btn btn-primary btn-sm">Add Resource</button>
                              </div>
                              
                              <div v-for="(resource, resourceIndex) in ensureArray(option.requiredResources)" :key="resourceIndex" class="resource-item mb-2">
                                <div class="d-flex gap-2">
                                  <select v-model.number="resource.id" class="form-control">
                                    <option value="">Select resource</option>
                                    <option v-for="resourceOption in resources" :key="resourceOption.id" :value="resourceOption.id">
                                      {{ resourceOption.name }}
                                    </option>
                                  </select>
                                  <input v-model.number="resource.amount" class="form-control" type="number" min="1" placeholder="Amount">
                                  <button @click="removeRequiredResource(option, resourceIndex)" class="btn btn-danger btn-sm">Remove</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button @click="addPlayerOption(stepIndex)" class="btn btn-primary btn-sm">Add Player Option</button>
                      </div>
                    </div>
                  </div>
                  <button @click="addStep" class="btn btn-primary">Add New Step</button>
                </div>
              </template>
              <template v-else-if="activeSection === 'story' && key === 'reward'">
                <div class="story-reward-container">
                  <div class="basic-rewards mb-3">
                    <div class="row">
                      <div class="col-md-6">
                        <label class="form-label">Experience:</label>
                        <input v-model.number="currentItem[key].exp" class="form-control" type="number" min="0" placeholder="Experience points">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Money:</label>
                        <input v-model.number="currentItem[key].money" class="form-control" type="number" min="0" placeholder="Money amount">
                      </div>
                    </div>
                  </div>
                  
                  <div v-for="rewardKey in ['resourceRewards', 'weaponRewards', 'armorRewards', 'aidRewards']" :key="rewardKey" class="reward-section mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="mb-0">{{ formatRewardTitle(rewardKey) }}</h6>
                      <button @click="addRewardItem(rewardKey)" class="btn btn-primary btn-sm">Add {{ formatRewardTitle(rewardKey, true) }}</button>
                    </div>
                    
                    <div v-for="(reward, index) in ensureArray(currentItem[key][rewardKey])" :key="index" class="reward-item mb-2">
                      <div class="d-flex gap-2">
                        <select v-model.number="reward.id" class="form-control">
                          <option value="">Select {{ formatRewardTitle(rewardKey, true) }}</option>
                          <option v-for="option in getRewardOptions(rewardKey)" :key="option.id" :value="option.id">
                            {{ option.name }}
                          </option>
                        </select>
                        <input v-if="rewardKey === 'resourceRewards'" 
                               v-model.number="reward.amount" class="form-control" type="number" min="1" placeholder="Amount">
                        <button @click="removeRewardItem(rewardKey, index)" class="btn btn-danger btn-sm">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else-if="key === 'playerChoices'">
                <div class="player-choices-container mb-3">
                  <label class="form-label">Player Choices (Auto-generated)</label>
                  <div class="choices-list">
                    <div v-for="(choice, index) in currentItem[key]" :key="index" class="choice-item">
                      {{ choice }}
                    </div>
                  </div>
                </div>
              </template>
              <input v-else-if="key === 'id'" v-model.number="currentItem[key]" class="form-control" readonly>
              <input v-else-if="isNumeric(key)" v-model.number="currentItem[key]" class="form-control">
              <input v-else-if="typeof value !== 'object' && typeof value !== 'boolean'" :id="key" v-model="currentItem[key]" class="form-control">
              <textarea v-else-if="typeof value === 'object' && key !== 'reward' && key !== 'armorReward' && key !== 'requiredEnemyDefeat' && key !== 'steps'" :id="key" v-model="currentItem[key]" class="form-control" rows="3"></textarea>
              <input v-else-if="typeof value === 'boolean'" type="checkbox" :id="key" v-model="currentItem[key]" class="form-check-input">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
/* eslint-disable */
import { v4 as uuidv4 } from 'uuid';
import questsData from '@/store/quests.js';
import itemsData from '@/store/items.js';
import storyData from '@/store/story.js';
import armorData from '@/store/armor.js';
import aidData from '@/store/aid.js';
import resourcesData from '@/store/ressources.js';
import enemyData from '@/store/enemy.js';
import StoryTemplates from './data/templates/StoryTemplates.vue';
import QuestTemplates from './data/templates/QuestTemplates.vue';
import EnemyTemplates from './data/templates/EnemyTemplates.vue';
import ResourceTemplates from './data/templates/ResourceTemplates.vue';
import AidTemplates from './data/templates/AidTemplates.vue';
import ArmorTemplates from './data/templates/ArmorTemplates.vue';
import WeaponTemplates from './data/templates/WeaponTemplates.vue';
import { mapState } from 'vuex';

export default {
  name: 'GameSettings',
  components: {
    StoryTemplates,
    QuestTemplates,
    EnemyTemplates,
    ResourceTemplates,
    AidTemplates,
    ArmorTemplates,
    WeaponTemplates,
  },
  data() {
    return {
      activeSection: 'quests',
      sections: ['quests', 'items', 'story', 'armor', 'aid', 'resources', 'enemies', 'speech', 'settlement'],
      quests: [],
      items: [],
      story: [],
      armor: [],
      aid: [],
      resources: [],
      enemies: [],
      settlement: {
        attackInterval: 1,
        healthLossPerHour: 1,
        radiationDamageMultiplier: 1,
        startingHealth: 100,
        maxHealth: 100,
        startingResources: 0,
        maxResources: 1000,
        attackChance: 100,
        upgradeCosts: {
          defences: {
            resource1: 1,
            resource1Amount: 30,
            resource2: 2,
            resource2Amount: 50,
            amount: 10,
            moneyCost: 0
          },
          power: {
            resource1: 1,
            resource1Amount: 40,
            resource2: 2,
            resource2Amount: 40,
            amount: 10,
            moneyCost: 0
          },
          level: {
            resource1: 1,
            resource1Amount: 100,
            resource2: 2,
            resource2Amount: 100,
            healthIncrease: 50,
            inhabitantsIncrease: 5,
            defencesIncrease: 25,
            powerIncrease: 25,
            moneyCost: 0
          },
          inhabitant: {
            resource1: 1,
            resource1Amount: 50,
            resource2: 2,
            resource2Amount: 30,
            moneyCost: 0
          }
        }
      },
      currentIndex: 0,
      selectedReward: {
        reward: '',
        armorReward: ''
      },
      numericFields: ['id', 'exp', 'money', 'duration', 'progress', 'rewardChance', 'armorRewardChance', 'levelRequirement', 'attack', 'defence', 'health', 'price', 'quantity', 'requiredStoryLineId', 'enemyHealth', 'defense'],
      showStoryTemplates: false,
      showQuestTemplates: false,
      showEnemyTemplates: false,
      showResourceTemplates: false,
      showAidTemplates: false,
      showArmorTemplates: false,
      showWeaponTemplates: false,
      // Speech synthesis settings
      speechSettings: {
        enabled: true,
        selectedVoice: null,
        volume: 1.0,
        rate: 1.0,
        pitch: 1.0,
        availableVoices: []
      },
    };
  },
  computed: {
    ...mapState(['resources']),
    getActiveData() {
      return this.activeSection === 'speech' ? [] : this[this.activeSection];
    },
    currentItem() {
      if (this.activeSection === 'speech') {
        return this.speechSettings;
      }
      return this.getActiveData[this.currentIndex] || {};
    },
    availableResources() {
      return this.$store.state.resources;
    }
  },
  methods: {
    isNumeric(key) {
      return this.numericFields.includes(key);
    },
    changeSection(section) {
      this.activeSection = section;
      this.currentIndex = 0;
    },
    prevItem() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    nextItem() {
      if (this.currentIndex < this.getActiveData.length - 1) {
        this.currentIndex++;
      }
    },
    saveChanges() {
      if (this.activeSection === 'story') {
        this.updatePlayerChoices();
        this.processStoryData(this.currentItem);
      }
      this.getActiveData[this.currentIndex] = this.convertToNumbers({ ...this.currentItem });
      this.saveToLocalStorage();
      alert('Changes saved locally!');
    },
    convertToNumbers(item) {
      for (let key in item) {
        if (this.isNumeric(key)) {
          item[key] = item[key] === '' || item[key] === null ? null : Number(item[key]);
        } else if (typeof item[key] === 'object' && item[key] !== null) {
          item[key] = this.convertToNumbers(item[key]);
        }
      }
      return item;
    },
    processStoryData(item) {
      if (item.steps) {
        item.steps.forEach(step => {
          if (step.playerOptions) {
            step.playerOptions.forEach(option => {
              if (option.nextId === "") {
                option.nextId = null;
              } else if (option.nextId !== null) {
                option.nextId = parseInt(option.nextId);
              }
              if (option.action === 'startEnemyBattle') {
                if (!option.actionParams) {
                  option.actionParams = { enemyId: null };
                }
              } else {
                delete option.actionParams;
              }
            });
          }
        });
      }
    },
    deleteItem() {
      if (confirm('Are you sure you want to delete this item?')) {
        this.getActiveData.splice(this.currentIndex, 1);
        this.updateIds();
        if (this.currentIndex >= this.getActiveData.length) {
          this.currentIndex = Math.max(0, this.getActiveData.length - 1);
        }
        this.saveToLocalStorage();
        alert('Item deleted successfully!');
      }
    },
    addNewItem() {
      switch(this.activeSection) {
        case 'story':
          this.showStoryTemplates = true;
          break;
        case 'quests':
          this.showQuestTemplates = true;
          break;
        case 'enemies':
          this.showEnemyTemplates = true;
          break;
        case 'resources':
          this.showResourceTemplates = true;
          break;
        case 'aid':
          this.showAidTemplates = true;
          break;
        case 'armor':
          this.showArmorTemplates = true;
          break;
        case 'items':
          this.showWeaponTemplates = true;
          break;
        default:
          const newItem = this.createNewItem();
          this.getActiveData.push(newItem);
          this.currentIndex = this.getActiveData.length - 1;
          this.saveToLocalStorage();
      }
    },
    createNewItem() {
      const newId = this.getNextId();
      const baseItem = {
        id: newId,
      };

      switch (this.activeSection) {
        case 'quests':
          return {
            ...baseItem,
            name: 'New Quest',
            desc: 'Quest description',
            exp: 0,
            money: 0,
            duration: 0,
            progress: 0,
            state: 'not-started',
            claimed: false,
            disabled: false,
            reward: [],
            rewardChance: 0,
            armorReward: [],
            armorRewardChance: 0,
            levelRequirement: 1,
          };
        case 'items':
        case 'armor':
          return {
            ...baseItem,
            uuid: uuidv4(),
            name: 'New Item',
            desc: 'Item description',
            attack: this.activeSection === 'items' ? 1 : 0,
            defence: this.activeSection === 'armor' ? 1 : 0,
            state: 'none',
            price: 0
          };
        case 'story':
          return {
            id: newId,
            name: 'New Story',
            levelRequirement: 1,
            completed: false,
            requiredStoryLineId: null,
            playerChoices: [],
            steps: [
              {
                npcMessage: 'New NPC message',
                playerOptions: [
                  { 
                    text: 'New player option', 
                    nextId: null,
                    requiredResources: [],
                    giveReward: false,
                    action: null,
                    actionParams: {}
                  }
                ]
              }
            ],
            requiredEnemyDefeat: { id: null, count: 0 },
            reward: {
              exp: 0,
              money: 0,
              resourceRewards: [],
              weaponRewards: [],
              armorRewards: [],
              aidRewards: [],
            },
            alwaysGiveReward: false,
          };
        case 'aid':
          return {
            ...baseItem,
            uuid: uuidv4(),
            name: 'New Aid Item',
            desc: 'Aid item description',
            health: 0,
            state: 'none',
            price: 0
          };
        case 'resources':
          return {
            ...baseItem,
            uuid: uuidv4(),
            name: 'New Resource',
            desc: 'Resource description',
            state: 'none',
            price: 0,
            quantity: 0,
          };
        case 'enemies':
          return {
            id: newId,
            name: 'New Enemy',
            enemyHealth: 100,
            attack: 10,
            defense: 5,
            exp: 50,
            money: 10,
          };
        case 'armor':
          return {
            ...baseItem,
            uuid: uuidv4(),
            name: 'New Armor',
            desc: 'Armor description',
            attack: 0,
            defence: 0,
            state: 'none',
            price: 0,
            img: '',
          };
        case 'items':
          return {
            ...baseItem,
            uuid: uuidv4(),
            name: 'New Weapon',
            desc: 'Weapon description',
            attack: 10,
            defence: 5,
            state: 'none',
            price: 0
          };
        default:
          return baseItem;
      }
    },
    getNextId() {
      const ids = this.getActiveData.map(item => item.id);
      return ids.length > 0 ? Math.max(...ids) + 1 : 0;
    },
    updateIds() {
      this.getActiveData.forEach((item, index) => {
        item.id = index;
      });
    },
    getItemOptions(key) {
      if (key === 'reward') {
        return this.items;
      } else if (key === 'armorReward') {
        return this.armor;
      }
      return [];
    },
    addReward(key) {
      if (this.selectedReward[key]) {
        if (!Array.isArray(this.currentItem[key])) {
          this.currentItem[key] = [];
        }
        this.currentItem[key].push(parseInt(this.selectedReward[key]));
        this.selectedReward[key] = '';
      }
    },
    removeReward(key, index) {
      this.currentItem[key].splice(index, 1);
    },
    getItemName(key, itemId) {
      const items = this.getItemOptions(key);
      const item = items.find(i => i.id === itemId);
      return item ? item.name : 'Unknown';
    },
    calculateNextStepId(currentSteps) {
      if (!currentSteps || currentSteps.length === 0) return 2;
      const lastStep = currentSteps[currentSteps.length - 1];
      const lastOptions = lastStep.playerOptions || [];
      const existingNextIds = lastOptions
        .map(opt => opt.nextId)
        .filter(id => id !== null);
      return existingNextIds.length > 0 ? Math.max(...existingNextIds) + 1 : null;
    },
    addStep() {
      if (!Array.isArray(this.currentItem.steps)) {
        this.currentItem.steps = [];
      }
      this.currentItem.steps.push({
        npcMessage: 'New NPC message',
        playerOptions: [{
          text: 'New player option',
          nextId: null,
          requiredResources: [],
          giveReward: false,
          action: null,
          actionParams: null
        }]
      });
    },
    addPlayerOption(stepIndex) {
      if (!this.currentItem.steps[stepIndex].playerOptions) {
        this.currentItem.steps[stepIndex].playerOptions = [];
      }
      this.currentItem.steps[stepIndex].playerOptions.push({
        text: 'New player option',
        nextId: null,
        requiredResources: [],
        giveReward: false,
        action: null,
        actionParams: null
      });
      this.updatePlayerChoices();
    },
    addRequiredResource(option) {
      const resources = this.getOrCreateRequiredResources(option);
      resources.push({ id: null, amount: 1 });
    },
    removeRequiredResource(option, index) {
      const resources = this.getOrCreateRequiredResources(option);
      resources.splice(index, 1);
    },
    saveToLocalStorage() {
      localStorage.setItem(this.activeSection, JSON.stringify(this.getActiveData));
    },
    loadFromLocalStorage() {
      for (const section of this.sections) {
        const savedData = localStorage.getItem(section);
        if (savedData) {
          if (section === 'settlement') {
            this[section] = this.convertToNumbers(JSON.parse(savedData));
          } else {
            this[section] = JSON.parse(savedData).map(item => this.convertToNumbers(item));
          }
        } else {
          this.resetSectionData(section);
        }
      }
    },
    exportChanges() {
      const section = this.activeSection;
      const data = this[section].map(item => this.convertToNumbers(item));
      const fileName = `${section}.js`;
      let content;

      if (section === 'story') {
        const processedData = data.map(item => {
          const processedItem = { ...item };
          this.processStoryData(processedItem);
          const { uuid, ...itemWithoutUuid } = processedItem;
          return itemWithoutUuid;
        });
        content = 'export default ' + JSON.stringify(processedData, null, 2) + ';';
      } else if (section === 'quests') {
        content = 'export default ' + JSON.stringify(data, null, 2) + ';';
      } else if (section === 'enemies') {
        content = 'export default ' + JSON.stringify(data, null, 2) + ';';
      } else if (section === 'items' || section === 'armor' || section === 'aid' || section === 'resources') {
        content = `import { v4 as uuidv4 } from 'uuid';\n\nexport default ${JSON.stringify(data.map(item => ({
          ...item,
          uuid: 'uuidv4()'
        })), null, 2).replace(/"uuidv4\(\)"/g, 'uuidv4()')};`;
      } else {
        content = 'export default ' + JSON.stringify(data, null, 2) + ';';
      }

      this.downloadFile(fileName, content);
    },
    downloadFile(fileName, content) {
      const blob = new Blob([content], { type: 'text/javascript' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    addRewardItem(rewardKey) {
      const rewards = this.getOrCreateRewardArray(this.currentItem.reward, rewardKey);
      const newReward = { id: null };
      if (rewardKey === 'resourceRewards') {
        newReward.amount = 1;
      }
      rewards.push(newReward);
    },
    removeRewardItem(rewardKey, index) {
      const rewards = this.getOrCreateRewardArray(this.currentItem.reward, rewardKey);
      rewards.splice(index, 1);
    },
    goToMainMenu() {
      this.$router.push('/');
    },
    getRewardOptions(rewardKey) {
      switch (rewardKey) {
        case 'resourceRewards':
          return this.resources;
        case 'weaponRewards':
          return this.items;
        case 'armorRewards':
          return this.armor;
        case 'aidRewards':
          return this.aid;
        default:
          return [];
      }
    },
    resetData() {
      if (confirm('Are you sure you want to reset all data? This will remove all local changes.')) {
        for (const section of this.sections) {
          this.resetSectionData(section);
        }
        this.currentIndex = 0;
        
        // Reinitialize speech settings with defaults after reset
        this.speechSettings = {
          enabled: true,
          selectedVoice: null,
          volume: 1.0,
          rate: 1.0,
          pitch: 1.0,
          availableVoices: []
        };
        this.initializeSpeechSettings();
        
        alert('All data has been reset to original values.');
      }
    },
    resetSectionData(section) {
      switch (section) {
        case 'settlement':
          this.settlement = {
            attackInterval: 1,
            healthLossPerHour: 1,
            radiationDamageMultiplier: 1,
            startingHealth: 100,
            maxHealth: 100,
            startingResources: 0,
            maxResources: 1000,
            attackChance: 100,
            upgradeCosts: {
              defences: {
                resource1: 1,
                resource1Amount: 30,
                resource2: 2,
                resource2Amount: 50,
                amount: 10,
                moneyCost: 0
              },
              power: {
                resource1: 1,
                resource1Amount: 40,
                resource2: 2,
                resource2Amount: 40,
                amount: 10,
                moneyCost: 0
              },
              level: {
                resource1: 1,
                resource1Amount: 100,
                resource2: 2,
                resource2Amount: 100,
                healthIncrease: 50,
                inhabitantsIncrease: 5,
                defencesIncrease: 25,
                powerIncrease: 25,
                moneyCost: 0
              },
              inhabitant: {
                resource1: 1,
                resource1Amount: 50,
                resource2: 2,
                resource2Amount: 30,
                moneyCost: 0
              }
            }
          };
          break;
        case 'quests':
          this.quests = JSON.parse(JSON.stringify(questsData)).map(item => this.convertToNumbers(item));
          break;
        case 'items':
          this.items = JSON.parse(JSON.stringify(itemsData)).map(item => this.convertToNumbers(item));
          break;
        case 'story':
          this.story = JSON.parse(JSON.stringify(storyData)).map(item => this.convertToNumbers(item));
          break;
        case 'armor':
          this.armor = JSON.parse(JSON.stringify(armorData)).map(item => this.convertToNumbers(item));
          break;
        case 'aid':
          this.aid = JSON.parse(JSON.stringify(aidData)).map(item => this.convertToNumbers(item));
          break;
        case 'resources':
          this.resources = JSON.parse(JSON.stringify(resourcesData)).map(item => this.convertToNumbers(item));
          break;
        case 'enemies':
          this.enemies = JSON.parse(JSON.stringify(enemyData)).map(item => this.convertToNumbers(item));
          break;
      }
      localStorage.removeItem(section);
    },
    handleTemplateSelect(template) {
      const newStory = {
        ...template.template,
        id: this.getNextId()
      };
      
      this.getActiveData.push(newStory);
      this.currentIndex = this.getActiveData.length - 1;
      this.saveToLocalStorage();
      this.showStoryTemplates = false;
    },
    handleQuestTemplateSelect(template) {
      const newQuest = {
        ...template.template,
        id: this.getNextId(),
        lat: 350 + Math.random() * 450,
        lon: 300 + Math.random() * 1300
      };
      
      this.getActiveData.push(newQuest);
      this.currentIndex = this.getActiveData.length - 1;
      this.saveToLocalStorage();
      this.showQuestTemplates = false;
    },
    handleEnemyTemplateSelect(template) {
      const newEnemy = {
        id: this.getNextId(),
        name: template.name,
        enemyHealth: template.enemyHealth,
        attack: template.attack,
        defense: template.defense,
        exp: template.exp,
        money: template.money
      };
      
      this.enemies.push(newEnemy);
      this.currentIndex = this.enemies.length - 1;
      this.saveToLocalStorage();
      this.showEnemyTemplates = false;
    },
    handleResourceTemplateSelect(template) {
      const newResource = {
        id: this.getNextId(),
        uuid: uuidv4(),
        name: template.template.name,
        desc: template.template.desc,
        state: template.template.state,
        price: template.template.price,
        quantity: template.template.quantity
      };

      this.resources.push(newResource);
      this.saveToLocalStorage();
      this.showResourceTemplates = false;
    },
    handleAidTemplateSelect(template) {
      const newAid = {
        id: this.getNextId(),
        uuid: uuidv4(),
        name: template.name,
        desc: template.desc,
        health: template.health,
        state: template.state,
        price: template.price,
        img: template.img
      };
      
      this.aid.push(newAid);
      this.currentIndex = this.aid.length - 1;
      this.saveToLocalStorage();
      this.showAidTemplates = false;
    },
    handleArmorTemplateSelect(template) {
      const newArmor = {
        id: this.getNextId(),
        uuid: uuidv4(),
        name: template.name,
        desc: template.desc,
        attack: template.attack,
        defence: template.defence,
        state: template.state,
        price: template.price,
        img: template.img
      };
      
      this.armor.push(newArmor);
      this.currentIndex = this.armor.length - 1;
      this.saveToLocalStorage();
      this.showArmorTemplates = false;
    },
    handleWeaponTemplateSelect(template) {
      const newWeapon = {
        id: this.getNextId(),
        uuid: uuidv4(),
        name: template.name,
        desc: template.desc,
        attack: template.attack,
        defence: template.defence,
        state: template.state,
        price: template.price,
        img: template.img
      };
      
      this.items.push(newWeapon);
      this.currentIndex = this.items.length - 1;
      this.saveToLocalStorage();
      this.showWeaponTemplates = false;
    },
    initializeSpeechSettings() {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Filter for English voices only
        const englishVoices = voices.filter(voice => 
          voice.lang.startsWith('en-')
        );
        
        // Remove duplicates by voiceURI
        const uniqueVoices = Array.from(new Map(englishVoices.map(voice => [voice.voiceURI, voice])).values());
        
        // Sort voices to prioritize Karen first
        const sortedVoices = uniqueVoices.sort((a, b) => {
          // Karen should always be first
          if (a.name === 'Karen') return -1;
          if (b.name === 'Karen') return 1;
          return 0;
        });
        
        this.speechSettings.availableVoices = sortedVoices;
        
        // Set default voice if none is selected
        if (!this.speechSettings.selectedVoice && sortedVoices.length > 0) {
          // Try to find Karen first
          let defaultVoice = sortedVoices.find(v => v.name === 'Karen');
          
          // If Karen not found, use any English voice
          if (!defaultVoice) {
            defaultVoice = sortedVoices[0];
          }
          
          this.speechSettings.selectedVoice = defaultVoice;
          this.saveSpeechSettings();
        }
      };

      // Initial load of voices
      loadVoices();

      // Some browsers need the onvoiceschanged event
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Load saved settings
      this.loadSpeechSettings();
    },
    saveSpeechSettings() {
      const settings = {
        enabled: this.speechSettings.enabled,
        volume: this.speechSettings.volume,
        rate: this.speechSettings.rate,
        pitch: this.speechSettings.pitch,
        selectedVoiceURI: this.speechSettings.selectedVoice?.voiceURI
      };
      localStorage.setItem('speechSettings', JSON.stringify(settings));
    },
    loadSpeechSettings() {
      const savedSettings = localStorage.getItem('speechSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.speechSettings.enabled = settings.enabled;
        this.speechSettings.volume = settings.volume;
        this.speechSettings.rate = settings.rate;
        this.speechSettings.pitch = settings.pitch;
        
        // Restore selected voice if available
        if (settings.selectedVoiceURI) {
          const voice = this.speechSettings.availableVoices.find(v => v.voiceURI === settings.selectedVoiceURI);
          if (voice) {
            this.speechSettings.selectedVoice = voice;
          }
        }
      }
    },
    updateSpeechSettings() {
      this.saveSpeechSettings();
      // Test the current settings
      this.testSpeechSettings();
    },
    testSpeechSettings() {
      if (!this.speechSettings.enabled) return;
      
      console.log('Current voice:', this.speechSettings.selectedVoice?.name);
      const testMessage = "This is a test message for speech synthesis.";
      const utterance = new SpeechSynthesisUtterance(testMessage);
      
      if (this.speechSettings.selectedVoice) {
        utterance.voice = this.speechSettings.selectedVoice;
      }
      
      utterance.volume = this.speechSettings.volume;
      utterance.rate = this.speechSettings.rate;
      utterance.pitch = this.speechSettings.pitch;
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Speak the test message
      window.speechSynthesis.speak(utterance);
    },
    getOrCreateActionParams(option) {
      if (!option.actionParams) {
        option.actionParams = { enemyId: null };
      }
      return option.actionParams;
    },
    getOrCreateRequiredResources(option) {
      if (!option.requiredResources) {
        option.requiredResources = [];
      }
      return option.requiredResources;
    },
    getOrCreateReward(reward) {
      if (!reward) {
        return { exp: 0, money: 0 };
      }
      if (typeof reward.exp === 'undefined') {
        reward.exp = 0;
      }
      if (typeof reward.money === 'undefined') {
        reward.money = 0;
      }
      return reward;
    },
    getOrCreateRewardArray(reward, rewardKey) {
      if (!reward[rewardKey]) {
        reward[rewardKey] = [];
      }
      return reward[rewardKey];
    },
    getOrCreateEnemyDefeat(enemyDefeat) {
      if (!enemyDefeat) {
        return { id: null, count: 0 };
      }
      if (typeof enemyDefeat.id === 'undefined') {
        enemyDefeat.id = null;
      }
      if (typeof enemyDefeat.count === 'undefined') {
        enemyDefeat.count = 0;
      }
      return enemyDefeat;
    },
    formatRewardTitle(rewardKey, singular = false) {
      const base = rewardKey.replace('Rewards', '');
      return base.charAt(0).toUpperCase() + base.slice(1) + (singular ? '' : ' Rewards');
    },
    removeStep(stepIndex) {
      if (confirm('Are you sure you want to remove this step? This action cannot be undone.')) {
        this.currentItem.steps.splice(stepIndex, 1);
        // Update nextId references
        this.currentItem.steps.forEach(step => {
          if (step.playerOptions) {
            step.playerOptions.forEach(option => {
              if (option.nextId > stepIndex + 1) {
                option.nextId -= 1;
              } else if (option.nextId === stepIndex + 1) {
                option.nextId = null;
              }
            });
          }
        });
      }
    },
    removePlayerOption(stepIndex, optionIndex) {
      if (confirm('Are you sure you want to remove this option? This action cannot be undone.')) {
        this.currentItem.steps[stepIndex].playerOptions.splice(optionIndex, 1);
        this.updatePlayerChoices();
      }
    },
    ensureArray(arr) {
      return Array.isArray(arr) ? arr : [];
    },
    handleActionChange(option) {
      if (option.action === 'startEnemyBattle') {
        option.actionParams = { enemyId: null };
      } else {
        option.actionParams = null;
      }
    },
    updatePlayerChoices() {
      if (this.currentItem && this.currentItem.steps) {
        const choices = this.currentItem.steps.reduce((acc, step) => {
          if (step.playerOptions) {
            step.playerOptions.forEach(option => {
              if (option.text && !acc.includes(option.text)) {
                acc.push(option.text);
              }
            });
          }
          return acc;
        }, []);
        this.currentItem.playerChoices = choices;
      }
    },
    applySettlementSettings() {
      // Convert all values to numbers to ensure correct type
      const settings = {
        attackInterval: Number(this.settlement.attackInterval),
        healthLossPerHour: Number(this.settlement.healthLossPerHour),
        radiationDamageMultiplier: Number(this.settlement.radiationDamageMultiplier),
        startingHealth: Number(this.settlement.startingHealth),
        maxHealth: Number(this.settlement.maxHealth),
        startingResources: Number(this.settlement.startingResources),
        maxResources: Number(this.settlement.maxResources),
        attackChance: Number(this.settlement.attackChance),
        upgradeCosts: {
          defences: {
            resource1: Number(this.settlement.upgradeCosts.defences.resource1),
            resource1Amount: Number(this.settlement.upgradeCosts.defences.resource1Amount),
            resource2: Number(this.settlement.upgradeCosts.defences.resource2),
            resource2Amount: Number(this.settlement.upgradeCosts.defences.resource2Amount),
            amount: Number(this.settlement.upgradeCosts.defences.amount),
            moneyCost: Number(this.settlement.upgradeCosts.defences.moneyCost)
          },
          power: {
            resource1: Number(this.settlement.upgradeCosts.power.resource1),
            resource1Amount: Number(this.settlement.upgradeCosts.power.resource1Amount),
            resource2: Number(this.settlement.upgradeCosts.power.resource2),
            resource2Amount: Number(this.settlement.upgradeCosts.power.resource2Amount),
            amount: Number(this.settlement.upgradeCosts.power.amount),
            moneyCost: Number(this.settlement.upgradeCosts.power.moneyCost)
          },
          level: {
            resource1: Number(this.settlement.upgradeCosts.level.resource1),
            resource1Amount: Number(this.settlement.upgradeCosts.level.resource1Amount),
            resource2: Number(this.settlement.upgradeCosts.level.resource2),
            resource2Amount: Number(this.settlement.upgradeCosts.level.resource2Amount),
            healthIncrease: Number(this.settlement.upgradeCosts.level.healthIncrease),
            inhabitantsIncrease: Number(this.settlement.upgradeCosts.level.inhabitantsIncrease),
            defencesIncrease: Number(this.settlement.upgradeCosts.level.defencesIncrease),
            powerIncrease: Number(this.settlement.upgradeCosts.level.powerIncrease),
            moneyCost: Number(this.settlement.upgradeCosts.level.moneyCost)
          },
          inhabitant: {
            resource1: Number(this.settlement.upgradeCosts.inhabitant.resource1),
            resource1Amount: Number(this.settlement.upgradeCosts.inhabitant.resource1Amount),
            resource2: Number(this.settlement.upgradeCosts.inhabitant.resource2),
            resource2Amount: Number(this.settlement.upgradeCosts.inhabitant.resource2Amount),
            moneyCost: Number(this.settlement.upgradeCosts.inhabitant.moneyCost)
          }
        }
      };

      // Save to Vuex store
      this.$store.commit('settlement/updateSettings', settings);
      
      // Save to localStorage
      localStorage.setItem('settlementSettings', JSON.stringify(settings));
      
      alert('Settlement settings have been applied!');
    },
  },
  mounted() {
    this.loadFromLocalStorage();
    this.initializeSpeechSettings();
    
    // Load settlement settings from localStorage or use defaults
    const savedSettlementSettings = localStorage.getItem('settlementSettings');
    if (savedSettlementSettings) {
      try {
        const settings = JSON.parse(savedSettlementSettings);
        // Ensure all values are numbers
        this.settlement = {
          attackInterval: Number(settings.attackInterval || 1),
          healthLossPerHour: Number(settings.healthLossPerHour || 1),
          radiationDamageMultiplier: Number(settings.radiationDamageMultiplier || 1),
          startingHealth: Number(settings.startingHealth || 100),
          maxHealth: Number(settings.maxHealth || 100),
          startingResources: Number(settings.startingResources || 0),
          maxResources: Number(settings.maxResources || 1000),
          attackChance: Number(settings.attackChance || 100),
          upgradeCosts: {
            defences: {
              resource1: Number(settings.upgradeCosts.defences.resource1 || 1),
              resource1Amount: Number(settings.upgradeCosts.defences.resource1Amount || 30),
              resource2: Number(settings.upgradeCosts.defences.resource2 || 2),
              resource2Amount: Number(settings.upgradeCosts.defences.resource2Amount || 50),
              amount: Number(settings.upgradeCosts.defences.amount || 10),
              moneyCost: Number(settings.upgradeCosts.defences.moneyCost || 0)
            },
            power: {
              resource1: Number(settings.upgradeCosts.power.resource1 || 1),
              resource1Amount: Number(settings.upgradeCosts.power.resource1Amount || 40),
              resource2: Number(settings.upgradeCosts.power.resource2 || 2),
              resource2Amount: Number(settings.upgradeCosts.power.resource2Amount || 40),
              amount: Number(settings.upgradeCosts.power.amount || 10),
              moneyCost: Number(settings.upgradeCosts.power.moneyCost || 0)
            },
            level: {
              resource1: Number(settings.upgradeCosts.level.resource1 || 1),
              resource1Amount: Number(settings.upgradeCosts.level.resource1Amount || 100),
              resource2: Number(settings.upgradeCosts.level.resource2 || 2),
              resource2Amount: Number(settings.upgradeCosts.level.resource2Amount || 100),
              healthIncrease: Number(settings.upgradeCosts.level.healthIncrease || 50),
              inhabitantsIncrease: Number(settings.upgradeCosts.level.inhabitantsIncrease || 5),
              defencesIncrease: Number(settings.upgradeCosts.level.defencesIncrease || 25),
              powerIncrease: Number(settings.upgradeCosts.level.powerIncrease || 25),
              moneyCost: Number(settings.upgradeCosts.level.moneyCost || 0)
            },
            inhabitant: {
              resource1: Number(settings.upgradeCosts.inhabitant.resource1 || 1),
              resource1Amount: Number(settings.upgradeCosts.inhabitant.resource1Amount || 50),
              resource2: Number(settings.upgradeCosts.inhabitant.resource2 || 2),
              resource2Amount: Number(settings.upgradeCosts.inhabitant.resource2Amount || 30),
              moneyCost: Number(settings.upgradeCosts.inhabitant.moneyCost || 0)
            }
          }
        };
      } catch (error) {
        console.error('Error loading settlement settings:', error);
        // Use defaults if there's an error
        this.resetSectionData('settlement');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

.settings-container {
  min-height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  color: #ffffff;
}

.settings-content {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  max-width: 100%;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items:start;
}

.game-title {
  font-size: 2.5rem;
  color: #00ff00;
  text-align: left;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff00;
}

.section-title {
  color: #00ff00;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.subsection-title {
  color: #00ff00;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.settings-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

.btn-outline-primary {
  background-color: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
}

.btn-outline-primary:hover, .btn-outline-primary.active {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  background-color: #00cc00;
}

.btn-success {
  background-color: #00ff00;
  border: none;
  color: #000;
}

.btn-success:hover {
  background-color: #00cc00;
}

.btn-danger {
  background-color: #ff0000;
  border: none;
}

.btn-danger:hover {
  background-color: #cc0000;
}

.btn-info {
  background-color: #17a2b8;
  color: #ffffff;
}

.btn-warning {
  background-color: #ffc107;
  color: #000000;
}

.data-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.data-display, .data-form {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
}

.data-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.data-content {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 5px;
  overflow-y: auto;
}

pre {
  color: #00ff00;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #00ff00;
  color: #ffffff;
  border-radius: 3px;
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.5);
}

.form-check-input {
  margin-right: 0.5rem;
}

.patreon-container {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.patreon-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  transition: transform 0.3s ease;
}

.patreon-link:hover {
  transform: scale(1.05);
}

.patreon-logo {
  width: 30px;
  height: auto;
  margin-bottom: 5px;
}

.patreon-text {
  font-size: 0.8rem;
  text-align: center;
  white-space: nowrap;
}

.version-number {
  position: fixed;
  bottom: 10px;
  right: 10px;
  color: rgba(255, 255, 255, 1);
  font-size: 0.8rem;
  font-weight: 300;
}

.story-steps-container {
  background-color: rgba(0, 255, 0, 0.05);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.story-step {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.step-title {
  color: #00ff00;
  margin: 0;
  font-size: 1.2rem;
}

.options-title {
  color: #00ff00;
  font-size: 1rem;
}

.player-option {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 0, 0.1);
}

.option-number {
  color: #00ff00;
  font-size: 0.9rem;
}

.story-reward-container {
  background-color: rgba(0, 255, 0, 0.05);
  padding: 1rem;
  border-radius: 5px;
}

.reward-section {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.form-label {
  color: #00ff00;
  margin-bottom: 0.5rem;
}

.player-choices-container {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 5px;
}

.choices-list {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.choice-item {
  color: #00ff00;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(0, 255, 0, 0.1);
}

.choice-item:last-child {
  border-bottom: none;
}

.settlement-settings {
  background-color: rgba(0, 255, 0, 0.05);
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.settings-title {
  color: #00ff00;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.settings-group {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 255, 0, 0.1);
}

.group-title {
  color: #00ff00;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  color: #00ff00;
  margin-bottom: 0.5rem;
  display: block;
  font-weight: 500;
}

.input-group {
  display: flex;
  align-items: stretch;
}

.input-group .form-control {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-append {
  display: flex;
}

.input-group-text {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-left: none;
  color: #00ff00;
  padding: 0.5rem 1rem;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.form-text {
  color: rgba(0, 255, 0, 0.7);
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.settings-actions .btn {
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.settings-actions .btn i {
  font-size: 1.1rem;
}

.upgrade-section {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 255, 0, 0.1);
}

.upgrade-title {
  color: #00ff00;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.1);
}

</style>
