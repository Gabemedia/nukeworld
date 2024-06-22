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
            <div v-for="option in currentStoryStep.playerOptions" :key="option.text">
              <button @click="selectOption(option)" class="btn btn-sm btn-outline-light mb-2">
                {{ option.text }}
              </button>
            </div>
          </div>
          <img class="sidebar-icon" :src="require(`@/assets/interface/icons/encounter.png`)" title="Player">
        </div>
      </div>
    </div>
    <div v-else-if="availableStoryLines.length > 0">
      <h6 class="mb-3 text-uppercase fw-bold text-start">Tilgængelige Quests</h6>
      <div v-for="storyLine in availableStoryLines" :key="storyLine.id">
        <button @click="startStoryLine(storyLine.id)" class="btn btn-sm btn-outline-light mb-2">
          {{ storyLine.name }} (Level {{ storyLine.levelRequirement }})
        </button>
      </div>
    </div>
    <div v-else>
      <h6 class="mb-3 text-uppercase fw-bold text-start">Ingen tilgængelige quests</h6>
      <p>COME BACK LATER</p>
    </div>
    <div class="mt-4">
      <h6 class="mb-3 text-uppercase fw-bold text-start">Gennemførte Quests</h6>
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
    selectOption(option) {
      this.progressStory({ nextId: option.nextId, choiceText: option.text });
    },
  },
};
</script>




<style lang="scss" scoped>
  .dialog-system {
    border-radius: 5px;
    color: white;
    text-shadow: rgba(0, 0, 0, 1) 0px 0px 2px;
    font-size: 0.8rem;
  }
  
  .dialog-log {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .conversation-box {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
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
  }
  
  .player-message {
    margin-left: 15px;
  }
  </style>
    