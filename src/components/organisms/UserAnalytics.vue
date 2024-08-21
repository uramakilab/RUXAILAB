<template>
  <div v-if="answers">
    <IntroAnalytics v-if="answers != null && intro" @goToCoops="goToCoops" />
    <ShowInfo v-if="answers != null && !intro" title="Analytics">
      <div slot="content">
        <v-card flat class="task-container">
          <v-row class="ma-0 pa-0">
            <!-- Tasks List -->
            <v-col class="ma-0 pa-0 task-list" cols="3">
              <v-list dense class="list-scroll">
                <v-subheader>Tasks</v-subheader>
                <v-divider />
                <v-list-item-group v-model="taskSelect" color="#fca326">
                  <v-list-item v-for="(item, i) in testTasks" :key="i">
                    <v-list-item-content>
                      <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-divider vertical inset />

            <!-- Answer List -->
            <v-col class="ma-0 pa-1 answer-list" cols="9">
              <v-data-table :headers="dataHeaders" :items="taskAnswers">
                <template v-slot:item.userDocId="{ item }">
                  <span>{{ getCooperatorEmail(item.userDocId) }}</span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn color="orange" text @click="viewAnswers(item)">
                    Show Answers
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </ShowInfo>
    <template>
      <v-dialog
        v-model="showDialog"
        max-width="600"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar color="orange" dark>
            <span class="headline">Answer and Observation</span>
            <v-btn class="ml-auto" icon @click="showDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text style="background-color: #E8EAF2;">
            <v-row v-if="dialogItem">
              <v-col
                v-if="dialogItem.preTestAnswer.length > 0"
                :cols="
                  dialogItem.tasks[taskSelect].taskTime != '' ? '10' : '12'
                "
                class="pt-8"
              >
                <span class="cardsTitle ma-3" style="color: #252525"
                  >Variables</span
                >
                <v-card outlined rounded="xxl">
                  <div class="ma-6">
                    <span
                      v-for="(question, index) in testStructure.preTest"
                      :key="index"
                      class="ma-1 text-subtitle-1"
                      style="color: #252525"
                    >
                      <strong>{{ question.title }}</strong> :
                      {{ dialogItem.preTestAnswer[index].answer }}
                    </span>
                  </div>
                </v-card>
              </v-col>
              <v-col
                v-if="dialogItem.tasks[taskSelect].taskTime != null"
                cols="2"
                class="pt-8"
              >
                <span
                  class="t-5 font-weight-bold text-h6"
                  style="color: #252525"
                  >Task Time</span
                >
                <v-card outlined rounded="xxl">
                  <div class="ma-6">
                    <p class="text-h6">
                      {{ formatTime(dialogItem.tasks[taskSelect].taskTime) }}
                    </p>
                  </div>
                </v-card>
              </v-col>
              <v-col
                v-if="dialogItem.postTestAnswer.length > 0"
                cols="12"
                class="pt-8"
              >
                <span class="cardsTitle ma-3" style="color: #252525"
                  >Post-Test Answer</span
                >
                <v-card outlined rounded="xxl">
                  <div class="ma-6">
                    <span
                      v-for="(question, index) in testStructure.postTest"
                      :key="index"
                      class="ma-1 text-subtitle-1"
                      style="color: #252525"
                    >
                      <strong>{{ question.title }}</strong> :
                      {{ dialogItem.postTestAnswer[index].answer }}
                    </span>
                  </div>
                </v-card>
              </v-col>
              <v-col
                v-if="dialogItem.tasks[taskSelect].taskAnswer != ''"
                :cols="
                  dialogItem.tasks[taskSelect].taskObservations != ''
                    ? '6'
                    : '12'
                "
                class="mt-4"
              >
                <span class="cardsTitle ma-3" style="color: #252525"
                  >Answer</span
                >
                <v-card outlined rounded="xxl">
                  <div class="ma-6">
                    <span>
                      {{ dialogItem.tasks[taskSelect].taskAnswer }}
                    </span>
                  </div>
                </v-card>
              </v-col>
              <v-col
                v-if="dialogItem.tasks[taskSelect].postAnswer != ''"
                cols="12"
                class="mt-4"
              >
                <span class="cardsTitle ma-3" style="color: #252525"
                  >Post Question</span
                >
                <v-card outlined rounded="xxl">
                  <div class="ma-6">
                    <strong>{{
                      testStructure.userTasks[taskSelect].postQuestion
                    }}</strong>
                    :
                    <span>
                      {{ dialogItem.tasks[taskSelect].postAnswer }}
                    </span>
                  </div>
                </v-card>
              </v-col>
              <v-col
                v-if="dialogItem.tasks[taskSelect].taskObservations != ''"
                :cols="
                  dialogItem.tasks[taskSelect].taskAnswer != '' ? '6' : '12'
                "
                class="mt-4"
              >
                <span class="cardsTitle ma-3" style="color: #252525"
                  >Observation</span
                >
                <v-card outlined rounded="xxl">
                  <div class="ma-6">
                    <span>
                      {{ dialogItem.tasks[taskSelect].taskObservations }}
                    </span>
                  </div>
                </v-card>
              </v-col>
              <div v-if="dialogItem">
                <v-col
                  v-if="dialogItem.tasks[taskSelect].webcamRecordURL"
                  cols="12"
                  class="d-flex align-center justify-center flex-column"
                >
                  <span class="cardsTitle ma-3" style="color: #252525"
                    >Web Cam Record</span
                  >
                  <video
                    v-if="dialogItem"
                    class="my-3"
                    :src="dialogItem.tasks[taskSelect].webcamRecordURL"
                    controls
                    height="260"
                  />
                </v-col>
              </div>
              <div v-if="dialogItem">
                <v-col
                  v-if="dialogItem.tasks[taskSelect].screenRecordURL"
                  cols="12"
                  class="d-flex align-center justify-center flex-column"
                >
                  <span class="cardsTitle ma-3" style="color: #252525"
                    >Screen Record</span
                  >
                  <video
                    class="my-3"
                    :src="dialogItem.tasks[taskSelect].screenRecordURL"
                    controls
                    height="260"
                  />
                </v-col>
              </div>
              <div v-if="dialogItem">
                <v-col
                  v-if="dialogItem.tasks[taskSelect].audioRecordURL"
                  cols="12"
                  class="d-flex align-center justify-center flex-column"
                >
                  <span class="cardsTitle ma-3" style="color: #252525">
                    Audio Record
                  </span>
                  <audio
                    class="mx-auto my-3"
                    :src="dialogItem.tasks[taskSelect].audioRecordURL"
                    controls
                  ></audio>
                </v-col>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import ShowInfo from '@/components/organisms/ShowInfo.vue'

