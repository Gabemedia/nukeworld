<template>
  <div class="inventory-container">
    <div class="inventory-tabs">
      <button 
        v-for="(items, type) in {'weapons': weapons, 'armor': armor, 'aid': aid, 'resources': resources, 'premium': premium}" 
        :key="type"
        class="tab-button"
        :class="{ active: activeTab === type }"
        @click="changeTab(type)"
      >
        <img :src="require(`@/assets/interface/icons/${type === 'weapons' ? 'gun' : type === 'armor' ? 'shield' : type === 'aid' ? 'medkit' : type === 'premium' ? 'premium/donate' : 'resources/ammunition'}.png`)" :alt="type">
        {{ type.toUpperCase() }}
        <span class="item-count">{{ items.length }}</span>
      </button>
    </div>

    <div class="inventory-container">
      <div class="inventory-content-grid">
        <div class="inventory-items">
          <!-- Weapons Tab -->
          <div v-show="activeTab === 'weapons'" class="items-grid">
            <div v-for="item in weapons" 
                 :key="item.uuid" 
                 class="item-slot"
                 :class="{ 'equipped': isEquipped(item.uuid), 'selected': hoveredItem === item }"
                 @click="showItemInfo(item)"
                 @mouseover="showItemInfo(item, 'weapon')">
              <img :src="require(`@/assets/interface/icons/weapons/${item.img}`)" :alt="item.name" />
              <div v-if="isEquipped(item.uuid)" class="equipped-badge">E</div>
              <button v-if="item.price !== -1" 
                      class="sell-button" 
                      @click.stop="sellWeapon(item.uuid)"
                      :disabled="isEquipped(item.uuid)">
                <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                <span>{{ Math.floor(item.price * 0.1) }}</span>
              </button>
            </div>
          </div>

          <!-- Armor Tab -->
          <div v-show="activeTab === 'armor'" class="items-grid">
            <div v-for="item in armor"
                 :key="item.uuid"
                 class="item-slot"
                 :class="{ 'equipped': isArmorEquipped(item.uuid), 'selected': hoveredItem === item }"
                 @click="showItemInfo(item)"
                 @mouseover="showItemInfo(item, 'armor')">
              <img :src="require(`@/assets/interface/icons/armor/${item.img}`)" :alt="item.name" />
              <div v-if="isArmorEquipped(item.uuid)" class="equipped-badge">E</div>
              <button v-if="item.price !== -1"
                      class="sell-button"
                      @click.stop="sellArmor(item.uuid)"
                      :disabled="isArmorEquipped(item.uuid)">
                <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                <span>{{ Math.floor(item.price * 0.1) }}</span>
              </button>
            </div>
          </div>

          <!-- Aid Tab -->
          <div v-show="activeTab === 'aid'" class="items-grid">
            <div v-for="item in aid"
                 :key="item.uuid"
                 class="item-slot"
                 :class="{ 'selected': hoveredItem === item }"
                 @click="showItemInfo(item)"
                 @mouseover="showItemInfo(item, 'aid')">
              <img :src="require(`@/assets/interface/icons/aid/${item.img}`)" :alt="item.name" />
              <button v-if="item.price !== -1"
                      class="sell-button"
                      @click.stop="sellAid(item.uuid)">
                <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                <span>{{ Math.floor(item.price * 0.1) }}</span>
              </button>
            </div>
          </div>

          <!-- Resources Tab -->
          <div v-show="activeTab === 'resources'" class="items-grid">
            <div v-for="stack in stackedResources"
                 :key="stack.id + '-' + stack.stackCount"
                 class="item-slot resource-stack"
                 :class="{ 'selected': hoveredItem === stack }"
                 @click="showItemInfo(stack)"
                 @mouseover="showItemInfo(stack, 'resources')">
              <img :src="require(`@/assets/interface/icons/resources/${stack.img}`)" :alt="stack.name" />
              <div class="stack-count">{{ stack.stackCount }}</div>
              <button class="sell-button resource-sell"
                      @click.stop="sellResourceStack(stack.stack)">
                <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                <span>{{ Math.floor(stack.totalValue * 0.1) }}</span>
              </button>
            </div>
          </div>

          <!-- Premium Tab -->
          <div v-show="activeTab === 'premium'" class="items-grid">
            <div v-for="item in premium"
                 :key="item.uuid"
                 class="item-slot"
                 :class="{ 'selected': hoveredItem === item }"
                 @click="showItemInfo(item)"
                 @mouseover="showItemInfo(item, 'premium')">
              <img :src="require(`@/assets/interface/icons/premium/${item.img}`)" :alt="item.name" />
              <button v-if="item.price !== -1"
                      class="sell-button"
                      @click.stop="sellPremium(item.uuid)">
                <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
                <span>{{ Math.floor(item.price * 0.1) }}</span>
              </button>

            </div>
          </div>
        </div>

        <div class="info-panel">
          <div v-if="hoveredItem" class="item-details" :class="activeTab">
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
              <div v-if="activeTab === 'resources'" class="stat">
                <img :src="require(`@/assets/interface/icons/resources/${hoveredItem.img}`)" :alt="hoveredItem.name">
                <span>Resource (Stack: {{ hoveredItem.stackCount }})</span>
              </div>
              <div v-if="activeTab === 'premium'" class="stat">
                <img :src="require(`@/assets/interface/icons/premium/${hoveredItem.img}`)" :alt="hoveredItem.name">
                <span>Premium Item</span>
              </div>
            </div>
            <p class="description">{{ hoveredItem.desc }}</p>
            <div v-if="hoveredItem.price !== -1" class="price-info">
              <img :src="require('@/assets/interface/icons/money.png')" alt="Money">
              <span>Value: {{ activeTab === 'resources' ? Math.floor(hoveredItem.totalValue * 0.1) : Math.floor(hoveredItem.price * 0.1) }}</span>
            </div>
            
            <div class="action-buttons">
              <!-- Equip Button for Weapons -->
              <button 
                v-if="activeTab === 'weapons' && hoveredItem.price !== -1"
                class="action-button equip-action"
                @click="toggleEquipWeapon(hoveredItem.uuid)"
                :class="{ 'equipped': isEquipped(hoveredItem.uuid) }">
                {{ isEquipped(hoveredItem.uuid) ? 'Unequip Weapon' : 'Equip Weapon' }}
              </button>

              <!-- Equip Button for Armor -->
              <button 
                v-if="activeTab === 'armor' && hoveredItem.price !== -1"
                class="action-button equip-action"
                @click="toggleEquipArmor(hoveredItem.uuid)"
                :class="{ 'equipped': isArmorEquipped(hoveredItem.uuid) }">
                {{ isArmorEquipped(hoveredItem.uuid) ? 'Unequip Armor' : 'Equip Armor' }}
              </button>

              <!-- Use Button for Aid Items -->
              <button 
                v-if="activeTab === 'aid'"
                class="action-button use-action"
                @click="useAid(hoveredItem.uuid)">
                Use Item
              </button>

              <!-- Sell Buttons -->
              <button 
                v-if="hoveredItem.price !== -1 && (activeTab === 'weapons' || activeTab === 'armor')"
                class="action-button sell-action"
                @click="activeTab === 'weapons' ? sellWeapon(hoveredItem.uuid) : sellArmor(hoveredItem.uuid)"
                :disabled="(activeTab === 'weapons' && isEquipped(hoveredItem.uuid)) || 
                          (activeTab === 'armor' && isArmorEquipped(hoveredItem.uuid))"
                :class="{ 'cant-sell': (activeTab === 'weapons' && isEquipped(hoveredItem.uuid)) || 
                                      (activeTab === 'armor' && isArmorEquipped(hoveredItem.uuid)) }">
                <span v-if="(activeTab === 'weapons' && !isEquipped(hoveredItem.uuid)) || 
                            (activeTab === 'armor' && !isArmorEquipped(hoveredItem.uuid))">
                  Sell Item
                </span>
                <span v-else>Can't Sell (Equipped)</span>
              </button>

              <!-- Sell Button for Aid -->
              <button 
                v-if="activeTab === 'aid' && hoveredItem.price !== -1"
                class="action-button sell-action"
                @click="sellAid(hoveredItem.uuid)">
                Sell Item
              </button>

              <!-- Sell Button for Resources -->
              <button 
                v-if="activeTab === 'resources'"
                class="action-button sell-action"
                @click="sellResource(hoveredItem.uuid)">
                Sell Item
              </button>

              <!-- Open Box Button for Premium -->
              <button 
                v-if="activeTab === 'premium' && hoveredItem.type === 'lootbox'"
                class="action-button open-box-action"
                @click="openLootbox(hoveredItem.uuid)">
                Open Box
              </button>

              <!-- Sell Button for Premium -->
              <button 
                v-if="activeTab === 'premium' && hoveredItem.price !== -1"
                class="action-button sell-action"
                @click="sellPremium(hoveredItem.uuid)">
                Sell Item
              </button>
            </div>
          </div>
          <div v-else class="item-details-placeholder">
            <p>Select an item to view details</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Lootbox Modal -->
    <LootboxModal
      v-if="isLootboxModalOpen"
      :rewards="currentLootboxRewards"
      :lootboxName="currentLootboxName"
      @close="closeLootboxModal"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import LootboxModal from './LootboxModal.vue';

