<template>
  <div>
    <v-btn
      rounded
      color="#f9a826"
      class="white--text"
      small
      :disabled="testAnswerDocLength > 0 ? true : false"
      :class="{
        disabledBtnBackground: testAnswerDocLength > 0,
      }"
      @click="$emit('dialog', true)"
    >
      {{ $t('HeuristicsTable.titles.addOption') }}
    </v-btn>

    <v-dialog v-model="dialog" width="500" persistent>
      <v-card class="dataCard">
        <p class="subtitleView ma-3 pt-3 mb-0 pa-2">
          {{ $t('HeuristicsTable.titles.addOption') }}
        </p>
        <v-divider />
        <v-row justify="center" class="ma-0">
          <v-col cols="11">
            <v-form ref="form">
              <v-row justify="center" align="center">
                <v-col cols="6">
                  <v-text-field
                    v-model="option.text"
                    max-length="100"
                    counter="100"
                    :label="$t('common.text')"
                    :rules="textRequired"
                  />
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model.number="option.value"
                    :label="$t('common.value')"
                    :disabled="!hasValue"
                    type="number"
                    placeholder="Ex. 0.5"
                    :rules="valueRequired"
                    :step="0.5"
                  />
                </v-col>
              </v-row>

              <!-- New row for Option description -->
              <v-row justify="center" align="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="option.description"
                    max-length="250"
                    counter="250"
                    :label="
                      $t('HeuristicsTable.placeholders.optionDescription')
                    "
                  />
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-checkbox
                  v-model="hasValueState"
                  :label="$t('HeuristicsTable.titles.hasValue')"
                />
              </v-row>
            </v-form>
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            small
            text
            color="red lighten-1 white--text"
            @click="$emit('dialog', false), resetVal()"
          >
            {{ $t('HeuristicsTable.titles.cancel') }}
          </v-btn>

          <v-btn small color="#f9a826" class="white--text" @click="validate()">
            {{ $t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import i18n from '@/i18n'
export default {
  props: {
    option: {
      type: Object,
      required: true,
    },
    dialog: {
      type: Boolean,
      default: false,
    },
    hasValue: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  data: () => ({
    textRequired: [
      (v) => !!v || i18n.t('HeuristicsTable.validation.textRequired'),
    ],
  }),
  computed: {
    testAnswerDocLength() {
      if (!this.$store.getters.testAnswerDocument) {
        return 0
      }
      const heuristicAnswers = this.$store.getters.testAnswerDocument
        .heuristicAnswers
      const heuristicAnswersCount = Object.keys(heuristicAnswers).length

      return heuristicAnswersCount
    },
    hasValueState: {
      get() {
        return this.hasValue
      },
      set() {
        this.$emit('changeHasValue')
      },
    },
    valueRequired() {
      if (
        this.hasValue ||
        (this.option.value !== null && this.option.value >= 0)
      ) {
        return [
          (v) =>
            (v !== '' && v !== null && v >= 0) ||
            i18n.t('HeuristicsTable.validation.textRequired'),
        ]
      } else {
        return []
      }
    },
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.hasValue = true
      }
    },
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (!this.hasValue) {
          this.option.value = null
        }
        this.$emit('dialog', false)
        this.$emit('addOption')
        this.$emit('change')
        this.resetVal()
      }
    },
    resetVal() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style scoped>
.disabledBtn {
  color: rgba(134, 125, 125, 0.438) !important;
}
.disabledBtnBackground {
  background-color: rgba(185, 185, 185, 0.308);
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

.dataCard {
  background: #f5f7ff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
</style>