export default {
  components: {
    ShowInfo,
  },
  data: () => ({
    showDialog: false,
    dialogItem: null,
    search: '',
    taskSelect: 0,
    testTasks: [],
    taskAnswers: [],
    intro: null,
    dataHeaders: [
      {
        text: 'Email',
        value: 'userDocId',
      },
      {
        text: 'Actions',
        sortable: false,
        value: 'actions',
      },
    ],
  }),
  computed: {
    test() {
      return this.$store.getters.test
    },
    testStructure() {
      return this.$store.state.Tests.Test.testStructure
    },
    tasksAnswer() {
      return this.$store.getters.testAnswerDocument
    },
    answers() {
      if (!this.$store.getters.testAnswerDocument) {
        return []
      }
      return this.$store.getters.testAnswerDocument.taskAnswers
    },
    loading() {
      return !Object.values(this.answers).length
    },
  },
  created() {
    let i = 0
    this.testStructure.userTasks.forEach((task) => {
      this.testTasks[i] = task.taskName
      i++
    })
    let c = 0
    for (const key in this.answers) {
      this.taskAnswers[c] = this.answers[key]
      c++
    }
  },
  methods: {
    formatTime(time) {
      var seconds = Math.floor(time / 1000)

      var minutes = Math.floor(seconds / 60)
      var remainingSeconds = seconds % 60

      return (
        minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds
      )
    },
    goToCoops() {
      this.$emit('goToCoops')
    },
    getCooperatorEmail(userDocId) {
      let cooperatorEmail = null
      if (this.test.cooperators && Array.isArray(this.test.cooperators)) {
        for (const element of this.test.cooperators) {
          if (element && element.email && element.userDocId === userDocId) {
            cooperatorEmail = element.email
          }
        }
      }
      return cooperatorEmail
    },
    viewAnswers(item) {
      this.dialogItem = item
      this.showDialog = true
    },
  },
}
</script>

<style scoped>
.cardsTitle {
  color: #455a64;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.list-scroll {
  height: 508px;
  overflow: auto;
}

/* Nav bar list scroll bar */
/* width */
.list-scroll::-webkit-scrollbar {
  width: 7px;
}

/* Track */
.list-scroll::-webkit-scrollbar-track {
  background: none;
}

/* Handle */
.list-scroll::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 4px;
}

/* Handle on hover */
.list-scroll::-webkit-scrollbar-thumb:hover {
  background: #fca326;
  /* background: #515069; */
}
</style>
