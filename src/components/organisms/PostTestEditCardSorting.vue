<template>
  <div>
    <!-- POST-FORM -->
    <!-- <CardForm 
      title="Post-Form"
      subtitle="This is a post-questions you make to get participants data"
    >
      <InputTextEditTest />
    </CardForm> -->

    <!-- Final Message -->
    <CardForm 
      title="Final Message"
      subtitle="This is a Final message you leave to the participant on finish test."
    >
      <InputTextEditTest
        v-model="postTest.finalMessage"
        label="Tankyou for participating..."
        :rows="1"
        @input="onChange"
      />
    </CardForm>
  </div>
</template>

<script>
import CardForm from '@/components/molecules/CardForm'
import InputTextEditTest from '@/components/atoms/InputTextEditTest'
// import VariableManager from '@/components/molecules/VariableManager'

export default {
  components: {
    CardForm,
    InputTextEditTest,
    // VariableManager,
  },

  data: () => ({
    postTest: {
      finalMessage: ''
    },
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

    const { finalMessage = '' } = this.testStructure || {}
    this.postTest = { finalMessage }
  },

  methods: {
    onChange() {
      this.$store.commit('SET_TEST_STRUCTURE', this.postTest)
      this.$store.commit('SET_LOCAL_CHANGES', true)
    }
  },
}
</script>