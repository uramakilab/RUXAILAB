<template>
  <div>
    <Toast position="top-right" auto-close="{3000}" :render="error()" />
  </div>
</template>

<script>
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default {
  components: { Toast },
  computed: {
    isError() {
      return (
        this.$store.state.error.message || this.$store.state.error.errorCode
      )
    },
  },
  methods: {
    error() {
      const mainError = this.$store.state.error
      if (mainError && (mainError.message || mainError.errorCode)) {
        if (
          this.previousErrorMessage !== mainError.message ||
          this.previousErrorCode !== mainError.errorCode
        ) {
          this.$toast.error(`${mainError.errorCode}: ${mainError.message}`)
          this.previousErrorMessage = ''
          this.previousErrorCode = ''
        }
        this.$store.state.error.errorCode = ''
        this.$store.state.error.message = ''
      }
    },
  },
}
</script>
