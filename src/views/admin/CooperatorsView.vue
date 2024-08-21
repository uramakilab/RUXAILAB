<template>
  <div>
    <div
      v-if="
        test.testType === 'HEURISTICS' ||
          (test.testType === 'User' && test.userTestType === 'unmoderated')
      "
    >
      <UnmoderatedCoopsView />
    </div>
    <div v-if="test.testType === 'User' && test.userTestType === 'moderated'">
      <ModeratedCoopsView />
    </div>
  </div>
</template>

<script>
import UnmoderatedCoopsView from '@/components/organisms/UnmoderatedCoopsView.vue'
import ModeratedCoopsView from '@/components/organisms/ModeratedCoopsView.vue'

export default {
  components: {
    UnmoderatedCoopsView,
    ModeratedCoopsView,
  },
  computed: {
    test() {
      return this.$store.getters.test
    },
  },
}
</script>
