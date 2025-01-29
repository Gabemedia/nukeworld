<template>
  <div v-if="show" class="story-template-dialog">
    <div class="template-content">
      <div class="template-header">
        <h2>Select Story Template</h2>
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
              <span v-if="template.hasEnemy" class="feature enemy">Enemy Battle</span>
              <span v-if="template.hasResources" class="feature resource">Resources</span>
              <span v-if="template.hasRewards" class="feature reward">Rewards</span>
              <span v-if="template.hasChoices" class="feature choice">Multiple Choices</span>
            </div>
          </div>
        </div>
      </div>

      <div class="template-preview" v-if="selectedTemplate">
        <h3>Template Preview</h3>
        <div class="preview-details">
          <div class="preview-section">
            <h4>Story Structure</h4>
            <ul>
              <li v-for="(step, index) in selectedTemplate.preview.steps" :key="index">
                {{ step }}
              </li>
            </ul>
          </div>
          <div class="preview-section">
            <h4>Features</h4>
            <ul>
              <li v-for="(feature, index) in selectedTemplate.preview.features" :key="index">
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
import { storyTemplateData } from './storyTemplateData';

export default {
  name: 'StoryTemplates',
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
      { id: 'all', name: 'All Templates' },
      { id: 'basic', name: 'Basic Stories' },
      { id: 'combat', name: 'Combat Stories' },
      { id: 'resource', name: 'Resource Stories' },
      { id: 'quest', name: 'Quest Chains' },
      { id: 'special', name: 'Special Events' }
    ]);

    const filteredTemplates = computed(() => {
      return selectedCategory.value === 'all'
        ? storyTemplateData
        : storyTemplateData.filter(t => t.category === selectedCategory.value);
    });

    const selectedTemplate = computed(() => 
      storyTemplateData.find(t => t.id === selectedTemplateId.value)
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
.story-template-dialog {
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
  
  &.enemy { background: #dc3545; }
  &.resource { background: #28a745; }
  &.reward { background: #ffc107; }
  &.choice { background: #17a2b8; }
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

.template-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.5rem 2rem;
  }
}
</style> 