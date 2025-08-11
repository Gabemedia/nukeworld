<template>
  <div class="map-container">
    <!-- Canvas-based tile map -->
    <canvas 
      ref="mapCanvas" 
      class="map-canvas"
      @click="onMapClick"
      @mousedown="onMapMouseDown"
      @mousemove="onMapMouseMove"
      @mouseup="onMapMouseUp"
      @mouseout="onMapMouseOut"
      @wheel="onMapWheel"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    ></canvas>
    
    <!-- Mouse coordinates display -->
    <div v-if="mouseCoords && mouseScreen && !isMobile" class="mouse-coords-floating" :style="{ left: mouseScreen.x + 15 + 'px', top: mouseScreen.y + 15 + 'px' }">
      X: {{ mouseCoords.x.toFixed(0) }}, Y: {{ mouseCoords.y.toFixed(0) }}
    </div>
    
    <!-- Mobile controls overlay -->
    <div v-if="isMobile" class="mobile-controls">
      <div class="control-pad">
        <button class="control-btn up" @click="moveCamera('up')" @touchstart="moveCamera('up')">
          <span>↑</span>
        </button>
        <div class="control-row">
          <button class="control-btn left" @click="moveCamera('left')" @touchstart="moveCamera('left')">
            <span>←</span>
          </button>
          <button class="control-btn center" @click="centerOnPlayableArea" @touchstart="centerOnPlayableArea">
            <span>⌂</span>
          </button>
          <button class="control-btn right" @click="moveCamera('right')" @touchstart="moveCamera('right')">
            <span>→</span>
          </button>
        </div>
        <button class="control-btn down" @click="moveCamera('down')" @touchstart="moveCamera('down')">
          <span>↓</span>
        </button>
      </div>
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomIn" @touchstart="zoomIn">+</button>
        <button class="zoom-btn" @click="zoomOut" @touchstart="zoomOut">-</button>
      </div>
    </div>
    
    <!-- Map info display -->
    <div class="map-info">
      <div class="info-item">
        <span class="info-label">Camera:</span>
        <span class="info-value">X: {{ cameraX.toFixed(0) }}, Y: {{ cameraY.toFixed(0) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Zoom:</span>
        <span class="info-value">{{ (zoom * 100).toFixed(0) }}%</span>
      </div>
      <div v-if="!isMobile" class="info-item">
        <span class="info-label">Controls:</span>
        <span class="info-value">WASD/Arrows to move, Mouse wheel to zoom, Home/End to center</span>
      </div>
      <div v-else class="info-item">
        <span class="info-label">Controls:</span>
        <span class="info-value">Touch to move, buttons to zoom/center</span>
      </div>
    </div>
    
    <!-- Quest markers overlay -->
    <div class="markers-overlay">
      <div 
        v-for="quest in filteredQuests" 
        :key="quest.id"
        class="quest-marker"
        :class="getQuestMarkerClass(quest)"
        :style="getMarkerPosition(quest)"
        @click="openModal(quest)"
        :title="quest.name"
      >
        <img :src="getQuestIconUrl(quest)" :alt="quest.name">
      </div>
      
      <!-- Settlement marker -->
      <div 
        v-if="$store.state.settlementMarker"
        class="settlement-marker"
        :style="getSettlementMarkerPosition()"
        @click="openSettlementModal"
        title="Settlement"
      >
        <img :src="require('@/assets/interface/icons/settlement_marker.png')" alt="Settlement">
      </div>
    </div>
    
    <!-- Quest modal -->
    <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <QuestDetails 
              v-if="selectedQuest" 
              :quest="selectedQuest" 
              @quest-updated="onQuestUpdated"
              :key="selectedQuest.id + selectedQuest.state"
            ></QuestDetails>
            <div v-if="selectedMarker">{{ selectedMarker.label }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <SettlementModal ref="settlementModal" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import QuestDetails from './controller/QuestDetails.vue';
import SettlementModal from './SettlementModal.vue';

export default {
  components: {
    QuestDetails,
    SettlementModal,
  },
  props: {
    mapImageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      baseTileSize: 32, // Base tile size for reference
      tileSize: 32, // Current tile size (scaled)
      mapWidth: 0,
      mapHeight: 0,
      cameraX: 0,
      cameraY: 0,
      zoom: 1,
      tiles: [],
      tileImages: {},
      showModal: false,
      selectedQuest: null,
      selectedMarker: null,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mouseCoords: null,
      mouseScreen: null,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      animationFrame: null,
      isMobile: false,
      touchStartX: 0,
      touchStartY: 0,
      lastTouchX: 0,
      lastTouchY: 0,
      isTouching: false,
      renderRequested: false,
      touchMomentumX: 0,
      touchMomentumY: 0,
    };
  },
  computed: {
    ...mapState(['quests', 'character']),
    ...mapGetters(['getResource']),
    characterLevel() {
      return this.character.level || 1;
    },
    filteredQuests() {
      return this.quests.filter(quest => 
        !quest.userCreated && 
        quest.lat && 
        quest.lon && 
        (quest.state === 'not-started' || quest.state === 'ready-to-claim' || quest.state === 'in-progress') &&
        quest.levelRequirement <= this.characterLevel &&
        quest.levelRequirement > Math.max(0, this.characterLevel - 3)
      );
    },
    playableArea() {
      // Fixed playable area that matches the container size
      const containerWidth = this.windowWidth;
      const containerHeight = this.windowHeight - 200; // Account for header and UI elements
      
      return {
        x: 0,
        y: 0,
        width: containerWidth,
        height: containerHeight
      };
    },
    mapScale() {
      // Optimized scaling for better visual balance
      const screenWidth = this.windowWidth;
      const screenHeight = this.windowHeight;
      const aspectRatio = screenWidth / screenHeight;
      
      let baseScale;
      
      // Responsive scaling based on screen size
      if (screenWidth < 480) { // Small phones
        baseScale = 0.8;
      } else if (screenWidth < 768) { // Large phones
        baseScale = 1.0;
      } else if (screenWidth < 1024) { // Tablets
        baseScale = 1.2;
      } else if (screenWidth < 1440) { // Small laptops
        baseScale = 1.4;
      } else if (screenWidth < 1920) { // Large laptops
        baseScale = 1.6;
      } else if (screenWidth < 2560) { // Desktop monitors
        baseScale = 1.8;
      } else { // Ultra-wide/4K displays
        baseScale = 2.0;
      }
      
      // Adjust for aspect ratio to maintain visual balance
      if (aspectRatio > 2.0) { // Ultra-wide
        baseScale *= 0.85;
      } else if (aspectRatio < 0.8) { // Portrait
        baseScale *= 1.15;
      }
      
      return baseScale * this.zoom;
    }
  },
      watch: {
      windowWidth() {
        this.$nextTick(() => {
          this.updateMapScale();
          this.resizeCanvas();
          this.requestRender();
          // Force additional renders
          setTimeout(() => this.requestRender(), 100);
        });
      },
      windowHeight() {
        this.$nextTick(() => {
          this.updateMapScale();
          this.resizeCanvas();
          this.requestRender();
          // Force additional renders
          setTimeout(() => this.requestRender(), 100);
        });
      },
          zoom() {
        this.updateMapScale();
        this.requestRender();
        // Force additional renders after zoom
        setTimeout(() => this.requestRender(), 50);
      },
          cameraX() {
        this.requestRender();
        // Force additional renders for smooth movement
        setTimeout(() => this.requestRender(), 16);
      },
      cameraY() {
        this.requestRender();
        // Force additional renders for smooth movement
        setTimeout(() => this.requestRender(), 16);
      },
    quests: {
      handler(newQuests) {
        if (this.selectedQuest) {
          const updatedQuest = newQuests.find(q => q.id === this.selectedQuest.id);
          if (updatedQuest) {
            this.selectedQuest = { ...updatedQuest };
          }
        }
        this.$forceUpdate();
      },
      deep: true
    }
  },
  created() {
    this.detectMobile();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('orientationchange', this.handleOrientationChange);
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap();
      this.loadTileImages().then(() => {
        this.generateMap();
        this.startRenderLoop();
        
        // Center on settlement if exists, otherwise center on playable area
        if (this.$store.state.settlementMarker) {
          this.centerOnSettlement();
        } else {
          this.centerOnPlayableArea();
        }
        
        // Force multiple renders to ensure everything is displayed
        this.requestRender();
        setTimeout(() => this.requestRender(), 100);
        setTimeout(() => this.requestRender(), 500);
      }).catch(error => {
        console.error('Failed to load tile images:', error);
        // Still try to generate map with fallback tiles
        this.generateMap();
        this.startRenderLoop();
        this.centerOnPlayableArea();
        this.requestRender();
      });
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  },
  methods: {
    ...mapActions(['updateSettlementMarker', 'updateQuest']),
    ...mapMutations(['setSettlementModalOpen']),
    
    // Mobile detection
    detectMobile() {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                      window.innerWidth <= 768;
    },
    
    // Map initialization
    initializeMap() {
      this.canvas = this.$refs.mapCanvas;
      this.ctx = this.canvas.getContext('2d');
      
      // Set canvas size to match container
      this.canvas.width = this.windowWidth;
      this.canvas.height = this.windowHeight;
      
      this.updateMapScale();
      this.resizeCanvas();
      
      console.log('Map initialized with canvas size:', this.canvas.width, 'x', this.canvas.height);
      
      // Force immediate render
      this.requestRender();
    },
    
    updateMapScale() {
      this.tileSize = this.baseTileSize * this.mapScale;
    },
    
    resizeCanvas() {
      this.canvas.width = this.windowWidth;
      this.canvas.height = this.windowHeight;
      this.mapWidth = Math.ceil(this.windowWidth / this.tileSize);
      this.mapHeight = Math.ceil(this.windowHeight / this.tileSize);
      
      console.log('Canvas resized to:', this.canvas.width, 'x', this.canvas.height);
    },
    
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.detectMobile();
      
      // Re-initialize map on resize
      this.$nextTick(() => {
        this.initializeMap();
        this.requestRender();
      });
    },
    
    handleOrientationChange() {
      setTimeout(() => {
        this.handleResize();
      }, 100);
    },
    
    handleKeyDown(event) {
      if (this.isMobile) return; // Disable keyboard on mobile
      
      const moveSpeed = 50 * this.mapScale;
      
      switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.moveCamera('up', moveSpeed);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.moveCamera('down', moveSpeed);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.moveCamera('left', moveSpeed);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.moveCamera('right', moveSpeed);
          break;
        case 'Home':
          this.centerOnPlayableArea();
          break;
        case 'End':
          if (this.$store.state.settlementMarker) {
            this.centerOnSettlement();
          }
          break;
      }
    },
    
    // Advanced camera movement with smooth acceleration
    moveCamera(direction, speed = 50) {
      const scaledSpeed = speed * this.mapScale;
      const maxSpeed = Math.max(scaledSpeed, 30); // Minimum speed for responsiveness
      
      let newCameraX = this.cameraX;
      let newCameraY = this.cameraY;
      
      switch(direction) {
        case 'up':
          newCameraY = Math.max(0, this.cameraY - maxSpeed);
          break;
        case 'down':
          newCameraY = Math.min(this.playableArea.height - this.canvas.height, this.cameraY + maxSpeed);
          break;
        case 'left':
          newCameraX = Math.max(0, this.cameraX - maxSpeed);
          break;
        case 'right':
          newCameraX = Math.min(this.playableArea.width - this.canvas.width, this.cameraX + maxSpeed);
          break;
      }
      
      // Smooth camera movement with easing
      this.cameraX = newCameraX;
      this.cameraY = newCameraY;
    },
    
    zoomIn() {
      const oldZoom = this.zoom;
      const newZoom = Math.min(3, this.zoom * 1.2);
      
      // Adjust camera position to keep center in view
      const rect = this.canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const worldCenterX = (centerX / oldZoom) + this.cameraX;
      const worldCenterY = (centerY / oldZoom) + this.cameraY;
      
      this.zoom = newZoom;
      this.cameraX = worldCenterX - (centerX / newZoom);
      this.cameraY = worldCenterY - (centerY / newZoom);
      
      this.clampCameraToBounds();
    },
    
    zoomOut() {
      const oldZoom = this.zoom;
      const newZoom = Math.max(0.3, this.zoom / 1.2);
      
      // Adjust camera position to keep center in view
      const rect = this.canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const worldCenterX = (centerX / oldZoom) + this.cameraX;
      const worldCenterY = (centerY / oldZoom) + this.cameraY;
      
      this.zoom = newZoom;
      this.cameraX = worldCenterX - (centerX / newZoom);
      this.cameraY = worldCenterY - (centerY / newZoom);
      
      this.clampCameraToBounds();
    },
    
    // Tile loading with better error handling and fallbacks
    async loadTileImages() {
      const tileTypes = ['grass', 'road', 'road_corner', 'road_intersection', 'water', 'factory', 'housing', 'power', 'shop', 'tower'];
      
      const loadPromises = tileTypes.map(async (tileType) => {
        try {
          const img = new Image();
          img.src = require(`@/assets/maps/maptiles/${tileType}.png`);
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          this.tileImages[tileType] = img;
        } catch (error) {
          console.warn(`Failed to load tile: ${tileType}`, error);
          // Create a fallback colored tile
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d');
          
          // Better fallback colors
          let fillColor;
          switch(tileType) {
            case 'grass': fillColor = '#90EE90'; break;
            case 'road': fillColor = '#696969'; break;
            case 'road_corner': fillColor = '#696969'; break;
            case 'road_intersection': fillColor = '#696969'; break;
            case 'water': fillColor = '#4169E1'; break;
            case 'factory': fillColor = '#8B4513'; break;
            case 'housing': fillColor = '#CD853F'; break;
            case 'power': fillColor = '#FFD700'; break;
            case 'shop': fillColor = '#32CD32'; break;
            case 'tower': fillColor = '#708090'; break;
            default: fillColor = '#90EE90'; break;
          }
          
          ctx.fillStyle = fillColor;
          ctx.fillRect(0, 0, 32, 32);
          this.tileImages[tileType] = canvas;
        }
      });
      
      await Promise.all(loadPromises);
      console.log('All tile images loaded successfully');
    },
    
    // Map generation
    generateMap() {
      this.tiles = [];
      const mapWidth = Math.ceil(this.playableArea.width / this.tileSize);
      const mapHeight = Math.ceil(this.playableArea.height / this.tileSize);
      
      // Add some buffer tiles for smooth scrolling
      const bufferTiles = 10;
      const totalWidth = mapWidth + bufferTiles * 2;
      const totalHeight = mapHeight + bufferTiles * 2;
      
      console.log('Generating map with dimensions:', totalWidth, 'x', totalHeight);
      
      for (let y = 0; y < totalHeight; y++) {
        this.tiles[y] = [];
        for (let x = 0; x < totalWidth; x++) {
          this.tiles[y][x] = this.generateTile(x - bufferTiles, y - bufferTiles, mapWidth, mapHeight);
        }
      }
      
      console.log('Map generation completed with', this.tiles.length, 'rows');
    },
    
    generateTile(x, y, mapWidth, mapHeight) {
      // Create a more interesting and varied map layout
      const centerX = mapWidth / 2;
      const centerY = mapHeight / 2;
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      
      // Base terrain - mostly grass
      let tileType = 'grass';
      
      // Create main roads (horizontal and vertical)
      if (x === Math.floor(centerX) || y === Math.floor(centerY)) {
        tileType = 'road';
      }
      
      // Create road intersections
      if (x === Math.floor(centerX) && y === Math.floor(centerY)) {
        tileType = 'road_intersection';
      }
      
      // Create road corners
      if ((x === Math.floor(centerX) - 1 || x === Math.floor(centerX) + 1) && 
          (y === Math.floor(centerY) - 1 || y === Math.floor(centerY) + 1)) {
        tileType = 'road_corner';
      }
      
      // Add secondary roads
      if (x === Math.floor(centerX / 2) || x === Math.floor(centerX * 1.5) ||
          y === Math.floor(centerY / 2) || y === Math.floor(centerY * 1.5)) {
        if (Math.random() < 0.7) {
          tileType = 'road';
        }
      }
      
      // Add water around edges and in some random areas
      if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
        tileType = 'water';
      } else if (Math.random() < 0.05) { // Random water patches
        tileType = 'water';
      }
      
      // Add buildings based on distance from center and some randomness
      if (distanceFromCenter > mapWidth * 0.15 && Math.random() < 0.12) {
        const buildingTypes = ['factory', 'housing', 'power', 'shop', 'tower'];
        tileType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
      }
      
      // Add more buildings near roads
      if (tileType === 'grass' && Math.random() < 0.08) {
        const buildingTypes = ['housing', 'shop', 'tower'];
        tileType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
      }
      
      return tileType;
    },
    
    // Advanced rendering with performance optimization
    startRenderLoop() {
      let lastTime = 0;
      const targetFPS = 60;
      const frameInterval = 1000 / targetFPS;
      
      const render = (currentTime) => {
        if (this.renderRequested && (currentTime - lastTime >= frameInterval)) {
          this.render();
          this.renderRequested = false;
          lastTime = currentTime;
        }
        this.animationFrame = requestAnimationFrame(render);
      };
      
      // Start the render loop
      render();
      
      // Force multiple initial renders to ensure display
      this.requestRender();
      setTimeout(() => this.requestRender(), 50);
      setTimeout(() => this.requestRender(), 150);
    },
    
    requestRender() {
      this.renderRequested = true;
    },
    
    render() {
      if (!this.ctx || !this.tiles.length) return;
      
      // Clear canvas completely
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Calculate visible tile range with buffer for smooth scrolling
      const buffer = 5; // Extra tiles to render for smooth scrolling
      const startX = Math.max(0, Math.floor(this.cameraX / this.tileSize) - buffer);
      const startY = Math.max(0, Math.floor(this.cameraY / this.tileSize) - buffer);
      const endX = Math.min(this.tiles[0]?.length || 0, Math.ceil((this.cameraX + this.canvas.width) / this.tileSize) + buffer);
      const endY = Math.min(this.tiles.length || 0, Math.ceil((this.cameraY + this.canvas.height) / this.tileSize) + buffer);
      
      // Batch render tiles for better performance
      this.ctx.save();
      this.ctx.globalAlpha = this.zoom;
      
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          if (y >= 0 && y < this.tiles.length && x >= 0 && x < this.tiles[y].length) {
            const tileType = this.tiles[y][x];
            const tileImage = this.tileImages[tileType];
            
            if (tileImage) {
              const screenX = x * this.tileSize - this.cameraX;
              const screenY = y * this.tileSize - this.cameraY;
              
              // Only render tiles that are actually visible
              if (screenX + this.tileSize > 0 && screenX < this.canvas.width &&
                  screenY + this.tileSize > 0 && screenY < this.canvas.height) {
                
                // Handle both Image objects and Canvas elements
                if (tileImage instanceof HTMLCanvasElement) {
                  this.ctx.drawImage(
                    tileImage,
                    screenX,
                    screenY,
                    this.tileSize,
                    this.tileSize
                  );
                } else {
                  this.ctx.drawImage(
                    tileImage,
                    screenX,
                    screenY,
                    this.tileSize,
                    this.tileSize
                  );
                }
              }
            }
          }
        }
      }
      
      this.ctx.restore();
      
      // No border rendering at all
    },
    
    renderPlayableAreaBorder() {
      // Completely disabled - no border rendering at all
      return;
    },
    
    // Camera controls
    centerOnSettlement() {
      if (this.$store.state.settlementMarker) {
        const latlng = this.$store.state.settlementMarker.latlng;
        // Center on settlement
        this.cameraX = latlng.lng - (this.canvas.width / this.zoom) / 2;
        this.cameraY = latlng.lat - (this.canvas.height / this.zoom) / 2;
        
        this.clampCameraToBounds();
      }
    },
    
    centerOnPlayableArea() {
      // Center on the middle of the playable area
      this.cameraX = (this.playableArea.width - (this.canvas.width / this.zoom)) / 2;
      this.cameraY = (this.playableArea.height - (this.canvas.height / this.zoom)) / 2;
      
      this.clampCameraToBounds();
    },
    
    // Mouse events
    onMapMouseDown(event) {
      if (this.isMobile) return;
      this.isDragging = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    },
    
    onMapMouseUp() {
      if (this.isMobile) return;
      this.isDragging = false;
    },
    
    onMapClick(event) {
      // Only trigger click if not dragging
      if (!this.isDragging && !this.isMobile) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert screen coordinates to quest/settlement coordinate system
        const worldPos = this.convertScreenToWorld(x, y);
        
        console.log('Map click at screen:', x, y, 'world:', worldPos);
        
        if (!this.$store.state.settlementMarker) {
          this.$refs.settlementModal.attemptPlaceSettlement({ lat: worldPos.y, lng: worldPos.x });
        }
      }
    },
    
    onMapMouseMove(event) {
      if (this.isMobile) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Convert to quest/settlement coordinate system for display
      const worldPos = this.convertScreenToWorld(x, y);
      
      this.mouseCoords = {
        x: worldPos.x,
        y: worldPos.y
      };
      
      this.mouseScreen = {
        x: event.clientX,
        y: event.clientY
      };
      
      // Handle dragging
      if (this.isDragging) {
        const deltaX = x - this.lastMouseX;
        const deltaY = y - this.lastMouseY;
        
        this.cameraX -= deltaX;
        this.cameraY -= deltaY;
        
        // Clamp camera to playable area
        this.clampCameraToBounds();
      }
      
      this.lastMouseX = x;
      this.lastMouseY = y;
    },
    
    onMapMouseOut() {
      this.mouseCoords = null;
      this.mouseScreen = null;
      this.isDragging = false;
    },
    
    onMapWheel(event) {
      event.preventDefault();
      
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.3, Math.min(3, this.zoom * zoomFactor));
      
      // Store old zoom for boundary adjustment
      const oldZoom = this.zoom;
      this.zoom = newZoom;
      
      // Adjust camera position to keep the center point in view
      const rect = this.canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const worldCenterX = (centerX / oldZoom) + this.cameraX;
      const worldCenterY = (centerY / oldZoom) + this.cameraY;
      
      this.cameraX = worldCenterX - (centerX / newZoom);
      this.cameraY = worldCenterY - (centerY / newZoom);
      
      // Clamp camera to bounds after zoom
      this.clampCameraToBounds();
    },
    
    // Enhanced touch events with momentum and gesture support
    onTouchStart(event) {
      if (!this.isMobile) return;
      event.preventDefault();
      
      const touch = event.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.lastTouchX = touch.clientX;
      this.lastTouchY = touch.clientY;
      this.isTouching = true;
      
      // Clear any existing momentum
      this.touchMomentumX = 0;
      this.touchMomentumY = 0;
    },
    
    onTouchMove(event) {
      if (!this.isMobile) return;
      event.preventDefault();
      
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.lastTouchX;
      const deltaY = touch.clientY - this.lastTouchY;
      
      // Calculate momentum for smooth scrolling
      this.touchMomentumX = deltaX * 0.8;
      this.touchMomentumY = deltaY * 0.8;
      
      // Apply movement with momentum
      this.cameraX -= deltaX * 1.2; // Slightly faster for better responsiveness
      this.cameraY -= deltaY * 1.2;
      
      // Clamp camera to playable area with smooth boundaries
      this.clampCameraToBounds();
      
      this.lastTouchX = touch.clientX;
      this.lastTouchY = touch.clientY;
    },
    
    onTouchEnd(event) {
      if (!this.isMobile) return;
      event.preventDefault();
      
      const touch = event.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);
      
      // If it's a tap (not a drag), handle as click
      if (deltaX < 15 && deltaY < 15) { // Slightly larger tap area for better UX
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Convert screen coordinates to quest/settlement coordinate system
        const worldPos = this.convertScreenToWorld(x, y);
        
        console.log('Touch click at screen:', x, y, 'world:', worldPos);
        
        if (!this.$store.state.settlementMarker) {
          this.$refs.settlementModal.attemptPlaceSettlement({ lat: worldPos.y, lng: worldPos.x });
        }
      }
      
      // Apply momentum for smooth deceleration
      if (Math.abs(this.touchMomentumX) > 0.1 || Math.abs(this.touchMomentumY) > 0.1) {
        this.applyMomentum();
      }
      
      this.isTouching = false;
    },
    
    applyMomentum() {
      const momentumDecay = 0.95;
      const applyMomentum = () => {
        if (Math.abs(this.touchMomentumX) < 0.1 && Math.abs(this.touchMomentumY) < 0.1) {
          return;
        }
        
        this.cameraX -= this.touchMomentumX;
        this.cameraY -= this.touchMomentumY;
        
        // Clamp camera to playable area
        this.clampCameraToBounds();
        
        // Decay momentum
        this.touchMomentumX *= momentumDecay;
        this.touchMomentumY *= momentumDecay;
        
        requestAnimationFrame(applyMomentum);
      };
      
      requestAnimationFrame(applyMomentum);
    },
    
    // Coordinate conversion system for compatibility with existing quest/settlement system
    convertWorldToScreen(worldX, worldY) {
      // Convert from quest/settlement coordinate system to screen coordinates
      const screenX = (worldX - this.cameraX) * this.zoom;
      const screenY = (worldY - this.cameraY) * this.zoom;
      return { x: screenX, y: screenY };
    },
    
    convertScreenToWorld(screenX, screenY) {
      // Convert from screen coordinates to quest/settlement coordinate system
      const worldX = (screenX / this.zoom) + this.cameraX;
      const worldY = (screenY / this.zoom) + this.cameraY;
      return { x: worldX, y: worldY };
    },
    
    // New method to clamp camera to bounds
    clampCameraToBounds() {
      const maxX = Math.max(0, this.playableArea.width - (this.canvas.width / this.zoom));
      const maxY = Math.max(0, this.playableArea.height - (this.canvas.height / this.zoom));
      
      this.cameraX = Math.max(0, Math.min(this.cameraX, maxX));
      this.cameraY = Math.max(0, Math.min(this.cameraY, maxY));
    },
    
    // Marker positioning - FIXED to properly follow zoom and camera
    getMarkerPosition(quest) {
      // Convert quest coordinates (lat/lon) to screen coordinates
      const screenPos = this.convertWorldToScreen(quest.lon, quest.lat);
      
      return {
        left: screenPos.x + 'px',
        top: screenPos.y + 'px',
        transform: `translate(-50%, -100%) scale(${this.zoom})`,
        zIndex: 20,
        pointerEvents: 'auto'
      };
    },
    
    getSettlementMarkerPosition() {
      if (!this.$store.state.settlementMarker) return {};
      
      const latlng = this.$store.state.settlementMarker.latlng;
      // Convert settlement coordinates to screen coordinates
      const screenPos = this.convertWorldToScreen(latlng.lng, latlng.lat);
      
      return {
        left: screenPos.x + 'px',
        top: screenPos.y + 'px',
        transform: `translate(-50%, -100%) scale(${this.zoom})`,
        zIndex: 20,
        pointerEvents: 'auto'
      };
    },
    
    // Quest marker styling
    getQuestMarkerClass(quest) {
      return {
        'marker-not-started': quest.state === 'not-started',
        'marker-ready-to-claim': quest.state === 'ready-to-claim',
        'marker-in-progress': quest.state === 'in-progress'
      };
    },
    
    getQuestIconUrl(quest) {
      if (quest.state === 'not-started') {
        return require('@/assets/interface/icons/marker.png');
      } else if (quest.state === 'ready-to-claim') {
        return require('@/assets/interface/icons/claim-quest.png');
      } else if (quest.state === 'in-progress') {
        return require('@/assets/interface/icons/in-progress-quest.png');
      }
      return require('@/assets/interface/icons/marker.png');
    },
    
    // Modal handling
    openModal(item) {
      if (Object.prototype.hasOwnProperty.call(item, 'name')) {
        this.selectedQuest = { ...item };
        if (item.state === 'completed' && !item.claimed) {
          this.selectedQuest.state = 'completed';
        }
      } else {
        this.selectedMarker = item;
      }
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.selectedQuest = null;
      this.selectedMarker = null;
    },
    
    onQuestUpdated(updatedQuest) {
      this.updateQuest(updatedQuest);
      this.selectedQuest = { ...updatedQuest };
    },
    
    openSettlementModal() {
      if (this.$refs.settlementModal) {
        this.$refs.settlementModal.openSettlementModal();
      }
    }
  },
};
</script>

