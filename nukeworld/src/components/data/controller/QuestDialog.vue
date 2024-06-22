<template>
  <div class="dialog-system">
    <div v-if="currentStoryLine && currentStoryStep">
      <h6 class="mb-3 text-uppercase fw-bold text-start">{{ currentStoryLine.name }}</h6>
      <div class="dialog-log border border-1 small">
        <div class="conversation-box npc-box">
          <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="NPC">
          <div class="message-box npc-message">
            {{ currentStoryStep.npcMessage }}
          </div>
        </div>
        
        <div class="conversation-box player-box">
          <div class="message-box player-message">
              <button @click="selectOption(option)" class="btn btn-md btn-outline-light m-1" v-for="option in currentStoryStep.playerOptions" :key="option.text">
                {{ option.text }}
              </button>
          </div>
          <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="Player">
        </div>
      </div>
    </div>
    <div v-else-if="availableStoryLines.length > 0">
      <h6 class="mb-3 text-uppercase fw-bold text-start">Available Storylines</h6>
      <div v-for="storyLine in availableStoryLines" :key="storyLine.id">
        <button @click="startStoryLine(storyLine.id)" class="btn btn-sm btn-outline-light">
          {{ storyLine.name }} (Level {{ storyLine.levelRequirement }})
        </button>
      </div>
    </div>
    <div v-else>
      <h6 class="mb-3 text-uppercase fw-bold text-start">Come back later for more Storylines</h6>
    </div>
    <div class="mt-4">
      <h6 class="mb-3 text-uppercase fw-bold text-start">Completed Storylines</h6>
      <ul>
        <li v-for="storyLine in completedStoryLines" :key="storyLine.id">
          <button @click="toggleStoryLineDetails(storyLine.id)" class="btn btn-link text-light">
            {{ storyLine.name }}
          </button>
          <ul v-if="expandedStoryLines[storyLine.id]">
            <li v-for="(choice, index) in storyLine.playerChoices" :key="index">
              {{ choice }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ref } from 'vue';

export default {
  name: 'QuestDialog',
  setup() {
    const expandedStoryLines = ref({});

    const toggleStoryLineDetails = (storyLineId) => {
      expandedStoryLines.value[storyLineId] = !expandedStoryLines.value[storyLineId];
    };

    return {
      expandedStoryLines,
      toggleStoryLineDetails
    };
  },
  computed: {
    ...mapGetters(['currentStoryLine', 'currentStoryStep', 'availableStoryLines', 'completedStoryLines']),
  },
  methods: {
    ...mapActions(['startStoryLine', 'progressStory']),
    checkResources(requiredResources) {
      return requiredResources.every(req => {
        return this.$store.state.character.resources.filter(r => r.id === req.id).length >= req.amount;
      });
    },
    selectOption(option) {
      if (option.requiredResources && !this.checkResources(option.requiredResources)) {
        // Vis en besked om manglende ressourcer
        return;
      }
      // Fjern ressourcer hvis nødvendigt
      if (option.requiredResources) {
        option.requiredResources.forEach(req => {
          for (let i = 0; i < req.amount; i++) {
            const resourceToRemove = this.$store.state.character.resources.find(r => r.id === req.id);
            if (resourceToRemove) {
              this.$store.dispatch('removeResource', resourceToRemove.uuid);
            }
          }
        });
      }
      this.progressStory({ 
        nextId: option.nextId, 
        choiceText: option.text,
        giveReward: option.giveReward !== undefined ? option.giveReward : true
      });
    },
  },
  
};
</script>




<style lang="scss" scoped>
  .dialog-system {
    border-radius: 5px;
    color: white;
    text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
    font-size: 1rem;
  }
  
  .dialog-log {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .conversation-box {
    display: flex;
    align-items: flex-start;
    margin: 10px 0px;
  }
  
  .npc-box {
    flex-direction: row;
  }
  
  .player-box .sidebar-icon{ 
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

  
  .sidebar-icon {
    width: 35px;
    height: 35px;
    margin: 0 10px;
  }
  
  .message-box {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 10px;
    flex-grow: 1;
  }
  
  .npc-message {
    margin-right: 15px;
    text-align: left;
  }
  
  .player-message {
    margin-left: 15px;
    text-align: right;
  }
  </style>
    