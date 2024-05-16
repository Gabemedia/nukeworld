<template>
  <div class="map-container h-100">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions">
      <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="markerPosition">
        <l-popup>
          <div v-if="randomQuest">
            <h4>{{ randomQuest.name }}</h4>
            <p>{{ randomQuest.description }}</p>
            <p>Reward: {{ randomQuest.exp }} EXP, {{ randomQuest.money }} Money</p>
            <p>Duration: {{ formatDuration(randomQuest.duration) }}</p>
            <button v-if="randomQuest.state === 'not-started'" @click="startQuest(randomQuest)">Start Quest</button>
            <div v-else-if="randomQuest.state === 'in-progress'">
              <p>Quest in progress...</p>
              <progress :value="randomQuest.progress" max="100"></progress>
              <p>Remaining Time: {{ formatDuration(randomQuest.remainingTime) }}</p>
            </div>
            <div v-else-if="randomQuest.state === 'completed'">
              <p>Quest completed!</p>
              <button @click="claimRewards(randomQuest)">Claim Rewards</button>
            </div>
          </div>
          <div v-else>
            No available quests.
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      zoom: 13, // Adjusted zoom level for a closer view of Seattle
      center: [47.6062, -122.3321], // Center coordinates for Seattle, WA
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomControl: false, // Disable zoom control
        attributionControl: false, // Hide attribution control
        maxBounds: [[47.5, -122.4], [47.7, -122.2]], // Set bounds to limit panning to Seattle area
        scrollWheelZoom: false, // Disable zoom by scroll wheel
        doubleClickZoom: false, // Disable zoom by double click
        dragging: true, // Enable dragging to pan the map
      },
      markerPosition: [47.6062, -122.3321], // Marker position in Seattle
    };
  },
  computed: {
    ...mapState(['quests']),
    randomQuest() {
      const availableQuests = this.quests.filter(quest => quest.state === 'not-started');
      return availableQuests.length > 0 ? availableQuests[Math.floor(Math.random() * availableQuests.length)] : null;
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
        map.invalidateSize();
      }
    },
    ...mapActions(['handleQuest', 'claimRewards']),
    startQuest(quest) {
      this.handleQuest(quest);
    },
    formatDuration(duration) {
      const seconds = Math.floor(duration / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      const daysDisplay = days > 0 ? `${days} day${days > 1 ? 's' : ''} ` : '';
      const hoursDisplay = hours % 24 > 0 ? `${hours % 24} hour${(hours % 24) > 1 ? 's' : ''} ` : '';
      const minutesDisplay = minutes % 60 > 0 ? `${minutes % 60} minute${(minutes % 60) > 1 ? 's' : ''} ` : '';
      const secondsDisplay = seconds % 60 > 0 ? `${seconds % 60} second${(seconds % 60) > 1 ? 's' : ''}` : '';

      return `${daysDisplay}${hoursDisplay}${minutesDisplay}${secondsDisplay}`;
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
</style>
