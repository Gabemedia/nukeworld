<template>
    <div>
      <button @click="increaseMoney(5)" class="btn btn-success">Increase Money</button>
      <button @click="decreaseMoney(5)" class="btn btn-danger">Decrease Money</button>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    methods: {
      ...mapActions(['increaseMoney', 'decreaseMoney']),
    },
  };
  </script>