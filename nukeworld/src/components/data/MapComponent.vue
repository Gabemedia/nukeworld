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
    <div v-if="$store.state.isSettlementModalOpen" class="modal" @click.self="closeSettlementModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $store.state.settlementMarker ? 'Place Settlement' : 'New Settlement' }}</h5>
            <button type="button" class="close" @click="closeSettlementModal">&times;</button>
          </div>
          <div class="modal-body">
            <input v-model="settlementName" placeholder="Settlement Navn" class="form-control">
          </div>
          <div class="modal-footer">
            <button @click="saveSettlement" class="btn btn-primary">Gem</button>
            <button v-if="$store.state.settlementMarker" @click="deleteSettlement" class="btn btn-danger">Slet</button>
            <button @click="closeSettlementModal" class="btn btn-secondary">Annuller</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LMarker, LImageOverlay } from '@vue-leaflet/vue-leaflet';
import { mapState, mapGetters } from 'vuex';
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
      settlementName: '',
      settlementIcon: L.icon({
        iconUrl: require('@/assets/interface/icons/settlement_marker.png'),
        iconSize: [30, 45],
        iconAnchor: [12, 12],
      }),
    };
  },
  computed: {
    ...mapState(['quests', 'markers', 'character']),
    ...mapGetters(['isSettlementModalOpen']),
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
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMapSize);
    window.removeEventListener('resize', this.updateZoom);
  },
  methods: {
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
    onMapClick(event) {
      if (!this.$store.state.settlementMarker) {
        this.$store.commit('updateSettlementMarker', {
          latlng: event.latlng,
          name: ''
        });
        this.openSettlementModal();
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
    onMarkerDragEnd(event) {
      this.$store.commit('updateSettlementMarker', {
        ...this.$store.state.settlementMarker,
        latlng: event.target.getLatLng(),
      });
    },
    openSettlementModal() {
      this.settlementName = this.$store.state.settlementMarker ? this.$store.state.settlementMarker.name : '';
      this.$store.commit('setSettlementModalOpen', true);
    },
    closeSettlementModal() {
      this.$store.commit('setSettlementModalOpen', false);
      if (this.$store.state.settlementMarker && !this.$store.state.settlementMarker.name) {
        this.$store.commit('deleteSettlementMarker');
      }
    },
    saveSettlement() {
      this.$store.commit('updateSettlementMarker', {
        ...this.$store.state.settlementMarker,
        name: this.settlementName,
      });
      this.$store.commit('setSettlementModalOpen', false);
    },
    deleteSettlement() {
      this.$store.commit('deleteSettlementMarker');
      this.$store.commit('setSettlementModalOpen', false);
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
