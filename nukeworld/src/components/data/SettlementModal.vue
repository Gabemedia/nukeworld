<template>
  <div>
    <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
      <img class="sidebar-icon" :src="require(`@/assets/interface/icons/settlement.png`)" title="Settlement">
    </button>
    <div v-if="isSettlementPlacementModalOpen" class="modal" tabindex="-1" @click.self="closePlacementModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Settlement</h5>
          </div>
          <div class="modal-body">
            <p>Du har ikke placeret en settlement endnu. Klik på kortet for at placere en.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isSettlementConfirmationModalOpen" class="modal" tabindex="-1" @click.self="closeConfirmationModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Settlement</h5>
          </div>
          <div class="modal-body">
            <p>Det koster 20 Wood Scrap at placere en settlement. Vil du fortsætte?</p>
            <div class="button-group">
              <button @click="confirmPlaceSettlement" class="btn btn-primary">Ja</button>
              <button @click="cancelPlaceSettlement" class="btn btn-secondary">Nej</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'SettlementModal',
  data() {
    return {
      isSettlementPlacementModalOpen: false,
      isSettlementConfirmationModalOpen: false,
      pendingSettlementLocation: null,
    };
  },
  computed: {
    ...mapState(['isSettlementModalOpen', 'settlementMarker']),
  },
  methods: {
    ...mapMutations(['setSettlementModalOpen']),
    ...mapActions(['updateSettlementMarker', 'checkRequiredResources', 'useRequiredResources']),
    openModal() {
      this.setSettlementModalOpen(true);
    },
    closeModal() {
      this.setSettlementModalOpen(false);
      this.showSettlementConfirmation = false;
      this.pendingSettlementLocation = null;
    },

    async confirmRemoveSettlement() {
      if (confirm('Er du sikker på, at du vil fjerne din settlement?')) {
        await this.updateSettlementMarker(null);
        this.closeModal();
      }
    },

    openPlacementModal() {
      this.isSettlementPlacementModalOpen = true;
    },

    closePlacementModal() {
      this.isSettlementPlacementModalOpen = false;
    },

    openConfirmationModal() {
      this.isSettlementConfirmationModalOpen = true;
    },

    closeConfirmationModal() {
      this.isSettlementConfirmationModalOpen = false;
      this.pendingSettlementLocation = null;
    },

    async attemptPlaceSettlement(latlng) {
      const requiredResources = [{ id: 1, amount: 20 }];
      const hasEnoughResources = await this.checkRequiredResources(requiredResources);
      if (hasEnoughResources) {
        this.pendingSettlementLocation = latlng;
        this.openConfirmationModal();
      } else {
        alert('Du har ikke nok Wood Scrap til at placere en settlement. Du skal bruge 20 Wood Scrap.');
      }
    },

    async confirmPlaceSettlement() {
      const requiredResources = [{ id: 1, amount: 20 }];
      await this.useRequiredResources(requiredResources);
      await this.updateSettlementMarker({
        latlng: this.pendingSettlementLocation,
        name: ''
      });
      this.showSettlementConfirmation = false;
      this.pendingSettlementLocation = null;
      this.closeModal();
    },
    cancelPlaceSettlement() {
      this.showSettlementConfirmation = false;
      this.pendingSettlementLocation = null;
      this.closeModal();
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
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 100%;
    margin: 1.75rem auto;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  background-clip: padding-box;
  border: 1px #fff solid;
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>
