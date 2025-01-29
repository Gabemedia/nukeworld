<template>
  <div v-if="show" class="enemy-template-dialog">
    <div class="template-content">
      <div class="template-header">
        <h2>Select Enemy Template</h2>
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
          <div class="template-card-content">
            <p>{{ template.shortDescription }}</p>
            <div class="template-features">
              <span v-if="template.hasWeapons" class="feature weapon">Weapons</span>
              <span v-if="template.hasArmor" class="feature armor">Armor</span>
              <span v-if="template.hasResources" class="feature resource">Resources</span>
            </div>
            <div class="enemy-details" v-if="selectedTemplateId === template.id">
              <div class="detail-item">
                <span class="detail-label">Health:</span>
                <span class="detail-value">{{ template.template.enemyHealth }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Attack:</span>
                <span class="detail-value">{{ template.template.attack }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Defense:</span>
                <span class="detail-value">{{ template.template.defense }}</span>
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
        <h3>Enemy Features</h3>
        <div class="preview-details">
          <div class="preview-section">
            <h4>Combat Stats</h4>
            <div class="stat-list">
              <div class="stat-item">
                <span>Health:</span>
                <span>{{ selectedTemplate.template.enemyHealth }}</span>
              </div>
              <div class="stat-item">
                <span>Attack:</span>
                <span>{{ selectedTemplate.template.attack }}</span>
              </div>
              <div class="stat-item">
                <span>Defense:</span>
                <span>{{ selectedTemplate.template.defense }}</span>
              </div>
              <div class="stat-item">
                <span>Base EXP:</span>
                <span>{{ selectedTemplate.template.exp }}</span>
              </div>
              <div class="stat-item">
                <span>Base Money:</span>
                <span>{{ selectedTemplate.template.money }}</span>
              </div>
            </div>
          </div>
          <div class="preview-section">
            <h4>Rewards</h4>
            <div class="reward-chances">
              <div class="chance-item">
                <span>Weapon Chance:</span>
                <span>{{ (selectedTemplate.template.rewardChance * 100).toFixed(1) }}%</span>
              </div>
              <div v-if="selectedTemplate.hasArmor" class="chance-item">
                <span>Armor Chance:</span>
                <span>{{ (selectedTemplate.template.armorRewardChance * 100).toFixed(1) }}%</span>
              </div>
              <div class="chance-item">
                <span>Resource Chance:</span>
                <span>{{ (selectedTemplate.template.resourceRewardChance * 100).toFixed(1) }}%</span>
              </div>
              <div class="chance-item">
                <span>Level Required:</span>
                <span>{{ selectedTemplate.template.levelRequirement }}</span>
              </div>
            </div>
          </div>
          <div class="preview-section full-width">
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

      <div class="template-actions">
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
import { enemyTemplateData } from './enemyTemplateData';

export default {
  name: 'EnemyTemplates',
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
    const categories = ref([
      { id: 'all', name: 'All Enemies' },
      { id: 'basic', name: 'Basic' },
      { id: 'defensive', name: 'Defensive' },
      { id: 'elite', name: 'Elite' },
      { id: 'boss', name: 'Boss' }
    ]);

    const filteredTemplates = computed(() => {
      return selectedCategory.value === 'all'
        ? enemyTemplateData
        : enemyTemplateData.filter(t => t.category === selectedCategory.value);
    });

    const selectedTemplate = computed(() => 
      enemyTemplateData.find(t => t.id === selectedTemplateId.value)
    );

    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
      selectedTemplateId.value = null;
    };

    const selectTemplate = (template) => {
      selectedTemplateId.value = template.id;
    };

    const useTemplate = () => {
      if (selectedTemplate.value) {
        emit('select-template', selectedTemplate.value);
      }
    };

    const closeDialog = () => {
      emit('close');
    };

    return {
      categories,
      selectedCategory,
      selectedTemplateId,
      selectedTemplate,
      filteredTemplates,
      selectCategory,
      selectTemplate,
      useTemplate,
      closeDialog
    };
  }
};
</script>

<style lang="scss" scoped>
.enemy-template-dialog {
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
  &.very-hard { background: #6f42c1; }
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
  &.resource { background: #17a2b8; }
}

.enemy-details {
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

  .full-width {
    grid-column: 1 / -1;
  }
}

.preview-section {
  h4 {
    color: #00ff00;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
}

.stat-list, .reward-chances {
  .stat-item, .chance-item {
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

.template-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 2rem;
  }
}
</style> 