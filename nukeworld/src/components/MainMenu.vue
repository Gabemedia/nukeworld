<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="game-title">NukeWorld</h1>
      <div v-if="!showCharacterList" class="login-form">
        <h2 class="section-title">Main Menu</h2>
        <div class="button-group">
          <button @click="continueGame" class="btn btn-primary">Continue</button>
          <button @click="newGame" class="btn btn-outline-primary btn-tertiary">New Game</button>
        </div>
        <button @click="openSettings" class="btn btn-outline-primary btn-tertiary" disabledd>Settings</button>
        <button @click="showCredits" class="btn btn-outline-primary btn-tertiary">Credits</button>
        <button @click="clearLocalStorage" class="btn btn-outlines-danger btn-tertiary">Delete All Saved Data</button>
      </div>
      <div v-else class="character-list">
        <h2 class="section-title">Character List</h2>
        <div class="character-grid">
          <div v-for="char in characters" :key="char.id" class="character-card" @click="selectCharacter(char)">
            <h3 class="character-name">{{ char.name }}</h3>
            <p class="character-level">Level: {{ char.level }}</p>
            <p class="character-level">NukaCoins: {{ char.money }}</p>
          </div>
        </div>
        <button @click="showCharacterList = false" class="btn btn-tertiary">Back to Menu</button>
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

    <!-- Fullscreen confirmation dialog -->
    <div v-if="showFullscreenDialog" class="fullscreen-dialog">
      <div class="fullscreen-dialog-content">
        <h2>Enter Fullscreen Mode</h2>
        <p>For the best experience, NukeWorld recommends playing in fullscreen mode. Would you like to enter fullscreen?</p>
        <div class="fullscreen-dialog-buttons">
          <button @click="enterFullscreen" class="btn btn-primary">Yes, enter fullscreen</button>
          <button @click="continueWithoutFullscreen" class="btn btn-tertiary">No, continue in windowed mode</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MainMenu',
  data() {
    return {
      showCharacterList: false,
      version: '0.1.8.0',
      showFullscreenDialog: false,
      selectedCharacter: null,
    };
  },
  computed: {
    ...mapState(['characters'])
  },
  methods: {
    ...mapActions(['updateCharacter']),
    newGame() {
      this.$router.push('/user-login');
    },
    continueGame() {
      this.showCharacterList = true;
    },
    openSettings() {
      this.$router.push('/game-settings');
    },
    showCredits() {
      this.$router.push('/credits');
    },
    selectCharacter(character) {
      this.selectedCharacter = character;
      this.showFullscreenDialog = true;
    },
    trackPatreonClick() {
      this.$gtag.event('patreon_click', {
        event_category: 'user_action',
        event_label: 'Patreon Link Click'
      });
    },
    clearLocalStorage() {
      if (confirm('Are you sure you want to delete all saved data for this game?')) {
        localStorage.clear();
        this.$gtag.event('clear_local_storage', {
          event_category: 'user_action',
          event_label: 'Clear Local Storage'
        });
        alert('All saved data has been deleted.');
        location.reload();
      }
    },
    enterFullscreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().then(() => {
          this.showFullscreenDialog = false;
          this.startGame();
        }).catch((err) => {
          console.error('Error attempting to enable fullscreen:', err);
          this.continueWithoutFullscreen();
        });
      } else {
        this.continueWithoutFullscreen();
      }
    },
    continueWithoutFullscreen() {
      this.showFullscreenDialog = false;
      this.startGame();
    },
    startGame() {
      if (this.selectedCharacter) {
        this.updateCharacter(this.selectedCharacter);
        this.$router.push('/loading');
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

.login-container {
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

.login-content {
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
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 0.5rem;
}

.section-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff00;
  color: #00ff00;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: 1px solid #00ff00;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  border: 1px solid #fff;
  background-color: #1b8c1b;
}

.btn-tertiary {
  background-color: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
}

.btn-tertiary:hover {
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
}

.btn-tertiary:disabled {
  opacity: 0.2;
  background-color: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
}

.btn-outlines-danger:hover{
  color:#ff0000;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.character-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.character-card:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.character-name {
  color: #00ff00;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.character-level {
  color: #ffffff;
  margin: 0;
  font-size: 0.875rem;
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

.fullscreen-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.fullscreen-dialog-content {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  max-width: 500px;
  width: 100%;
  color: #00ff00;
  text-align: center;
}

.fullscreen-dialog-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
}

.fullscreen-dialog-content p {
  margin-bottom: 1.5rem;
}

.fullscreen-dialog-buttons {
  display: flex;
  justify-content: space-between;
}

.fullscreen-dialog-buttons .btn {
  width: 48%;
}
</style>
