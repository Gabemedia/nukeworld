<template>
  <l-map :zoom="zoom" :center="center">
    <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
    <!-- Add markers or other Leaflet components as needed -->
  </l-map>
</template>

<script>
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 13,
      center: [51.505, -0.09],
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
};
</script>
