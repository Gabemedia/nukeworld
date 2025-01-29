<template>
  <div v-if="show" class="enemy-template-dialog">
    <div class="template-content">
      <div class="template-header">
        <h2>Select Enemy Template</h2>
      </div>

      <div class="templates-grid">
        <div 
          v-for="template in enemyTemplateData" 
          :key="template.id"
          class="template-card"
          @click="useTemplate(template)"
        >
          <div class="template-card-header">
            <h3>{{ template.name }}</h3>
          </div>
          <div class="template-stats">
            <div class="stat-item">
              <span>Health:</span>
              <span>{{ template.enemyHealth }}</span>
            </div>
            <div class="stat-item">
              <span>Attack:</span>
              <span>{{ template.attack }}</span>
            </div>
            <div class="stat-item">
              <span>Defense:</span>
              <span>{{ template.defense }}</span>
            </div>
            <div class="stat-item">
              <span>EXP:</span>
              <span>{{ template.exp }}</span>
            </div>
            <div class="stat-item">
              <span>Money:</span>
              <span>{{ template.money }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="template-actions">
        <button class="btn btn-danger" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import enemyTemplateData from './enemyTemplateData';

export default {
  name: 'EnemyTemplates',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const useTemplate = (template) => {
      emit('select-template', template);
      emit('close');
    };

    return {
      enemyTemplateData,
      useTemplate
    };
  }
};
</script>

<style scoped>
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

.template-stats {
  display: grid;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.btn-danger {
  background: #dc3545;
  color: white;
}
</style> 