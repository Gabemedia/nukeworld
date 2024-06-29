<template>
  <div id="app" class="fullscreen">
    <nav class="d-none navbar navbar-expand-lg m-0 p-0 navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Admin Panel</router-link>
        <div class="menu-icon" @click="navOpen = !navOpen">
          <div :class="{ 'change': navOpen }" class="bar"></div>
          <div :class="{ 'change': navOpen }" class="bar"></div>
          <div :class="{ 'change': navOpen }" class="bar"></div>
        </div>
        <div :class="navOpen ? 'show-nav navbar-collapse' : 'collapse navbar-collapse'" id="navbarNav">
          <ul class="navbar-nav">
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
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navOpen: false,
      loggedInUser: null,
      isFullscreen: false
    };
  },
  created() {
    this.loggedInUser = this.$store.state.loggedInUser;
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
        console.error('Fejl ved anmodning om fuldskærm:', error);
        // Håndter fejlen her, f.eks. vis en besked til brugeren
      }
    },
    fullscreenChangeHandler() {
      this.isFullscreen = !!document.fullscreenElement;
      if (!this.isFullscreen) {
        this.requestFullscreen(); // Prøv at gå tilbage til fuldskærm, hvis brugeren forlader den
      }
    }
  }
};
</script>

<style lang="scss">
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

.navbar-brand, .nav-link {
  font-size: 0.6rem!important;
}

.menu-icon {
  display: none;
  cursor: pointer;
}

.bar {
  width: 30px;
  height: 4px;
  background-color: #fff;
  margin: 1px 0;
  transition: 0.4s;
}

/* Rotate first bar */
.change .bar:nth-child(1) {
  transform: rotate(-45deg) translate(-8px, 5px);
}

/* Fade out the second bar */
.change .bar:nth-child(2) {
  opacity: 0;
}

/* Rotate last bar */
.change .bar:nth-child(3) {
  transform: rotate(45deg) translate(-8px, -8px);
}

@media screen and (max-width: 992px) {
  .menu-icon {
    display: block;
  }

  .navbar-collapse {
    position: absolute;
    top: 56px;
    right: 0;
    background-color: #343a40;
    width: 100%;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  }

  .show-nav {
    transform: translateX(0);
  }
}

@media screen and (max-width: 600px) {
  .container {
    flex-direction: column;
    padding: 10px;
  }
  .character-info {
    width: 100%;
    margin-bottom: 20px;
  }
  .quest-list {
    width: 100%;
  }
}
</style>
