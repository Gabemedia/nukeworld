<template>
  <div class="credits-container">
    <div class="credits-content">
      <h1 class="game-title">NukeWorld</h1>
      <div class="credits-scroll">
        <h2 class="section-title">Credits</h2>
        <div class="credits-section">
          <h3 class="role-title">Game Creator</h3>
          <p class="creator-name">Gabemedia</p>
        </div>
        <div class="credits-section">
          <h3 class="role-title">Development Team</h3>
          <p class="team-member">Gabemedia - Lead Developer</p>
        </div>
        <div class="credits-section">
          <h3 class="role-title">Patreon Contributes</h3>
          <p class="special-thanks">Get your name listed here!</p>
        </div>
        <div class="credits-section">
          <h3 class="role-title">Special Thanks</h3>
          <p class="special-thanks">To all our supporters and players</p>
        </div>
      </div>
      <button @click="goBack" class="btn btn-primary">Back to Menu</button>
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
  name: 'CreditsRoll',
  data() {
    return {
      version: '0.1.7.1', // Update this to your current version
    }
  },
  methods: {
    goBack() {
      this.$router.push('/');
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

.credits-container {
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

.credits-content {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  max-width: 500px;
  width: 100%;
  text-align: center;
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
  margin-bottom: 2.5rem;
  font-size: 1.2rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 10px #00ff00;
  color: #00ff00;
}

.credits-scroll::-webkit-scrollbar {
  width: 5px;
}

.credits-scroll::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.credits-scroll::-webkit-scrollbar-thumb {
  background: #00ff00;
  border-radius: 5px;
}

.credits-section {
  margin-bottom: 2rem;
}

.role-title {
  color: #00ff00;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.creator-name {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.team-member, .special-thanks {
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
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
  width: 100%;
}

.btn-primary {
  background-color: #00ff00;
  color: #000000;
}

.btn-primary:hover {
  background-color: #00cc00;
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
