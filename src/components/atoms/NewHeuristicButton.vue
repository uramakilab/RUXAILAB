<template>
  <div>
    <v-btn
      rounded
      color="#f9a826"
      class="white--text"
      small
      disabled
      @click="$emit('dialog', true)"
    >
      {{ $t('HeuristicsTable.titles.addNewHeuristic') }}
    </v-btn>

    <v-dialog v-model="dialog" width="500" persistent>
      <v-card class="dataCard">
        <p class="subtitleView ma-3 pt-3 mb-0 pa-2">
          {{ $t('HeuristicsTable.titles.addNewHeuristic') }}
        </p>
        <v-divider />
        <v-row justify="center" class="ma-0">
          <v-col cols="11">
            <v-form ref="form">
              <v-text-field
                v-model="heuris.title"
                label="Title"
                class="mx-3"
                :rules="nameRequired"
              />
              <v-row
                v-for="(n, i) in heuris.questions"
                :key="i"
                align="center"
                justify="space-around"
                class="mx-1"
              >
                <v-col cols="10" class="pt-0 pb-0">
                  <v-text-field
                    v-model="heuris.questions[i].text"
                    :label="'Question ' + (i + 1)"
                    :rules="questionRequired"
                  />
                </v-col>

                <v-col cols="1">
                  <v-btn small icon>
                    <v-icon small @click="removeQuestion(i)">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-btn color="#f9a826" text class="ma-3" @click="addQuestion()">
                {{ $t('HeuristicsTable.titles.addNewQuestion') }}
              </v-btn>
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
            <v-btn small color="#f9a826" class="white--text" @click="validate()">
              {{ $t('common.save') }}
            </v-btn>
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
    heuris: {
      type: Object,
      required: true,
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    id: 0,
    nameRequired: [(v) => !!v || i18n.t('HeuristicsTable.validation.nameRequired')],
    questionRequired: [(v) => !!v || i18n.t('HeuristicsTable.validation.questionRequired')],
  }),
  methods: {
    addQuestion() {
      if (this.heuris.questions.length > 0)
        this.id = this.heuris.questions[this.heuris.questions.length - 1].id + 1
      else this.id = 0
      this.heuris.questions.push({ id: this.id, text: '' })
      this.heuris.total = this.heuris.questions.length
    },
    removeQuestion(i) {
      this.heuris.questions.splice(i, 1)
      this.heuris.total = this.heuris.questions.length
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (this.heuris.questions.length == 0) {
          this.$toast.info(i18n.t('HeuristicsTable.validation.addQuestion'))
        } else {
          this.$emit('dialog', false)
          this.$emit('addHeuris')
          this.$emit('change')
          this.resetVal()
        }
      }
    },
    resetVal() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style scoped>
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
