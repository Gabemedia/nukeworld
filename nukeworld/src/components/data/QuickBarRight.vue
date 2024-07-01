<template>
  <div class="quick-bar-right">
    <div class="currency-container" @mouseover="showItemInfo('currency')" @mouseleave="hideItemInfo">
      <div class="currency-icon">
        <img :src="require(`@/assets/interface/icons/money.png`)" alt="NukaCoin">
      </div>
      <span class="currency-amount">{{ character.money }}</span>
      <div v-if="hoveredItem === 'currency'" class="item-info">
        <p class="mb-1 fw-bold small">NukaCoin</p>
        <p class="mb-1 small">Current Balance: {{ character.money }}</p>
      </div>
    </div>
    <div class="resources-container mt-2">
      <div v-for="resource in stackedResources" :key="resource.id" class="resource-item" @mouseover="showItemInfo(resource)" @mouseleave="hideItemInfo">
        <div class="resource-icon">
          <img :src="require(`@/assets/interface/icons/resources/${resource.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="resource.name" />
        </div>
        <span class="resource-amount">{{ resource.quantity }}</span>
        <div v-if="hoveredItem && hoveredItem.id === resource.id" class="item-info">
          <p class="mb-1 fw-bold small">{{ resource.name }}</p>
          <p class="mb-1 small">Quantity: {{ resource.quantity }}</p>
          <p class="mb-1 small">Description: {{ resource.desc }}</p>
          <p class="mb-1 small">Price: {{ resource.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import resources from '@/store/ressources';

export default {
  name: 'QuickBarRight',

  data() {
    return {
      hoveredItem: null,
      resources: resources,
    };
  },

  computed: {
    ...mapState(['character']),
    stackedResources() {
      const resourceMap = new Map();
      this.character.resources.forEach(resource => {
        const resourceInfo = this.resources.find(r => r.id === resource.id);
        if (resourceMap.has(resource.id)) {
          resourceMap.get(resource.id).quantity += 1;
        } else {
          resourceMap.set(resource.id, { ...resourceInfo, quantity: 1 });
        }
      });
      return Array.from(resourceMap.values());
    },
  },

  methods: {
    showItemInfo(item) {
      this.hoveredItem = item;
    },
    hideItemInfo() {
      this.hoveredItem = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.quick-bar-right {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff00;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  z-index: 9999;
}

.currency-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: rgba(0, 255, 0, 0.1);
  border-radius: 15px;
  padding: 3px 8px;
  position: relative;
  cursor: pointer;
}

.currency-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 2px rgba(0, 255, 0, 0.7));
  }
}

.currency-amount {
  color: #00ff00;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(0, 255, 0, 0.5);
}

.resources-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.resource-item {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 8px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 255, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 255, 0, 0.2);
  }
}

.resource-icon {
  width: 25px;
  height: 25px;
  margin-bottom: 3px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 2px rgba(0, 255, 0, 0.7));
  }
}

.resource-amount {
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.item-info {
  position: absolute;
  bottom: 200%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 10;
  width: 180px;
  text-align: left;
  color: #fff;
  font-size: 0.8rem;
  border: 1px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

@media screen and (max-width: 768px) {
  .quick-bar-right {
    bottom: 10px;
    right: 10px;
    padding: 8px;
  }

  .currency-container {
    padding: 2px 6px;
    margin-bottom: 8px;
  }

  .currency-icon {
    width: 18px;
    height: 18px;
  }

  .currency-amount {
    font-size: 0.9rem;
  }

  .resources-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .resource-icon {
    width: 22px;
    height: 22px;
  }

  .resource-amount {
    font-size: 0.7rem;
  }
}
</style>
