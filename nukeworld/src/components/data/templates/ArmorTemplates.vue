<template>
  <div v-if="show" class="armor-template-dialog">
    <div class="template-content">
      <div class="template-header">
        <h2>Select Armor Template</h2>
      </div>

      <div class="templates-grid">
        <div 
          v-for="template in armorTemplateData" 
          :key="template.id"
          class="template-card"
          @click="useTemplate(template)"
        >
          <div class="template-card-header">
            <h3>{{ template.name }}</h3>
          </div>
          <div class="template-icon">
            <img :src="require('@/assets/interface/icons/armor/' + template.img)" :alt="template.name">
          </div>
          <div class="template-stats">
            <div class="stat-item">
              <span>Defence:</span>
              <span>{{ template.defence }}</span>
            </div>
            <div class="stat-item">
              <span>Price:</span>
              <span>{{ template.price }}</span>
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
            :class="{ 'selected': selectedTemplate && selectedTemplate.img === icon }"
          >
            <img :src="require('@/assets/interface/icons/armor/' + icon)" :alt="icon">
          </div>
        </div>
        <div class="icon-selector-actions">
          <button class="btn btn-success" @click="confirmTemplate">Confirm</button>
          <button class="btn btn-danger" @click="cancelIconSelection">Cancel</button>
        </div>
      </div>

      <div class="template-actions" v-if="!showIconSelector">
        <button class="btn btn-danger" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import armorTemplateData from './armorTemplateData';

export default {
  name: 'ArmorTemplates',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const showIconSelector = ref(false);
    const selectedTemplate = ref(null);
    const availableIcons = ref([
      'ar_001.png',
      'ar_005.png',
      'ar_011.png',
      'ar_015.png',
      'bt_001.png',
      'bt_002.png',
      'bt_003.png',
      'bt_004.png',
      'bt_005.png',
      'bt_006.png',
      'bt_007.png',
      'bt_008.png',
      'bt_009.png',
      'bt_010.png',
      'bt_011.png',
      'bt_012.png',
      'bt_013.png',
      'bt_014.png',
      'bt_015.png',
      'bt_016.png',
      'bt_017.png',
      'battle_armor.png',
      'doomslayer.png',
      'leather_armor.png',
      'metal_armor.png',
      'military_armor.png',
      'nano_suit.png',
      'plate_armor.png',
      'radiation_suit.png',
      'raider_armor.png',
      'rags.png',
      'trader_suit.png',
      'wooden_armor.png'
    ]);

    const useTemplate = (template) => {
      selectedTemplate.value = { ...template };
      showIconSelector.value = true;
    };

    const selectIcon = (icon) => {
      if (selectedTemplate.value) {
        selectedTemplate.value.img = icon;
      }
    };

    const confirmTemplate = () => {
      if (selectedTemplate.value) {
        const finalTemplate = {
          ...selectedTemplate.value
        };
        emit('select-template', finalTemplate);
        emit('close');
      }
    };

    const cancelIconSelection = () => {
      showIconSelector.value = false;
      selectedTemplate.value = null;
    };

    return {
      armorTemplateData,
      showIconSelector,
      selectedTemplate,
      availableIcons,
      useTemplate,
      selectIcon,
      confirmTemplate,
      cancelIconSelection
    };
  }
};
</script>

<style scoped>
.armor-template-dialog {
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
}

.template-header h2 {
  color: #00ff00;
  margin: 0;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
}

.template-card:hover {
  background: rgba(0, 255, 0, 0.2);
  transform: translateY(-2px);
}

.template-card-header {
  margin-bottom: 1rem;
}

.template-card-header h3 {
  margin: 0;
  color: #00ff00;
}

.template-icon {
  text-align: center;
  margin-bottom: 1rem;
}

.template-icon img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.template-stats {
  display: grid;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-selector {
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #00ff00;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
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
}

.icon-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.icon-item:hover {
  background: rgba(0, 255, 0, 0.2);
}

.icon-item.selected {
  background: rgba(0, 255, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
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
}

.btn {
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
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