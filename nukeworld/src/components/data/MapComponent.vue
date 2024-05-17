<template>
  <div class="map-container">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions">
      <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="quest in quests" :key="quest.id" :lat-lng="[quest.lat, quest.lon]" @click="centerOnMarker(quest.lat, quest.lon)">
        <l-popup :open-on="'bottom'">
          <QuestDetails :quest="quest"></QuestDetails>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { mapState } from 'vuex';
import QuestDetails from './controller/QuestDetails.vue';

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
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
        maxBounds: [[51.2, -0.4], [51.8, 0.2]], // Increase the maxBounds area
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: true,
      },
      selectedMarkerCoords: null,
    };
  },
  computed: {
    ...mapState(['quests']),
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
        maxBounds: [[51.2, -0.4], [51.8, 0.2]], // Set the maxBounds option
      });
      map.invalidateSize(false);
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
