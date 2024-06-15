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
      zoom: 13,
      center: [51.505, -0.09],
      tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        maxBounds: [[51.470, -0.3], [51.50, -0.06]], // Increase the maxBounds area
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
        map.setView([51.505, -0.09], 13, {
          animate: false,
          maxBounds: [[51.470, -0.3], [51.50, -0.06]], // Set the maxBounds option
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
