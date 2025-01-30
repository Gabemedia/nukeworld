<template>
  <div>
    <div v-if="isSettlementModalOpen" class="modal" tabindex="-1" @click.self="closeSettlementModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Settlement: {{ settlementMarker.latlng.lat.toFixed(2) }}, {{ settlementMarker.latlng.lng.toFixed(2) }}</h5>
            <button type="button" class="btn-close" @click="closeSettlementModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Your settlement is located at: {{ settlementMarker.latlng.lat.toFixed(2) }}, {{ settlementMarker.latlng.lng.toFixed(2) }}</p>
          </div>
          <div class="modal-footer">
            <template v-if="settlementMarker">
              <button @click="confirmRemoveSettlement" class="btn btn-danger">Remove Settlement</button>
            </template>
            <template v-else>
              <p>You haven't placed a settlement yet.</p>
            </template>
            <button type="button" class="btn btn-secondary" @click="closeSettlementModal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSettlementConfirmationModalOpen" class="modal" tabindex="-1" @click.self="closeConfirmationModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Settlement Placement</h5>
            <button type="button" class="btn-close" @click="closeConfirmationModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>It costs 20 Wood & Steel Scrap to place a settlement. Do you want to continue?</p>
            <div class="button-group">
              <button @click="confirmPlaceSettlement" class="btn btn-primary">Yes</button>
              <button @click="cancelPlaceSettlement" class="btn btn-secondary">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'SettlementModal',
  computed: {
    ...mapState(['settlementMarker', 'isSettlementModalOpen']),
  },
  data() {
    return {
      isSettlementConfirmationModalOpen: false,
      pendingSettlementLocation: null,
    };
  },
  methods: {
    ...mapActions(['updateSettlementMarker', 'checkRequiredResources', 'useRequiredResources']),
    ...mapMutations(['setSettlementModalOpen']),
    openSettlementModal() {
      this.setSettlementModalOpen(true);
    },
    closeSettlementModal() {
      this.setSettlementModalOpen(false);
    },
    openConfirmationModal() {
      this.isSettlementConfirmationModalOpen = true;
    },
    closeConfirmationModal() {
      this.isSettlementConfirmationModalOpen = false;
      this.pendingSettlementLocation = null;
    },
    async confirmRemoveSettlement() {
      if (confirm('Are you sure you want to remove your settlement?')) {
        await this.updateSettlementMarker(null);
        this.closeSettlementModal();
      }
    },
    async attemptPlaceSettlement(latlng) {
      const requiredResources = [{ id: 1, amount: 20 }, { id: 2, amount: 20 }];
      const hasEnoughResources = await this.checkRequiredResources(requiredResources);
      if (hasEnoughResources) {
        this.pendingSettlementLocation = latlng;
        this.openConfirmationModal();
      } else {
        alert('You don\'t have enough Wood Scrap to place a settlement. You need 20 Wood & Steel Scrap.');
      }
    },
    async confirmPlaceSettlement() {
      const requiredResources = [{ id: 1, amount: 20 }, { id: 2, amount: 20 }];
      await this.useRequiredResources(requiredResources);
      await this.updateSettlementMarker({
        latlng: this.pendingSettlementLocation,
        name: ''
      });
      this.closeConfirmationModal();
      this.closeSettlementModal();
    },
    cancelPlaceSettlement() {
      this.closeConfirmationModal();
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
  color: #fff;
}

.modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 0.75rem 1rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.modal-footer {
  border-top: 1px solid #00ff00;
  padding: 0.75rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  background-color: #00cc00;
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;
}

.btn-secondary:hover {
  background-color: #00ff00;
  color: #000;
}

.btn-danger {
  background-color: #ff0000;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #cc0000;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-close {
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-close:hover {
  color: #00cc00;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem auto;
  }
}
</style>
