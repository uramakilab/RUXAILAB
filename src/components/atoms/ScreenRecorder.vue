<template>
  <div>
    <v-col>
      <v-row>
        <v-tooltip bottom v-if="!isCapturing">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="captureScreen"
              class="ml-4 my-2 mr-auto"
              elevation="0"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-monitor-screenshot</v-icon>
            </v-btn>
          </template>
          <span>Capture Screen</span>
        </v-tooltip>
        <v-tooltip bottom v-if="isCapturing">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="recordScreen"
              class="ml-4 my-2 mr-auto"
              :color="!isRecording ? 'grey-darken-1' : 'red lighten-1'"
              :dark="isRecording"
              elevation="0"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>{{
                isRecording ? 'mdi-stop' : 'mdi-monitor-screenshot'
              }}</v-icon>
            </v-btn>
          </template>
          <span>{{ isRecording ? 'Stop Recording' : 'Record Screen' }}</span>
        </v-tooltip>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
export default {
  props: {
    testId: String,
    taskIndex: Number,
  },
  data() {
    return {
      isCapturing: false,
      isRecording: false,
      videoUrl: '',
      videoStream: null,
      mediaRecorder: null,
      chunks: [],
    }
  },
  computed: {
    currentUserTestAnswer() {
      return this.$store.getters.currentUserTestAnswer
    },
  },
  methods: {
    async captureScreen() {
      try {
        this.videoStream = await navigator.mediaDevices.getDisplayMedia({
          cursor: true,
        })
        this.isCapturing = true
        this.recordScreen()
      } catch (err) {
        console.error(err)
      }
    },
    recordScreen() {
      if (!this.isRecording) {
        this.chunks = []
        this.mediaRecorder = new MediaRecorder(this.videoStream)
        this.mediaRecorder.start()
        this.mediaRecorder.ondataavailable = (e) => {
          this.chunks.push(e.data)
        }

        this.mediaRecorder.onstop = async () => {
          this.$emit('showLoading')
          const videoBlob = new Blob(this.chunks, { type: 'video/webm' })
          const storage = getStorage()
          const storageRef = ref(
            storage,
            `tests/${this.testId}/${this.currentUserTestAnswer.userDocId}/task_${this.taskIndex}/screen_record/${this.videoUrl}`,
          )
          await uploadBytes(storageRef, videoBlob)

          this.videoUrl = await getDownloadURL(storageRef)

          this.currentUserTestAnswer.tasks[
            this.taskIndex
          ].screenRecordURL = this.videoUrl
          this.isRecording = false
          this.videoStream.getTracks().forEach((track) => track.stop())
          this.isRecording = false
          this.isCapturing = false
          this.$emit('stopShowLoading')
          this.$toast.success('Screen record saved!')
        }
        this.isRecording = true
      } else {
        this.mediaRecorder.stop()
      }
    },
  },
}
</script>

<style scoped></style>
