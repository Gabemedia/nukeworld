<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/shop.png`)" title="Player Shop">
  </button>

  <div v-if="showModal" class="shop-modal" tabindex="-1" @click.self="closeModal">
    <div class="shop-dialog">
      <div class="shop-content">
        <div class="shop-header">
          <div class="shop-title-wrapper">
            <img class="shop-logo" :src="require(`@/assets/interface/icons/shop.png`)" alt="Shop Icon">
            <h5 class="shop-title">Big´n´Small Shop</h5>
          </div>
          <div class="player-money">
        <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
        <span>{{ character.money }}</span>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
        </div>

        <div class="shop-tabs">
          <button 
            v-for="category in ['weapons', 'armor', 'aid', 'resources', 'premium']" 
            :key="category"
            class="tab-button"
            :class="{ active: activeCategory === category }"
            @click="changeCategory(category)"
          >
            <img :src="require(`@/assets/interface/icons/${category === 'weapons' ? 'gun' : category === 'armor' ? 'shield' : category === 'aid' ? 'medkit' : category === 'premium' ? 'premium/donate' : 'resources/ammunition'}.png`)" :alt="category">
            {{ category.toUpperCase() }}
            <span class="item-count">
              {{ getAvailableItems(category).length }}
            </span>
          </button>
        </div>

        <div class="shop-container">
          <div class="shop-content-grid">
            <div class="shop-items">
              <div class="items-grid">
                <div v-for="item in getAvailableItems(activeCategory)" 
                     :key="item.id"
                     class="item-slot"
                     :class="{ 'can-afford': character.money >= Math.floor(item.price * shopPriceMultiplier), 'selected': hoveredItem === item }"
                     @click="showItemInfo(item)"
                     :ref="'item-' + activeCategory + '-' + item.id">
                  <img :src="getImagePath(item)" :alt="item.name">
                </div>
              </div>
            </div>

            <div class="info-panel">
              <div v-if="hoveredItem" class="item-details" :class="activeCategory">
                <h3>{{ hoveredItem.name }}</h3>
                <div class="stats">
                  <div v-if="hoveredItem.attack" class="stat">
                    <img :src="require('@/assets/interface/icons/gun.png')" alt="Attack">
                    <span>Attack: {{ hoveredItem.attack }}</span>
                  </div>
                  <div v-if="hoveredItem.defence" class="stat">
                    <img :src="require('@/assets/interface/icons/shield.png')" alt="Defense">
                    <span>Defense: {{ hoveredItem.defence }}</span>
                  </div>
                  <div v-if="hoveredItem.health" class="stat">
                    <img :src="require('@/assets/interface/icons/medkit.png')" alt="Health">
                    <span>Health: +{{ hoveredItem.health }}</span>
                  </div>
                  <div v-if="activeCategory === 'resources'" class="stat">
                    <img :src="getImagePath(hoveredItem)" :alt="hoveredItem.name">
                    <span>Resource</span>
                  </div>
                </div>
                <p class="description">{{ hoveredItem.desc }}</p>
                <div class="price-info">
                  <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                  <span>Price: {{ Math.floor(hoveredItem.price * shopPriceMultiplier) }} 
                    <span v-if="shopPriceMultiplier < 1" class="discount-text">({{ Math.floor(hoveredItem.price) }} -{{ Math.floor((1 - shopPriceMultiplier) * 100) }}%)</span>
                  </span>
                </div>
                <button 
                  class="buy-button" 
                  @click="buyItem(hoveredItem, activeCategory)"
                  :disabled="character.money < Math.floor(hoveredItem.price * shopPriceMultiplier)"
                  :class="{ 'can-afford': character.money >= Math.floor(hoveredItem.price * shopPriceMultiplier) }">
                  <span v-if="character.money >= Math.floor(hoveredItem.price * shopPriceMultiplier)">Buy Item</span>
                  <span v-else>Can't Afford</span>
                </button>
              </div>
              <div v-else class="item-details-placeholder">
                <p>Select an item to view details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'PlayerShop',
  data() {
    return {
      showModal: false,
      hoveredItem: null,
      activeCategory: 'weapons'
    };
  },
  computed: {
    ...mapState(['character', 'items', 'armor', 'aid', 'resources', 'premium']),
    ...mapGetters(['shopPriceMultiplier']),
    availableWeapons() {
      return this.items.filter(item => item.price !== -1 && item.id !== 0);
    },
    availableArmor() {
      return this.armor.filter(item => item.price !== -1 && item.id !== 0);
    },
    availableAid() {
      return this.aid.filter(item => item.price !== -1 && item.id !== 0);
    },
    availableResources() {
      return this.resources.filter(item => item.price !== -1 && item.id !== 0);
    },
    availablePremium() {
      return this.premium.filter(item => item.price !== -1 && item.id !== 0);
    }
  },
  mounted() {
    // No complex event system needed - just use simple methods like other components
  },
  beforeUnmount() {
    // No cleanup needed
  },
  methods: {
    ...mapActions(['addItemToWeapons', 'addItemToArmor', 'addItemToAid', 'addResource', 'addItemToPremium', 'decreaseMoney']),
    getAvailableItems(category) {
      switch(category) {
        case 'weapons': return this.availableWeapons;
        case 'armor': return this.availableArmor;
        case 'aid': return this.availableAid;
        case 'resources': return this.availableResources;
        case 'premium': return this.availablePremium;
        default: return [];
      }
    },
    getImagePath(item) {
      if (item.img.includes('hl_')) {
        const fileName = item.img.toLowerCase();
        return require(`@/assets/interface/icons/helmets/${fileName}`);
      }
      if (this.activeCategory === 'resources') {
        return require(`@/assets/interface/icons/resources/${item.img}`);
      }
      if (this.activeCategory === 'premium') {
        return require(`@/assets/interface/icons/premium/${item.img}`);
      }
      return require(`@/assets/interface/icons/${this.activeCategory}/${item.img}`);
    },
    changeCategory(category) {
      this.activeCategory = category;
      this.hoveredItem = null; // Clear hovered item when changing category
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.hoveredItem = null;
    },
    buyItem(item, category) {
      const price = Math.floor(parseInt(item.price) * this.shopPriceMultiplier);
      if (this.character.money >= price) {
        if (category === 'weapons' && this.character.weapons.length < 6) {
          this.addItemToWeapons(item.id);
          this.decreaseMoney(price);
          this.animatePurchase(item.id, category);
        } else if (category === 'armor' && this.character.armor.length < 6) {
          this.addItemToArmor(item.id);
          this.decreaseMoney(price);
          this.animatePurchase(item.id, category);
        } else if (category === 'aid' && this.character.aid.length < 6) {
          this.addItemToAid(item.id);
          this.decreaseMoney(price);
          this.animatePurchase(item.id, category);
        } else if (category === 'resources') {
          this.addResource(item.id);
          this.decreaseMoney(price);
          this.animatePurchase(item.id, category);
        } else if (category === 'premium' && (this.character.premium || []).length < 6) {
          this.addItemToPremium(item.id);
          this.decreaseMoney(price);
          this.animatePurchase(item.id, category);
        } else {
          this.showError('Inventory full! Maximum 6 items per category.');
        }
      } else {
        this.showError('Not enough money!');
        this.animateError(item.id, category);
      }
    },
    showItemInfo(item) {
      this.hoveredItem = item;
    },
    hideItemInfo() {
      this.hoveredItem = null;
    },
    animatePurchase(itemId, category) {
      const element = this.$refs[`item-${category}-${itemId}`][0];
      element.classList.add('purchase-success');
      setTimeout(() => element.classList.remove('purchase-success'), 500);
    },
    animateError(itemId, category) {
      const element = this.$refs[`item-${category}-${itemId}`][0];
      element.classList.add('purchase-error');
      setTimeout(() => element.classList.remove('purchase-error'), 500);
    },
    showError(message) {
      // You can implement a toast or other notification system here
      alert(message);
    }
  }
};
</script>

<style scoped lang="scss">
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
  margin: 1.75rem auto;
}

.modal-content {
  background-color: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 10px;
}

.modal-header {
  border-bottom: 1px solid #00ff00;
  padding: 1rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem!important;
  max-height: 70vh;
  overflow-y: auto;
  color: #fff;
}

.modal-footer {
  border-top: 1px solid #00ff00;
  padding: 1rem;
}


.shop-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.shop-dialog {
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

.shop-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.shop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.shop-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-logo {
  width: 24px;
  height: 24px;
}

.shop-title {
  color: #00ff00;
  margin: 0;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.player-money {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 0, 0.1);
  border: 1px solid #ffff00;
  border-radius: 4px;
  color: #ffff00;
  font-size: 14px;

  img {
    width: 16px;
    height: 16px;
  }
}

.shop-button {
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

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: #00cc00;
  }
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

.shop-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  border-bottom: 2px solid #2a2a2a;
  padding-bottom: 10px;
}

.tab-button {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #888;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #222;
    color: #fff;
  }

  &.active {
    background: #333;
    color: #00ff00;
    border-color: #00ff00;
  }

  .item-count {
    display: inline-block;
    background: #333;
    color: #fff;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    margin-left: 8px;
  }
}

.shop-container {
  flex: 1;
  min-height: 0;
  margin-top: 15px;
}

.shop-content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px); // Subtracting header + tabs height
}

.shop-items {
  overflow-y: auto;
  padding-right: 10px;

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

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-template-rows: repeat(3, 80px);
  gap: 15px;
  padding: 5px;
  max-height: calc(3 * 80px + 2 * 15px); /* 3 rows * 80px height + 2 gaps */
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

.info-panel {
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

.item-details {
  padding: 15px;
  height: 100%;

  &.weapons { border-left: 2px solid rgba(255, 68, 68, 0.3); }
  &.armor { border-left: 2px solid rgba(68, 68, 255, 0.3); }
  &.aid { border-left: 2px solid rgba(255, 255, 68, 0.3); }
  &.resources { border-left: 2px solid rgba(68, 255, 68, 0.3); }
  &.premium { border-left: 2px solid rgba(255, 215, 0, 0.3); }

  h3 {
    color: #00ff00;
    font-size: 18px;
    margin: 0 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .stats {
    margin-bottom: 15px;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 14px;

    img {
      width: 18px;
      height: 18px;
    }

    span {
      color: #fff;
      &:last-child {
        color: #00ff00;
        text-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
      }
    }
  }

  .description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 15px;
    line-height: 1.6;
  }

  .price-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffff00;
    font-size: 16px;

    img {
      width: 20px;
      height: 20px;
    }
    
    .discount-text {
      color: #00ff00;
      font-size: 12px;
      font-weight: bold;
    }
  }
}

.item-details-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  padding: 20px;
  text-align: center;
}

.item-slot {
  width: 80px;
  height: 80px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #00ff00;
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  }

  &.can-afford {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.1);
  }

  &.selected {
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }

  img {
    max-width: 80%;
    max-height: 80%;
    transition: transform 0.2s ease;
    image-rendering: pixelated;
    z-index: 1;
  }

  &:hover img {
    transform: scale(1.1);
  }
}

.buy-button {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(26, 26, 26, 0.95);
  color: #ff4444;
  border: 1px solid #ff4444;

  &.can-afford {
    background: rgba(0, 255, 0, 0.1);
    color: #00ff00;
    border-color: #00ff00;

    &:hover {
      background: #00ff00;
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

@keyframes purchaseSuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); background: rgba(0, 255, 0, 0.2); }
  100% { transform: scale(1); }
}

@keyframes purchaseError {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

.purchase-success {
  animation: purchaseSuccess 0.5s ease;
}

.purchase-error {
  animation: purchaseError 0.3s ease;
}

@media (max-width: 1024px) {
  .shop-content-grid {
    grid-template-columns: 1fr 250px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    grid-template-rows: repeat(3, 70px);
    gap: 12px;
    max-height: calc(3 * 70px + 2 * 12px); /* 3 rows * 70px height + 2 gaps */
  }

  .item-slot {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .shop-dialog {
    padding: 10px;
    max-height: 100vh;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .shop-content-grid {
    grid-template-columns: 1fr;
    max-height: calc(100vh - 120px);
  }

  .shop-items {
    max-height: 60vh;
  }

  .info-panel {
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

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    grid-template-rows: repeat(3, 65px);
    gap: 10px;
    max-height: calc(3 * 65px + 2 * 10px); /* 3 rows * 65px height + 2 gaps */
  }

  .item-slot {
    width: 65px;
    height: 65px;
  }

  .item-overlay {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
  }

  .item-price {
    font-size: 11px;

    img {
      width: 12px;
      height: 12px;
    }
  }
}

@media (max-width: 480px) {
  .shop-content {
    padding: 10px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    grid-template-rows: repeat(3, 60px);
    gap: 8px;
    max-height: calc(3 * 60px + 2 * 8px); /* 3 rows * 60px height + 2 gaps */
  }

  .item-slot {
    width: 60px;
    height: 60px;
  }

  .info-panel {
    max-height: 50vh;
  }

  .item-price {
    font-size: 10px;

    img {
      width: 10px;
      height: 10px;
    }
  }
}
</style>
