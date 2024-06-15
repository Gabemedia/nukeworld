<!-- MapComponent.vue -->
<template>
  <div class="map-container">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions" @click="onMapClick">
      <l-image-overlay :url="mapImageUrl" :bounds="mapBounds" :opacity="1"></l-image-overlay>
      <l-marker
        v-for="quest in filteredQuests"
        :key="quest.id"
        :lat-lng="[quest.lat, quest.lon]"
        :icon="customIcon"
        @click="openModal(quest)"
      >
      </l-marker>
      <l-marker
        v-for="marker in markers"
        :key="marker.id"
        :lat-lng="[marker.lat, marker.lon]"
        @click="openModal(marker)"
      >
      </l-marker>
    </l-map>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <QuestDetails v-if="selectedQuest" :quest="selectedQuest"></QuestDetails>
        <div v-if="selectedMarker">{{ selectedMarker.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LMarker, LImageOverlay } from '@vue-leaflet/vue-leaflet';
import { mapState } from 'vuex';
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
        iconUrl: require('@/assets/interface/icons/reward.png'),
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      }),
      isMarkerPlacementEnabled: true,
      showModal: false,
      selectedQuest: null,
      selectedMarker: null,
    };
  },
  computed: {
    ...mapState(['quests', 'markers']),
    filteredQuests() {
      return this.quests.filter(quest => !quest.userCreated && quest.lat && quest.lon && (quest.state === 'not-started' || quest.state === 'completed'));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateMapSize();
      window.addEventListener('resize', this.updateMapSize);
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateMapSize);
  },
  methods: {
    updateMapSize() {
      const map = this.$refs.map?.$mapObject;
      if (map) {
        map.fitBounds(this.mapBounds);
        map.invalidateSize(false);
      }
    },
    onMapClick(event) {
      if (this.isMarkerPlacementEnabled) {
        const { lat, lng } = event.latlng;
        const newMarker = {
          id: Date.now(),
          lat,
          lon: lng,
          label: `LAT: ${lat.toFixed(6)}, LON: ${lng.toFixed(6)}`,
          userCreated: true,
        };
        this.$store.commit('addMarker', newMarker);
      }
    },
    openModal(item) {
      if (Object.prototype.hasOwnProperty.call(item, 'name')) {
        this.selectedQuest = item;
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
  watch: {
    selectedMarkerCoords(newCoords) {
      if (newCoords) {
        this.center = newCoords;
      }
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
  z-index: -999;
  width: 100%;
  height: 100vh;
}
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
