<template>
  <div>
    <h1>Character List</h1>
    <div class="row">
      <div class="col-md-4" v-for="(character, index) in characters" :key="index">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ character.name }}</h5>
            <p class="card-text">
              Level: {{ character.level }}<br>
              Experience: {{ character.exp }}<br>
              Money: {{ character.money }}<br>
              Username: {{ character.name }}<br>
              Email: {{ character.email }}<br>
              Password: {{ character.password }}
            </p>
            <button @click="confirmDelete(character)" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['characters'])
  },
  methods: {
    ...mapActions(['deleteCharacter']),
    confirmDelete(character) {
      const confirmation = prompt(`Please enter the name of the character to delete: ${character.name}`);
      if (confirmation === character.name) {
        this.deleteCharacter(character);
      } else {
        alert('Character name does not match. Deletion cancelled.');
      }
    }
  },
  mounted() {
    console.log('Characters:', this.characters);
  }
};
</script>

<style scoped>
.card {
  width: 18rem;
}
</style>
