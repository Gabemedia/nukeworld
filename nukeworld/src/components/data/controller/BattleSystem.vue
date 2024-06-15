<!-- src/components/data/controller/BattleSystem.vue -->
<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title">Battle System</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="battle-system">
        <!-- Vis spillerens og fjendens liv, handlinger og kamplog -->
        <div class="player-info">
          <!-- Vis spilleroplysninger, liv, udrustede våben og rustning -->
        </div>
        <div class="enemy-info">
          <!-- Vis fjendeoplysninger og liv -->
        </div>
        <div class="battle-actions">
          <!-- Vis tilgængelige handlinger (f.eks. angreb, forsvar, brug af genstand) -->
        </div>
        <div class="battle-log">
          <!-- Vis kamploggen -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BattleSystem',
  // ...
};
</script>
