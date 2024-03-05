<template>
  <div class="questpopup" v-show="showPopup">
    <div class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="closePopup"></button>
          </div>
          <div class="modal-body">
            <p>{{ desc }}</p>
            <div class="progress">
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

export default {
  name: 'QuestPopUp',
  props: ['title', 'desc'],
  emits: ['popup-closed'],
  data() {
    return {
      showPopup: false,
      progress: 0,
    };
  },
  methods: {
    closePopup() {
      this.showPopup = false;
      this.progress = 0;
      this.$emit('popup-closed');
    },
    openPopup() {
      this.showPopup = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      let intervalId = setInterval(() => {
        this.progress += 0.1;
        if (this.progress >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            this.closePopup();
          }, 100);
        }
      }, 5);
    },
  },
};
</script>

<style scoped>
  .questpopup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
  }
    
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1051;
    animation: scaleIn 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .modal-dialog {
    width:500px;
  }

  @keyframes scaleIn {
    0% {
      transform: translateX(-50%) scale(0.5);
      opacity: 0;
    }
    100% {
      transform: translateX(-50%) scale(1);
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
    transition: width 0.2s;
  }
</style>