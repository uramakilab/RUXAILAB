<template>
  <div class="mr-auto">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          @click="toggleTimer"
          class="ml-4 mr-2 my-4"
          style="cursor: pointer"
          v-bind="attrs"
          v-on="on"
        >
          {{ timerRunning ? 'mdi-clock' : 'mdi-clock-outline' }}
        </v-icon>
      </template>
      <span>{{ timerVisible ? 'Hide Timer' : 'Show Timer' }}</span>
    </v-tooltip>
    <span v-if="timerVisible"> {{ formatTime(elapsedTime) }} </span>
  </div>
</template>

<script>
export default {
  props: {
    taskIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      timerRunning: false,
      timerVisible: false,
      startTime: null,
      elapsedTime: 0,
    }
  },
  beforeMount() {
    this.startTimer()
  },
  methods: {
    startTimer() {
      this.startTime = new Date()
      this.timerInterval = setInterval(() => {
        this.elapsedTime = new Date() - this.startTime
      }, 1000)
    },
    stopTimer() {
      clearInterval(this.timerInterval)
      this.timerRunning = false
      this.$emit('timerStopped', this.elapsedTime, this.taskIndex)
    },
    toggleTimer() {
      if (!this.timerVisible) {
        this.timerVisible = true
      } else {
        this.timerVisible = !this.timerVisible
      }
    },
    formatTime(time) {
      const seconds = Math.floor(time / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    },
  },
}
</script>
