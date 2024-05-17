<template>
  <div>
    <h2>Inventory</h2>
    <ul>
      <li v-for="item in inventory" :key="item.id">
        {{ item.name }}
        <button v-if="item.state === 'none'" @click="equipWeapon(item.id)">Equip</button>
        <span v-else-if="item.state === 'equipped'" class="equipped-badge">Equipped</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'InventoryStash',
  computed: {
    ...mapState(['character', 'items']),
    inventory() {
      return this.items.filter(item => item.attack > 0);
    },
  },
  methods: {
    ...mapActions(['equipWeapon']),
  },
};
</script>

<style scoped>
.equipped-badge {
  background-color: green;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 8px;
}
</style>
