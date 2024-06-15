<template>
  <div class="map-container">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions" @click="onMapClick">
      <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
      <l-marker
        v-for="quest in filteredQuests"
        :key="quest.id"
        :lat-lng="[quest.lat, quest.lon]"
        @click="centerOnMarker(quest.lat, quest.lon)"
        :icon="customIcon"
      >
        <l-popup :open-on="'bottom'">
          <QuestDetails :quest="quest"></QuestDetails>
        </l-popup>
      </l-marker>
      <l-marker
        v-for="marker in markers"
        :key="marker.id"
        :lat-lng="[marker.lat, marker.lon]"
      >
        <l-popup :open-on="'bottom'">
          <div>{{ marker.label }}</div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { mapState } from 'vuex';
import QuestDetails from './controller/QuestDetails.vue';
import L from 'leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    QuestDetails,
  },
  data() {
    return {
      zoom: 12, // Ændret zoom niveau
      center: [51.52, -0.11], // Ændret center koordinater
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Ændret tile URL
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        maxBounds: this.getRandomBounds(), // Tilfældige maxBounds
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
      },
      selectedMarkerCoords: null,
      customIcon: L.icon({
        iconUrl: require('@/assets/interface/icons/reward.png'),
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      }),
      isMarkerPlacementEnabled: true,
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
        map.setView(this.center, this.zoom, {
          animate: false,
          maxBounds: this.mapOptions.maxBounds,
        });
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
    centerOnMarker(lat, lon) {
      this.selectedMarkerCoords = [lat, lon];
      const map = this.$refs.map?.$mapObject;
      if (map) {
        map.panTo([lat, lon]);
      }
    },
    getRandomBounds() {
      const lat1 = Math.random() * (51.6 - 51.4) + 51.4;
      const lat2 = Math.random() * (51.6 - 51.4) + 51.4;
      const lon1 = Math.random() * (-0.2 - -0.4) + -0.4;
      const lon2 = Math.random() * (0.0 - -0.2) + -0.2;
      return [[Math.min(lat1, lat2), Math.min(lon1, lon2)], [Math.max(lat1, lat2), Math.max(lon1, lon2)]];
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
.leaflet-popup-content-wrapper {
  transform: translateY(10px);
}
</style>
