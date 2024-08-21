<template>
  <v-row>
    <!--Dialog Edit-->
    <v-dialog v-model="dialogEdit" width="800" persistent>
      <v-card v-if="itemEdit">
        <v-card-title
          class="headline white--text"
          style="background-color: #fca326"
          primary-title
        >
          {{ itemEdit.title }}
        </v-card-title>
        <v-row class="ma-0">
          <v-col cols="10">
            <v-form ref="formEdit" @submit.prevent="validateEdit()">
              <v-text-field
                v-model="itemEdit.titleEdit"
                dense
                :label="
                  itemEdit.title === $t('HeuristicsTable.titles.editHeuristic')
                    ? $t('HeuristicsTable.placeholders.titleHeuristic')
                    : $t('HeuristicsTable.placeholders.titleQuestion')
                "
                outlined
                class="mx-3"
                :rules="itemEdit.rule"
                autofocus
              />
            </v-form>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="lighten-2"
            text
            @click=";(dialogEdit = false), (itemEdit = null)"
          >
            {{ $t('HeuristicsTable.titles.cancel') }}
          </v-btn>
          <v-btn class="white--text" color="#fca326" @click="validateEdit()">
            {{ $t('HeuristicsTable.titles.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog Create New Question-->
    <v-dialog v-model="dialogQuestion" width="800" persistent>
      <v-card v-if="newQuestion">
        <v-card-title class="headline white--text" primary-title>
          <v-row class="ma-0 ">
            <v-col cols="10">
              <v-form ref="formQuestion" @submit.prevent="addQuestion()">
                <v-text-field
                  v-model="newQuestion.title"
                  dense
                  :label="$t('HeuristicsTable.placeholders.titleNewQuestion')"
                  outlined
                  class="mx-2"
                  :rules="questionRequired"
                  autofocus
                />
              </v-form>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="lighten-2"
              text
              @click="closeDialog('dialogQuestion')"
            >
              {{ $t('HeuristicsTable.titles.cancel') }}
            </v-btn>
            <v-btn class="white--text" color="#fca326" @click="addQuestion()">
              {{ $t('HeuristicsTable.titles.add') }}
            </v-btn>
          </v-card-actions>
        </v-card-title>
      </v-card>
    </v-dialog>

    <!--Card Create New Heuristic-->
    <v-dialog v-model="dialogHeuris" width="800" persistent>
      <v-card>
        <v-card-title
          class="headline white--text"
          style="background-color: #fca326"
          primary-title
        >
          {{ $t('HeuristicsTable.titles.creatingHeuristic') }}
        </v-card-title>
        <v-row justify="center" class="ma-0">
          <v-col cols="10">
            <v-form
              v-if="heuristicForm"
              ref="formHeuris"
              @keyup.native.enter="addHeuris()"
            >
              <v-text-field
                v-model="heuristicForm.title"
                dense
                :label="$t('HeuristicsTable.placeholders.titleYourHeuristic')"
                outlined
                class="mx-2"
                :rules="nameRequired"
                autofocus
              />

              <v-text-field
                v-model="heuristicForm.questions[0].title"
                dense
                :label="$t('HeuristicsTable.placeholders.titleYourQuestion')"
                outlined
                class="mx-2"
                :rules="questionRequired"
              />
            </v-form>
          </v-col>
        </v-row>

        <v-card-actions>
          <v-spacer />
          <v-btn class="lighten-2" text @click="closeDialog('dialogHeuris')">
            {{ $t('HeuristicsTable.titles.cancel') }}
          </v-btn>
          <v-btn class="white--text" color="#fca326" @click="addHeuris()">
            {{ $t('HeuristicsTable.titles.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="800" persistent />

    <!-- Main -->
    <v-col cols="12">
      <v-card style="background: #f5f7ff" elevation="0">
        <v-card-title class="subtitleView">
          {{ $t('HeuristicsTable.titles.currentHeuristics') }}
        </v-card-title>
        <v-divider />
        <v-row v-if="heuristics.length" class="ma-0 pa-0">
          <!--Heuristics List-->
          <v-col class="ma-0 pa-0" cols="12" sm="6" md="4">
            <v-list height="560px" class="pt-0 ma-0 pa-0"  dense>
              <v-list-item
                :disabled="testAnswerDocLength > 0 ? true : false"
                :class="{ disabledBtnBackground: testAnswerDocLength > 0 }"
                @click="dialogHeuris = true"
              >
                <v-list-item-icon>
                  <v-icon style=" color:#fca326">
                    mdi-plus
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    style="color:#fca326"
                    :class="{ disabledBtn: testAnswerDocLength > 0 }"
                  >
                    <strong>{{
                      $t('HeuristicsTable.titles.addNewHeuristic')
                    }}</strong>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-subheader>
                <v-text-field
                  v-model="search"
                  solo
                  flat
                  prepend-icon="mdi-magnify"
                  color="orange"
                  class="ml-2"
                  single-line
                  hide-details
                  dense
                >
                  <template v-slot:label>
                    <span class="ml-2" style="font-size: 12px">
                      {{ $t('HeuristicsTable.titles.searchHeuristics') }}</span>
                  </template>'
                </v-text-field>
              </v-subheader>
              <v-divider />
              <v-list height="470px" class="list-scroll">
                <v-list-item-group v-model="itemSelect" color="#fca326">
                  <template v-if="filteredHeuristics.length === 0">
                    <center class="mt-16" style="color: #a7a7a7">
                      <strong>{{
                        $t('HeuristicsTable.titles.noHeuristicsFound')
                      }}</strong><br>
                      <h5>{{ $t('HeuristicsTable.messages.youMustHave') }}</h5>
                      <br>
                      <v-icon>mdi-file-remove</v-icon>
                    </center>
                  </template>
                  <template v-else>
                    <v-list-item
                      v-for="(item, i) in filteredHeuristics"
                      :key="i"
                      class="pb-0 pt-0"
                      small
                      @mouseenter="hoveredItem = i"
                      @mouseleave="hoveredItem = null"
                    >
                      <v-list-item-content
                        style="
                          margin-bottom: 8px !important;
                          margin-top: 8px !important;
                          padding-top: 6px !important;
                          padding-bottom: 6px !important;
                          justify-content: space-between;
                        "
                      >
                        <v-list-item-title
                          style="
                            margin-top: 2px !important;
                            margin-bottom: 2px !important;
                            padding-top: 4px !important;
                            padding-bottom: 4px !important;
                          "
                        >
                           {{ item.id + 1 }}
                          - {{ item.title }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: center !important;
                        "
                      >
                        <v-list-item-action
                          v-if="hoveredItem === i && i != itemSelect"
                          style="
                            margin: 0px !important;
                            padding: 0px !important;
                          "
                        >
                          <v-btn
                            icon
                            small
                            style="
                              margin: 0px !important;
                              padding: 0px !important;
                            "
                            :disabled="
                              item.id == 0 || testAnswerDocLength > 0
                                ? true
                                : false
                            "
                            @click.stop="moveItemUp(i)"
                          >
                            <v-icon
                              x-small
                              color="orange"
                              style="
                                margin: 0px !important;
                                padding: 0px !important;
                              "
                            >
                              mdi-arrow-up
                            </v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            small
                            style="
                              margin: 0px !important;
                              padding: 0px !important;
                            "
                            :disabled="
                              testAnswerDocLength > 0
                                ? true
                                : false || i === filteredHeuristics.length - 1
                            "
                            @click.stop="moveItemDown(i)"
                          >
                            <v-icon
                              x-small
                              color="orange"
                              style="
                                margin: 0px !important;
                                padding: 0px !important;
                              "
                            >
                              mdi-arrow-down
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </div>
                      <v-list-item-icon v-if="i == itemSelect" class="pt-4">
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-list>
          </v-col>

          <v-divider vertical />

          <!--Questions List-->
          <v-col
            v-if="itemSelect != null"
            class="ma-0 pa-0" cols="12" sm="6" md="4"
          >
            <v-list dense height="560px" class="ma-0 pa-0">
              <v-subheader>
                <v-clamp autoresize :max-lines="2">
                  {{ heuristics[itemSelect].title }} -
                  {{ $t('HeuristicsTable.titles.questions') }}
                </v-clamp>
                <template v-slot:top>
                  <v-row class>
                    <v-col class="ml-2 mb-1 pa-4 pb-0">
                      <p class="subtitleView">
                        {{ $t('HeuristicsTable.titles.descriptions') }}
                      </p>
                    </v-col>
                    <v-col class="mr-2 mb-1 pb-0 pa-4">
                      <v-row justify="end" class="ma-0 pa-0">
                        <AddDescBtn
                          ref="descBtn"
                          :question-index="questionSelect"
                          :heuristic-index="itemSelect"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </template>
                <v-spacer />
                <v-menu v-model="menuHeuristics" offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="HandleNotEditable"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list
                    dense
                    :class="{ disabledBtnBackground: testAnswerDocLength > 0 }"
                  >
                    <!--Edit Heuris Flag -->
                    <v-list-item
                      :disabled="testAnswerDocLength > 0 ? false : false"
                      @click="editHeuris(heuristics[itemSelect])"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ $t('HeuristicsTable.titles.editHeuristic') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :disabled="testAnswerDocLength > 0 ? true : false"
                      @click="deleteHeuristic(itemSelect)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ $t('HeuristicsTable.titles.deleteHeuristic') }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-subheader>
              <v-divider />
              <v-list-item
                :disabled="testAnswerDocLength > 0 ? true : false"
                :class="{ disabledBtnBackground: testAnswerDocLength > 0 }"
                @click="setupQuestion()"
              >
                <v-list-item-icon>
                  <v-icon
                    color="#fca326"
                    :class="{ disabledBtn: testAnswerDocLength > 0 }"
                  >
                    mdi-plus
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    style="color: #fca326"
                    :class="{ disabledBtn: testAnswerDocLength > 0 }"
                  >
                    {{ $t('HeuristicsTable.titles.addNewQuestion') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
              <v-list dense height="470px" class="list-scroll">
                <v-list-item-group v-model="questionSelect" color="#fca326">
                  <v-list-item
                    v-for="(item, i) in heuristics[itemSelect].questions"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title class="py-3">{{
                        item.title
                      }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon v-if="i == questionSelect" class="pt-4">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-list>
          </v-col>
          <v-divider vertical />
          <!--Questions content-->
          <v-col
            v-if="questionSelect != null"
            class="ma-0 pa-0 questionsContent"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card height="560px" elevation="0" class="pa-0 ma-0">
              <v-subheader class="px-2 pt-0 ma-0 " style="font-size: 12px; height: 40px">
                {{ heuristics[itemSelect].questions[questionSelect].title }}
                <v-spacer />
                <v-menu v-model="menuQuestions" offset-x>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="HandleNotEditable"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list
                    dense
                    :disabled="testAnswerDocLength > 0 ? false : false"
                    :class="{
                      disabledBtnBackground: testAnswerDocLength > 0,
                    }"
                  >
                    <v-list-item
                      :disabled="testAnswerDocLength > 0 ? false : false"
                      @click="
                        editQuestions(
                          heuristics[itemSelect].questions[questionSelect],
                        )
                      "
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ $t('HeuristicsTable.titles.editQuestion') }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :disabled="testAnswerDocLength > 0 ? true : false"
                      @click="deleteQuestion(questionSelect)"
                    >
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ $t('HeuristicsTable.titles.deleteQuestion') }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-subheader>
              <v-divider />

              <v-row>
                <v-col>
                  <v-data-table
                    height="350px"
                    :headers="headers"
                    :items="
                      heuristics[itemSelect].questions[questionSelect].descriptions
                    "
                    :items-per-page="5"
                  >
                    <template v-slot:top>
                      <v-row class="mx-2 my-0 pa-0" style="height: 40px">
                        <v-col class="ma-0 pa-0 py-1">
                          <p >
                            {{ $t('HeuristicsTable.titles.descriptions') }}
                          </p>
                        </v-col>
                        <v-col class="ma-0 pa-0">
                          <v-row justify="end" class="ma-0 pa-0 pt-1">
                            <AddDescBtn
                              ref="descBtn"
                              :question-index="questionSelect"
                              :heuristic-index="itemSelect"
                              @update-description="updateDescription"
                            />
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-divider class="mb-4" />
                    </template>

                    <template v-slot:item.actions="{ item }">
                      <!-- table actions -->
                      <v-row justify="end" class="pr-1">
                        <!-- TODO: Uncomment and fix reactivity -->
                        <v-btn
                          icon
                          small
                          class="mr-2"
                          @click="editDescription(item)"
                        >
                          <v-icon small>
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                        <v-btn icon small @click="deleteItem(item)">
                          <v-icon small>
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </v-row>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else justify="center">
          <v-col class="ma-10" cols="10">
            <v-row justify="center" align="center" class="ma-0">
              <p class="subtitleView">
                {{ $t('HeuristicsTable.messages.noHeuristics') }}
              </p>
            </v-row>
            <v-row class="ma-4" justify="center" align="center">
              <v-btn icon x-large color="grey" @click="dialogHeuris = true">
                <v-icon size="100">
                  mdi-plus-circle-outline
                </v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AddDescBtn from '@/components/atoms/AddDescBtn'

import VClamp from 'vue-clamp'
import i18n from '@/i18n'

export default {
  components: {
    AddDescBtn,
    VClamp,
  },
  data: () => ({
    menuHeuristics: false,
    menuQuestions: false,
    itemSelect: null,
    questionSelect: null,
    itemEdit: null,
    newQuestion: null,
    comparisonSelect: null,
    heuristicForm: null,
    search: '',
    searchBar: false,
    headers: [
      {
        text: 'Title',
        align: 'start',
        value: 'title',
      },
      { text: 'Actions', value: 'actions', align: 'end', sortable: false },
    ],
    dialog: false,
    dialogEdit: false,
    dialogHeuris: false,
    dialogQuestion: false,
    editIndex: -1,
    nameRequired: [
      (v) => !!v || i18n.t('HeuristicsTable.validation.nameRequired'),
    ],
    questionRequired: [
      (v) => !!v || i18n.t('HeuristicsTable.validation.questionRequired'),
    ],
    hoveredItem: null,
  }),
  computed: {
    csvHeuristics() {
      return this.$store.state.Tests.Test.testStructure
    },
    filteredHeuristics() {
      if (this.search === '') {
        return this.heuristics.filter((item) => {
          const searchLower = this.search.toLowerCase()
          const idString = item.id.toString()

          return (
            item.title.toLowerCase().includes(searchLower) ||
            idString.includes(searchLower) ||
            idString === searchLower
          )
        })
      } else {
        return this.heuristics.filter((item) => {
          const searchLower = this.search.toLowerCase()
          const idString = item.id.toString()

          return (
            item.title.toLowerCase().includes(searchLower) ||
            idString.includes(searchLower) ||
            idString === searchLower
          )
        })
      }
    },
    heuristics() {
      return this.$store.state.Tests.Test.testStructure
        ? this.$store.state.Tests.Test.testStructure
        : []
    },
    arrayQuestions() {
      const aux = []
      const array = Array.from(this.heuristics[this.itemSelect].questions)
      array.forEach((el) => {
        aux.push(Object.assign({}, { id: el.id, res: '', com: '' }))
      })
      return []
    },
    totalQuestions() {
      let result = 0
      this.heuristics.forEach((h) => {
        result += h.total
      })
      return result
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
    dialogHeuris() {
      if (!this.dialogHeuris && this.heuristics.length > 0 && !this.itemEdit) {
        this.heuristicForm = {
          id: this.heuristics[this.heuristics.length - 1].id + 1,
          title: '',
          total: 0,
          questions: [
            {
              id: 0,
              title: '',
              comparision: [],
              descriptions: [],
            },
          ],
        }
        this.heuristicForm.total = this.heuristicForm.questions.length
      }
      if (this.dialogHeuris) {
        //when dialog opens everything is reset
        if (this.$refs.formHeuris) {
          this.$refs.formHeuris.resetValidation()
          this.$refs.formHeuris.reset()
        }
      }
      // this.updateFilteredHeuristics()
    },
    itemSelect() {
      if (this.itemSelect !== null) this.questionSelect = null
      else this.itemSelect = null
    },

    loader() {
      const l = this.loader
      this[l] = !this[l]
      // const alertFunc = alert("Your file has been uploaded!");

      if (this.csvFile !== null) {
        setTimeout(() => (this[l] = false), 3000)
        setTimeout(() => (this.csvFile = null), 3000)
        // setTimeout(alertFunc, 3000);
        this.loader = null
      } else {
        setTimeout(() => (this[l] = false), 3000)
        this.$toast.warning(
          'No csv file selected. \nPlease select one before procede.',
        )
        this.loader = null
      }
    },
  },
  async created() {
    if (this.heuristics.length) {
      this.heuristicForm = {
        id: this.heuristics[this.heuristics.length - 1].id + 1,
        total: 0,
        title: '',
        questions: [
          {
            id: 0,
            title: '',
            descriptions: [],
            comparison: [],
          },
        ],
      }
    } else {
      this.heuristicForm = {
        id: 0,
        total: 0,
        title: '',
        questions: [
          {
            id: 0,
            title: '',
            descriptions: [],
            comparison: [],
          },
        ],
      }
    }
    this.heuristicForm.total = this.heuristicForm.questions.length
  },
  methods: {
    moveItemUp(index) {
      if (index > 0) {
        const itemToMove = this.filteredHeuristics[index]
        const itemAbove = this.filteredHeuristics[index - 1]

        this.filteredHeuristics[index] = itemAbove
        this.filteredHeuristics[index - 1] = itemToMove

        itemToMove.id = index - 1
        itemAbove.id = index

        this.heuristics[index] = itemAbove
        this.heuristics[index - 1] = itemToMove

        itemToMove.id = index - 1
        itemAbove.id = index

        this.$toast.warning(i18n.t('HeuristicsTable.messages.changeWeights'))
      }
    },
    moveItemDown(index) {
      if (index < this.filteredHeuristics.length - 1) {
        const itemToMove = this.filteredHeuristics[index]
        const itemBelow = this.filteredHeuristics[index + 1]

        this.filteredHeuristics[index] = itemBelow
        this.filteredHeuristics[index + 1] = itemToMove

        itemToMove.id = index + 1
        itemBelow.id = index

        this.heuristics[index] = itemBelow
        this.heuristics[index + 1] = itemToMove

        itemToMove.id = index + 1
        itemBelow.id = index

        this.$toast.warning(i18n.t('HeuristicsTable.messages.changeWeights'))
      }
    },
    deleteHeuristic(item) {
      const config = confirm(
        `${i18n.t('alerts.deleteHeuristic')} ${this.heuristics[item].title}?`,
      )

      if (config) {
        this.$store.commit('removeHeuristic', item)
        this.itemSelect = null
        this.questionSelect = null
      }
      this.menuQuestions = false
      this.menuHeuristics = false
    },
    deleteQuestion(item) {
      if (this.heuristics[this.itemSelect].questions.length > 1) {
        const config = confirm(
          `Are you sure delete the Question ${
            this.heuristics[this.itemSelect].questions[item].title
          }?`,
        )

        if (config) {
          this.heuristics[this.itemSelect].questions.splice(item, 1)
          this.questionSelect = null

          this.heuristics[this.itemSelect].total = this.heuristics[
            this.itemSelect
          ].questions.length
        }
      } else {
        this.$toast.warning(
          'Sorry, but you can\'t delete all heuristics questions',
        )
      }

      this.menuQuestions = false
      this.menuHeuristics = false
    },
    editHeuris(item) {
      this.itemEdit = {
        title: 'Edit Heuristic',
        titleEdit: item.title,
        rule: this.nameRequired,
        id: item.id,
      }
      this.dialogEdit = true
    },
    editQuestions(item) {
      this.itemEdit = {
        title: 'Edit Question',
        titleEdit: item.title,
        rule: this.questionRequired,
      }
      this.dialogEdit = true
    },
    editDescription(desc) {
      const ind = this.heuristics[this.itemSelect].questions[
        this.questionSelect
      ].descriptions.indexOf(desc)
      this.$refs.descBtn.editSetup(ind)
    },
    setupQuestion() {
      this.newQuestion = {
        id:
          this.heuristics[this.itemSelect].questions[
            this.heuristics[this.itemSelect].questions.length - 1
          ].id + 1,
        title: '',
        descriptions: [],
      }
      this.dialogQuestion = true
    },
    deleteItem(item) {
      this.heuristics[this.itemSelect].questions[
        this.questionSelect
      ].descriptions.splice(
        this.heuristics[this.itemSelect].questions[
          this.questionSelect
        ].descriptions.indexOf(item),
        1,
      )
    },
    addHeuris() {
      if (this.$refs.formHeuris.validate()) {
        this.dialogHeuris = false

        this.heuristics.push(Object.assign({}, this.heuristicForm))
        this.itemSelect = this.heuristics.length - 1

        this.heuristics.total = this.totalQuestions

        this.$refs.formHeuris.resetValidation()

        this.$emit('change')
      }
    },
    closeDialog(dialogName) {
      this[dialogName] = false

      if (this.$refs.formHeuris) {
        this.$refs.formHeuris.resetValidation()
        this.$refs.formHeuris.reset()
      }
      if (this.$refs.formQuestion) {
        this.$refs.formQuestion.resetValidation()
        this.$refs.formQuestion.reset()
        this.newQuestion = null
      }
    },
    addQuestion() {
      if (this.$refs.formQuestion.validate()) {
        this.dialogQuestion = false

        this.heuristics[this.itemSelect].questions.push(this.newQuestion)
        this.newQuestion = null

        this.heuristics[this.itemSelect].total = this.heuristics[
          this.itemSelect
        ].questions.length

        this.$refs.formQuestion.resetValidation()
        this.$emit('change')
      }
    },
    validateEdit() {
      if (this.$refs.formEdit.validate()) {
        this.dialogEdit = false

        if (this.itemEdit.title === 'Edit Heuristic') {
          this.heuristics[this.itemSelect].title = this.itemEdit.titleEdit
        } else {
          this.heuristics[this.itemSelect].questions[
            this.questionSelect
          ].title = this.itemEdit.titleEdit
        }
      }
    },
    //Solution #1
    HandleNotEditable() {
      console.log('not editable')
      // if (this.testAnswerDocLength > 0) {
      //   this.$toast.error('Not Editable : this test already has answers')
      // }
    },
  },
}
</script>

<style scoped>
.disabledBtn {
  color: rgba(75, 65, 65, 0.438) !important;
}
.disabledBtnBackground {
  background-color: #f0f0f0;
}
.search-bar {
  color: #dbdde4;
}
.subtitleView {
  font-style: normal;
  font-weight: 500;
  font-size: 18.18px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}

.list-scroll {
  overflow: auto;
}
.list-scroll::-webkit-scrollbar {
  width: 5px;
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
.csv-btn {
  position: absolute;
  right: 10px;

  z-index: 0;
  width: 10vw;
  height: 4vh;
  border-radius: 0px 0px 20px 20px;

  box-shadow: 0px 2px 5px black;
  background-color: #fca326;

  transition: 0.5s;
}

.csv-btn:hover {
  height: 10vh;
  content: 'test';
}

.csv-model {
  position: absolute;
  top: 40%;
  right: 32%;
  z-index: 50;

  width: 40%;
  height: 42%;

  background-color: #dbdde4;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}
.import-img {
  width: 10vw;
  height: 10vw;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .questionsList {
    margin-top: 0px;
  }
  .questionsContent {
    margin-top: 0px;
  }
}
</style>
