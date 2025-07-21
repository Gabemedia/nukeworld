<template>
  <Teleport to="body" v-if="showMusicControls">
    <div class="music-modal" @click="closeMusicPlayer">
      <div class="music-dialog" @click.stop>
        <div class="music-content">
          <div class="music-header">
            <div class="music-title-wrapper">
              <img class="music-logo" :src="require('@/assets/interface/icons/settings.png')" alt="Music Icon">
              <h5 class="music-title">Music Player</h5>
            </div>
            <button class="close-button" @click.stop="closeMusicPlayer">&times;</button>
          </div>

          <div class="music-container">
            <div class="music-content-grid">
              <div class="music-controls-panel">
                <div class="current-track-info">
                  <div class="track-name">
                    <strong>Now Playing:</strong> {{ currentTrackName }}
                  </div>
                  <div class="track-progress">
                    <span class="time">{{ formattedCurrentTime }}</span>
                                      <div class="progress-container">
                    <div class="progress-bar" @click.stop="seekToPosition">
                      <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                  </div>
                    <span class="time">{{ formattedDuration }}</span>
                  </div>
                </div>
                
                <div class="music-controls">
                  <button @click.stop="playPreviousTrack" class="control-btn" title="Previous Track">
                    ⏮
                  </button>
                  <button @click.stop="togglePlayPause" class="control-btn play-btn" :title="isPlaying ? 'Pause' : 'Play'">
                    {{ isPlaying ? '⏸' : '▶' }}
                  </button>
                  <button @click.stop="playNextTrack" class="control-btn" title="Next Track">
                    ⏭
                  </button>
                </div>
                
                <div class="volume-control">
                  <label>Volume: {{ Math.round(musicSettings.volume * 100) }}%</label>
                  <input 
                    type="range" 
                    v-model.number="musicSettings.volume" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    @input.stop="updateVolume"
                    class="volume-slider"
                  >
                </div>
              </div>

              <div class="playlist-panel">
                <div class="playlist-header">
                  <strong>Playlist ({{ playlist.length }} tracks)</strong>
                </div>
                <div class="playlist-container">
                  <div 
                    v-for="(track, index) in playlist" 
                    :key="index"
                    @click.stop="selectTrack(index)"
                    class="playlist-item"
                    :class="{ active: index === currentTrackIndex }"
                  >
                    <span class="track-number">{{ index + 1 }}</span>
                    <span class="track-title">{{ track.split('/').pop().replace('.mp3', '').replace(/\.[a-f0-9]{8}/, '') || 'Unknown Track' }}</span>
                    <span v-if="index === currentTrackIndex" class="playing-indicator">▶</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
// Get all music files from the music directory
const musicFiles = require.context('@/assets/music', false, /\.mp3$/);
const playlist = musicFiles.keys().map(key => musicFiles(key));

