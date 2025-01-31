<template>
  <div v-if="show" class="quest-template-dialog">
    <div class="template-content">
      <div class="template-header">
        <h2>Select Quest Template</h2>
        <div class="template-description">
          {{ selectedTemplate ? selectedTemplate.description : 'Choose a template to get started' }}
        </div>
      </div>

      <div class="template-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="templates-grid">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          :class="{ selected: selectedTemplateId === template.id }"
          @click="selectTemplate(template)"
        >
          <div class="template-card-header">
            <h3>{{ template.name }}</h3>
            <span class="template-difficulty" :class="template.difficulty">
              {{ template.difficulty }}
            </span>
          </div>
          <div class="template-icon">
            <img :src="require('@/assets/quests/bg/' + template.template.img + '.jpg')" :alt="template.name">
          </div>
          <div class="template-card-content">
            <p>{{ template.shortDescription }}</p>
            <div class="template-features">
              <span v-if="template.hasWeapons" class="feature weapon">Weapons</span>
              <span v-if="template.hasArmor" class="feature armor">Armor</span>
              <span v-if="template.hasTimer" class="feature timer">Timed</span>
            </div>
            <div class="quest-details" v-if="selectedTemplateId === template.id">
              <div class="detail-item">
                <span class="detail-label">EXP:</span>
                <span class="detail-value">{{ template.template.exp }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Money:</span>
                <span class="detail-value">{{ template.template.money }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ formatDuration(template.template.duration) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Level Req:</span>
                <span class="detail-value">{{ template.template.levelRequirement }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="template-preview" v-if="selectedTemplate">
        <h3>Quest Features</h3>
        <div class="preview-details">
          <div class="preview-section">
            <h4>Rewards</h4>
            <div class="reward-chances">
              <div class="chance-item">
                <span>Base EXP:</span>
                <span>{{ selectedTemplate.template.exp }}</span>
              </div>
              <div class="chance-item">
                <span>Base Money:</span>
                <span>{{ selectedTemplate.template.money }}</span>
              </div>
              <div class="chance-item">
                <span>Weapon Chance:</span>
                <span>{{ (selectedTemplate.template.rewardChance * 100).toFixed(1) }}%</span>
              </div>
              <div class="chance-item">
                <span>Armor Chance:</span>
                <span>{{ (selectedTemplate.template.armorRewardChance * 100).toFixed(1) }}%</span>
              </div>
              <div class="chance-item">
                <span>Duration:</span>
                <span>{{ formatDuration(selectedTemplate.template.duration) }}</span>
              </div>
              <div class="chance-item">
                <span>Level Required:</span>
                <span>{{ selectedTemplate.template.levelRequirement }}</span>
              </div>
            </div>
          </div>
          <div class="preview-section">
            <h4>Features</h4>
            <ul class="feature-list">
              <li v-for="(feature, index) in selectedTemplate.preview.features" :key="index">
                <span class="feature-icon">✓</span>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="icon-selector" v-if="showIconSelector">
        <h3>Select Quest Background</h3>
        <div class="icons-grid">
          <div 
            v-for="icon in availableIcons" 
            :key="icon"
            class="icon-item"
            @click="selectIcon(icon)"
            :class="{ 'selected': selectedTemplate && selectedTemplate.template.img === icon }"
          >
            <img :src="require('@/assets/quests/bg/' + icon + '.jpg')" :alt="icon">
          </div>
        </div>
        <div class="icon-selector-actions">
          <button class="btn btn-success" @click="confirmTemplate">Confirm</button>
          <button class="btn btn-danger" @click="cancelIconSelection">Cancel</button>
        </div>
      </div>

      <div class="template-actions" v-if="!showIconSelector">
        <button class="btn btn-danger" @click="closeDialog">Cancel</button>
        <button 
          class="btn btn-success" 
          @click="useTemplate"
          :disabled="!selectedTemplate"
        >
          Use Template
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { questTemplateData } from './questTemplateData';

export default {
  name: 'QuestTemplates',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'select-template'],
  setup(props, { emit }) {
    const selectedCategory = ref('all');
    const selectedTemplateId = ref(null);
    const showIconSelector = ref(false);
    const selectedTemplate = ref(null);
    const categories = ref([
      { id: 'all', name: 'All Quests' },
      { id: 'basic', name: 'Basic Quests' },
      { id: 'exploration', name: 'Exploration' },
      { id: 'dangerous', name: 'High Risk' },
      { id: 'settlement', name: 'Settlement' }
    ]);

    const availableIcons = ref([
      'settlement_supplies',
      'search_location',
      'clock_tower',
      'strange_noises',
      'library_cleanup',
      'supply_run',
      'library_cleanup_2',
      'radioactive_wasteland',
      'overgrown_village',
      'supply_shipment',
      'atlantic_city',
      'warehouse_stashes',
      'acid_rain',
      'supply_quest',
      'exploration_quest',
      'high_risk_quest',
      'settlement_quest',
      'highway',
    ]);

    const filteredTemplates = computed(() => {
      return selectedCategory.value === 'all'
        ? questTemplateData
        : questTemplateData.filter(t => t.category === selectedCategory.value);
    });

    const formatDuration = (ms) => {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ${seconds % 60}s`;
    };

    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
      selectedTemplateId.value = null;
    };

    const selectTemplate = (template) => {
      selectedTemplateId.value = template.id;
      selectedTemplate.value = { ...template };
      showIconSelector.value = true;
    };

    const selectIcon = (icon) => {
      if (selectedTemplate.value) {
        selectedTemplate.value = {
          ...selectedTemplate.value,
          template: {
            ...selectedTemplate.value.template,
            img: icon
          }
        };
      }
    };

    const useTemplate = () => {
      if (selectedTemplate.value) {
        emit('select-template', selectedTemplate.value);
      }
    };

    const confirmTemplate = () => {
      if (selectedTemplate.value) {
        emit('select-template', selectedTemplate.value);
        emit('close');
      }
    };

    const cancelIconSelection = () => {
      showIconSelector.value = false;
      selectedTemplate.value = null;
      selectedTemplateId.value = null;
    };

    const closeDialog = () => {
      emit('close');
    };

    return {
      categories,
      selectedCategory,
      selectedTemplateId,
      selectedTemplate,
      showIconSelector,
      availableIcons,
      filteredTemplates,
      selectCategory,
      selectTemplate,
      selectIcon,
      useTemplate,
      confirmTemplate,
      cancelIconSelection,
      closeDialog,
      formatDuration
    };
  }
};
</script>

<style lang="scss" scoped>
.quest-template-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.template-content {
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #00ff00;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  color: #00ff00;
}

.template-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    color: #00ff00;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

.template-categories {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover, &.active {
    background: #00ff00;
    color: black;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.template-card {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover, &.selected {
    background: rgba(0, 255, 0, 0.2);
    transform: translateY(-2px);
  }
}

.template-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
}

.template-difficulty {
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;

  &.easy { background: #28a745; }
  &.medium { background: #ffc107; }
  &.hard { background: #dc3545; }
}

.template-features {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.feature {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  
  &.weapon { background: #dc3545; }
  &.armor { background: #28a745; }
  &.timer { background: #17a2b8; }
}

.quest-details {
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;

  .detail-item {
    display: flex;
    justify-content: space-between;
    margin: 0.2rem 0;
    
    .detail-label {
      color: #aaa;
    }
  }
}

.template-preview {
  background: rgba(0, 255, 0, 0.1);
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.preview-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.preview-section {
  h4 {
    color: #00ff00;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
}

.reward-chances {
  .chance-item {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    padding: 0.3rem 0;
    border-bottom: 1px solid rgba(0, 255, 0, 0.1);

    span:first-child {
      color: #aaa;
    }

    span:last-child {
      color: #00ff00;
      font-weight: bold;
    }
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    color: #fff;
  }

  .feature-icon {
    color: #00ff00;
    margin-right: 0.5rem;
    font-weight: bold;
  }
}

.template-icon {
  text-align: center;
  margin: 1rem 0;

  img {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid rgba(0, 255, 0, 0.3);
  }
}

.icon-selector {
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #00ff00;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;

  h3 {
    color: #00ff00;
    text-align: center;
    margin-bottom: 1rem;
  }
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.icon-item {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 3px;
  }

  &:hover {
    background: rgba(0, 255, 0, 0.2);
  }

  &.selected {
    background: rgba(0, 255, 0, 0.3);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }
}

.icon-selector-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.template-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 2rem;
  }
}
</style> 