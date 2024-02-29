<template>
  <div class="character-creation">
    <h1>Character Creation</h1>
    <form @submit.prevent="createCharacter">
      <div class="card mb-4">
        <div class="card-body">
          <label for="name" class="card-header">Name:</label>
          <input v-model="localCharacterName" type="text" id="name" placeholder="Enter your character's name">
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <label for="email" class="card-header">Email:</label>
          <input v-model="character.email" type="email" id="email" placeholder="Enter your email" class="game-input">
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <label for="password" class="card-header">Password:</label>
          <input v-model="character.password" type="password" id="password" placeholder="Enter your password" class="game-input">
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <label for="class" class="card-header">Class:</label>
          <select v-model="character.class" id="class" class="game-input">
            <option value="">Select a class</option>
            <option value="Wastelander">Wastelander</option>
            <option value="Mercenary">Mercenary</option>
            <option value="CaravanTrader">Caravan Trader</option>
            <option value="Raider">Raider</option>
            <option value="Scientist">Scientist</option>
          </select>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <label class="card-header">Gender:</label>
          <input type="radio" id="male" value="Male" v-model="character.gender">
          <label for="male">Male</label>
          <input type="radio" id="female" value="Female" v-model="character.gender">
          <label for="female">Female</label>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <h2 class="card-header">Attributes</h2>
          <div class="row">
            <div class="col-4">
              <div class="attribute-card">
                <label for="strength">Strength:</label>
                <input type="number" v-model="character.attributes.strength" id="strength" min="1" class="game-input">
              </div>
              <div class="attribute-card">
                <label for="intelligence">Intelligence:</label>
                <input type="number" v-model="character.attributes.intelligence" id="intelligence" min="1" class="game-input">
              </div>
            </div>
            <div class="col-4">
              <div class="attribute-card">
                <label for="perception">Perception:</label>
                <input type="number" v-model="character.attributes.perception" id="perception" min="1" class="game-input">
              </div>
              <div class="attribute-card">
                <label for="charisma">Charisma:</label>
                <input type="number" v-model="character.attributes.charisma" id="charisma" min="1" class="game-input">
              </div>
            </div>
            <div class="col-4">
              <div class="attribute-card">
                <label for="endurance">Endurance:</label>
                <input type="number" v-model="character.attributes.endurance" id="endurance" min="1" class="game-input">
              </div>
              <div class="attribute-card">
                <label for="luck">Luck:</label>
                <input type="number" v-model="character.attributes.luck" id="luck" min="1" class="game-input">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mb-4">
        <div class="card-body">
          <h2 class="card-header">Attributes</h2>
          <div class="row">
            <div class="col-12">
              <label for="projectX">ProjectX:</label>
              <input type="number" v-model="character.attributes.projectX" id="projectX" min="1" class="game-input">
            </div>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Create Character</button>
    </form>
    <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
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
        email: '',
        password: '',
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
        this.$store.commit('updateCharacterAttributes', this.character.attributes);
        this.$store.commit('setCharacterEmailAndPassword', { email: this.character.email, password: this.character.password });
        this.$store.commit('setCharacterGender', this.character.gender);
        this.$store.commit('setCharacterClass', this.character.class);
        this.showSuccessMessage = true;
      } else {
        alert('Please enter your character name.');
      }
    }
  },
  computed: {
    totalAttributePoints() {
      return Object.values(this.character.attributes).reduce((a, b) => a + b, 0);
    },
  },
  watch: {
  totalAttributePoints(newVal) {
    const initialTotal = 8; // since each attribute starts at 1 and there are 8 attributes
    const addedPoints = newVal - initialTotal;
    if (addedPoints > this.character.freePoints) {
      alert('You have exceeded the available free points.');
      // Reset the attributes to their initial state
      this.character.attributes = {
        strength: 1,
        perception: 1,
        endurance: 1,
        agility: 1,
        intelligence: 1,
        charisma: 1,
        luck: 1,
        projectX: 1,
      };
    } else {
      // Update freePoints in the Vuex store
      this.$store.commit('updateFreePoints', this.character.freePoints - addedPoints);
    }
  },
},
};
</script>

<style scoped>
/* Add styles for your character creation page */
.character-creation {
  font-family: Arial, sans-serif;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
  color: #666;
  font-size: 1.2em;
}

.card-body > input {
  font-weight: bold;
  color: #666;
  font-size: 1.2em;
  margin-bottom: 10px;
  padding: 10px;
}

.character-creation form button {
  padding: 10px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.character-creation form button:hover {
  background-color: #45a049;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: .25rem;
}
</style>