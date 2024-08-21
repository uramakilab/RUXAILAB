<template>
  <div>
    <template>
      <v-btn
        v-if="!isHelp"
        small
        icon
        class="mr-1"
        @click="$router.push('/help')"
      >
        <v-icon size="20">
          mdi-help-circle-outline
        </v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    isHelp() {
      return this.$route.name == 'Help'
    },
  },
}
</script>

<style></style>
