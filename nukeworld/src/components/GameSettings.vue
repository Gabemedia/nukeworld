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
              <select v-model="selectedReward[key]" class="form-control form-control-sm mb-2">
                <option value="">Select a reward</option>
                <option v-for="option in getItemOptions(key)" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              <button @click="addReward(key)" class="btn btn-primary btn-sm">Add reward</button>
            </template>
            <template v-else-if="activeSection === 'story' && key === 'requiredEnemyDefeat'">
              <div class="mb-2">
                <input v-model.number="currentItem[key].id" class="form-control form-control-sm mb-1" placeholder="Enemy ID">
                <input v-model.number="currentItem[key].count" class="form-control form-control-sm" placeholder="Count">
              </div>
            </template>
            <template v-else-if="activeSection === 'story' && key === 'steps'">
              <div v-for="(step, index) in currentItem[key]" :key="index" class="mb-2">
                <textarea v-model="step.npcMessage" class="form-control form-control-sm mb-1" rows="2" placeholder="NPC Message"></textarea>
                <div v-for="(option, optionIndex) in step.playerOptions" :key="optionIndex" class="mb-1">
                  <input v-model="option.text" class="form-control form-control-sm mb-1" placeholder="Option Text">
                  <input v-model="option.nextId" class="form-control form-control-sm" placeholder="Next ID">
                </div>
                <button @click="addPlayerOption(index)" class="btn btn-primary btn-sm">Add Player Option</button>
              </div>
              <button @click="addStep" class="btn btn-primary btn-sm">Add Step</button>
            </template>
            <template v-else-if="activeSection === 'story' && key === 'reward'">
              <div class="mb-2">
                <label>Experience:</label>
                <input v-model.number="currentItem[key].exp" class="form-control form-control-sm mb-1" placeholder="Experience">
                <label>Money:</label>
                <input v-model.number="currentItem[key].money" class="form-control form-control-sm mb-1" placeholder="Money">
                <div v-for="(rewardType, rewardKey) in ['resourceRewards', 'weaponRewards', 'armorRewards', 'aidRewards']" :key="rewardKey">
                  <h6>{{ rewardKey }}</h6>
                  <div v-for="(reward, index) in currentItem[key][rewardKey]" :key="index" class="mb-1">
                    <input v-model.number="reward.id" class="form-control form-control-sm mb-1" placeholder="ID">
                    <input v-model.number="reward.amount" class="form-control form-control-sm mb-1" placeholder="Amount">
                    <button @click="removeRewardItem(rewardKey, index)" class="btn btn-danger btn-sm">Remove</button>
                  </div>
                  <button @click="addRewardItem(rewardKey)" class="btn btn-primary btn-sm mb-2">Add {{ rewardKey }}</button>
                </div>
              </div>
            </template>
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
import { v4 as uuidv4 } from 'uuid';
import quests from '@/store/quests.js';
import items from '@/store/items.js';
import story from '@/store/story.js';
import armor from '@/store/armor.js';
import aid from '@/store/aid.js';
import resources from '@/store/ressources.js';

export default {
  name: 'GameSettings',
  data() {
    return {
      activeSection: 'quests',
      sections: ['quests', 'items', 'story', 'armor', 'aid', 'resources'],
      quests,
      items,
      story,
      armor,
      aid,
      resources,
      currentIndex: 0,
      selectedReward: {
        reward: '',
        armorReward: ''
      }
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
      this.getActiveData[this.currentIndex] = { ...this.currentItem };
      this.saveToLocalStorage();
      alert('Changes saved locally!');
    },
    deleteItem() {
      if (confirm('Are you sure you want to delete this item?')) {
        this.getActiveData.splice(this.currentIndex, 1);
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
      const baseItem = {
        id: this.getActiveData.length,
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
            price: '0',
          };
        case 'story':
          return {
            ...baseItem,
            name: 'New Story',
            levelRequirement: 1,
            completed: false,
            requiredStoryLineId: null,
            playerChoices: [],
            steps: [
              {
                npcMessage: 'New NPC message',
                playerOptions: [
                  { text: 'New player option', nextId: null }
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
            price: '0',
          };
        case 'resources':
          return {
            ...baseItem,
            name: 'New Resource',
            desc: 'Resource description',
            state: 'none',
            price: '0',
            quantity: 0,
          };
        default:
          return baseItem;
      }
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
          { text: 'New player option', nextId: null }
        ]
      });
    },
    addPlayerOption(stepIndex) {
      this.currentItem.steps[stepIndex].playerOptions.push({
        text: 'New player option',
        nextId: null
      });
    },
    saveToLocalStorage() {
      localStorage.setItem(this.activeSection, JSON.stringify(this.getActiveData));
    },
    loadFromLocalStorage() {
      for (const section of this.sections) {
        const savedData = localStorage.getItem(section);
        if (savedData) {
          this[section] = JSON.parse(savedData);
        }
      }
    },
    exportChanges() {
      const section = this.activeSection;
      const data = this[section];
      const fileName = `${section}.js`;
      let content;

      if (section === 'quests' || section === 'story') {
        content = 'export default [\n' + data.map(item => '  ' + JSON.stringify(item, null, 2)).join(',\n') + '\n];';
      } else if (section === 'items' || section === 'armor' || section === 'aid' || section === 'resources') {
        content = `import { v4 as uuidv4 } from 'uuid';\n\nexport default ${JSON.stringify(data, null, 2)};`;
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
      this.currentItem.reward[rewardKey].push({ id: null, amount: 1 });
    },
    removeRewardItem(rewardKey, index) {
      this.currentItem.reward[rewardKey].splice(index, 1);
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

/* New styles for story editing */
.story-step {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.player-option {
  margin-left: 20px;
  margin-bottom: 5px;
}

.add-step-btn, .add-option-btn {
  margin-top: 5px;
}
</style>
