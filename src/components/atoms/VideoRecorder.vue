<template>
  <div>
    <v-col>
      <v-row>
        <v-tooltip bottom v-if="!recording">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="startRecording"
              class="ml-4 my-2 mr-auto"
              elevation="0"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </template>
          <span>Start Recording</span>
        </v-tooltip>
        <v-tooltip bottom v-if="recording">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="stopRecording"
              class="ml-4 my-2 mr-auto"
              color="red"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>mdi-stop</v-icon>
            </v-btn>
          </template>
          <span>Stop Recording</span>
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
      recording: false,
      videoStream: null,
      recordedChunks: [],
      mediaRecorder: null,
      recordedVideo: '',
    }
  },
  computed: {
    currentUserTestAnswer() {
      return this.$store.getters.currentUserTestAnswer
    },
  },
  methods: {
    async startRecording() {
      this.recording = true
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })

        this.recordedChunks = []
        this.mediaRecorder = new MediaRecorder(this.videoStream)

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data)
          }
        }
      } catch (e) {
        this.recording = false
        this.$toast.error('Error in capturing your media device: ' + e.message)
      }

      try {
        this.mediaRecorder.onstop = async () => {
          this.$emit('showLoading')
          const videoBlob = new Blob(this.recordedChunks, {
            type: 'video/webm',
          })
          const storage = getStorage()
          const storageRef = ref(
            storage,
            `tests/${this.testId}/${this.currentUserTestAnswer.userDocId}/task_${this.taskIndex}/video/${this.recordedVideo}`,
          )
          await uploadBytes(storageRef, videoBlob)

          this.recordedVideo = await getDownloadURL(storageRef)

          this.currentUserTestAnswer.tasks[
            this.taskIndex
          ].webcamRecordURL = this.recordedVideo

          this.videoStream.getTracks().forEach((track) => track.stop())
          this.recording = false

          this.$emit('stopShowLoading')
          this.$toast.success('Video record saved!')
        }

        this.mediaRecorder.start()
      } catch (e) {
        this.$toast.error('Error in capturing your media device: ' + e.message)
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
      }
    },
  },
}
</script>

<style scoped>
.web-cam {
  position: relative;
  text-align: center;
  height: 125px;
  width: 125px;
  border-radius: 50%;
  overflow: hidden;
  mask-image: radial-gradient(circle, white 100%, black 100%);
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
