<template>
  <div class="map-container h-100">
    <l-map ref="map" :zoom="zoom" :center="center" :options="mapOptions">
      <l-tile-layer :url="tileUrl" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="markerPosition">
        <l-popup>
          <div v-if="selectedQuest">
            <div class="card my-2">
              <div class="card-header p-0 d-flex">
                <div class="col-6" :style="{
                  backgroundImage: `url(${require(`@/assets/quests/bg/${selectedQuest.id}.jpg`)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                  backgroundRepeat: 'no-repeat'
                }"></div>

                <div class="col-6 bg-light">
                  <h5 class="card-text-header text-capitalize p-2">{{ selectedQuest.name }}</h5>
                  <p class="card-text card-text-desc p-2">{{ selectedQuest.desc }}</p>
                </div>
              </div>
              <div class="progress p-0 m-0">
                <div class="progress-bar p-0 m-0" :style="{ width: selectedQuest.progress + '%' }"></div>
              </div>
              <div class="card-body bg-secondary bg-gradient p-2">
                <p class="card-text" v-if="selectedQuest.state === 'in-progress'">Remaining Time: {{ formatTime(selectedQuest.remainingTime) }}</p>
                <div class="d-flex align-items-center justify-content-center">
                  <div class="flex-grow-1 text-center">
                    <button class="btn btn-success bg-gradient" :disabled="isButtonDisabled(selectedQuest)" @click="handleQuestAction(selectedQuest)" style="width: 100%;">
                      {{ selectedQuest.state === 'not-started' ? 'Start Quest' : selectedQuest.state === 'in-progress' ? 'Please Wait' : 'Claim Rewards' }}
                    </button>
                  </div>
                  <div class="d-flex justify-content-around flex-grow-1 text-center">
                    <div style="margin-top:5px;" class="card-text d-block fw-bold">
                      <img style="width:25px; margin-top:-5px;" :src="require(`@/assets/interface/icons/exp.png`)" alt="Exp"> {{ selectedQuest.exp }}
                    </div>
                    <div style="margin-top:5px;" class="card-text d-block fw-bold"><img style="width:25px; margin-top:-5px;" :src="require(`@/assets/interface/icons/money.png`)" alt="Money"> {{ selectedQuest.money }}</div>
                  </div>
                </div>
              </div>
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
      zoom: 13,
      center: [51.505, -0.09],
      tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomControl: false,
        attributionControl: false,
      },
      markerPosition: [51.505, -0.09],
      popupTitle: '',
      popupDesc: '',
      selectedQuest: null,
    };
  },
  computed: {
    ...mapState(['quests']),
  },
  mounted() {
    this.$nextTick(() => {
      this.updateMapSize();
      window.addEventListener('resize', this.updateMapSize);
      this.selectRandomQuest();
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
    ...mapActions(['handleQuest', 'claimRewards', 'startQuestProgress']),
    selectRandomQuest() {
      const availableQuests = this.quests.filter(quest => quest.state === 'not-started');
      this.selectedQuest = availableQuests.length > 0 ? availableQuests[0] : null;
    },
    handleQuestAction(quest) {
      if (quest.state === 'not-started') {
        this.handleQuest(quest);
        this.startQuestProgress(quest);
      } else if (quest.state === 'completed') {
        this.claimRewardsAction(quest);
      }
    },
    claimRewardsAction(quest) {
      if (!quest.claimed) {
        this.claimRewards(quest);
        this.popupTitle = quest.name;
        this.popupDesc = 'Quest completed! You earned ' + quest.exp + ' exp and ' + quest.money + ' money.';
        if (this.$refs.questPopup) {
          this.$refs.questPopup.openPopup();
        }
        quest.claimed = true;
      }
    },
    formatTime(milliseconds) {
      if (isNaN(milliseconds)) {
        return '';
      }
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes} min ${seconds} sec`;
    },
    isButtonDisabled(quest) {
      if (quest.state === 'not-started') {
        return false;
      } else if (quest.state === 'in-progress') {
        return true;
      } else if (quest.state === 'completed') {
        return false;
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
.card-body {
  color: white;
  text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
}
.card-text {
  font-size: 0.8rem;
  font-weight: 400;
}
.card-text-header {
  font-weight: 600;
  font-size: 1rem;
}
.card-text-desc {
  font-size: 1rem;
  font-weight: 400;
}
</style>
