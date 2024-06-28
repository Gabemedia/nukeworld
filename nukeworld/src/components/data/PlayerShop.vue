<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/shop.png`)" title="Player Shop">
  </button>
  <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Big´n´Small Shop</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body shop-modal-body">
          <div class="shop">
            <div class="shop-section">
              <h6 class="mb-2 text-uppercase fw-bold">Weapons</h6>
              <div class="shop-items">
                <div v-for="weapon in availableWeapons" :key="weapon.id" 
                    class="shop-item" 
                    @click="buyItem(weapon, 'weapons')" 
                    @mouseover="showItemInfo(weapon)"
                    @mouseleave="hideItemInfo"
                    :ref="'item-weapons-' + weapon.id">
                  <img :src="require(`@/assets/interface/icons/weapons/${weapon.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="weapon.name" />
                  <div class="price-box">{{ weapon.price }}</div>
                  <div v-if="hoveredItem === weapon" class="item-info">
                    <p class="mb-1 fw-bold small">Name: {{ weapon.name }}</p>
                    <p class="mb-1 small">Attack: {{ weapon.attack }}</p>
                    <p class="mb-1 small">Defence: {{ weapon.defence }}</p>
                    <p class="mb-1 small">Description: {{ weapon.desc }}</p>
                    <p class="mb-1 small">Price: {{ weapon.price }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="shop-section">
              <h6 class="mb-2 text-uppercase fw-bold">Armor</h6>
              <div class="shop-items">
                <div v-for="armor in availableArmor" :key="armor.id" 
                    class="shop-item" 
                    @click="buyItem(armor, 'armor')" 
                    @mouseover="showItemInfo(armor)"
                    @mouseleave="hideItemInfo"
                    :ref="'item-armor-' + armor.id">
                  <img :src="require(`@/assets/interface/icons/armor/${armor.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="armor.name" />
                  <div class="price-box">{{ armor.price }}</div>
                  <div v-if="hoveredItem === armor" class="item-info">
                    <p class="mb-1 fw-bold small">Name: {{ armor.name }}</p>
                    <p class="mb-1 small">Defence: {{ armor.defence }}</p>
                    <p class="mb-1 small">Description: {{ armor.desc }}</p>
                    <p class="mb-1 small">Price: {{ armor.price }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="shop-section">
              <h6 class="mb-2 text-uppercase fw-bold">Aid</h6>
              <div class="shop-items">
                <div v-for="aid in availableAid" :key="aid.id" 
                    class="shop-item" 
                    @click="buyItem(aid, 'aid')" 
                    @mouseover="showItemInfo(aid)"
                    @mouseleave="hideItemInfo"
                    :ref="'item-aid-' + aid.id">
                  <img :src="require(`@/assets/interface/icons/aid/${aid.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="aid.name" />
                  <div class="price-box">{{ aid.price }}</div>
                  <div v-if="hoveredItem === aid" class="item-info">
                    <p class="mb-1 fw-bold small">Name: {{ aid.name }}</p>
                    <p class="mb-1 small">Health: {{ aid.health }}</p>
                    <p class="mb-1 small">Description: {{ aid.desc }}</p>
                    <p class="mb-1 small">Price: {{ aid.price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'PlayerShop',
  
  data() {
    return {
      showModal: false,
      hoveredItem: null,
    };
  },
  computed: {
    ...mapState(['character', 'items', 'armor', 'aid']),
    availableWeapons() {
      return this.items.filter(item => item.price !== '-1');
    },
    availableArmor() {
      return this.armor.filter(item => item.price !== '-1');
    },
    availableAid() {
      return this.aid.filter(item => item.price !== '-1');
    },
  },
  methods: {
    ...mapActions(['addItemToWeapons', 'addItemToArmor', 'addItemToAid', 'decreaseMoney']),
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    buyItem(item, category) {
      const price = parseInt(item.price);
      if (this.character.money >= price) {
        if (category === 'weapons' && this.character.weapons.length < 6) {
          this.addItemToWeapons(item.id);
        } else if (category === 'armor' && this.character.armor.length < 6) {
          this.addItemToArmor(item.id);
        } else if (category === 'aid' && this.character.aid.length < 6) {
          this.addItemToAid(item.id);
        } else {
          alert('You can only have a maximum of 6 items in each category.');
          return;
        }
        this.decreaseMoney(price);
        this.$nextTick(() => {
          const itemElement = this.$refs[`item-${category}-${item.id}`][0];
          itemElement.classList.add('pull-out');
          setTimeout(() => {
            itemElement.classList.remove('pull-out');
          }, 500);
        });
      } else {
        this.$nextTick(() => {
          const itemElement = this.$refs[`item-${category}-${item.id}`][0];
          itemElement.classList.add('shake');
          setTimeout(() => {
            itemElement.classList.remove('shake');
          }, 500);
        });
        alert('Not enough money to buy this item.');
      }
    },
    showItemInfo(item) {
      this.hoveredItem = item;
    },
    hideItemInfo() {
      this.hoveredItem = null;
    },
  },
};
</script>

<style scoped>
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
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 800px;
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
  padding: 0.75rem 1rem;
}

.modal-title {
  color: #00ff00;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #00ff00;
  font-size: 1rem;
}

.shop-modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  border-top: 1px solid #00ff00;
  padding: 0.75rem;
}

.btn-secondary {
  background-color: #333;
  color: #fff;
  border: 1px solid #00ff00;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-secondary:hover {
  background-color: #00ff00;
  color: #000;
}

.shop-section {
  margin-bottom: 15px;
}

.shop-section h6 {
  color: #00ff00;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-align: left;
  font-size: 0.9rem;
}

.shop-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: start;
}

.shop-item {
  width: calc(25% - 8px);
  height: 80px;
  background-color: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 5px;
}

.shop-item img {
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
}

.price-box {
  margin-top: 2px;
  padding: 1px 3px;
  background-color: #000;
  border: 1px solid #00ff00;
  border-radius: 3px;
  font-size: 0.7rem;
  color: #00ff00;
}

.item-info {
  position: absolute;
  top: 100%;
  left: 68.5%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  z-index: 1;
  width: 250px;
  text-align: left;
  color: #fff;
  font-size: 0.8rem;
  border: 1px solid #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.item-info p {
  margin-bottom: 2px;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.3s;
}

@keyframes pullOut {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.pull-out {
  animation: pullOut 0.3s;
}

@media (max-width: 768px) {
  .shop-item {
    width: calc(33.33% - 8px);
  }
}

@media (max-width: 576px) {
  .shop-item {
    width: calc(50% - 8px);
  }
}
</style>
