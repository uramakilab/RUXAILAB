<template>
  <div v-if="answers && test.userTestType != 'moderated'">
    <IntroAnalytics v-if="answers != null && intro" @goToCoops="goToCoops" />
    <div>
      <!-- Analysis Geral -->
      <v-row class="ma-0 pa-0">
        <v-col cols="8">
          <v-card height="400" class="cards mt-3">
            <v-row>
              <v-col cols="6">
                <v-row justify="center">
                  <span class="cardTitle">Conclusion percentage</span>
                  <span class="conclusionPercentage mx-auto mb-1"
                    >{{ parseFloat(getConclusionAverage()).toFixed(2) }}%</span
                  >
                  <v-col cols="8" class="mx-auto">
                    <v-progress-linear
                      rounded
                      height="6"
                      color="orange"
                      :value="getConclusionAverage()"
                    />
                  </v-col>
                  <span class="cardTitle">Tests in progress</span>
                  <span class="conclusionPercentage mx-auto mb-1">{{
                    getTestsInProgress().totalInProgress
                  }}</span>
                </v-row>
              </v-col>

              <v-divider
                vertical
                class="mt-14"
                style="background-color: #c9c9c9"
              />

              <v-col cols="6">
                <v-row justify="center">
                  <span class="cardSubtitle"
                    ><v-icon class="mr-1"> mdi-arrow-top-right</v-icon>Max
                    {{ parseFloat(maxProgressPerTask()).toFixed(2) }}%</span
                  >
                  <span class="cardSubtitle"
                    ><v-icon class="mr-1"> mdi-arrow-bottom-right</v-icon>Min
                    {{ parseFloat(minProgressPerTask()).toFixed(2) }}%</span
                  >
                  <span class="cardSubtitle"
                    >Total time<br />
                    16m</span
                  >
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="4">
          <v-card height="190" class="mb-8 cards mt-3">
            <v-row justify="center">
              <span class="cardTitle mt-6">Average Time per Task</span>
              <span class="cardTime mt-3"
                ><v-icon size="45" class="mr-1 mb-2"> mdi-clock-fast</v-icon>
                {{ calculateAverageTime().formatedTime }}</span
              >
              <span class="subtitleTime mt-4 mx-8"
                >Users spend a average of
                {{ calculateAverageTime().minutes }} minutes and
                {{ calculateAverageTime().seconds }} seconds on each task</span
              >
            </v-row>
          </v-card>
          <v-card height="190" class="cards">
            <v-row justify="center">
              <span class="cardTitle mt-6">Longest Task on Average</span>
              <span class="cardTime mt-4" style="color: #ff5252"
                ><v-icon size="38" class="mr-1 mb-2" color="#FF5252">
                  mdi-clock-alert-outline</v-icon
                >
                {{ findLongestTask().averageTime.formatedTime }}</span
              >
              <span
                class="subtitleTime mt-4 mx-8"
                style="
                  color: #414d55;
                  display: inline-block;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  direction: ltr;
                "
                >“{{ findLongestTask().taskName }}”</span
              >
              <span class="subtitleTime mx-8">with the longest average</span>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card height="190" class="mb-8 cards mt-3">
            <v-row>
              <span class="bottomCardsTitle mt-6 ml-11">Answers</span>
              <span
                class="conclusionPercentage mt-2 ml-11 mr-3"
                style="
                  min-width: 0px;
                  font-weight: 700;
                  font-size: 36px;
                  line-height: 40px;
                  text-align: start;
                "
                ><v-icon size="38" class="mr-1 mb-2" color="green">
                  mdi-check-circle-outline</v-icon
                >{{ getTotalAnswers() }}</span
              >
              <span
                class="subtitleTime mt-6"
                style="text-align: start; min-width: 150px"
                >Total answers</span
              >
              <v-col class="ml-9" cols="9">
                <v-divider style="background-color: #e4eaf0" />
              </v-col>

              <span
                class="subtitleTime mt-2 ml-12"
                style="text-align: start; min-width: 210px"
                ><v-icon size="20" class="mr-1 mb-2" color="green">
                  mdi-chevron-double-up</v-icon
                ><strong>+{{ getTasksTodayCount() }} </strong>answers/day</span
              >
            </v-row>
          </v-card>

          <v-card height="190" class="cards">
            <v-row>
              <span class="bottomCardsTitle mb-1 mt-7 ml-11"
                >Latest user answer</span
              >
              <v-avatar color="grey lighten-1" class="ml-10 mt-4" size="45">
                <v-icon size="42" dark>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <span
                class="subtitleTime mt-4 ml-4"
                style="text-align: start; min-width: 210px; color: #696d6e"
              >
                {{ getLatestResponse().cooperatorEmail }}
                <br />
                <div class="mt-1" style="color: #28b5e1 !important">
                  Evaluator
                </div>
              </span>
              <span
                class="subtitleTime ml-16 mt-5"
                style="font-size: 14px; text-align: end"
                >Last Updated:
                {{ getFormattedDate(getLatestResponse().lastUpdate) }}</span
              >
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card height="400" class="mt-3 cards">
            <v-row>
              <span
                class="bottomCardsTitle ml-10 mt-6 mb-5"
                style="min-width:500px"
                >Answers Timeline</span
              >
            </v-row>
            <DateChart
              :task-answers="taskAnswers"
              class="ml-6"
              style="max-height:300px; max-width:680px;"
            />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
  <div v-else>
    <IntroAnalytics v-if="answers != null && intro" @goToCoops="goToCoops" />
    <div>
      <!-- Analysis Geral -->
      <v-row class="ma-0 pa-0">
        <v-col cols="8">
          <v-card height="400" class="cards mt-3">
            <v-row>
              <v-col cols="6" class="mb-8">
                <v-row justify="center" class="mt-16">
                  <span class="cardTitle">Total Insights</span>
                  <span class="conclusionPercentage mx-auto mb-1">0</span>
                </v-row>
              </v-col>

              <v-divider
                vertical
                class="mt-10"
                style="background-color: #c9c9c9"
              />

              <v-col cols="6">
                <v-row justify="center">
                  <span class="cardSubtitle">
                    <v-icon class="mr-1">mdi-thumb-up</v-icon>
                    Positive Insights
                    <br />
                    0
                  </span>
                  <span class="cardSubtitle">
                    <v-icon class="mr-1">mdi-thumb-down</v-icon>
                    Negative Insights
                    <br />
                    0
                  </span>
                  <span class="cardSubtitle">
                    Total test time
                    <br />
                    0m
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="4">
          <v-card height="190" class="mb-8 cards mt-3">
            <v-row justify="center">
              <span class="cardTitle mt-6">Average Time per Task</span>
              <span class="cardTime mt-3"
                ><v-icon size="45" class="mr-1 mb-2"> mdi-clock-fast</v-icon>
                {{ calculateAverageTime().formatedTime }}</span
              >
              <span class="subtitleTime mt-4 mx-8"
                >Users spend a average of
                {{ calculateAverageTime().minutes }} minutes and
                {{ calculateAverageTime().seconds }} seconds on each task</span
              >
            </v-row>
          </v-card>
          <v-card height="190" class="cards">
            <v-row justify="center">
              <span class="cardTitle mt-6">Longest Task on Average</span>
              <span class="cardTime mt-4" style="color: #ff5252"
                ><v-icon size="38" class="mr-1 mb-2" color="#FF5252">
                  mdi-clock-alert-outline</v-icon
                >
                0 min 0s</span
              >
              <span
                class="subtitleTime mt-4 mx-8"
                style="
                  color: #414d55;
                  display: inline-block;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  direction: ltr;
                "
                >“Task”</span
              >
              <span class="subtitleTime mx-8">with the longest average</span>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card height="190" class="mb-8 cards mt-3">
            <v-row>
              <span class="bottomCardsTitle mt-6 ml-11">Answers</span>
              <span
                class="conclusionPercentage mt-2 ml-11 mr-3"
                style="
                  min-width: 0px;
                  font-weight: 700;
                  font-size: 36px;
                  line-height: 40px;
                  text-align: start;
                "
                ><v-icon size="38" class="mr-1 mb-2" color="green">
                  mdi-check-circle-outline</v-icon
                >{{ getTotalAnswers() }}</span
              >
              <span
                class="subtitleTime mt-6"
                style="text-align: start; min-width: 150px"
                >Total answers</span
              >
              <v-col class="ml-9" cols="9">
                <v-divider style="background-color: #e4eaf0" />
              </v-col>

              <span
                class="subtitleTime mt-2 ml-12"
                style="text-align: start; min-width: 210px"
                ><v-icon size="20" class="mr-1 mb-2" color="green">
                  mdi-chevron-double-up</v-icon
                ><strong>+{{ getTasksTodayCount() }} </strong>answers/day</span
              >
            </v-row>
          </v-card>

          <v-card height="190" class="cards">
            <v-row>
              <span class="bottomCardsTitle mb-1 mt-7 ml-11"
                >Latest user answer</span
              >
              <v-avatar color="grey lighten-1" class="ml-10 mt-4" size="45">
                <v-icon size="42" dark>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <span
                class="subtitleTime mt-4 ml-4"
                style="text-align: start; min-width: 210px; color: #696d6e"
              >
                {{ getLatestResponse().cooperatorEmail }}
                <br />
                <div class="mt-1" style="color: #28b5e1 !important">
                  Evaluator
                </div>
              </span>
              <span
                class="subtitleTime ml-16 mt-5"
                style="font-size: 14px; text-align: end"
                >Last Updated:
                {{ getFormattedDate(getLatestResponse().lastUpdate) }}</span
              >
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card height="400" class="mt-3 cards">
            <v-row>
              <span
                class="bottomCardsTitle ml-10 mt-6 mb-5"
                style="min-width:500px"
                >Answers Timeline</span
              >
            </v-row>
            <DateChart
              :task-answers="taskAnswers"
              class="ml-6"
              style="max-height:300px; max-width:680px;"
            />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import DateChart from '../atoms/DateChart.vue'
