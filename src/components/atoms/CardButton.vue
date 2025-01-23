<template>
  <v-card
    outlined
    rounded="xl"
    color="grey lighten-2"
    @click="$emit('click')"
  >
    <p class="text-center ma-2">
      <v-icon>{{ icon }}</v-icon>
      {{ text }}
    </p>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
      require: false,
    },

    text: {
      type: String,
      default: '',
      require: true,
    }
  }
}
</script>