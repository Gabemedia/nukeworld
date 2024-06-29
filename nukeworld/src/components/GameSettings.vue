<template>
  <div class="game-settings scrollable">
    <h3 class="text-primary mb-3">Game Settings</h3>
    <div class="settings-menu mb-3">
      <button 
        class="btn btn-outline-primary btn-sm" 
        v-for="section in sections" 
        :key="section" 
        @click="changeSection(section)"
        :class="{ active: activeSection === section }"
      >
        {{ section }}
      </button>
    </div>
    <div class="action-buttons mb-3">
      <button type="button" class="btn btn-success btn-sm" @click="addNewItem">Add New</button>
      <button type="button" class="btn btn-primary btn-sm" @click="saveChanges">Save Changes</button>
      <button type="button" class="btn btn-danger btn-sm" @click="deleteItem">Delete</button>
      <button type="button" class="btn btn-info btn-sm" @click="exportChanges">Export {{ activeSection }}</button>
      <button type="button" class="btn btn-warning btn-sm" @click="resetData">Reset Data</button>
    </div>
    <div class="data-container">
      <div class="data-display">
        <h5 class="text-primary">{{ activeSection }} Data</h5>
        <div class="data-navigation mb-2">
          <button class="btn btn-outline-primary btn-sm" @click="prevItem" :disabled="currentIndex === 0">&lt;</button>
          <span class="mx-2">Item {{ currentIndex + 1 }} of {{ getActiveData.length }}</span>
          <button class="btn btn-outline-primary btn-sm" @click="nextItem" :disabled="currentIndex === getActiveData.length - 1">&gt;</button>
        </div>
        <div class="data-content">
          <pre class="small">{{ JSON.stringify(currentItem, null, 2) }}</pre>
        </div>
      </div>
      <div class="data-form">
        <h5 class="text-primary">Edit {{ activeSection }}</h5>
        <form @submit.prevent="saveChanges">
          <div class="form-group" v-for="(value, key) in currentItem" :key="key">
            <label :for="key" class="small">{{ key }}</label>
            <template v-if="activeSection === 'quests' && (key === 'reward' || key === 'armorReward')">
              <div class="reward-list mb-2">
                <div v-for="(itemId, index) in currentItem[key]" :key="index" class="mb-1">
                  {{ getItemName(key, itemId) }}
                  <button @click="removeReward(key, index)" class="btn btn-danger btn-sm ml-2">Remove</button>
                </div>
              </div>
              <select v-model.number="selectedReward[key]" class="form-control form-control-sm mb-2">
                <option value="">Select a reward</option>
                <option v-for="option in getItemOptions(key)" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              <button @click="addReward(key)" class="btn btn-primary btn-sm">Add reward</button>
            </template>
            <template v-else-if="activeSection === 'story' && key === 'requiredEnemyDefeat'">
              <div class="mb-2">
                <select v-model.number="currentItem[key].id" class="form-control form-control-sm mb-1">
                  <option value="">Select an enemy</option>
                  <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                    {{ enemy.name }}
                  </option>
                </select>
                <input v-model.number="currentItem[key].count" class="form-control form-control-sm" placeholder="Count">
              </div>
            </template>
            <template v-else-if="activeSection === 'story' && key === 'steps'">
              <div v-for="(step, stepIndex) in currentItem[key]" :key="stepIndex" class="mb-2 story-step">
                <textarea v-model="step.npcMessage" class="form-control form-control-sm mb-1" rows="2" placeholder="NPC Message"></textarea>
                <div v-for="(option, optionIndex) in step.playerOptions" :key="optionIndex" class="mb-1 player-option">
                  <input v-model="option.text" class="form-control form-control-sm mb-1" placeholder="Option Text">
                  <input v-model.number="option.nextId" class="form-control form-control-sm mb-1" placeholder="Next ID">
                  <div class="form-check mb-1">
                    <input type="checkbox" class="form-check-input" v-model="option.giveReward" :id="'giveReward-' + stepIndex + '-' + optionIndex">
                    <label class="form-check-label" :for="'giveReward-' + stepIndex + '-' + optionIndex">Give Reward</label>
                  </div>
                  <div class="form-check mb-1">
                    <input type="checkbox" class="form-check-input" v-model="option.action" :true-value="'startEnemyBattle'" :false-value="null" :id="'action-' + stepIndex + '-' + optionIndex">
                    <label class="form-check-label" :for="'action-' + stepIndex + '-' + optionIndex">Start Enemy Battle</label>
                  </div>
                  <div v-if="option.action === 'startEnemyBattle'" class="mb-1">
                    <select v-model.number="option.actionParams.enemyId" class="form-control form-control-sm">
                      <option value="">Select an enemy</option>
                      <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                        {{ enemy.name }}
                      </option>
                    </select>
                  </div>
                  <div class="required-resources mb-1">
                    <h6>Required Resources</h6>
                    <div v-for="(resource, resourceIndex) in option.requiredResources" :key="resourceIndex" class="mb-1">
                      <select v-model.number="resource.id" class="form-control form-control-sm mb-1">
                        <option v-for="resourceOption in resources" :key="resourceOption.id" :value="resourceOption.id">
                          {{ resourceOption.name }}
                        </option>
                      </select>
                      <input v-model.number="resource.amount" class="form-control form-control-sm mb-1" placeholder="Amount">
                      <button @click="removeRequiredResource(option, resourceIndex)" class="btn btn-danger btn-sm">Remove</button>
                    </div>
                    <button @click="addRequiredResource(option)" class="btn btn-primary btn-sm">Add Required Resource</button>
                  </div>
                </div>
                <button @click="addPlayerOption(stepIndex)" class="btn btn-primary btn-sm">Add Player Option</button>
              </div>
              <button @click="addStep" class="btn btn-primary btn-sm">Add Step</button>
            </template>
            <template v-else-if="activeSection === 'story' && key === 'reward'">
              <div class="mb-2">
                <label>Experience:</label>
                <input v-model.number="currentItem[key].exp" class="form-control form-control-sm mb-1" placeholder="Experience">
                <label>Money:</label>
                <input v-model.number="currentItem[key].money" class="form-control form-control-sm mb-1" placeholder="Money">
                <div v-for="rewardKey in ['resourceRewards', 'weaponRewards', 'armorRewards', 'aidRewards']" :key="rewardKey">
                  <h6>{{ rewardKey }}</h6>
                  <div v-for="(reward, index) in currentItem[key][rewardKey]" :key="index" class="mb-1">
                    <select v-model.number="reward.id" class="form-control form-control-sm mb-1">
                      <option v-for="option in getRewardOptions(rewardKey)" :key="option.id" :value="option.id">
                        {{ option.name }}
                      </option>
                    </select>
                    <input v-if="rewardKey !== 'weaponRewards' && rewardKey !== 'armorRewards' && rewardKey !== 'aidRewards'" v-model.number="reward.amount" class="form-control form-control-sm mb-1" placeholder="Amount">
                    <button @click="removeRewardItem(rewardKey, index)" class="btn btn-danger btn-sm">Remove</button>
                  </div>
                  <button @click="addRewardItem(rewardKey)" class="btn btn-primary btn-sm mb-2">Add {{ rewardKey }}</button>
                </div>
              </div>
            </template>
            <input v-else-if="key === 'id'" v-model.number="currentItem[key]" class="form-control form-control-sm" :readonly="true">
            <input v-else-if="isNumeric(key)" v-model.number="currentItem[key]" class="form-control form-control-sm">
            <input v-else-if="typeof value !== 'object' && typeof value !== 'boolean'" :id="key" v-model="currentItem[key]" class="form-control form-control-sm">
            <textarea v-else-if="typeof value === 'object' && key !== 'reward' && key !== 'armorReward' && key !== 'requiredEnemyDefeat' && key !== 'steps'" :id="key" v-model.lazy="currentItem[key]" class="form-control form-control-sm" rows="3"></textarea>
            <input v-else-if="typeof value === 'boolean'" type="checkbox" :id="key" v-model="currentItem[key]" class="form-check-input">
          </div>
        </form>
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