export default {
  components: {
    DateChart,
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
    averageTimePerTask() {
      let totalTasks = 0
      let totalTaskTime = 0

      if (!this.taskAnswers.length) return 0

      this.taskAnswers.forEach((answer) => {
        Object.values(answer.tasks).forEach((task) => {
          totalTaskTime += task.taskTime
          totalTasks++
        })
      })

      return totalTasks === 0 ? 0 : totalTaskTime / totalTasks
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

      return {
        formatedTime: `${minutes} min ${
          remainingSeconds < 10 ? '0' : ''
        }${remainingSeconds} s`,
        seconds: remainingSeconds,
        minutes: minutes,
      }
    },

    findLongestTask() {
      if (!this.taskAnswers.length) return null

      const taskAverages = {}

      this.taskAnswers.forEach((answer) => {
        for (const taskId in answer.tasks) {
          const taskTime = answer.tasks[taskId].taskTime

          if (!taskAverages[taskId]) {
            taskAverages[taskId] = {
              totalTime: taskTime,
              count: 1,
            }
          } else {
            taskAverages[taskId].totalTime += taskTime
            taskAverages[taskId].count++
          }
        }
      })

      for (const taskId in taskAverages) {
        const averageTime =
          taskAverages[taskId].totalTime / taskAverages[taskId].count
        taskAverages[taskId].averageTime = averageTime
      }

      let longestTask = null
      let longestAverageTime = 0

      for (const taskId in taskAverages) {
        if (taskAverages[taskId].averageTime > longestAverageTime) {
          longestAverageTime = taskAverages[taskId].averageTime
          longestTask = taskId
        }
      }

      return {
        taskName: this.testStructure.userTasks[longestTask].taskName,
        averageTime: this.formatTime(longestAverageTime),
      }
    },
    calculateAverageTime() {
      const averageTime = this.formatTime(this.averageTimePerTask)
      return averageTime
    },
    getConclusionAverage() {
      if (!this.taskAnswers.length) return null

      let conclusion = null
      let eachConclusion = 0
      let totalAnswers = 0
      this.taskAnswers.forEach((answer) => {
        eachConclusion += answer.progress
        totalAnswers++
      })
      conclusion = eachConclusion / totalAnswers
      return conclusion
    },
    getTestsInProgress() {
      if (!this.taskAnswers.length) return null

      let totalProgress = 0
      let totalCompleted = 0
      this.taskAnswers.forEach((answer) => {
        if (answer.submitted) {
          totalCompleted++
        } else {
          totalProgress++
        }
      })
      return {
        totalInProgress: totalProgress,
        totalCompleted: totalCompleted,
      }
    },
    maxProgressPerTask() {
      if (!this.taskAnswers.length) return 0

      const progressArray = this.taskAnswers.map((answer) => {
        return answer.progress
      })

      const maxProgress = Math.max(...progressArray)

      return maxProgress
    },
    minProgressPerTask() {
      if (!this.taskAnswers.length) return 0

      const progressArray = this.taskAnswers.map((answer) => {
        return answer.progress
      })

      const minProgress = Math.min(...progressArray)

      return minProgress
    },
    getTotalAnswers() {
      return this.taskAnswers.length
    },
    getLatestResponse() {
      if (!this.taskAnswers.length) return null

      let latestResponse = this.taskAnswers[0].userDocId
      let lastUpdate = this.taskAnswers[0].lastUpdate

      this.taskAnswers.forEach((answer) => {
        if (answer.lastUpdate > this.taskAnswers[0].lastUpdate) {
          latestResponse = answer.userDocId
          lastUpdate = answer.lastUpdate
        }
      })

      return {
        cooperatorEmail: this.getCooperatorEmail(latestResponse),
        lastUpdate: lastUpdate,
      }
    },
    getTasksTodayCount() {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Zerar as horas, minutos, segundos e milissegundos

      let tasksToday = 0

      this.taskAnswers.forEach((answer) => {
        const answerDate = new Date(answer.lastUpdate)
        answerDate.setHours(0, 0, 0, 0)

        if (answerDate.getTime() === today.getTime()) {
          tasksToday++
        }
      })

      return tasksToday
    },
    getCooperatorEmail(userDocId) {
      let cooperatorEmail = null
      if (this.test.cooperators && Array.isArray(this.test.cooperators)) {
        for (const element of this.test.cooperators) {
          if (element.userDocId === userDocId) {
            cooperatorEmail = element.email
          }
        }
      }
      return cooperatorEmail
    },
    getFormattedDate(date) {
      return new Date(date).toLocaleString()
    },
    goToCoops() {
      this.$emit('goToCoops')
    },
    viewAnswers(item) {
      this.dialogItem = item
      this.showDialog = true
    },
  },
}
</script>

<style scoped>
.cards {
  border-radius: 20px;
  box-shadow: 0px 0px 8.2px 0px rgba(0, 0, 0, 0.25);
}

.cardTitle {
  margin-top: 50px;
  color: #414d55;
  text-align: center;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.cardTime {
  min-width: 250px;
  color: #414d55;
  font-size: 27px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.conclusionPercentage {
  min-width: 250px;
  color: #414d55;
  text-align: center;
  font-size: 48px;
  font-style: normal;
  font-weight: semi-bold;
  line-height: normal;
}

.cardSubtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 250px;
  margin-top: 75px;
  color: #414d55;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.subtitleTime {
  color: #8e8e8e;
  text-align: center;
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  min-width: 250px;
}

.bottomCardsTitle {
  min-width: 300px;
  color: #414d55;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  letter-spacing: 0.01px;
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
}
</style>
