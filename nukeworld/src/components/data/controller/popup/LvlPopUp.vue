<template>
    <div class="lvlpopup" v-show="showPopup">
        <div class="modal-backdrop show"></div>
        <div class="modal" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-body">
                <p>{{ title }}</p>
                <p>{{ desc }}</p>
                <p>You have reached level {{ character.level }}</p>
                <p><b>You have gained the following rewards</b><br/>
                <img style="width:20px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Experience"> {{ expGained }}
                <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money"> {{ moneyGained }}
                </p>
                <div class="progress mt-2">
                <div class="progress-bar" role="progressbar" :style="{width: progress + '%'}"></div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>
  
<script>
import confetti from 'canvas-confetti';
import { mapState } from 'vuex';

export default {
    name: 'LvlPopUp',
  props: ['title', 'desc'],
  emits: ['popup-closed'], 
  data() {
    return {
      showPopup: false,
      progress: 0,
      expGained: 0,
      moneyGained: 0,
      healthGained: 0,
    };
  },
  computed: {
    ...mapState(['character']),
  },
  methods: {
    closePopup() {
        this.showPopup = false;
        this.progress = 0;
        this.$emit('popup-closed'); // emit an event when the popup is closed
    },
    openPopup() {
      this.showPopup = true;
      this.calculateRewards();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const duration = 5000; // 5 sekunder
      const interval = 50; // opdatering hvert 50ms
      const increment = 100 / (duration / interval); // beregn inkrement baseret på varighed og interval
      let currentProgress = 0;

      const timer = setInterval(() => {
        currentProgress += increment;
        this.progress = Math.min(currentProgress, 100); // sørg for, at progress ikke overstiger 100%
        if (currentProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            this.closePopup();
            console.log('Popup closed');
          }, 1000); // forsink lukning af popup med 1 sekund
        }
      }, interval);
    },
    calculateRewards() {
      this.expGained = this.character.maxExp - this.character.exp;
      this.moneyGained = Math.floor(this.character.level * 100);
      this.healthGained = Math.floor(this.character.level * 10);
    },
  },
};
</script>
  
<style scoped>
  .lvlpopup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-dialog {
    max-width: 500px;
    width: 90%;
    margin: 1.75rem auto;
  }
  
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1051;
    animation: scaleIn 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @keyframes scaleIn {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
.progress {
  height: 20px;
}

.progress-bar {
  width: 0;
  height: 100%;
  background-color: #007bff;
}
</style>
