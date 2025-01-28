<template>
  <div class="settings-container">
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
          <div class="data-navigation">
            <button class="btn btn-outline-primary" @click="prevItem" :disabled="currentIndex === 0">&lt;</button>
            <span>Item {{ currentIndex + 1 }} of {{ getActiveData.length }}</span>
            <button class="btn btn-outline-primary" @click="nextItem" :disabled="currentIndex === getActiveData.length - 1">&gt;</button>
          </div>
          <div class="data-content">
            <pre>{{ JSON.stringify(currentItem, null, 2) }}</pre>
          </div>
        </div>
        <div class="data-form">
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
                <div>
                  <select v-model.number="currentItem[key].id" class="form-control">
                    <option value="">Select an enemy</option>
                    <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                      {{ enemy.name }}
                    </option>
                  </select>
                  <input v-model.number="currentItem[key].count" class="form-control" placeholder="Count">
                </div>
              </template>
              <template v-else-if="activeSection === 'story' && key === 'steps'">
                <div v-for="(step, stepIndex) in currentItem[key]" :key="stepIndex" class="story-step">
                  <textarea v-model="step.npcMessage" class="form-control" rows="2" placeholder="NPC Message"></textarea>
                  <div v-for="(option, optionIndex) in step.playerOptions" :key="optionIndex" class="player-option">
                    <input v-model="option.text" class="form-control" placeholder="Option Text">
                    <input v-model.number="option.nextId" class="form-control" placeholder="Next ID">
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" v-model="option.giveReward" :id="'giveReward-' + stepIndex + '-' + optionIndex">
                      <label class="form-check-label" :for="'giveReward-' + stepIndex + '-' + optionIndex">Give Reward</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" v-model="option.action" :true-value="'startEnemyBattle'" :false-value="null" :id="'action-' + stepIndex + '-' + optionIndex">
                      <label class="form-check-label" :for="'action-' + stepIndex + '-' + optionIndex">Start Enemy Battle</label>
                    </div>
                    <div v-if="option.action === 'startEnemyBattle'">
                      <select v-model.number="option.actionParams.enemyId" class="form-control">
                        <option value="">Select an enemy</option>
                        <option v-for="enemy in enemies" :key="enemy.id" :value="enemy.id">
                          {{ enemy.name }}
                        </option>
                      </select>
                    </div>
                    <div class="required-resources">
                      <h6>Required Resources</h6>
                      <div v-for="(resource, resourceIndex) in option.requiredResources" :key="resourceIndex">
                        <select v-model.number="resource.id" class="form-control">
                          <option v-for="resourceOption in resources" :key="resourceOption.id" :value="resourceOption.id">
                            {{ resourceOption.name }}
                          </option>
                        </select>
                        <input v-model.number="resource.amount" class="form-control" placeholder="Amount">
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
                <div>
                  <label>Experience:</label>
                  <input v-model.number="currentItem[key].exp" class="form-control" placeholder="Experience">
                  <label>Money:</label>
                  <input v-model.number="currentItem[key].money" class="form-control" placeholder="Money">
                  <div v-for="rewardKey in ['resourceRewards', 'weaponRewards', 'armorRewards', 'aidRewards']" :key="rewardKey">
                    <h6>{{ rewardKey }}</h6>
                    <div v-for="(reward, index) in currentItem[key][rewardKey]" :key="index">
                      <select v-model.number="reward.id" class="form-control">
                        <option v-for="option in getRewardOptions(rewardKey)" :key="option.id" :value="option.id">
                          {{ option.name }}
                        </option>
                      </select>
                      <input v-if="rewardKey !== 'weaponRewards' && rewardKey !== 'armorRewards' && rewardKey !== 'aidRewards'" v-model.number="reward.amount" class="form-control" placeholder="Amount">
                      <button @click="removeRewardItem(rewardKey, index)" class="btn btn-danger btn-sm">Remove</button>
                    </div>
                    <button @click="addRewardItem(rewardKey)" class="btn btn-primary btn-sm">Add {{ rewardKey }}</button>
                  </div>
                </div>
              </template>
              <input v-else-if="key === 'id'" v-model.number="currentItem[key]" class="form-control" :readonly="true">
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
      const nextStepId = this.calculateNextStepId(this.currentItem.steps);
      this.currentItem.steps.push({
        npcMessage: 'New NPC message',
        playerOptions: [
          { 
            text: 'New player option', 
            nextId: nextStepId,
            requiredResources: [],
            giveReward: false,
            action: null,
            actionParams: {}
          }
        ]
      });
    },
    addPlayerOption(stepIndex) {
      const nextStepId = this.calculateNextStepId(this.currentItem.steps);
      this.currentItem.steps[stepIndex].playerOptions.push({
        text: 'New player option',
        nextId: nextStepId,
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
  background-color: #28a745;
  color: #ffffff;
}

.btn-danger {
  background-color: #dc3545;
  color: #ffffff;
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
</style>
