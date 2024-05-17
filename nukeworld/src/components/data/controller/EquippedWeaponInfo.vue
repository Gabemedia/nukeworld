<template>
  <div v-if="equippedWeapon" class="equipped-weapon-info">
    <h3>Equipped Weapon</h3>
    <p><strong>Name:</strong> {{ equippedWeapon.name }}</p>
    <p><strong>Description:</strong> {{ equippedWeapon.desc }}</p>
    <p><strong>Attack:</strong> {{ equippedWeapon.attack }}</p>
    <p><strong>Defence:</strong> {{ equippedWeapon.defence }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'EquippedWeaponInfo',
  computed: {
    ...mapState(['character', 'items']),
    equippedWeapon() {
      return this.character.equippedWeapon !== null
        ? this.items.find(item => item.id === this.character.equippedWeapon)
        : null;
    },
  },
};
</script>
