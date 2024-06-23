<template>
  <button class="btn btn-main sidebar-btn border border-1 border-white m-2" type="button" @click="openModal">
    <img class="sidebar-icon" :src="require(`@/assets/interface/icons/shop.png`)" title="Player Shop">
  </button>
  <div v-if="showModal" class="modal" tabindex="-1" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body shop-modal-body">
          <div class="shop">
            <div class="shop-section">
              <h6 class="mb-3 text-uppercase fw-bold">Big´n´Small Shop</h6>
              <p class="mt-3 text-uppercase fw-bold text-left">Weapon:</p>
              <div class="shop-items">
                <div v-for="weapon in availableWeapons" :key="weapon.id" class="shop-item" @click="buyItem(weapon, 'weapons')" :ref="'item-weapons-' + weapon.id">
                  <img :src="require(`@/assets/interface/icons/weapons/${weapon.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="weapon.name" />
                  <div class="price-box">{{ weapon.price }}</div>
                </div>
              </div>
            </div>
            <div class="shop-section">
              <p class="mt-3 text-uppercase fw-bold text-left"><br/>Armor:</p>
              <div class="shop-items">
                <div v-for="armor in availableArmor" :key="armor.id" class="shop-item" @click="buyItem(armor, 'armor')" :ref="'item-armor-' + armor.id">
                  <img :src="require(`@/assets/interface/icons/armor/${armor.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="armor.name" />
                  <div class="price-box">{{ armor.price }}</div>
                </div>
              </div>
            </div>
            <div class="shop-section">
              <p class="mt-3 text-uppercase fw-bold text-left"><br/>Aid:</p>
              <div class="shop-items">
                <div v-for="aid in availableAid" :key="aid.id" class="shop-item" @click="buyItem(aid, 'aid')" :ref="'item-aid-' + aid.id">
                  <img :src="require(`@/assets/interface/icons/aid/${aid.name.toLowerCase().replace(/ /g, '_')}.png`)" :alt="aid.name" />
                  <div class="price-box">{{ aid.price }}</div>
                </div>
              </div>
            </div>
          </div>
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
    getTooltip(item) {
      const price = parseInt(item.price); 
      return `Price: ${price}`;
    },
  },
};
</script>

<style scoped>
.card-text-header {
  font-weight: 600;
  font-size: 1rem;
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

.shop-modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.modal-content {
  position: relative;
  background-clip: padding-box;
  border: 1px #fff solid;
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content:space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.shop-section {
  margin-bottom: 20px;
}

.shop-section p{
  color: #fff;;
  margin-bottom: 0;
  line-height: 1.5;
  margin-top: 25px;
  text-align: left;
}

.shop-section h6{
  color: #fff;;
  margin-bottom: 0;
  line-height: 1.5;
  text-align: left;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s;
}

@keyframes pullOut {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.pull-out {
  animation: pullOut 0.5s;
}

.shop-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content:start;
}

.shop-item {
    width: calc(25% - 12px);
    height: 100px;
    border: 2px solid #ccc;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin:12px 0;
}

.shop-item img {
  max-width: 100%;
  max-height: 100%;
  scale: 0.8;
  margin-top:20px;
}

.price-box {
  margin-top: -5px;
  padding: 3px 6px;
  background-color: #000;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.8rem;
}
</style>
