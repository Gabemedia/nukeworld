<template>
  <div class="loading-container">
    <div class="loading-content">
      <h1 class="game-title">NukeWorld</h1>
      <div class="loading-form">
        <h2 class="section-title">Loading Game</h2>
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: `${progress}%` }"></div>
        </div>
        <p class="loading-text">{{ loadingMessage }}</p>
      </div>
    </div>
    <div class="patreon-container">
      <a href="https://patreon.com/NukeWorldGame?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink" 
         target="_blank" 
         rel="noopener noreferrer" 
         class="patreon-link"
         @click="trackPatreonClick">
        <img src="@/assets/patreon-logo.png" alt="Support us on Patreon" class="patreon-logo">
        <div class="patreon-text">Support us on Patreon</div>
      </a>
    </div>
    <div class="version-number">v{{ version }} - For testing purpose only</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  data() {
    return {
      progress: 0,
      loadingMessage: 'Initializing...',
      version: '0.1.8.0',
      loadingMessages: [
        'Loading game assets...',
        'Preparing nuclear wasteland...',
        'Arming mutants...',
        'Calibrating Geiger counters...',
        'Finalizing apocalypse...'
      ]
    }
  },
  mounted() {
    this.startLoading();
  },
  methods: {
    startLoading() {
      const interval = setInterval(() => {
        this.progress += 20;
        this.loadingMessage = this.loadingMessages[Math.floor(this.progress / 20) - 1] || 'Almost there...';
        if (this.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            this.$router.push('/game-world');
          }, 500);
        }
      }, 1000);
    },
    trackPatreonClick() {
      this.$gtag.event('patreon_click', {
        event_category: 'user_action',
        event_label: 'Patreon Link Click'
      });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

.loading-container {
  min-height: 100vh;
  background-image: url('../assets/bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.loading-content {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.game-title {
  font-size: 2.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff00;
}

.section-title {
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 300;
}

.loading-bar {
  width: 100%;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.loading-progress {
  height: 100%;
  background-color: #00ff00;
  transition: width 0.5s ease;
}

.loading-text {
  color: #00ff00;
  text-align: center;
  font-size: 1rem;
}

.patreon-container {
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.patreon-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  transition: transform 0.3s ease;
}

.patreon-link:hover {
  transform: scale(1.05);
}

.patreon-logo {
  width: 30px;
  height: auto;
  margin-bottom: 5px;
}

.patreon-text {
  font-size: 0.8rem;
  text-align: center;
  white-space: nowrap;
}

.version-number {
  position: fixed;
  bottom: 10px;
  right: 10px;
  color: rgba(255, 255, 255, 1);
  font-size: 0.8rem;
  font-weight: 300;
}
</style>
