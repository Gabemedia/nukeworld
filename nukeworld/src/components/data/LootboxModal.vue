<template>
  <div class="lootbox-modal-backdrop" @click.self="close">
    <div class="lootbox-modal">
      <div class="lootbox-header">
        <img :src="require('@/assets/interface/icons/premium/donate.png')" class="lootbox-icon" alt="Lootbox" />
        <h2>{{ lootboxName }}</h2>
      </div>
      <transition-group name="reward-fade" tag="div" class="rewards-list">
        <div v-for="(reward, idx) in rewards" :key="reward.item ? reward.item.uuid : 'money-' + idx" class="reward-item">
          <img v-if="reward.type === 'weapon'" :src="require(`@/assets/interface/icons/weapons/${reward.item.img}`)" class="reward-img" />
          <img v-else-if="reward.type === 'armor'" :src="require(`@/assets/interface/icons/armor/${reward.item.img}`)" class="reward-img" />
          <img v-else-if="reward.type === 'aid'" :src="require(`@/assets/interface/icons/aid/${reward.item.img}`)" class="reward-img" />
          <img v-else-if="reward.type === 'resource'" :src="require(`@/assets/interface/icons/resources/${reward.item.img}`)" class="reward-img" />
          <img v-else-if="reward.type === 'money'" :src="require('@/assets/interface/icons/money.png')" class="reward-img" />
          
          <span v-if="reward.type === 'weapon'" class="reward-label">{{ reward.item.name }}</span>
          <span v-else-if="reward.type === 'armor'" class="reward-label">{{ reward.item.name }}</span>
          <span v-else-if="reward.type === 'aid'" class="reward-label">{{ reward.item.name }}</span>
          <span v-else-if="reward.type === 'resource'" class="reward-label">{{ reward.item.name }}</span>
          <span v-else-if="reward.type === 'money'" class="reward-label">{{ reward.amount }} Money</span>
        </div>
      </transition-group>
      <button class="close-btn" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LootboxModal',
  props: {
    rewards: {
      type: Array,
      required: true
    },
    lootboxName: {
      type: String,
      default: 'Lootbox Opened!'
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.lootbox-modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lootbox-modal {
  background: #181818;
  border: 2px solid #FFD700;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  padding: 20px 16px 16px 16px;
  min-width: 280px;
  max-width: 400px;
  text-align: center;
  position: relative;
  animation: lootbox-pop 0.5s cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes lootbox-pop {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
.lootbox-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}
.lootbox-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 8px #FFD70088);
}
.lootbox-header h2 {
  color: #FFD700;
  font-size: 1.1rem;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}
.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  align-items: center;
}
.reward-item {
  background: rgba(255, 215, 0, 0.08);
  border: 1.5px solid #FFD700;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(255,215,0,0.08);
  font-size: 0.95rem;
  animation: reward-fade-in 0.7s;
}
@keyframes reward-fade-in {
  0% { opacity: 0; transform: translateY(30px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.reward-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 0 6px #FFD70088);
}
.reward-label {
  color: #FFD700;
  font-weight: bold;
  text-shadow: 0 1px 8px #000;
  text-align: right;
}
.close-btn {
  margin-top: 8px;
  padding: 8px 20px;
  background: linear-gradient(90deg, #FFD700 60%, #fffbe6 100%);
  color: #222;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #FFD70044;
  transition: background 0.2s, color 0.2s;
}
.close-btn:hover {
  background: #fffbe6;
  color: #FFD700;
}
.reward-fade-enter-active, .reward-fade-leave-active {
  transition: all 0.5s;
}
.reward-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.reward-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style> 