export default {
  name: 'MusicPlayer',
  emits: ['music-status-updated'],
  data() {
    return {
      showMusicControls: false,
      audio: null,
      currentTrackIndex: 0,
      playlist: playlist,
      currentTrackName: '',
      isPlaying: false,
      currentTime: 0,
      duration: 0
    };
  },
  computed: {
    musicSettings() {
      return this.$store.state.userSettings?.music || { enabled: true, volume: 0.5 };
    },
    formattedCurrentTime() {
      return this.formatTime(this.currentTime);
    },
    formattedDuration() {
      return this.formatTime(this.duration);
    },
    progressPercentage() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
  },
  watch: {
    'musicSettings.enabled': {
      handler(newValue) {
        if (this.audio && this.musicSettings) {
          if (newValue) {
            this.audio.play().catch(error => {
              console.warn('Audio autoplay blocked by browser policy:', error);
            });
          } else {
            this.audio.pause();
          }
        }
      },
      immediate: true
    },
    'musicSettings.volume': {
      handler(newValue) {
        if (this.audio && this.musicSettings) {
          this.audio.volume = newValue || 0.5;
        }
      },
      immediate: true
    }
  },
  mounted() {
    // Ensure music is enabled by default if not set
    if (!this.$store.state.userSettings?.music?.enabled) {
      this.$store.commit('updateMusicSettings', {
        enabled: true,
        volume: 0.5
      });
    }
    this.initializeMusic();
    this.addUserInteractionListener();
  },
  beforeUnmount() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('ended', () => {});
      this.audio = null;
    }
  },
  methods: {
    initializeMusic() {
      if (!this.audio) {
        this.audio = new Audio();
        this.audio.volume = this.musicSettings.volume || 0.5;
        
        // Enhanced audio event listeners
        this.audio.addEventListener('ended', () => {
          // Auto-play next track when current track ends
          this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
          this.loadTrack(this.currentTrackIndex, true); // Auto-play when track ends naturally
        });

        this.audio.addEventListener('timeupdate', () => {
          this.currentTime = this.audio.currentTime;
        });

        this.audio.addEventListener('loadedmetadata', () => {
          this.duration = this.audio.duration;
        });

        this.audio.addEventListener('canplay', () => {
          // Track is ready to play
        });

        this.audio.addEventListener('play', () => {
          this.isPlaying = true;
          this.$emit('music-status-updated', true, this.currentTrackName);
        });

        this.audio.addEventListener('pause', () => {
          this.isPlaying = false;
          this.$emit('music-status-updated', false, this.currentTrackName);
        });

        this.audio.addEventListener('error', (error) => {
          console.error('Audio error:', error);
        });

        // Set initial track
        this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
        this.loadTrack(this.currentTrackIndex, true); // Auto-play initial track
      }
    },

    loadTrack(index, shouldAutoPlay = true) {
      if (this.playlist[index]) {
        // Stop current audio before loading new track
        if (this.audio) {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.isPlaying = false; // Reset playing state
        }
        
        this.audio.src = this.playlist[index];
        // Extract filename from the full path
        const fullPath = this.playlist[index];
        const fileName = fullPath.split('/').pop().replace('.mp3', '').replace(/\.[a-f0-9]{8}/, '');
        this.currentTrackName = fileName;
        this.currentTrackIndex = index;
        this.currentTime = 0;
        this.duration = 0;
        this.$emit('music-status-updated', false, this.currentTrackName); // Emit paused state
        
        // Auto-play the new track if music is enabled and shouldAutoPlay is true
        if (this.musicSettings && this.musicSettings.enabled && shouldAutoPlay) {
          // Wait for audio to load before playing
          this.audio.addEventListener('canplay', () => {
            this.audio.play().catch(error => {
              console.warn('Audio autoplay blocked by browser policy:', error);
            });
          }, { once: true });
        }
      }
    },

    playNextTrack() {
      if (this.playlist.length > 0) {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex, false); // Don't auto-play when manually changing tracks
      }
    },

    playPreviousTrack() {
      if (this.playlist.length > 0) {
        this.currentTrackIndex = this.currentTrackIndex === 0 ? this.playlist.length - 1 : this.currentTrackIndex - 1;
        this.loadTrack(this.currentTrackIndex, false); // Don't auto-play when manually changing tracks
      }
    },

    togglePlayPause() {
      if (this.audio) {
        if (this.isPlaying) {
          this.audio.pause();
        } else {
          this.audio.play().catch(error => {
            console.warn('Audio autoplay blocked by browser policy:', error);
          });
        }
      }
    },

    selectTrack(index) {
      this.loadTrack(index, false); // Don't auto-play when manually selecting tracks
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    openMusicPlayer() {
      this.showMusicControls = true;
    },

    closeMusicPlayer() {
      this.showMusicControls = false;
    },
    
    seekToPosition(event) {
      if (this.audio && this.duration > 0) {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * this.duration;
        
        this.audio.currentTime = newTime;
        this.currentTime = newTime;
      }
    },
    
    updateVolume() {
      if (this.audio) {
        this.audio.volume = this.musicSettings.volume;
      }
      // Update store
      this.$store.commit('updateMusicSettings', {
        enabled: this.musicSettings.enabled,
        volume: this.musicSettings.volume
      });
    },
    
    addUserInteractionListener() {
      const enableAudio = () => {
        if (this.audio && this.musicSettings && this.musicSettings.enabled) {
          this.audio.play().catch(error => {
            console.warn('Audio autoplay blocked by browser policy:', error);
          });
        }
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
      };
      
      document.addEventListener('click', enableAudio, { once: true });
      document.addEventListener('keydown', enableAudio, { once: true });
      document.addEventListener('touchstart', enableAudio, { once: true });
    }
  }
};
</script>

<style scoped>
.music-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}

.music-dialog {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.music-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.music-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.music-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.music-logo {
  width: 24px;
  height: 24px;
}

.music-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  margin-left: auto;
  
  &:hover {
    color: #ff0000;
  }
}

.music-container {
  flex: 1;
  min-height: 0;
  margin-top: 15px;
}

.music-content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px); /* Subtracting header + tabs height */
}

.music-controls-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-track-info {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.track-name {
  color: #00ff00;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-align: center;
}

.track-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: #cccccc;
}

.time {
  min-width: 40px;
  text-align: center;
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.progress-bar:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(0, 255, 0, 0.5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00cc00);
  transition: width 0.1s ease;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.music-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

.control-btn {
  background: #00ff00;
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 50px;
  font-size: 1.5rem;
  padding: 12px 16px;

  &:hover {
    background-color: #00cc00;
  }
}

.play-btn {
  font-size: 1.8rem;
  padding: 15px 20px;
}

.volume-control {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.volume-control label {
  color: #00ff00;
  font-size: 0.9rem;
  text-align: center;
}

.volume-slider {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #00ff00;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #00ff00;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.playlist-panel {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #333;
  border-radius: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
    
    &:hover {
      background: #444;
    }
  }
}

.playlist-header {
  padding: 15px;
  background: rgba(0, 255, 0, 0.1);
  color: #00ff00;
  font-size: 1rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
}

.playlist-container {
  max-height: 200px;
  overflow-y: auto;
}

.playlist-container::-webkit-scrollbar {
  width: 8px;
}

.playlist-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.playlist-container::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.playlist-container::-webkit-scrollbar-thumb:hover {
  background: #444;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-item:hover {
  background-color: rgba(0, 255, 0, 0.1);
  color: #00ff00;
}

.playlist-item.active {
  background-color: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  font-weight: bold;
}

.track-number {
  color: #888;
  font-size: 0.9rem;
  min-width: 30px;
}

.track-title {
  flex: 1;
  color: #fff;
  font-size: 0.9rem;
}

.track-title {
  flex: 1;
  font-size: 0.95rem;
}

.playing-indicator {
  color: #00ff00;
  font-size: 1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}



@media (max-width: 1024px) {
  .music-content-grid {
    grid-template-columns: 1fr 250px;
  }
}

@media (max-width: 768px) {
  .music-dialog {
    padding: 10px;
    max-height: 100vh;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .music-content-grid {
    grid-template-columns: 1fr;
    max-height: calc(100vh - 120px);
  }

  .music-controls-panel {
    max-height: 60vh;
  }

  .playlist-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-height: 40vh;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }
}

@media (max-width: 480px) {
  .music-content {
    padding: 10px;
  }

  .playlist-panel {
    max-height: 50vh;
  }
}
</style> 