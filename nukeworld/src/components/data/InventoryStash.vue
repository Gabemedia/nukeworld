<template>
    <div>
      <h2>Inventory</h2>
      <ul>
        <li v-for="item in character.inventory" :key="item.id">
          {{ item.name }} <button @click="equipItem(item.id)">Equip</button>
        </li>
      </ul>
      <h2>Equipped Item</h2>
      <p v-if="character.equipped">{{ character.equipped.name }}</p>
      <p v-else>No item equipped</p>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    name: 'InventoryStash',
    computed: {
      ...mapState(['character']),
    },
    methods: {
      ...mapActions(['equipItem']),
    },
  };
  </script>
  