export default {
  name: 'GameSettings',
  data() {
    return {
      activeSection: 'quests',
      sections: ['quests', 'items', 'story', 'armor', 'aid', 'resources', 'enemies'],
      quests: [],
      items: [],
      story: [],
      armor: [],
      aid: [],
      resources: [],
      enemies: [],
      currentIndex: 0,
      selectedReward: {
        reward: '',
        armorReward: ''
      },
      numericFields: ['id', 'exp', 'money', 'duration', 'progress', 'rewardChance', 'armorRewardChance', 'levelRequirement', 'attack', 'defence', 'health', 'price', 'quantity', 'requiredStoryLineId', 'enemyHealth', 'defense']
    };
  },
  computed: {
    getActiveData() {
      return this[this.activeSection];
    },
    currentItem() {
      return this.getActiveData[this.currentIndex] || {};
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
      const newItem = this.createNewItem();
      this.getActiveData.push(newItem);
      this.currentIndex = this.getActiveData.length - 1;
      this.saveToLocalStorage();
      alert('New item added successfully!');
    },
    createNewItem() {
      const newId = this.getNextId();
      const baseItem = {
        id: newId,
        uuid: uuidv4(),
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
            name: 'New Item',
            desc: 'Item description',
            attack: 0,
            defence: 0,
            state: 'none',
            price: 0,
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
            name: 'New Aid Item',
            desc: 'Aid item description',
            health: 0,
            state: 'none',
            price: 0,
          };
        case 'resources':
          return {
            ...baseItem,
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
    addStep() {
      this.currentItem.steps.push({
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
      });
    },
    addPlayerOption(stepIndex) {
      this.currentItem.steps[stepIndex].playerOptions.push({
        text: 'New player option',
        nextId: null,
        requiredResources: [],
        giveReward: false,
        action: null,
        actionParams: {}
      });
    },
    addRequiredResource(option) {
      if (!option.requiredResources) {
        option.requiredResources = [];
      }
      option.requiredResources.push({ id: null, amount: 1 });
    },
    removeRequiredResource(option, index) {
      option.requiredResources.splice(index, 1);
    },
    saveToLocalStorage() {
      localStorage.setItem(this.activeSection, JSON.stringify(this.getActiveData));
    },
    loadFromLocalStorage() {
      for (const section of this.sections) {
        const savedData = localStorage.getItem(section);
        if (savedData) {
          this[section] = JSON.parse(savedData).map(item => this.convertToNumbers(item));
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
      } else if (section === 'items' || section === 'armor' || section === 'aid') {
        content = `import { v4 as uuidv4 } from 'uuid';\n\nexport default ${JSON.stringify(data.map(item => ({
          ...item,
          uuid: 'uuidv4()'
        })), null, 2).replace(/"uuidv4\(\)"/g, 'uuidv4()')};`;
      } else if (section === 'resources') {
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
      if (!this.currentItem.reward[rewardKey]) {
        this.currentItem.reward[rewardKey] = [];
      }
      const newReward = { id: null };
      if (rewardKey !== 'weaponRewards' && rewardKey !== 'armorRewards' && rewardKey !== 'aidRewards') {
        newReward.amount = 1;
      }
      this.currentItem.reward[rewardKey].push(newReward);
    },
    removeRewardItem(rewardKey, index) {
      this.currentItem.reward[rewardKey].splice(index, 1);
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
        alert('All data has been reset to original values.');
      }
    },
    resetSectionData(section) {
      switch (section) {
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
    }
  },
  mounted() {
    this.loadFromLocalStorage();
  }
};
</script>

<style scoped>
.game-settings {
  height: 100vh;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 0.9rem;
}

.settings-menu, .action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.settings-menu button.active {
  background-color: #007bff;
  color: white;
}

.data-container {
  display: flex;
  flex-grow: 1;
  gap: 15px;
}

.data-display, .data-form {
  flex: 1;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.data-content, form {
  flex-grow: 1;
  overflow-y: auto;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.form-control {
  margin-bottom: 5px;
}

.reward-list {
  max-height: 150px;
  overflow-y: auto;
}

/* Scrollbar styles */
.data-content::-webkit-scrollbar, form::-webkit-scrollbar, .reward-list::-webkit-scrollbar {
  width: 5px;
}

.data-content::-webkit-scrollbar-track, form::-webkit-scrollbar-track, .reward-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.data-content::-webkit-scrollbar-thumb, form::-webkit-scrollbar-thumb, .reward-list::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 2px;
}

.form-group {
  margin-bottom: 10px;
}

.form-check-input {
  margin-top: 0.3rem;
}

/* Styles for story editing */
.story-step {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.player-option {
  margin-left: 20px;
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.add-step-btn, .add-option-btn {
  margin-top: 5px;
}

/* Style for the reset button */
.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
  color: #212529;
}

/* Styles for reward editing */
.reward-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.reward-item select, .reward-item input {
  margin-right: 5px;
}

.reward-item button {
  margin-left: auto;
}

.reward-section {
  margin-bottom: 15px;
}

.reward-section h6 {
  margin-bottom: 10px;
}

/* Styles for required resources */
.required-resources {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.required-resources h6 {
  margin-bottom: 10px;
}

.required-resource-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.required-resource-item select, .required-resource-item input {
  margin-right: 5px;
}

.required-resource-item button {
  margin-left: auto;
}

/* Style for readonly id field */
input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>
