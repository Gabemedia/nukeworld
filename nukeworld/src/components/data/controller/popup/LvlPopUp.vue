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
                <img style="width:20px;" :src="require(`@/assets/interface/icons/exp.png`)" title="Experience"> {{ expGained }} Experience<br/>
                <img style="width:20px;" :src="require(`@/assets/interface/icons/money.png`)" title="Money"> {{ moneyGained }} NukaCoins<br/>
                <img style="width:20px;" :src="require(`@/assets/interface/icons/aid/medkit.png`)" title="Health"> +{{ healthGained }} Max Health<br/>
                <img style="width:20px;" :src="require(`@/assets/interface/icons/player.png`)" title="Skill Points"> +{{ skillPointsGained }} Skill Points
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
import { mapState, mapActions } from 'vuex';

export default {
    name: 'LvlPopUp',
    props: {
        title: {
            type: String,
            default: 'Congratulations!'
        },
        desc: {
            type: String,
            default: 'You have leveled up!'
        }
    },
    emits: ['popup-closed'], 
    data() {
        return {
            showPopup: false,
            progress: 0,
            expGained: 0,
            moneyGained: 0,
            healthGained: 10,
            skillPointsGained: 0
        };
    },
    computed: {
        ...mapState(['character']),
    },
    methods: {
        ...mapActions(['increaseMoney', 'increaseExp', 'updateCharacter']),
        closePopup() {
            this.showPopup = false;
            this.progress = 0;
            this.$emit('popup-closed');
        },
        openPopup() {
            this.showPopup = true;
            this.calculateRewards();
            this.addRewardsToCharacter();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            const duration = 5000;
            const interval = 50;
            const increment = 100 / (duration / interval);
            let currentProgress = 0;

            const timer = setInterval(() => {
                currentProgress += increment;
                this.progress = Math.min(currentProgress, 100);
                if (currentProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        this.closePopup();
                    }, 1000);
                }
            }, interval);
        },
        calculateRewards() {
            // Beregn belønninger baseret på level med mere balancerede værdier
            this.expGained = Math.floor(this.character.maxExp * 0.0005); // 0.05% af max exp som bonus
            this.moneyGained = this.character.level; // 1 penge per level
            
            // Beräkna skill points baserat på Intelligence (samma som i levelUp funktionen)
            const intelligenceBonus = this.character.special ? this.character.special.intelligence : 1;
            const baseSkillPoints = 1;
            this.skillPointsGained = baseSkillPoints + Math.floor(intelligenceBonus / 2);
        },
        addRewardsToCharacter() {
            // Brug de eksisterende Vuex actions som allerede inkluderer SPECIAL bonuser
            this.increaseMoney(this.moneyGained);
            this.increaseExp(this.expGained);
            
            // Opdater maxHealth og health via updateCharacter action
            const newMaxHealth = this.character.maxHealth + this.healthGained;
            this.updateCharacter({
                maxHealth: newMaxHealth,
                health: newMaxHealth // Heal til ny max health
            });
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

.modal-content {
    background-color: #1a1a1a;
    color: #fff;
    border: 2px solid #00ff00;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.modal-body {
    padding: 1rem!important;
    text-align: center;
}

.modal-body p {
    margin-bottom: 15px;
}

.modal-body img {
    margin: 0 5px;
    vertical-align: middle;
}
</style>
