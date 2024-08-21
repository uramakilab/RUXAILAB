<template>
  <div id="FileUpload" class="rounded" style="background-color:#f5f7ff">
    <v-card-title class="subtitleView">
      {{ $t('HeuristicsSettings.titles.settings') }}
    </v-card-title>
    <v-divider class="mb-4" />
    <v-col justify="center">
      <v-row class="px-6 ">
        <v-btn
          depressed
          dark
          color="orange"
          class="ma-2"
          @click="downloadTemplate"
        >
          {{ $t('HeuristicsSettings.actions.downloadCsvTemplate') }}
        </v-btn>
      </v-row>
      <v-divider class="ma-8" />
      <v-row>
        <v-row class="px-8 mb-2" justify="center" align="center">
          <v-file-input
            ref="myFile"
            v-model="csvFile"
            class="d-flex justify-center ma-2"
            accept=".csv"
            show-size
            truncate-length="15"
            :placeholder="$t('HeuristicsSettings.placeHolders.importCsv')"
            :disabled="testAnswerDocLength > 0 ? true : false"
          />
          <v-btn
            :loading="loadingUpdate"
            :disabled="loadingUpdate || testAnswerDocLength > 0 ? true : false"
            color="blue-grey"
            class="ma-3 white--text"
            @click="changeToJSON"
          >
            {{ $t('HeuristicsSettings.actions.update') }}
            <v-icon right dark>
              mdi-cloud-upload
            </v-icon>
          </v-btn>
        </v-row>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default {
  data() {
    return {
      loading: false,
      loader: null,
      csvFile: null,
      heuristicForm: null,
      refs: this.$refs,
      loadingUpdate: false,
    }
  },
  computed: {
    test() {
      return this.$store.getters.test
    },
    user() {
      return this.$store.getters.user
    },
    csvHeuristics() {
      return this.$store.state.Tests.currentTest
    },
    testAnswerDocLength() {
      if (!this.$store.getters.testAnswerDocument) {
        return 0
      }
      const heuristicAnswers = this.$store.getters.testAnswerDocument
        .heuristicAnswers
      const heuristicAnswersCount = Object.keys(heuristicAnswers).length

      return heuristicAnswersCount
    },
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
      // const alertFunc = alert("Your file has been uploaded!");
      if (this.csvFile != null) {
        setTimeout(() => (this[l] = false), 3000)
        setTimeout(() => (this.csvFile = null), 3000)
        // setTimeout(alertFunc, 3000);
        this.loader = null
      } else {
        setTimeout(() => (this[l] = false), 3000)
        this.$toast.warning(
          this.$t('HeuristicsSettings.messages.noCsvFileSelected'),
        )
        this.loader = null
      }
    },
  },

  methods: {
    async changeToJSON() {
      this.loadingUpdate = true
      try {
        const confirmationText = this.$t(
          'HeuristicsSettings.messages.acceptCsv',
        )
        if (confirm(confirmationText)) {
          const reader = new FileReader()
          reader.readAsText(this.csvFile, 'UTF-8') // Use readAsText with UTF-8 encoding
          reader.onload = async () => {
            const csv = reader.result
            const lines = csv.split('\r\n') // Split lines using '\r\n' for cross-platform compatibility
            const headers = lines[0].split(';').map((header) => header.trim()) // Trim headers
            const heuristicMap = new Map()

            for (let i = 1; i < lines.length; i++) {
              const currentline = lines[i]
              if (!currentline) continue

              const currentFields = currentline.split(';')

              const heuristicId = currentFields[0]
              const heuristicTitle = currentFields[1]
              const questionId = currentFields[2]
              const questionText = currentFields[3]

              if (!heuristicMap.has(heuristicId)) {
                heuristicMap.set(heuristicId, {
                  id: parseInt(heuristicId) - 1,
                  title: heuristicTitle,
                  questions: [],
                  total: 0, // Inicializa o total com 0
                })
              }

              const heuristicEntry = heuristicMap.get(heuristicId)
              heuristicEntry.questions.push({
                id: parseInt(questionId) - 1,
                title: questionText,
                descriptions: questionText,
                text: questionText,
                answerImageUrl: '',
              })

              // Atualize o valor total da heurística se o valor atual for maior
              heuristicEntry.total = Math.max(
                heuristicEntry.total,
                parseInt(questionId),
              )
            }

            const heuristicTest = Array.from(heuristicMap.values())

            this.$store.state.Tests.Test.testStructure = heuristicTest
            this.$store.dispatch('updateTest', this.test)
          }
        }
      } catch (error) {
        // Handle errors here if necessary
        console.error('Update action failed:', error)
      } finally {
        this.loadingUpdate = false
      }
    },

    async downloadTemplate() {
      const storage = getStorage()
      const starsRef = ref(storage, 'template-csv/heuristic-template.csv')
      getDownloadURL(starsRef)
        .then((url) => {
          window.open(url, '_blank')
        })
        .catch((error) => {
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break
            case 'storage/canceled':
              // User canceled the upload
              break
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break
          }
        })
    },
  },
}
</script>

<style scoped>
.csv-box {
  background-color: white;
}
.subtitleView {
  font-family: 'Poppins', Helvetica;
  font-style: normal;
  font-weight: 500;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}
</style>
