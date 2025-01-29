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
          <div class="template-icon">
            <img :src="require('@/assets/interface/icons/resources/' + template.template.img)" :alt="template.template.name">
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

      <div class="icon-selector" v-if="showIconSelector">
        <h3>Select Icon</h3>
        <div class="icons-grid">
          <div 
            v-for="icon in availableIcons" 
            :key="icon"
            class="icon-item"
            @click="selectIcon(icon)"
            :class="{ 'selected': selectedTemplate && selectedTemplate.template.img === icon }"
          >
            <img :src="require('@/assets/interface/icons/resources/' + icon)" :alt="icon">
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
    const showIconSelector = ref(false);
    const selectedTemplate = ref(null);

    const availableIcons = ref([
      'none.png',
      'wood_scrap.png',
      'steel_scrap.png',
      'plastic_scrap.png',
      'gasoline.png',
      'cloth_scraps.png',
      'electronic_parts.png',
      'ammunition.png',
      'fuel.png',
      'oil.png',
      'battery.png',
      'screws.png'
    ]);

    const filteredTemplates = computed(() => {
      return resourceTemplateData.filter(t => t.template.name !== 'None');
    });

    const selectTemplate = (template) => {
      selectedTemplateId.value = filteredTemplates.value.indexOf(template);
      selectedTemplate.value = template;
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
      selectedTemplateId,
      selectedTemplate,
      filteredTemplates,
      showIconSelector,
      availableIcons,
      selectTemplate,
      selectIcon,
      useTemplate,
      confirmTemplate,
      cancelIconSelection,
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

.template-icon {
  text-align: center;
  margin-bottom: 1rem;

  img {
    width: 64px;
    height: 64px;
    object-fit: contain;
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
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
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
    width: 48px;
    height: 48px;
    object-fit: contain;
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

.btn {
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}
</style> 