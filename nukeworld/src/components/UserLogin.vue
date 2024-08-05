<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="game-title">NukeWorld</h1>
      <div class="login-form">
        <h2 class="section-title">Create Character</h2>
        <input v-model="character.name" placeholder="Character Name" class="input-field" autocomplete="name">
        <div class="button-group">
          <button @click="createCharacter" class="btn btn-primary">Create Character</button>
        </div>
        <button @click="goToMainMenu" class="btn btn-tertiary">Back to Main Menu</button>
        <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
          Character created successfully!
        </div>
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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'UserLogin',
  data() {
    return {
      character: {
        name: '',
      },
      showSuccessMessage: false,
      version: '0.1.7.0',
      showFullscreenDialog: false,
    };
  },
  computed: {
    ...mapState(['characters'])
  },
  methods: {
    ...mapActions(['updateCharacter', 'createCharacter']),
    async createCharacter() {
      if (this.character.name.trim() !== '') {
        await this.$store.dispatch('createCharacter', this.character);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showFullscreenDialog = true;
        }, 1000);
      } else {
        alert('Please enter your character name.');
      }
    },
    goToMainMenu() {
      this.$router.push('/');
    },
    trackPatreonClick() {
      this.$gtag.event('patreon_click', {
        event_category: 'user_action',
        event_label: 'Patreon Link Click'
      });
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
      this.$router.push('/loading');
    }
  }
};
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

.input-field {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-bottom: 2px solid #00ff00;
  color: #ffffff;
  transition: all 0.3s ease;
}

.input-field:focus {
  background-color: rgba(255, 255, 255, 0.2);
  outline: none;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  background-color: #00cc00;
}

.btn-tertiary {
  background-color: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  width: 100%;
}

.btn-tertiary:hover {
  background-color: rgba(0, 255, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
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
