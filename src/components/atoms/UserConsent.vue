<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-textarea
          v-model="consent"
          rows="3"
          outlined
          color="orange"
          class="mx-6 mt-3"
          placeholder="Consent Form..."
          @change="saveState()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    consent: '',
  }),
  computed: {
    consentStore() {
      return this.$store.getters.consent
    },
    test() {
      return this.$store.getters.test
    },
  },
  mounted() {
    this.getConsent()
  },
  methods: {
    saveState() {
      this.$store.dispatch('setConsent', this.consent)
      this.test.testStructure.consent = this.consent
    },
    getConsent() {
      if (this.test.testStructure.consent) {
        this.consent = this.test.testStructure.consent
      }
    },
  },
}
</script>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-radius: 25px;
  border: 1px solid #ffceb2;
}
</style>
