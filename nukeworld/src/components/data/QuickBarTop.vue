<template>
    <div class="quick-bar-top">
      <div class="resource-container" v-for="resource in stackedResources" :key="resource.id">
        <div class="resource-item" @mouseover="showItemInfo(resource)" @mouseleave="hideItemInfo">
          <img :src="require(`@/assets/interface/icons/resources/${resource.name.toLowerCase().replace(/ /g, '_')}.png`)" :title="resource.name" />
          <span class="resource-quantity">{{ resource.quantity }}</span>
        </div>
        <div v-if="hoveredItem === resource" class="item-info">
          <p class="mb-1 fw-bold small"><strong>Navn:</strong> {{ resource.name }}</p>
          <p class="mb-1 small"><strong>Beskrivelse:</strong> {{ resource.desc }}</p>
          <p class="mb-1 small"><strong>Antal:</strong> {{ resource.quantity }}</p>
          <p class="mb-1 small"><strong>Pris:</strong> {{ resource.price }} mønter</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'QuickBarTop',
    data() {
      return {
        hoveredItem: null,
      };
    },
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
  .quick-bar-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px;
    z-index: 9999;
  }
  
  .resource-container {
    position: relative;
    margin: 0 5px;
  }
  
  .resource-item {
    width: 40px;
    height: 40px;
    border: 1px solid #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
  }
  
  .resource-item img {
    max-width: 80%;
    max-height: 80%;
  }
  
  .resource-quantity {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background-color: #4caf50;
    color: white;
    border-radius: 50%;
    padding: 2px 5px;
    font-size: 10px;
  }
  
  .item-info {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 1;
    width: 200px;
    text-align: left;
  }
  
  @media screen and (max-width: 600px) {
    .quick-bar-top {
      justify-content: flex-start;
      overflow-x: auto;
    }
  
    .resource-item {
      width: 30px;
      height: 30px;
    }
  
    .resource-quantity {
      font-size: 8px;
    }
  }
  </style>
  