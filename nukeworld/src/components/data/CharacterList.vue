<!-- CharacterList.vue -->
<template>
  <div>
    <div class="row mt-4">
      <div class="col-12" v-for="(character, index) in characters" :key="index">
        <div class="card bg-primary mb-4" @click="selectCharacter(character)">
          <div class="card-body">
            <h5 class="card-title">{{ character.name }}</h5>
            <p class="card-text d-flex">
              Level: {{ character.level }}
              Liv: {{ character.health }}
              Experience: {{ character.exp }}
              Money: {{ character.money }}
            </p>
            <button @click.stop="selectCharacter(character)" class="btn btn-success">Continue</button>
            <button @click.stop="confirmDelete(character)" class="btn btn-danger ms-2">Delete</button>
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
    ...mapActions(['deleteCharacter', 'updateCharacter']),
    confirmDelete(character) {
      const confirmation = prompt(`Please enter the name of the character to delete: ${character.name}`);
      if (confirmation === character.name) {
        this.deleteCharacter(character);
      } else {
        alert('Character name does not match. Deletion cancelled.');
      }
    },
    async selectCharacter(character) {
      await this.updateCharacter(character);
      this.$router.push('/game-world');
    }
  },
  mounted() {
    console.log('Characters:', this.characters);
  }
};
</script>
