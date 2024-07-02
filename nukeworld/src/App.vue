<template>
  <div id="app" class="fullscreen">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
    this.requestFullscreen();
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
  },
  methods: {
    async requestFullscreen() {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error('Error requesting fullscreen:', error);
      }
    },
    fullscreenChangeHandler() {
      if (!document.fullscreenElement) {
        this.requestFullscreen();
      }
    }
  }
};
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
}
</style>
