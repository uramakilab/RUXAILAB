<template>
  <v-row>
    <!-- Consent Form -->
    <v-col cols="8">
      <CardForm 
        title="Consent Form"
        subtitle="This is a Consent Checkbox with a text for confirm the consentiment"
      >
        <InputTextEditTest
          v-model="preTest.consent"
          label="Consent Form..."
          :rows="3"
          @input="onChange"
        />
      </CardForm>
    </v-col>

    <!-- Right Menu -->
    <v-col cols="4" class="pl-0" style="height: 19vh;">
      <!-- Welcom Message -->
      <CardForm
        title="Welcome Message"
        subtitle="This message will be the first thing participants see before the session is started."
      >
        <InputTextEditTest
          v-model="preTest.welcomeMessage"
          label="Thank you for participating..."
          :rows="3"
          @input="onChange"
        />
      </CardForm>

      <!-- Landing Page -->
      <CardForm
        class="mt-2"
        title="Landing Page"
        subtitle="This URL will automatically load when participants starts session."
      >
        <InputTextEditTest
          v-model="preTest.landingPage"
          label="URL"
          :rows="1"
          @input="onChange"
        />
      </CardForm>

      <!-- Participant Camera -->
      <!-- <CardForm
        class="mt-2"
        title="Participant Camera"
      >
        <v-radio-group v-model="preTest.participantCamera" class="px-2">
          <v-radio label="Optional" color="orange" value="optional" />
          <v-radio label="Required" color="orange" value="required" />
          <v-radio label="Disabled" color="orange" value="disabled" />
        </v-radio-group>
      </CardForm> -->
    </v-col>

    <!-- Pre Form -->
    <v-col cols="8" class="pt-0 pb-0">
      <CardForm 
        title="Pre-Form"
        subtitle="This is a pre-questions you make to get participants data"
      >
        <VariableManager />
      </CardForm>
    </v-col>
  </v-row>
</template>

<script>
import CardForm from '@/components/molecules/CardForm'
import InputTextEditTest from '@/components/atoms/InputTextEditTest'
import VariableManager from '@/components/molecules/VariableManager'

export default {
  components: {
    CardForm,
    InputTextEditTest,
    VariableManager,
  },

  data: () => ({
    preTest: {
      consent: '',
      landingPage: '',
      // participantCamera: '',
      preForm: [],
      welcomeMessage: '',
    }
  }),

  computed: {
    test() {
      return this.$store.getters.test
    },

    testStructure() {
      return this.$store.getters.testStructure
    },
  },

  created() {
    if (!this.testStructure) {
      this.$store.commit('SET_TEST_STRUCTURE', this.test.testStructure)
    }

    const { consent = '', welcomeMessage = '', landingPage = '' } = this.testStructure || {}
    this.preTest = { consent, welcomeMessage, landingPage }
  },

  methods: {
    onChange() {
      this.$store.commit('SET_TEST_STRUCTURE', this.preTest)
      this.$store.commit('SET_LOCAL_CHANGES', true)
    }
  }
}
</script>