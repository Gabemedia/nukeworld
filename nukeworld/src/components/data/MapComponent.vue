<template>
  <div class="map-container">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions" @click="onMapClick">
      <l-image-overlay :url="mapImageUrl" :bounds="mapBounds" :opacity="1"></l-image-overlay>

      <l-marker
        v-for="quest in filteredQuests"
        :key="quest.id"
        :lat-lng="[quest.lat, quest.lon]"
        :icon="getQuestIcon(quest)"
        @click="openModal(quest)"
      >
      </l-marker>

      <l-marker
        v-if="$store.state.settlementMarker"
        :lat-lng="$store.state.settlementMarker.latlng"
        :icon="settlementIcon"
        draggable
        @dragend="onMarkerDragEnd"
        @click="openSettlementModal"
      >
      </l-marker>

    </l-map>
    <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <QuestDetails v-if="selectedQuest" :quest="selectedQuest"></QuestDetails>
            <div v-if="selectedMarker">{{ selectedMarker.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Settlement confirmation modal -->
    <div v-if="showSettlementConfirmation" class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Placer Settlement</h5>
            <button type="button" class="close" @click="cancelPlaceSettlement">&times;</button>
          </div>
          <div class="modal-body">
            <p>Det koster 20 Wood Scrap at placere en settlement. Vil du fortsætte?</p>
          </div>
          <div class="modal-footer">
            <button @click="confirmPlaceSettlement" class="btn btn-primary">Ja</button>
            <button @click="cancelPlaceSettlement" class="btn btn-secondary">Nej</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LMarker, LImageOverlay } from '@vue-leaflet/vue-leaflet';
import { mapState, mapGetters, mapActions } from 'vuex';
import QuestDetails from './controller/QuestDetails.vue';
import L from 'leaflet';

export default {
  components: {
    LMap,
    LMarker,
    QuestDetails,
    LImageOverlay,
  },
  data() {
    return {
      zoom: 0,
      center: [600, 960],
      mapImageUrl: require('@/assets/maps/nukemap1.webp'),
      mapBounds: [[230, 230], [930, 1700]],
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        crs: L.CRS.Simple,
      },
      selectedMarkerCoords: null,
      customIcon: L.icon({
        iconUrl: require('@/assets/interface/icons/marker.png'),
        iconSize: [30, 40],
        iconAnchor: [12, 12],
      }),
      showModal: false,
      selectedQuest: null,
      selectedMarker: null,
      showSettlementConfirmation: false,
      pendingSettlementLocation: null,
      settlementIcon: L.icon({
        iconUrl: require('@/assets/interface/icons/settlement_marker.png'),
        iconSize: [30, 45],
        iconAnchor: [15, 45],
      }),
    };
  },
  computed: {
    ...mapState(['quests', 'markers', 'character']),
    ...mapGetters(['getResource']),
    filteredQuests() {
      return this.quests.filter(quest => 
        !quest.userCreated && 
        quest.lat && 
        quest.lon && 
        (quest.state === 'not-started' || quest.state === 'ready-to-claim') &&
        quest.levelRequirement <= this.character.level
      );
    },
  },
  created() {
    this.forceUpdateZoom();
    this.updateDragging();
  },
  mounted() {
    this.$nextTick(() => {
      this.updateMapSize();
      window.addEventListener('resize', this.updateMapSize);
      window.addEventListener('resize', this.updateZoom);
      if (this.$store.state.settlementMarker) {
        this.$nextTick(() => {
          const map = this.$refs.map.$mapObject;
          if (map) {
            map.setView(this.$store.state.settlementMarker.latlng, this.zoom);
          }
        });
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMapSize);
    window.removeEventListener('resize', this.updateZoom);
  },
  methods: {
    ...mapActions(['checkRequiredResources', 'useRequiredResources', 'updateSettlementMarker', 'openSettlementModal']),
    updateMapSize() {
      const map = this.$refs.map?.$mapObject;
      if (map) {
        map.fitBounds(this.mapBounds);
        map.invalidateSize(true);
      }
    },
    forceUpdateZoom() {
      this.zoom = window.innerWidth >= 1600 ? 1 : 0;
      this.$nextTick(() => {
        const map = this.$refs.map?.$mapObject;
        if (map) {
          map.setZoom(this.zoom);
          map.invalidateSize(true);
          map.fitBounds(this.mapBounds);
        }
        this.updateDragging();
      });
    },
    updateZoom() {
      this.zoom = window.innerWidth >= 1600 ? 1 : 0;
      this.updateDragging();
    },
    updateDragging() {
      this.mapOptions.dragging = window.innerWidth >= 1600;
    },

    async onMapClick(event) {
      if (!this.$store.state.settlementMarker) {
        const requiredResources = [{ id: 1, amount: 20 }];
        const hasEnoughResources = await this.checkRequiredResources(requiredResources);
        if (hasEnoughResources) {
          this.pendingSettlementLocation = event.latlng;
          this.showSettlementConfirmation = true;
        } else {
          alert('Du har ikke nok Wood Scrap til at placere en settlement. Du skal bruge 20 Wood Scrap.');
        }
      }
    },

    async confirmPlaceSettlement() {
      console.log('Confirming settlement placement');
      const requiredResources = [{ id: 1, amount: 20 }];
      console.log('Required resources:', requiredResources);
      console.log('Current resources:', this.character.resources);
      
      const hasEnoughResources = await this.checkRequiredResources(requiredResources);
      console.log('Has enough resources:', hasEnoughResources);

      if (hasEnoughResources) {
        console.log('Resources check passed');
        this.useRequiredResources(requiredResources);
        console.log('Resources after deduction:', this.character.resources);
        
        console.log('Updating settlement marker');
        this.updateSettlementMarker({
          latlng: this.pendingSettlementLocation,
          name: ''
        });
        console.log('Settlement marker updated:', this.$store.state.settlementMarker);
        
        console.log('Opening settlement modal');
        this.openSettlementModal();
      } else {
        console.log('Not enough resources');
        alert('Du har ikke nok Wood Scrap til at placere en settlement. Du skal bruge 20 Wood Scrap.');
      }
      this.showSettlementConfirmation = false;
      this.pendingSettlementLocation = null;
    },


    onMarkerDragEnd(event) {
      this.updateSettlementMarker({
        ...this.$store.state.settlementMarker,
        latlng: event.target.getLatLng(),
      });
    },
    removeSettlement() {
      if (confirm('Er du sikker på, at du vil fjerne din settlement?')) {
        this.updateSettlementMarker(null);
      }
    },

    getQuestIcon(quest) {
      if (quest.state === 'not-started') {
        return L.icon({
          iconUrl: require('@/assets/interface/icons/marker.png'),
          iconSize: [30, 40],
          iconAnchor: [12, 12],
          className: 'quest-marker',
        });
      } else if (quest.state === 'ready-to-claim') {
        return L.icon({
          iconUrl: require('@/assets/interface/icons/claim-quest.png'),
          iconSize: [30, 40],
          iconAnchor: [12, 12],
          className: 'claim-marker',
        });
      }
    },
    openModal(item) {
      if (Object.prototype.hasOwnProperty.call(item, 'name')) {
        this.selectedQuest = item;
        if (item.state === 'completed' && !item.claimed) {
          this.selectedQuest.state = 'completed';
        }
      } else {
        this.selectedMarker = item;
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedQuest = null;
      this.selectedMarker = null;
    },
  },
};
</script>

<style scoped>
@import url(../../assets/MapPopup.css);
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -999;
}
.leaflet-container{
  background: linear-gradient(180deg, rgb(180, 141, 102) 0%, rgb(188, 140, 87) 100%);
  margin-top: -15px;
}
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
  background-color: rgba(0, 0, 0, 0.4);
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
  overflow-y: scroll;
  padding: 0px;
}
.modal-content {
  position: relative;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}
</style>
