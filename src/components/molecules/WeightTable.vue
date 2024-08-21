<template>
  <v-col style="background-color:#F5F7FF" class="rounded pa-0 pb-1 mb-10">
    <v-card-title class="subtitleView">
      {{ $t('HeuristicsWeightsTable.titles.weights') }}
    </v-card-title>
    <v-divider class="mb-4" />
    <v-card
      v-if="heuristics.length < 2"
      class="mx-auto mb-5 py-4 transparent rounded-0 subtitleView"
      elevation="0"
      align="center"
    >
      {{ $t('HeuristicsWeightsTable.messages.atLeast2HeuristicsForWeighting') }}
    </v-card>
    <v-card v-else class="mx-auto mt-4 mb-5 rounded-0" elevation="0">
      <!-- tabs  -->
      <template>
        <v-tabs
          v-model="tabs"
          centered
          background-color="#F5F7FF"
          color="orange"
          show-arrows
        >
          <v-tabs-slider color="#FF9800" />
          <v-tab v-for="(heuri, index) in heuristics.length - 1" :key="index">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on"> H {{ heuri }}</span>
              </template>
              <span>{{ heuristics[index].title }}</span>
            </v-tooltip>
          </v-tab>
        </v-tabs>
        <!-- tbody  -->
        <v-tabs-items v-model="tabs">
          <v-tab-item
            v-for="(n, pes) in heuristics && heuristics.length
              ? heuristics.length - 1
              : 0"
            :key="pes"
            style="background-color:#F5F7FF"
          >
            <v-card flat class="mx-4 mt-2 mb-8">
              <v-card-text class="tablebody">
                <v-simple-table>
                  <template>
                    <thead>
                      <tr>
                        <th class="text-left">
                          {{ $t('HeuristicsWeightsTable.titles.heuristics') }}
                        </th>
                        <th class="text-center">
                          {{ $t('HeuristicsWeightsTable.titles.weights') }}
                        </th>
                      </tr>
                    </thead>
                    <!-- tbody -->
                    <tbody>
                      <tr
                        v-for="(f, tam) in heuristics.length - (tabs + 1)"
                        :key="tam"
                      >
                        <td>
                          H {{ f + (tabs + 1) }}
                          <!-- tooltips -->
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon
                                color="#FCA326"
                                small
                                dark
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-help-circle
                              </v-icon>
                            </template>
                            <span>{{ heuristics[f + tabs].title }}</span>
                          </v-tooltip>
                        </td>
                        <!-- radio-group -->
                        <td>
                          <v-radio-group
                            v-model="group[tabs][tam]"
                            dense
                            row
                            class="px-10 mx-2 v-input--radio-group__input justify-space-around"
                          >
                            <v-tooltip
                              v-for="(r, rad) in importance"
                              :key="rad"
                              bottom
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-radio
                                  :label="`${r}`"
                                  :value="r"
                                  active-class
                                  class="padding-left mx-4"
                                  on-icon="mdi-check-circle-outline"
                                  off-icon="mdi-checkbox-blank-circle-outline"
                                  color="#FCA326"
                                  v-bind="attrs"
                                  v-on="on"
                                />
                              </template>
                              <span>
                                H{{ tabs + 1 }} has
                                {{ importt[r - 1] }} than H{{ f + (tabs + 1) }}</span
                              >
                            </v-tooltip>
                          </v-radio-group>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <!-- save button -->
                <v-row align="center" justify="space-around">
                  <v-btn
                    dark
                    depressed
                    class="mt-8 mb-4"
                    large
                    align="center"
                    color="orange"
                    type="submit"
                    @click="updateDatas()"
                  >
                    {{ $t('HeuristicsWeightsTable.actions.saveWeights') }}
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: 'WeightTable',
  data() {
    return {
      tabs: 0,
      row: [],
      group: {},
      scores: null,
      importance: {
        'Equal Importance': 1,
        'Moderately Importance': 2,
        'Strongly Importance': 3,
        'Very Strongly Importance': 4,
        'Extreme Importance': 5,
        'Moderately Less Important': 6,
        'Strongly Less Important': 7,
        'Very Strongly Less Important': 8,
        'Extremely Less Important': 9
      },
      importt: [
        'Equal Importance',
        'Moderately Importance',
        'Strongly Importance',
        'Very Strongly Importance',
        'Extremely Importance',
        'Moderately Less Important',
        'Strongly Less Important',
        'Very Strongly Less Important',
        'Extremely Less Important',
      ],
    }
  },
  computed: {
    testAll() {
      return this.$store.state.Tests.Test
    },
    heuristics() {
      return this.testAll.testStructure || []
    },
    heuristicaTamanho() {
      return this.heuristics.length
    },
    scoresPercentage() {
      return this.$store.state.Tests.scoresPercentage
    },
  },
  beforeMount() {
    if (!this.testAll.testWeights) {
      console.error('testWeights is undefined')
      return
    }
    const heuristicLength = this.testAll.testStructure.length
    this.group = this.testAll.testWeights

    if (Object.keys(this.testAll.testWeights).length === 0) {
      // Verifica se é um objeto vazio
      const weightMap = {}
      for (let i = 0; i < heuristicLength - 1; i++) {
        weightMap[i] = new Array(heuristicLength - (i + 1)).fill(null)
      }
      this.group = weightMap
    }
  },

  methods: {
    updateDatas() {
      this.testAll.testWeights = this.group
      this.$store.dispatch('updateTest', this.testAll)
    },
  },
}
</script>

<style scoped>
.justify-space-between {
  justify-content: space-between !important;
}
.padding-left {
  padding-left: 23px;
}

.if-card {
  /*border-radius: 15px;
  border: 0.2px solid #fca326;*/
  width: 950px;
  font-size: 18px;
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

.tablebody {
  display: contents;
}
.v-input--radio-group__input {
  border: none;
  cursor: default;
  display: flex;
  width: 100%;
  justify-content: space-evenly !important;
}
</style>
