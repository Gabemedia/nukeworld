<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">NukeWorld</router-link>
        <button class="navbar-toggler" type="button" @click="navOpen = !navOpen">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div :class="['collapse navbar-collapse', { 'show': navOpen }]">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'UserLogin' }">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'GameWorld' }">Game World</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'GameSettings' }">Game Settings</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="fullscreen-toggle" @click="toggleFullscreen">
      {{ isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
    </div>
    <div class="d-flex justify-content-center game-container mt-3" :style="gameContainerStyle">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      navOpen: false,
      isFullscreen: false,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  },
  computed: {
    ...mapState({
      screenWidth: state => state.settings.screenWidth,
      screenHeight: state => state.settings.screenHeight
    }),
    gameContainerStyle() {
      const targetAspectRatio = this.screenWidth / this.screenHeight;
      const currentAspectRatio = this.windowWidth / this.windowHeight;
      
      let width, height, scale;

      if (currentAspectRatio > targetAspectRatio) {
        // Window is wider than needed
        height = this.windowHeight;
        width = height * targetAspectRatio;
        scale = height / this.screenHeight;
      } else {
        // Window is taller than needed
        width = this.windowWidth;
        height = width / targetAspectRatio;
        scale = width / this.screenWidth;
      }

      return {
        width: `${this.screenWidth}px`,
        height: `${this.screenHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      };
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.$store.commit('updateScreenSize', {
        width: this.windowWidth,
        height: this.windowHeight
      });
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.isFullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.isFullscreen = false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.navbar {
  flex-shrink: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.game-container {

}

.fullscreen-toggle {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1001;
  font-size: 0.8rem;
}

@media (max-width: 992px) {
  .navbar-nav {
    flex-direction: column;
  }
  
  .nav-item {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .navbar-brand, .nav-link {
    font-size: 0.9rem;
  }

  .fullscreen-toggle {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}

@media (max-width: 576px) {
  .navbar-brand, .nav-link {
    font-size: 0.8rem;
  }

  .fullscreen-toggle {
    font-size: 0.6rem;
    padding: 2px 4px;
  }
}
</style>