export default {
  name: 'InventoryStash',
  components: { LootboxModal },
  data() {
    return {
      hoveredItem: null,
      activeTab: 'weapons'
    };
  },
  computed: {
    ...mapState(['character', 'isLootboxModalOpen', 'currentLootboxRewards', 'currentLootboxName']),
    weapons() {
      const handsWeapon = this.character.weapons.find(weapon => weapon.name === 'Hands');
      if (handsWeapon) {
        return [handsWeapon, ...this.character.weapons.filter(weapon => weapon.name !== 'Hands')];
      }
      return this.character.weapons;
    },
    armor() {
      return this.character.armor;
    },
    aid() {
      return this.character.aid;
    },
    resources() {
      return this.character.resources;
    },
    premium() {
      return this.character.premium || [];
    },
    stackedResources() {
      // Group resources by their ID
      const groups = this.character.resources.reduce((acc, resource) => {
        if (!acc[resource.id]) {
          acc[resource.id] = {
            ...resource,
            stack: [resource],
            stackCount: 1,
            totalValue: parseInt(resource.price)
          };
        } else {
          acc[resource.id].stack.push(resource);
          acc[resource.id].stackCount++;
          acc[resource.id].totalValue += parseInt(resource.price);
        }
        return acc;
      }, {});

      // Convert groups to array and split into stacks of 15
      return Object.values(groups).reduce((acc, group) => {
        const fullStacks = Math.floor(group.stackCount / 15);
        const remainingItems = group.stackCount % 15;

        // Add full stacks
        for (let i = 0; i < fullStacks; i++) {
          acc.push({
            ...group,
            stack: group.stack.slice(i * 15, (i + 1) * 15),
            stackCount: 15,
            totalValue: 15 * parseInt(group.price)
          });
        }

        // Add remaining items if any
        if (remainingItems > 0) {
          acc.push({
            ...group,
            stack: group.stack.slice(fullStacks * 15),
            stackCount: remainingItems,
            totalValue: remainingItems * parseInt(group.price)
          });
        }

        return acc;
      }, []);
    }
  },
  methods: {
    ...mapActions(['equipWeapon', 'sellWeapon', 'equipArmor', 'sellArmor', 'useAid', 'sellResource', 'sellAid', 'sellResourceStack', 'sellPremium', 'openLootboxAction']),
    changeTab(type) {
      this.activeTab = type;
      this.hoveredItem = null; // Clear active item when changing tabs
    },
    sellResourceStack(stack) {
      this.$store.dispatch('sellResourceStack', stack);
    },
    toggleEquipWeapon(itemUuid) {
      this.equipWeapon(itemUuid);
    },
    isEquipped(itemUuid) {
      return this.character.equippedWeapons.some(weapon => weapon.uuid === itemUuid);
    },
    toggleEquipArmor(itemUuid) {
      this.equipArmor(itemUuid);
    },
    isArmorEquipped(itemUuid) {
      return this.character.equippedArmor && this.character.equippedArmor.uuid === itemUuid;
    },
    showItemInfo(item) {
      this.hoveredItem = item;
    },
    hideItemInfo() {
      // Removed this method as we're no longer using mouseleave
    },
    closeModal() {
      // This method will be called by parent component
      this.$emit('close-modal');
    },
    // Åbn lootbox og vis modal
    openLootbox(lootboxUuid) {
      this.openLootboxAction(lootboxUuid);
    },
    closeLootboxModal() {
      this.$store.commit('setLootboxModalOpen', false);
      this.$store.commit('setCurrentLootboxRewards', []);
      this.$store.commit('setCurrentLootboxName', '');
    }
  },
};
</script>

