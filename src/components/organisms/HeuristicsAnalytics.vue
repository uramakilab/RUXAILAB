<template>
  <div v-if="answers">
    <IntroAnalytics
      v-if="answers != null && intro == true"
      @goToCoops="goToCoops()"
    />

    <ShowInfo v-if="answers != null && !intro && test" title="Analytics">
      <div slot="content" class="ma-0 pa-0">
        <v-card flat rounded="xl" style="background: #f5f7ff">
          <v-row v-if="resultHeuristics" class="ma-0 pa-0">
            <!--Heuristics List-->
            <v-col class="ma-0 pa-0" cols="2">
              <v-list outlined rounded dense height="560px">
                <v-subheader>Heuristics</v-subheader>
                <v-divider />
                <v-list
                  color="grey-lighten-3"
                  dense
                  height="470px"
                  class="list-scroll"
                >
                  <v-list-item-group v-model="heuristicSelect" color="#fca326">
                    <v-list-item
                      v-for="(item, i) in test.testStructure"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{
                          `H${item.id + 1} - ${item.title}`
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon v-if="i == heuristicSelect">
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-list>
            </v-col>
            <v-divider vertical inset />
            <!--Questions List-->
            <v-col
              v-if="
                heuristicSelect !== null && test.testStructure[heuristicSelect]
              "
              class="ma-0 pa-0"
              cols="3"
            >
              <v-list outlined rounded dense height="560px">
                <v-subheader>
                  {{ test.testStructure[heuristicSelect].title }} - Questions
                </v-subheader>
                <v-divider />
                <v-list dense height="470px" class="list-scroll">
                  <v-list-item-group v-model="questionSelect" color="#fca326">
                    <v-list-item :value="-1">
                      <v-list-item-content>
                        <v-list-item-title>Data Table</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon v-if="questionSelect == -1">
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                    <v-list-item
                      v-for="(item, i) in test.testStructure[heuristicSelect]
                        .questions"
                      :key="i"
                      :value="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{
                          `Q${item.id + 1} - ${item.title}`
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon v-if="i == questionSelect">
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-list>
            </v-col>
            <!--Content-->
            <v-col
              v-if="
                questionSelect !== null &&
                  heuristicSelect !== null &&
                  test.testStructure[heuristicSelect]
              "
              class="ma-0 pa-0"
              cols="7"
            >
              <v-card outlined rounded flat height="560px" elevation-0>
                <v-subheader v-if="questionSelect != -1" class="pa-2">
                  {{
                    test.testStructure[heuristicSelect].questions[
                      questionSelect
                    ].title
                  }}
                </v-subheader>
                <v-subheader v-else class="pa-2">
                  Data Table
                </v-subheader>
                <v-divider />
                <!-- DATA TABLE CONTENT TYPE -->
                <v-row v-if="questionSelect == -1">
                  <v-col>
                    <v-text-field
                      v-model="search"
                      class="mx-3"
                      append-icon="mdi-magnify"
                      label="Search"
                    />
                    <v-data-table
                      class="elevation-1"
                      :headers="headersHeuristic"
                      :items="itemsHeuristic"
                      :search="search"
                      height="360px"
                      dense
                    >
                      <template
                        v-for="header in headersHeuristic"
                        v-slot:[`item.${header.value}`]="{ item }"
                      >
                        <div
                          :key="item[header.value].uid"
                          v-if="item[header.value].uid"
                        >
                          {{ item[header.value].uid }}
                        </div>
                        <div
                          v-else
                          :key="item[header.value].heuristicAnswer.value"
                        >
                          <div
                            v-if="
                              item[header.value].heuristicAnswer.value == null
                            "
                          >
                            -
                          </div>
                          <div v-else>
                            {{ item[header.value].heuristicAnswer.value }}
                          </div>
                        </div>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
                <v-row v-else class="ma-0 pa-0">
                  <v-tabs
                    v-model="ind"
                    background-color="transparent"
                    color="grey darken-2"
                    class="mt-2"
                    centered
                  >
                    <v-tab
                      class="tab-text"
                      style="text-transform: none !important"
                      @click="ind = 0"
                    >
                      Comments
                    </v-tab>
                    <v-tab
                      class="tab-text"
                      style="text-transform: none !important"
                      @click="ind = 1"
                    >
                      Chart
                    </v-tab>
                  </v-tabs>
                  <v-col v-if="ind == 1">
                    <v-row justify="center">
                      <v-col cols="10">
                        <BarChart
                          v-if="questionGraph"
                          :labels="questionGraph.label"
                          :data="questionGraph.data"
                          legend="Quantity"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col v-if="ind == 0">
                    <v-row
                      class="list-scroll"
                      style="height: 430px"
                      justify="center"
                    >
                      <v-col cols="10">
                        <v-timeline dense>
                          <div
                            v-for="(result, index) in itemsHeuristic"
                            :key="index"
                          >
                            <v-timeline-item
                              v-if="result[questionSelect].heuristicComment"
                              fill-dot
                              color="#fca326"
                              icon="mdi-message-reply-text"
                            >
                              <v-card class="elevation-2">
                                <v-card-text>{{
                                  result[questionSelect].heuristicComment
                                }}</v-card-text>
                                <v-card-img
                                  v-if="result[questionSelect].answerImageUrl"
                                >
                                  <img
                                    height="200"
                                    :src="result[questionSelect].answerImageUrl"
                                  />
                                </v-card-img>
                              </v-card>
                            </v-timeline-item>
                          </div>
                        </v-timeline>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </ShowInfo>
  </div>
</template>

<script>
import ShowInfo from '@/components/organisms/ShowInfo.vue'
import BarChart from '@/components/atoms/BarChart.vue'

export default {
  components: {
    ShowInfo,
    BarChart,
  },
  data: () => ({
    search: '',
    ind: 0,
    resultHeuristics: [],
    heuristicSelect: null,
    questionSelect: null,
    intro: null,
  }),
  computed: {
    headersHeuristic() {
      const header = [
        {
          text: 'Evalutator',
          align: 'start',
          value: 'uid',
        },
      ]
      if (this.heuristicSelect !== null) {
        this.test.testStructure[this.heuristicSelect].questions.forEach(
          (question) => {
            header.push({
              text: `Q${question.id + 1}`,
              align: 'center',
              value: question.id,
            })
          },
        )
      }

      return header
    },
    itemsHeuristic() {
      const items = []
      if (this.heuristicSelect !== null) {
        Object.values(this.answers).forEach((answer) => {
          items.push({
            uid: { uid: answer.userDocId },
            ...answer.heuristicQuestions[this.heuristicSelect]
              .heuristicQuestions,
          })
        })
      }
      return items
    },
    questionGraph() {
      const { testOptions: options } = this.test

      const graph = {
        label: [...options.map((op) => op.text)],
        data: [...options.map(() => 0)],
      }

      if (this.heuristicSelect !== null && this.questionSelect !== null) {
        Object.values(this.answers).forEach((userAnswer) => {
          const question =
            userAnswer.heuristicQuestions[this.heuristicSelect]
              .heuristicQuestions[this.questionSelect]

          const optionSelect = options.find(
            (op) => op.text === question.heuristicAnswer.text,
          )
          if (optionSelect) {
            const optionIndex = graph.label.indexOf(optionSelect.text)
            graph.data[optionIndex] += 1
          }
        })
      }
      return graph
    },
    answers() {
      if (!this.$store.getters.testAnswerDocument) {
        return {}
      }

      return this.$store.getters.testAnswerDocument.heuristicAnswers
    },
    loading() {
      return !Object.values(this.answers).length
    },
    test() {
      return this.$store.getters.test
    },
  },
  watch: {
    answers() {
      if (Object.values(this.answers)) {
        this.intro = !Object.values(this.answers).length
      }
    },
    heuristicSelect() {
      this.questionSelect = -1
    },
    questionSelect() {
      this.ind = 0
    },
  },
  updated() {
    if (this.heuristic) {
      this.heuristicSelect = Number(this.heuristic)
    }
  },
  async created() {
    await this.$store.dispatch('getCurrentTestAnswerDoc')
  },
  methods: {
    goToCoops() {
      this.$emit('goToCoops')
    },
  },
}
</script>

<style scoped>
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
