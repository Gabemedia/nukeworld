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
              Money: {{ character.money }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['characters'])
  }
};
</script>

<style scoped>
.card {
  width: 18rem;
}
</style>