<style scoped lang="scss">
.inventory-container {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  padding: 15px;
  color: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.inventory-tabs {
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

.inventory-content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: 100%;
  max-height: calc(90vh - 140px);
  flex: 1;
}

.inventory-items {
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
  gap: 15px;
  padding: 5px;
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

  &.equipped {
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

.equipped-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #00ff00;
  color: #000;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.sell-button {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: rgba(26, 26, 26, 0.95);
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 12px;
    height: 12px;
  }

  &:hover:not(:disabled) {
    background: #00ff00;
    color: #000;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 255, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

.action-buttons {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-button {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(26, 26, 26, 0.95);
  text-align: center;

  &.equip-action {
    color: #00ff00;
    border: 1px solid #00ff00;

    &:hover {
      background: #00ff00;
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    }

    &.equipped {
      background: rgba(0, 255, 0, 0.1);
    }
  }

  &.use-action {
    color: #ffff00;
    border: 1px solid #ffff00;

    &:hover {
      background: #ffff00;
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 255, 0, 0.2);
    }
  }

  &.open-box-action {
    color: #00ff00;
    border: 1px solid #00ff00;

    &:hover {
      background: #00ff00;
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
    }
  }

  &.sell-action {
    color: #ff4444;
    border: 1px solid #ff4444;

    &:not(:disabled):hover {
      background: #ff4444;
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
    }

    &.cant-sell {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.resource-stack {
  position: relative;
  width: 80px;
  height: 80px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;

  &:hover {
    transform: translateY(-2px);
    border-color: #00ff00;
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.2);
  }

  &.selected {
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }

  img {
    max-width: 50%;
    max-height: 50%;
    transition: transform 0.2s ease;
    image-rendering: pixelated;
  }

  &:hover img {
    transform: scale(1.1);
  }

  .stack-count {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #00ff00;
    color: #000;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

@media (max-width: 1024px) {
  .inventory-content-grid {
    grid-template-columns: 1fr 250px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
  }

  .item-slot {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 768px) {
  .inventory-container {
    padding: 10px;
  }

  .inventory-content-grid {
    grid-template-columns: 1fr;
    max-height: calc(100vh - 120px);
  }

  .inventory-items {
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

  .inventory-tabs {
    overflow-x: auto;
    padding-bottom: 5px;
    margin-bottom: 10px;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 1.5px;
    }
  }

  .tab-button {
    padding: 6px 12px;
    font-size: 12px;
    white-space: nowrap;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
    gap: 10px;
  }

  .item-slot {
    width: 65px;
    height: 65px;
  }

  .sell-button {
    font-size: 10px;
    padding: 1px 4px;
  }

  .action-button {
    padding: 8px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .inventory-container {
    padding: 8px;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
    gap: 6px;
  }

  .item-slot {
    width: 55px;
    height: 55px;
  }

  .sell-button {
    font-size: 10px;
    padding: 1px 4px;
  }

  .action-button {
    padding: 6px;
    font-size: 12px;
  }
}


</style>
