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
        :options="{ className: getBounceClass(quest) }"
      >
      </l-marker>

      <l-marker
        v-for="quest in filteredQuests"
        :key="quest.id"
        :lat-lng="[quest.lat, quest.lon]"
        :icon="getQuestIcon(quest)"
        @click="openModal(quest)"
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
      mapImageUrl: require('@/assets/maps/nukemap2.webp'),
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
      isMarkerPlacementEnabled: false,
      showModal: false,
      selectedQuest: null,
      selectedMarker: null,
    };
  },
  computed: {
    ...mapState(['quests', 'markers']),
    filteredQuests() {
      return this.quests.filter(quest => !quest.userCreated && quest.lat && quest.lon && (quest.state === 'not-started' || quest.state === 'ready-to-claim'));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateMapSize();
      window.addEventListener('resize', this.updateMapSize);
      window.addEventListener('resize', this.updateZoom);
      this.forceUpdateZoom();
      this.updateDragging();
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
      });
    },
    updateZoom() {
      this.zoom = window.innerWidth >= 1600 ? 1 : 0;
    },
    updateDragging() {
      this.mapOptions.dragging = window.innerWidth >= 1600;
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
    getQuestIcon(quest) {
      if (quest.state === 'not-started') {
        return L.icon({
          iconUrl: require('@/assets/interface/icons/marker.png'),
          iconSize: [30, 40],
          iconAnchor: [12, 12],
        });
      } else if (quest.state === 'ready-to-claim') {
        return L.icon({
          iconUrl: require('@/assets/interface/icons/claim-quest.png'),
          iconSize: [30, 40],
          iconAnchor: [12, 12],
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
    getBounceClass(quest) {
    return quest.state === 'ready-to-claim' && !quest.claimed ? 'bounce-marker' : '';
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
.modal {
  display: block;
  position: absolute;
  z-index: 999;
  left: 0;
  top: 50px;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  margin: 15% auto;
}
.modal-body{
  padding: 0!important;
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.bounce-marker {
  animation: bounce 1s infinite;
}
</style>