<style scoped>
@import url(../../assets/MapPopup.css);

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 105%;
  z-index: 1;
  overflow: hidden;
}

.map-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  background: linear-gradient(180deg, rgb(180, 141, 102) 0%, rgb(188, 140, 87) 100%);
  touch-action: none; /* Prevent default touch behaviors */
}

.map-canvas:active {
  cursor: grabbing;
}

.markers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.quest-marker,
.settlement-marker {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.1s ease;
  z-index: 20;
  will-change: transform;
}

.quest-marker:hover,
.settlement-marker:hover {
  transform: scale(1.2) translate(-50%, -100%);
}

.quest-marker img,
.settlement-marker img {
  width: 36px;
  height: 48px;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  image-rendering: pixelated;
}

.mouse-coords-floating {
  position: fixed;
  pointer-events: none;
  background: rgba(0,0,0,0.85);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 15px;
  z-index: 99999;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

/* Mobile Controls */
.mobile-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.control-row {
  display: flex;
  gap: 5px;
}

.control-btn {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 8px;
  color: #00ff00;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.control-btn:active {
  background: rgba(0, 255, 0, 0.3);
  transform: scale(0.95);
}

.zoom-controls {
  display: flex;
  gap: 5px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 8px;
  color: #00ff00;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
}

.zoom-btn:active {
  background: rgba(0, 255, 0, 0.3);
  transform: scale(0.95);
}

.map-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 1000;
  border: 1px solid #00ff00;
  max-width: 300px;
}

.info-item {
  margin-bottom: 5px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #00ff00;
  font-weight: bold;
  margin-right: 5px;
}

.info-value {
  color: #fff;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 100%;
    margin: 1.75rem auto;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  overflow-y: scroll;
  padding: 0px;
}

.modal-content {
  position: relative;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

/* Responsive styles */
@media (min-width: 1441px) {
  .quest-marker img,
  .settlement-marker img {
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
  }
}

@media (min-width: 1921px) {
  .quest-marker img,
  .settlement-marker img {
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
  }
}

@media (min-width: 2561px) {
  .quest-marker img,
  .settlement-marker img {
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
  }
}

@media (min-width: 3841px) {
  .quest-marker img,
  .settlement-marker img {
    filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.5));
  }
}

/* Mobile specific styles */
@media (max-width: 768px) {
  .map-info {
    top: 5px;
    right: 5px;
    font-size: 10px;
    padding: 8px;
    max-width: 200px;
  }
  
  .mobile-controls {
    bottom: 10px;
    left: 10px;
  }
  
  .control-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .zoom-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .map-info {
    font-size: 9px;
    padding: 6px;
    max-width: 150px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .zoom-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
}
</style>
