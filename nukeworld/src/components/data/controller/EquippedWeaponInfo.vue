<template>
  <div v-if="equippedWeapons.length" class="equipped-weapon-info">
    <h3>Equipped Weapons</h3>
    <ul>
      <li v-for="weapon in equippedWeapons" :key="weapon.uuid">
        <p><strong>Name:</strong> {{ weapon.name }}</p>
        <p><strong>Description:</strong> {{ weapon.desc }}</p>
        <p><strong>Attack:</strong> {{ weapon.attack }}</p>
        <p><strong>Defence:</strong> {{ weapon.defence }}</p>
      </li>
    </ul>
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
