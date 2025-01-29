<template>
  <div v-if="show" class="resource-template-dialog">
    <div class="template-content">
      <div class="template-header">
        <h2>Select Resource Template</h2>
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
            <h3>{{ template.template.name }}</h3>
          </div>
          <div class="template-card-content">
            <div class="resource-details">
              <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span class="detail-value">{{ template.template.desc }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Price:</span>
                <span class="detail-value">{{ template.template.price }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">State:</span>
                <span class="detail-value">{{ template.template.state }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">{{ template.template.quantity }}</span>
              </div>
            </div>
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
import { resourceTemplateData } from './resourceTemplateData';

export default {
  name: 'ResourceTemplates',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'select-template'],
  setup(props, { emit }) {
    const selectedTemplateId = ref(null);

    const filteredTemplates = computed(() => {
      return resourceTemplateData.filter(t => t.template.name !== 'None');
    });

    const selectedTemplate = computed(() => {
      if (!selectedTemplateId.value) return null;
      return filteredTemplates.value[selectedTemplateId.value];
    });

    const selectTemplate = (template) => {
      selectedTemplateId.value = filteredTemplates.value.indexOf(template);
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
      selectedTemplateId,
      selectedTemplate,
      filteredTemplates,
      selectTemplate,
      useTemplate,
      closeDialog
    };
  }
};
</script>

<style lang="scss" scoped>
.resource-template-dialog {
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
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #00ff00;
  }
}

.resource-details {
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

    .detail-value {
      color: #00ff00;
    }
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