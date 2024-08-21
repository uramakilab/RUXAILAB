<template>
  <div>
    <div v-if="testAnswerDocument.type === 'HEURISTICS'">
      <HeuristicsAnalytics />
    </div>
    <div v-else>
      <UserAnalytics />
    </div>
  </div>
</template>

<script>
import HeuristicsAnalytics from '@/components/organisms/HeuristicsAnalytics.vue'
import UserAnalytics from '@/components/organisms/UserAnalytics.vue'
export default {
  components: {
    HeuristicsAnalytics,
    UserAnalytics,
  },
  computed: {
    testAnswerDocument() {
      return this.$store.state.Answer.testAnswerDocument
    },
  },
  async created() {
    await this.$store.dispatch('getCurrentTestAnswerDoc')
  },
}
</script>
