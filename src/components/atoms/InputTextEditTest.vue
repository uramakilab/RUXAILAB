<template>
  <v-container>
    <v-row justify="center">
      <v-text-field
        v-if="type === 'textField'"
        v-model="internalValue"
        outlined
        color="orange"
        class="mx-3"
        :label="label"
        @change="$emit('change', internalValue)"
      />

      <v-textarea
        v-else
        v-model="internalValue"
        :rows="rows"
        outlined
        color="orange"
        class="mx-3"
        :label="label"
        @change="$emit('change', internalValue)"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    },

    type: {
      type: String,
      default: 'textArea',
      require: false
    },

    label: {
      type: String,
      default: '',
      require: false,
    },

    rows: {
      type: Number,
      default: 1,
      require: false,
    },
  },

  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-radius: 25px;
  border: 1px solid #ffceb2;
}
</style>
