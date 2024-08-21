<template>
  <div v-if="answers">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <IntroAnswer
      v-if="answers != null && intro == true"
      @goToCoops="goToCoops"
    />
    <v-row
      v-else-if="answers != null && intro == false"
      justify="center"
      class="ma-0 mt-4"
    >
      <ShowInfo :title="$t('HeuristicsTestAnswer.titles.answers')">
        <!-- Main Tabs -->
        <v-tabs
          slot="top"
          v-model="tab"
          background-color="transparent"
          color="#FCA326"
          class="ml-4"
        >
          <v-tab @click=";(tab = 0), (ind = 0)">
            {{ $t('HeuristicsTestAnswer.titles.statistics') }}
          </v-tab>
          <v-tab @click=";(tab = 1), (ind = 0)">
            {{ $t('HeuristicsTestAnswer.titles.evaluators') }}
          </v-tab>
          <v-tab @click=";(tab = 2), (ind = 0)">
            {{ $t('HeuristicsTestAnswer.titles.heuristics') }}
          </v-tab>
          <v-tab @click=";(tab = 3), (ind = 0)">
            {{ $t('HeuristicsTestAnswer.titles.analytics') }}
          </v-tab>
        </v-tabs>

        <!-- Main Tabs Content -->
        <div slot="content" class="ma-0 pa-0">
          <!-- Tab 1 - Statistics -->
          <v-card v-if="tab == 0" flat rounded="xl" style="background: #f5f7ff">
            <v-card-title class="subtitleView">
              {{ $t('HeuristicsTestAnswer.titles.statistics') }}
            </v-card-title>

            <v-divider />

            <v-row justify="space-around" class="ma-0">
              <!-- Top Card -->
              <v-col cols="10">
                <v-card class="cardStyle my-6" flat>
                  <v-row justify="space-around" class="ma-0">
                    <!-- Average -->
                    <v-col cols="4">
                      <v-row justify="center" class="ma-0">
                        <v-card-title class="mt-4">
                          {{
                            $t(
                              'HeuristicsTestAnswer.statistics.usabilityPercentage',
                            )
                          }}
                        </v-card-title>
                        <v-card-text>
                          <v-row align="center" justify="center">
                            <p class="display-3">
                              {{ showFinalResult.average }}
                            </p>
                          </v-row>
                        </v-card-text>
                      </v-row>
                    </v-col>

                    <v-divider vertical />

                    <!-- Info -->
                    <v-col>
                      <v-list class="transparent">
                        <v-list-item>
                          <v-list-item-icon>
                            <v-icon>mdi-arrow-up-bold-hexagon-outline</v-icon>
                          </v-list-item-icon>

                          <v-list-item-title>
                            {{ $t('HeuristicsTestAnswer.statistics.max') }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-right">
                            {{ showFinalResult.max }}
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-icon>
                            <v-icon>mdi-arrow-down-bold-hexagon-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('HeuristicsTestAnswer.statistics.min') }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-right">
                            {{ showFinalResult.min }}
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-icon>
                            <v-icon>mdi-plus-minus</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>
                            {{ $t('HeuristicsTestAnswer.statistics.std') }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="text-right">
                            {{ showFinalResult.sd }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>

          <!-- Tab 2 - Evaluators -->
          <v-card v-if="tab == 1" flat rounded="xl" style="background: #f5f7ff">
            <v-card-title class="subtitleView">
              {{ $t('HeuristicsTestAnswer.titles.evaluators') }}
            </v-card-title>

            <v-divider />

            <v-tabs
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
                {{ $t('HeuristicsTestAnswer.evaluators.headers.table') }}
              </v-tab>
              <v-tab
                class="tab-text"
                style="text-transform: none !important"
                @click="ind = 1"
              >
                {{ $t('HeuristicsTestAnswer.evaluators.headers.graphic') }}
              </v-tab>
            </v-tabs>

            <v-row justify="center">
              <v-col v-if="ind == 0" cols="10">
                <v-data-table
                  dense
                  :headers="evaluatorStatistics.header"
                  :items="evaluatorStatistics.items"
                  :items-per-page="15"
                  class="elevation-0 cardStyle mx-2 mt-3 mb-6"
                >
                  <template v-slot:item.result="{ item }">
                    <v-chip
                      v-if="isNaN(item.result)"
                      :color="getColorPorcentage(item.result)"
                      dark
                    >
                      0.0%
                    </v-chip>
                    <v-chip
                      v-else
                      :color="getColorPorcentage(item.result)"
                      dark
                    >
                      {{ item.result }}%
                    </v-chip>
                  </template>
                  <template v-slot:item.answered="{ item }">
                    {{ item.answered }}%
                  </template>
                </v-data-table>
                <v-btn
                  class="mx-2"
                  small
                  outlined
                  :loading="loading"
                  :disabled="loading"
                  @click="DownloadEvaluatorCsv"
                >
                  Export as CSV
                  <v-icon right dark>
                    mdi-download
                  </v-icon>
                </v-btn>
              </v-col>

              <v-col v-if="ind == 1" cols="10">
                <RadarChart
                  v-if="evaluatorStatistics.items.length >= 3"
                  :labels="
                    evaluatorStatistics.items.map(
                      (item) => `${item.evaluator} - ${item.result}%`,
                    )
                  "
                  :data="evaluatorStatistics.items.map((item) => item.result)"
                />
                <v-card
                  v-else
                  flat
                  class="mx-auto mt-10 mb-10 py-6 px-3 if-card"
                  align="center"
                  width="970px"
                >
                  {{
                    $t(
                      'HeuristicsTestAnswer.evaluators.messages.graphForMoreThan3',
                    )
                  }}
                </v-card>
              </v-col>
            </v-row>
          </v-card>

          <!-- Tab 3 - Heuristics-->
          <v-card
            v-if="tab == 2"
            rounded="xl"
            flat
            class="mb-6 py-2"
            style="background: #f5f7ff"
          >
            <v-card
              v-if="evaluatorStatistics.items.length <= 1"
              class="mx-auto mt-10 mb-10 py-6 if-card"
              align="center"
              width="970px"
            >
              {{
                $t(
                  'HeuristicsTestAnswer.heuristics.messages.needMoreThan1Answer',
                )
              }}
            </v-card>
            <div v-else>
              <v-card-title class="subtitleView">
                {{
                  $t('HeuristicsTestAnswer.heuristics.headers.heuristicsData')
                }}
              </v-card-title>

              <v-divider />

              <!-- Bottom Tabs -->
              <v-tabs
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
                  {{
                    $t(
                      'HeuristicsTestAnswer.heuristics.headers.answersByEvaluator',
                    )
                  }}
                </v-tab>
                <v-tab
                  class="tab-text"
                  style="text-transform: none !important"
                  @click="ind = 1"
                >
                  {{
                    $t(
                      'HeuristicsTestAnswer.heuristics.headers.answersByHeuristics',
                    )
                  }}
                </v-tab>
                <v-tab
                  class="tab-text"
                  style="text-transform: none !important"
                  @click="ind = 2"
                >
                  {{ $t('HeuristicsTestAnswer.heuristics.headers.graphic') }}
                </v-tab>
                <v-tab
                  class="tab-text"
                  style="text-transform: none !important"
                  @click="ind = 3"
                >
                  {{ $t('HeuristicsTestAnswer.heuristics.headers.weights') }}
                </v-tab>
              </v-tabs>

              <!-- Bottom Tab Content -->
              <v-row justify="center">
                <v-col cols="10">
                  <v-row>
                    <!-- Bottom Tab 1 -->
                    <v-col v-if="ind == 0" cols="12">
                      <v-data-table
                        :headers="heuristicsEvaluator.header"
                        :items="heuristicsEvaluator.items"
                        :items-per-page="15"
                        class="elevation-0 cardStyle mx-2 mt-3 mb-6"
                        dense
                      >
                        <template
                          v-for="header in heuristicsEvaluator.header"
                          v-slot:[`item.${header.value}`]="{ item }"
                        >
                          <v-chip
                            v-if="header.value != 'heuristic'"
                            :key="header.value"
                            :color="
                              getColor(item[header.value], item.max, item.min)
                            "
                            dark
                            class="chip"
                          >
                            {{
                              item[header.value]
                                ? item[header.value].toFixed(2)
                                : 0
                            }}
                          </v-chip>
                          <v-btn
                            v-else
                            :key="header.value"
                            text
                            @click="goToDataHeuristic(item.heuristic)"
                          >
                            {{ item[header.value] }}
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                    <!-- Bottom Tab 2 -->
                    <v-col v-if="ind == 1" cols="12">
                      <v-data-table
                        :headers="heuristicsStatistics.header"
                        :items="heuristicsStatistics.items"
                        :items-per-page="15"
                        class="elevation-0 cardStyle mx-2 mt-3 mb-6"
                        dense
                      >
                        <template v-slot:item.percentage="{ item }">
                          <div style="padding-top: 2px; padding-bottom: 2px">
                            <v-chip
                              style="width: 35%"
                              :color="
                                getColor(item.average, item.max, item.min)
                              "
                              dark
                            >
                              {{ checkIfNan(item.percentage) }}
                            </v-chip>
                          </div>
                        </template>

                        <template v-slot:item.sd="{ item }">
                          {{ checkIfNan(item.sd) }}
                        </template>
                        <template v-slot:item.average="{ item }">
                          {{ checkIfNan(item.average) }}
                        </template>
                      </v-data-table>
                    </v-col>
                    <!-- Bottom Tab 3 -->
                    <v-col v-if="ind == 2" cols="12">
                      <BarChart
                        class="mx-2 mt-3 mb-6"
                        :labels="
                          heuristicsStatistics.items.map((item) => item.name)
                        "
                        :data="
                          heuristicsStatistics.items.map((item) => item.average)
                        "
                        legend="Average"
                      />
                    </v-col>

                    <!-- Bottom Tab 4 -->

                    <v-col v-if="ind == 3" cols="12" align="center">
                      <v-card
                        v-if="relative === null"
                        class="mx-auto mt-10 mb-10 py-6 if-card"
                        align="center"
                        width="970px"
                      >
                        {{
                          $t(
                            'HeuristicsTestAnswer.heuristics.messages.runWeightFunction',
                          )
                        }}
                      </v-card>
                      <div v-else>
                        <v-row align="center" justify="space-around">
                          <v-col md="4" sm="8">
                            <v-card
                              align="center"
                              class="elevation-4 weightsStatisticsStyle mt-6 py-4 mb-6 mx-auto"
                              width="950px"
                            >
                              <v-card-title class="mt-4 mb-4 font-weight-bold">
                                <v-row align="center" justify="center">
                                  Usability Percentage <br>
                                  With Weights
                                </v-row>
                              </v-card-title>
                              <v-card-text>
                                <v-row
                                  align="center"
                                  justify="center mt-2 mb-2"
                                >
                                  <p class="display-3">
                                    {{ usabilityTotalFix }}
                                  </p>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-col>
                          <v-col cols="12" sm="6" md="8">
                            <v-card
                              align="center"
                              class=" elevation-4 weightsStatisticsStyle mt-6 py-4 px-4 mb-6 mx-auto"
                              width="950px"
                            >
                              <RadarWeight
                                :labels="
                                  Array.from(
                                    { length: heuristicsLength },
                                    (_, index) => `H ${index + 1}`,
                                  )
                                "
                                :data="
                                  weightsStatistics.items.map((item) => item.rw)
                                "
                                :max-value="maxValue"
                              />
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row align="center" justify="space-around">
                          <v-data-table
                            :headers="weightsStatistics.header"
                            :items="weightsStatistics.items"
                            :items-per-page="10"
                            align="center"
                            class="elevation-4 weightsStatisticsStyle mt-3 mb-6 mx-auto"
                            width="950px"
                          />
                        </v-row>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- tab 4 analytics -->
          <AnalyticsView v-if="tab == 3" />
        </div>
      </ShowInfo>
    </v-row>
  </div>
</template>

<script>
import BarChart from '@/components/atoms/BarChart.vue'
import RadarChart from '@/components/atoms/RadarChart.vue'
import ShowInfo from '@/components/organisms/ShowInfo'
import IntroAnswer from '@/components/molecules/IntroAnswer'
import AnalyticsView from '@/views/admin/AnalyticsView.vue'
import RadarWeight from '@/components/atoms/RadarWeight.vue'
import axios from 'axios'

import { standardDeviation, finalResult, statistics } from '@/utils/statistics'

export default {
  components: {
    BarChart,
    RadarChart,
    ShowInfo,
    IntroAnswer,
    AnalyticsView,
    RadarWeight,
  },
  props: { id: { type: String, default: '' } },
  data: () => ({
    tab: 0,
    ind: 0,
    resultEvaluator: statistics(),
    intro: null,
    tabelacompleta: null,
    decisionmatrix: null,
    relative: null,
    usability_total: 0,
    loading: false,
  }),

  computed: {
    showFinalResult() {
      return finalResult()
    },
    evaluatorStatistics() {
      return this.$store.state.Answer.evaluatorStatistics
    },
    testWeights() {
      return this.$store.state.Tests.Test.testWeights
    },
    heuristicsEvaluator() {
      const table = {
        header: [],
        items: [],
      }
      const options = this.test.testOptions.map((op) => op.value)
      const max = Math.max(...options)
      const min = Math.min(...options)

      table.header.push({
        text: 'HEURISTICS',
        align: 'start',
        value: 'heuristic',
      })
      if (this.resultEvaluator) {
        let evaluatorIndex = 1
        this.resultEvaluator.forEach((evaluator) => {
          evaluator.id = `Ev${evaluatorIndex}`
          const header = table.header.find((h) => h.text == evaluator.id)
          if (!header) {
            table.header.push({
              text: evaluator.id,
              align: 'center',
              value: evaluator.id,
            })
          }
          evaluator.heuristics.forEach((heuristic) => {
            const item = table.items.find((i) => i.heuristic == heuristic.id)
            if (item) {
              Object.assign(item, {
                [evaluator.id]: heuristic.result,
              })
            } else {
              table.items.push({
                heuristic: heuristic.id,
                max: max * heuristic.totalQuestions,
                min: min * heuristic.totalQuestions,
                [evaluator.id]: heuristic.result,
              })
            }
          })
          evaluatorIndex++
        })
      }
      return table
    },
    heuristicsStatistics() {
      const table = {
        header: [],
        items: [],
      }

      table.header = [
        {
          text: 'HEURISTICS',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Percentage (%)',
          value: 'percentage',
          align: 'center',
          sortable: false,
        },

        {
          text: 'Standard deviation',
          value: 'sd',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Average',
          value: 'average',
          align: 'center',
          sortable: false,
        },
        { text: 'Max', value: 'max', align: 'center', sortable: false },
        { text: 'Min', value: 'min', align: 'center', sortable: false },
      ]

      if (this.heuristicsEvaluator.items) {
        this.heuristicsEvaluator.items.forEach((item) => {
          const results = Object.entries(item)
            .filter((item) => item[0].includes('Ev'))
            .map((item) => item[1])
          const valueToConvert = results
              .reduce((total, value) => total + value / results.length, 0)
              .toFixed(2),
            convertedValue =
              ((valueToConvert - item.min) / (item.max - item.min)) * 100
          table.items.push({
            name: item.heuristic,
            max: Math.max(item.max).toFixed(2),
            min: Math.min(item.min).toFixed(2),
            percentage: convertedValue.toFixed(2),
            sd: standardDeviation(results).toFixed(2),
            average: results
              .reduce((total, value) => total + value / results.length, 0)
              .toFixed(2),
          })
        })
      }
      return table
    },

    heuristics() {
      return this.testAll.testStructure || []
    },
    heuristicsLength() {
      return this.relative.length
    },

    weightsStatistics() {
      const tableWeights = {
        header: [],
        items: [],
      }

      tableWeights.header = [
        {
          text: 'HEURISTICS',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Usability Score (%)',
          value: 'percentage',
          align: 'center',
          sortable: true,
        },
        {
          text: 'Relative  Weights',
          value: 'rw',
          align: 'center',
          sortable: true,
        },
      ]

      const relativeLength = this.relative.length

      if (relativeLength > 0) {
        for (var i = 0; i < relativeLength; i++)
          tableWeights.items.push({
            name: `H${i + 1} - ${this.heuristics[i].title}`,
            percentage: this.$store.state.Tests.scoresPercentage[i],
            rw: this.relative[i].toFixed(4),
          })
      }
      return tableWeights
    },

    usabilityTotalFix() {
      const usabilityTotalFix = parseFloat(this.usability_total).toFixed(2)
      return usabilityTotalFix
    },

    maxValue() {
      const relative = this.relative
      let maxValue = relative[0]
      for (let i = 1; i < relative.length; i++) {
        if (relative[i] > maxValue) {
          maxValue = relative[i]
        }
      }
      const maxplus = parseFloat(maxValue).toFixed(1)
      return maxplus
    },

    testAnswerDocument() {
      return this.$store.state.Answer.testAnswerDocument
    },
    answers() {
      if (this.testAnswerDocument) {
        return Object.values(this.testAnswerDocument.heuristicAnswers)
      }
      return []
    },
    test() {
      this.$store.dispatch('processStatistics', {
        resultEvaluator: statistics(),
        percentage: this.percentage,
      })
      return this.$store.getters.test
    },
    loading() {
      return this.$store.getters.loading
    },
  },
  watch: {
    answers() {
      if (
        this.testAnswerDocument &&
        (this.answers !== null || this.answers.length > 0)
      ) {
        statistics()
        if (this.answers.length == 0) this.intro = true
        else this.intro = false
      }
    },
    index() {
      this.ind = 0
    },
  },
  mounted() {
    this.array_scores = this.usuability_percentage_array()
    this.pythonFunction()
  },
  async created() {
    await this.$store.dispatch('getCurrentTestAnswerDoc')
    this.usuability_percentage_array()
  },
  methods: {
    checkIfNan(value) {
      return !isNaN(value) ? value : '-'
    },
    getColor(value, max, min) {
      //✓
      max = Number(max)
      min = Number(min)
      const h = (max - min) / max

      if (value == null) return 'grey'
      else if (value === 0) return 'red'
      else if (value <= min + 1 * h) return 'amber'
      else if (value <= min + 2 * h) return 'orange lighten-1'
      else if (value <= min + 3 * h) return 'lime'
      else return 'green'
    },
    getColorPorcentage(value) {
      //✓
      if (value <= 20) return 'red'
      else if (value <= 40) return 'ambar'
      else if (value <= 60) return 'orange lighten-1'
      else if (value <= 80) return 'lime'
      else return 'green'
    },
    goToDataHeuristic(item) {
      //✓
      const selectHeruristc = this.heuristicsEvaluator.items.indexOf(
        this.heuristicsEvaluator.items.find((h) => h.heuristic === item),
      )
      this.$router
        .push(`/analyticsview/${this.id}/${selectHeruristc}`)
        .catch(() => {})
    },
    goToCoops() {
      //✓
      this.$emit('goToCoops')
    },
    usuability_percentage_array() {
      const teste = this.heuristicsStatistics
      const array_scores = []
      for (let i = 0; i < teste.items.length; i++) {
        array_scores.push(teste.items[i].percentage)
      }
      this.$store.dispatch('setScoresPercentage', array_scores)
      return array_scores
    },

    async pythonFunction() {
      const caminhoTestStructure = this.$store.state.Tests.Test.testStructure
      const caminhoTestWeights = this.$store.state.Tests.Test.testWeights
      const caminhoTestScore = this.$store.state.Tests.scoresPercentage

      try {
        const resposta = await axios.post(
          process.env.VUE_APP_FIREBASE_PYTHON_FUNCTION,
          {
            caminhoTestStructure: caminhoTestStructure,
            caminhoTestWeights: caminhoTestWeights,
            caminhoTestScore: caminhoTestScore,
          },
        )
        const data = resposta.data

        this.decisionmatrix = data.decisionmatrix
        this.tabelacompleta = data.tabelacompleta
        this.relative = data.relative
        this.usability_total = data.usability_total
      } catch (erro) {
        console.error('Erro ao chamar Cloud Function:', erro)
      }
    },
    DownloadEvaluatorCsv() {
      this.loading = true
      const headers = this.evaluatorStatistics.header
        .map((header) => header.text)
        .join(',')
      const rows = this.evaluatorStatistics.items
        .map((item) => {
          return this.evaluatorStatistics.header
            .map((header) => item[header.value])
            .join(',')
        })
        .join('\n')
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'evaluatorStatistics.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
  },
}
</script>

<style scoped>
.titleView {
  font-style: normal;
  font-weight: 300;
  font-size: 60px;
  line-height: 70px;
  display: flex;
  align-items: center;
  color: #000000;
}

.subtitleView {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}

.scroll {
  overflow-y: auto;
  overflow-x: hidden;
}

.cardStyle {
  background-color: transparent;
  border: 0.2px solid rgba(0, 0, 0, 0.25);
}

.tab-text {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  align-items: center;
  color: #000000;
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

.weightsStatisticsStyle {
  border-radius: 20px;
  border: 0.2px solid #fca326;
  width: 950px;
}

.radar {
  background: #fff;
}

.if-card {
  border-radius: 15px;
  border: 0.2px solid #fca326;
  width: 950px;
  font-size: 18px;
}
</style>
<style>
.v-chip {
  min-width: 50px;
  justify-content: center;
}
</style>
