<template>
  <div v-if="equippedWeapons.length" class="equipped-weapon-info text-white">
    <h2>Equipped Weapons</h2>
    <div v-for="weapon in equippedWeapons" :key="weapon.uuid">
        <p><strong>Name:</strong> {{ weapon.name }}</p>
        <p><strong>Description:</strong> {{ weapon.desc }}</p>
        <p><strong>Attack:</strong> {{ weapon.attack }}</p>
        <p><strong>Defence:</strong> {{ weapon.defence }}</p>
        <p><strong>Price:</strong> <span v-if="weapon.price === '-1'" class="badge bg-danger">Not for Sale</span><span v-else>{{ weapon.price }} coins</span></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'EquippedWeaponInfo',
  computed: {
    ...mapState(['character']),
    equippedWeapons() {
      return this.character.equippedWeapons;
    },
  },
};
</script>
