<template>
  <div class="character-creation">
    <h1>Character Creation</h1>
    <form @submit.prevent="createCharacter">
      <div>
        <label for="name">Name:</label>
        <input v-model="localCharacterName" type="text" id="name" placeholder="Enter your character's name">
      </div>
      <div>
        <label for="class">Class:</label>
        <select v-model="character.class" id="class">
          <option value="">Select a class</option>
          <option value="Wastelander">Wastelander</option>
          <option value="Mercenary">Mercenary</option>
          <option value="CaravanTrader">Caravan Trader</option>
          <option value="Raider">Raider</option>
          <option value="Scientist">Scientist</option>
        </select>
      </div>
      <!-- Gender -->
      <div>
        <label>Gender:</label>
        <input type="radio" id="male" value="Male" v-model="character.gender">
        <label for="male">Male</label>
        <input type="radio" id="female" value="Female" v-model="character.gender">
        <label for="female">Female</label>
      </div>
      <!-- Attributes -->
      <div>
        <h2>Attributes</h2>
        <label for="strength">Strength:</label>
        <input type="number" v-model="character.attributes.strength" id="strength" min="1">
        <!-- Include other attributes here -->
      </div>
      <button type="submit">Create Character</button>
    </form>
    <!-- Success message -->
    <div v-if="showSuccessMessage" class="success-message">
      Character created successfully!
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CharacterCreation',
  data() {
    return {
      localCharacterName: '',
      character: {
        name: '',
        class: '',
        gender: '',
        attributes: {
          strength: 1,
          perception: 1,
          endurance: 1,
          agility: 1,
          intelligence: 1,
          charisma: 1,
          luck: 1,
          projectX: 1,
        },
        freePoints: 5,
      },
      showSuccessMessage: false,
    };
  },
  methods: {
    ...mapActions(['updateCharacter']),
    createCharacter() {
      if (this.localCharacterName.trim() !== '') {
        this.character.name = this.localCharacterName;
        this.updateCharacter(this.character);
        this.showSuccessMessage = true;
        // Removed unnecessary dispatch
      } else {
        alert('Please enter your character name.');
      }
    }
  },
};
</script>

<style scoped>
/* Add styles for your character creation page */
.success-message {
  background-color: lightgreen;
  padding: 10px;
  margin-top: 10px;
}
</style>
