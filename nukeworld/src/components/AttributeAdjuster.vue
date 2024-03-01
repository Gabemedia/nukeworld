<template>
  <div class="attribute-card">
    <label :for="attribute">{{ attribute }}:</label>
    <button @click="decreaseValue">-</button>
    <input type="number" :value="value" :id="attribute" readonly class="game-input">
    <button @click="increaseValue">+</button>
  </div>
</template>

<script>
export default {
  name: 'AttributeAdjuster',
  props: {
    attribute: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    increaseValue() {
      this.$emit('input', this.value + 1);
    },
    decreaseValue() {
      if (this.value > 1) {
        this.$emit('input', this.value - 1);
      }
    }
  }
}
</script>