<template>
  <div>
    <v-col>
      <v-row>
        <v-tooltip bottom v-if="!recordingAudio">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="startAudioRecording"
              elevation="0"
              icon
              class="ml-4 my-2 mr-auto"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-microphone</v-icon>
            </v-btn>
          </template>
          <span>Start Audio Record</span>
        </v-tooltip>
        <v-tooltip bottom v-if="recordingAudio">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="stopAudioRecording"
              color="red"
              dark
              elevation="0"
              icon
              class="ml-4 my-2 mr-auto xl"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>
          </template>
          <span>Stop Audio Record</span>
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
      recordingAudio: false,
      recordedChunks: [],
      mediaRecorder: null,
      audioStream: null,
      recordedAudio: '',
    }
  },
  computed: {
    currentUserTestAnswer() {
      return this.$store.getters.currentUserTestAnswer
    },
  },
  methods: {
    async startAudioRecording() {
      this.recordingAudio = true

      try {
        this.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

        this.recordedChunks = []
        this.mediaRecorder = new MediaRecorder(this.audioStream, {
          mimeType: 'audio/webm',
        })

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data)
          }
        }

        this.mediaRecorder.onstop = async () => {
          this.$emit('showLoading')
          const audioBlob = new Blob(this.recordedChunks, {
            type: 'audio/webm',
          })
          const storage = getStorage()
          const storageRef = ref(
            storage,
            'tests/' +
              this.testId +
              '/' +
              this.currentUserTestAnswer.userDocId +
              '/' +
              'task_' +
              this.taskIndex +
              'audio' +
              '/' +
              this.recordedAudio,
          )
          await uploadBytes(storageRef, audioBlob)

          this.recordedAudio = await getDownloadURL(storageRef)

          this.currentUserTestAnswer.tasks[
            this.taskIndex
          ].audioRecordURL = this.recordedAudio

          this.audioStream.getTracks().forEach((track) => track.stop())
          this.audioStream = null
          this.recordingAudio = false

          this.$emit('stopShowLoading')
          this.$toast.success('Audio record saved!')
          this.recordingAudio = false
        }

        this.mediaRecorder.start()
      } catch (error) {
        console.error('Error accessing audio stream:', error)
        this.recordingAudio = false
      }
    },
    stopAudioRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
      }
    },
  },
}
</script>
