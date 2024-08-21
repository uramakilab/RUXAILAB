<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackColor"
    :timeout="4000"
    top
  >
    <div>{{ snackMessage }}</div>
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        {{ $t('buttons.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: false,
  }),
  computed: {
    snackMessage() {
      return this.$store.getters.snackMessage
    },
    snackColor() {
      return this.$store.getters.snackColor
    },
  },
  watch: {
    snackMessage() {
      if (this.snackMessage) this.snackbar = true
    },
    snackbar() {
      if (!this.snackbar) this.$store.commit('resetSnack')
    },
  },
}
</script>