<template>
  <div>
    <!-- User Usability Test -->
    <div v-if="testAnswerDocument.type === 'User'">
      <!-- Moderated Test -->
      <div v-if="testDocument.userTestType === 'moderated'">
        <UserModeratedSentiment />
      </div>

      <!-- Un-moderated Test -->
      <div v-else>
        <h6>Sorry Sentiment Analysis isn't available for Un-moderated tests</h6>
      </div>
    </div>

    <!-- Heuristic Test -->
    <div v-else>
      <h6>Sorry Sentiment Analysis isn't available for Heuristic tests</h6>
    </div>
  </div>
</template>

<script>
// Components
import UserModeratedSentiment from '@/components/organisms/UserModeratedSentiment.vue'

export default {
  components: {
    UserModeratedSentiment,
  },
  computed: {
    testDocument() {
      return this.$store.getters.test
    },
    testAnswerDocument() {
      return this.$store.state.Answer.testAnswerDocument
    },
  },
}
</script>

<style></style>
