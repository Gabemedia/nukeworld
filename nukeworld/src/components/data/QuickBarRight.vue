<template>
  <div class="quick-bar-right">
    <div class="d-flex justify-content-end text-white mb-3">
      <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money" class="me-1">
      <span class="mobile-text fw-bold fs-6">NukaCoin: {{ character.money }}</span>
    </div>
    <div class="resources-container">
      <div v-for="resource in stackedResources" :key="resource.id" class="resource-item position-relative">
        <img :src="require(`@/assets/interface/icons/resources/${resource.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="resource.name" />
        <div class="item-actions">
          <button class="btn btn-success btn-sm position-absolute top-0 start-100 translate-middle py-0 px-1">
            <p class="card-text m-0">{{ resource.quantity }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'QuickBarRight',

  computed: {
    ...mapState(['character']),
    stackedResources() {
      const resourceMap = new Map();
      this.character.resources.forEach(resource => {
        if (resourceMap.has(resource.id)) {
          resourceMap.get(resource.id).quantity += 1;
        } else {
          resourceMap.set(resource.id, { ...resource, quantity: 1 });
        }
      });
      return Array.from(resourceMap.values());
    },
  },
};
</script>

<style lang="scss" scoped>
.quick-bar-right {
  position: absolute;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

.resources-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 240px; /* Juster denne værdi efter behov */
}

.resource-item {
  width: 50px;
  height: 50px;
  border: 1px solid #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  margin: 0;
}

.resource-item img {
  max-width: 90%;
  max-height: 90%;
  scale: 1;
}

.item-actions {
  position: absolute;
  top: 0;
  right: 0;
}

.card-text {
  font-size: 0.666rem;
}

@media screen and (max-width: 600px) {
  .quick-bar-right {
    bottom: 10px;
    right: 10px;
  }

  .resources-container {
    width: 200px; /* Juster denne værdi for mobile enheder */
  }

  .resource-item {
    width: 40px;
    height: 40px;
  }

  .card-text {
    font-size: 0.5rem;
  }
}
</style>
