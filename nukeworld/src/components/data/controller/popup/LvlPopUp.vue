<template>
    <div class="lvlpopup" v-show="showPopup">
        <div class="modal-backdrop show"></div>
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
    name: 'LvlPopUp',
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
        this.$emit('popup-closed'); // emit an event when the popup is closed
    },
    openPopup() {
      this.showPopup = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      let intervalId = setInterval(() => {
        this.progress += 0.1; // increment progress by a smaller amount
        if (this.progress >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            this.closePopup();
          }, 100); // add a slight delay before closing the popup
        }
      }, 5); // update progress every 1ms
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
    width:500px;
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
  transition: width 0.2s;
}
</style>