<template>
  <div class="map-container h-100">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions">
      <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="markerPosition"></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 13,
      center: [51.505, -0.09], // Set your desired center coordinates
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomControl: false, // Disable zoom control
        attributionControl: false, // Hide attribution control
      },
      markerPosition: [51.505, -0.09], // Set your desired marker coordinates
    };
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
        map.invalidateSize();
      }
    },
  },
};
</script>

<style scoped>
.map-container {
  position: absolute;
  top: 0;
  left:0;
  z-index:-999;
  width: 100%;
  height: 100vh;
}
</style>
