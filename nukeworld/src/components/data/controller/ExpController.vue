<template>
    <div>
      <button @click="increaseExp(5)" class="btn btn-success">Increase Exp</button>
      <button @click="decreaseExp(5)" class="btn btn-danger">Decrease Exp</button>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    methods: {
      ...mapActions(['increaseExp', 'decreaseExp']),
    },
  };
  </script>