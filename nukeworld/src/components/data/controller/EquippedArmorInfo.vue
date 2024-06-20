<template>
    <div v-if="equippedArmor" class="equipped-armor-info text-white">
      <h2>Equipped Armor</h2>
      <p><strong>Name:</strong> {{ equippedArmor.name }}</p>
      <p><strong>Description:</strong> {{ equippedArmor.desc }}</p>
      <p><strong>Defence:</strong> {{ equippedArmor.defence }}</p>
      <p><strong>Price:</strong> <span v-if="equippedArmor.price === '-1'" class="badge bg-danger">Not for Sale</span><span v-else>{{ equippedArmor.price }} coins</span></p>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'EquippedArmorInfo',
    computed: {
      ...mapState(['character']),
      equippedArmor() {
        return this.character.equippedArmor;
      },
    },
  };
  </script>
  