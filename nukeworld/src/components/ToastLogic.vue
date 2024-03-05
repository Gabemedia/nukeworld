<template>
    <button type="button" class="btn btn-primary" @click="showToast">
      {{ buttonText }}
    </button>
    
  </template>
  
  <script>
  import { toast } from "vue3-toastify";
  
  export default {
    name: 'ToastLogic',
    props: {
      message: {
        type: String,
        required: true
      },
      buttonText: {
        type: String,
        default: 'Show live toast'
      }
    },
    methods: {
      showToast() {
        toast.success(this.message);
      }
    }
  };
  </script>