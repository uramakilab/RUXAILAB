<template>
  <div class="mt-0 pa-0 rounded-sm">
    <v-data-table
      height="420px"
      style="background: #f5f7ff;"
      :headers="headers"
      :items="optionsWithFormattedValue"
      :items-per-page="-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          :disabled="testAnswerDocLength > 0 ? true : false"
          small
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          :disabled="testAnswerDocLength > 0 ? true : false"
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:top>
        <v-row class="ma-0" align="center">
          <v-card-title class="subtitleView">
            {{ $t('HeuristicsOptionsTable.titles.options') }}
          </v-card-title>
          <v-row justify="end" class="ma-0 pa-0 mr-4">
            <AddOptionBtn
              :option="option"
              :dialog="dialog"
              :has-value="hasValue"
              @changeHasValue="hasValue = !hasValue"
              @addOption="updateOptions"
              @dialog="changeDialog"
              @change="emitChange()"
            />
          </v-row>
        </v-row>
        <v-divider class="mb-4" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import i18n from '@/i18n'
import AddOptionBtn from '../atoms/AddOptionBtn'

export default {
  components: {
    AddOptionBtn,
  },
  data: () => ({
    headers: [
      {
        text: i18n.t('common.text'),
        align: 'start',
        value: 'text',
      },
      {
        text: i18n.t('common.description'),
        align: 'end',
        value: 'description',
      },
      { text: i18n.t('common.value'), align: 'end', value: 'value' },
      {
        text: i18n.t('common.editDelete'),
        value: 'actions',
        align: 'end',
        sortable: false,
      },
    ],
    option: {
      text: '',
      description: '',
      value: null,
    },
    dialog: false,
    editIndex: -1,
    hasValue: true,
  }),
  computed: {
    options() {
      return this.$store.state.Tests.Test.testOptions
    },
    optionsWithFormattedValue() {
      return this.options.map((option) => {
        if (option.value === null) {
          return { ...option, value: 'No value' }
        } else {
          return option
        }
      })
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
    dialog() {
      if (!this.dialog) {
        this.option = {
          text: '',
          value: null,
        }
        this.hasValue = true
      }
    },
    options() {
      this.$emit('change')
    },
  },
  methods: {
    changeDialog(payload) {
      this.dialog = payload
    },
    updateOptions() {
      if (this.editIndex == -1) {
        this.option.timestamp = Date.now() // using the current timestamp as a unique identifier
        this.options.push(this.option)
      } else {
        Object.assign(this.options[this.editIndex], this.option)
        this.editIndex = -1
      }

      this.option = {
        text: '',
        value: null,
      }
      this.hasValue = true
    },
    deleteItem(item) {
      const index = this.options.findIndex(
        (option) => option.timestamp === item.timestamp,
      )
      if (index !== -1) {
        this.options.splice(index, 1)
      }
    },
    editItem(item) {
      this.editIndex = this.options.findIndex(
        (option) => option.timestamp === item.timestamp,
      )
      this.option.text = this.options[this.editIndex].text
      this.option.value = this.options[this.editIndex].value

      if (this.option.value === null) this.hasValue = false
      else this.hasValue = true
      this.dialog = true
    },
    emitChange() {
      this.$emit('change')
    },
  },
}
</script>

<style scoped>
.subtitleView {
  font-style: normal;
  font-weight: 500;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}
</style>
