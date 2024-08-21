<template>
  <div class="input">
    <v-file-input :id="`${heuristicId.id}${questionId}`" class="ml-2" type="file" name="my-image"
                  accept="image/gif, image/jpeg, image/png" :placeholder="imageUploaded
                    ? $t('common.inputImage')
                    : url
                  " @change="uploadFile()"
    />
    <!-- Add the image field to display the inputted image -->
    <v-row justify="center">
      <v-img v-if="imageUploaded" max-height="225" :src="url" contain />
    </v-row>
  </div>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default {
  props: {
    heuristicId: { type: String, default: '', required: true },
    questionId: { type: String, default: '', required: true },
    testId: { type: String, default: '', required: true },
  },
  data: () => ({
    url: {},
    object: {},
    imageUploaded: false,
  }),
  computed: {
    test() {
      return this.$store.state.Tests.Test
    },
    currentUserTestAnswer() {
      return this.$store.getters.currentUserTestAnswer
    },
  },

  mounted() {
    this.url = this.currentUserTestAnswer.heuristicQuestions[
      this.heuristicId.id
    ].heuristicQuestions[this.questionId].answerImageUrl

    this.imageUploaded = true
  },
  methods: {
    async uploadFile() {
      const fileInput = document.getElementById(
        `${this.heuristicId.id}${this.questionId}`,
      )

      const storage = getStorage()

      const file = fileInput.files[0]

      const storageRef = ref(
        storage,
        'tests/' +
        this.testId +
        '/' +
        'heuristic_' +
        this.heuristicId.id +
        '/' +
        this.questionId +
        '/' +
        file.name,
      )

      await uploadBytes(storageRef, file)

      this.url = await getDownloadURL(storageRef)
      this.$store.commit('updateCurrentImageUrl', this.url)

      this.imageUploaded = true
      this.$emit('imageUploaded')
    },
  },
}
</script>

<style>
.input {
  width: 100%;
}

.image-container {
  width: 100%;
  height: 100%;
}
</style>
