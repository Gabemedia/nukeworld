<template>
    <div class="quick-bar-left">
    <div class="character-info" @mouseover="showItemInfo('character')" @mouseleave="hideItemInfo">
      <div class="character-avatar">
        <img :src="require(`@/assets/interface/icons/player.png`)" alt="Character Avatar">
      </div>
      <div class="character-level">
        <span class="level-number">{{ character.level }}</span>
      </div>
      <div v-if="hoveredItem === 'character'" class="item-info">
        <p class="mb-1 fw-bold small">Character Info</p>
        <p class="mb-1 small">Name: {{ character.name }}</p>
        <p class="mb-1 small">Level: {{ character.level }}</p>
        <p class="mb-1 small">Class: {{ character.class }}</p>
      </div>
    </div>
    <div class="stats-container">
      <div class="stat-bar health-bar" @mouseover="showItemInfo('health')" @mouseleave="hideItemInfo">
        <div class="stat-icon">
          <img :src="require(`@/assets/interface/icons/aid/medkit.png`)" alt="Health">
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: healthPercentage + '%' }"></div>
          <span class="progress-text">{{ character.health }} / {{ character.maxHealth }}</span>
        </div>
        <div v-if="hoveredItem === 'health'" class="item-info">
          <p class="mb-1 fw-bold small">Health</p>
          <p class="mb-1 small">Current: {{ character.health }}</p>
          <p class="mb-1 small">Max: {{ character.maxHealth }}</p>
        </div>
      </div>
      <div class="stat-bar exp-bar" @mouseover="showItemInfo('exp')" @mouseleave="hideItemInfo">
        <div class="stat-icon">
          <img :src="require(`@/assets/interface/icons/exp.png`)" alt="Experience">
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: expPercentage + '%' }"></div>
          <span class="progress-text">{{ character.exp }} / {{ character.maxExp }}</span>
        </div>
        <div v-if="hoveredItem === 'exp'" class="item-info">
          <p class="mb-1 fw-bold small">Experience</p>
          <p class="mb-1 small">Current: {{ character.exp }}</p>
          <p class="mb-1 small">Next Level: {{ character.maxExp }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'QuickBarLeft',  
  data() {
    return {
      hoveredItem: null,
    };
  },
  computed: {
    ...mapState(['character']),
    healthPercentage() {
      return (this.character.health / this.character.maxHealth) * 100;
    },
    expPercentage() {
      return (this.character.exp / this.character.maxExp) * 100;
    },
  },
  methods: {
    ...mapActions(['increaseExp', 'decreaseExp', 'levelUp']),
    showItemInfo(item) {
      this.hoveredItem = item;
    },
    hideItemInfo() {
      this.hoveredItem = null;
    },
  }
};
</script>

<style lang="scss" scoped>
.quick-bar-left {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff00;
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  display: flex;
  align-items: center;
  z-index: 9999;
}

.character-info {
  position: relative;
  margin-right: 15px;
  cursor: pointer;
}

.character-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.character-level {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: #00ff00;
  color: #000;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
}

.stat-icon {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
    filter: drop-shadow(0 0 2px rgba(0, 255, 0, 0.7));
  }
}

.progress-bar {
  width: 150px;
  height: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.health-bar .progress-fill {
  background: linear-gradient(to right, #ff3e3e, #ff7f7f);
}

.exp-bar .progress-fill {
  background: linear-gradient(to right, #3e84ff, #7fa8ff);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.7rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
}

.item-info {
  position: absolute;
  top:-192%;
  left:150%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1;
  width: 200px;
  text-align: left;
  color: #fff;
  font-size: 0.8rem;
  border: 1px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

@media screen and (max-width: 768px) {
  .quick-bar-left {
    top: 10px;
    left: 10px;
    flex-direction: column;
    align-items: flex-start;
  }

  .character-info {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .character-avatar {
    width: 50px;
    height: 50px;
  }

  .progress-bar {
    width: 120px;
  }
}
</style>
