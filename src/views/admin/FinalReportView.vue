<template>
  <div class="finalReportView">
    <v-container v-if="test.testType == 'HEURISTICS'">
      <ShowInfo
        style="padding: 0!important;"
        :title="$t('titles.drawer.Final Report')"
      />

      <v-stepper
        v-model="step"
        style="background-color:#F5F7FF"
        class="final-report-box rounded pt-0 mb-4"
        elevation="0"
      >
        <v-stepper-header style="background-color: #F5F7FF;" class="pt-2">
          <v-stepper-step :complete="step > 1" step="1" color="orange">
            Conclusion
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="step > 2" step="2" color="orange">
            Elements
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items style="background-color:#F5F7FF" class="mt-0">
          <v-stepper-content step="1" class="align-mid pt-2">
            <div class="container">
              <div class="row">
                <TextControls />
              </div>

              <div class="row">
                <div class="col">
                  <div id="myTextarea" contenteditable class="form-control" />
                </div>
              </div>
              <v-btn
                class="mt-4"
                align="right"
                color="orange"
                elevation="0"
                dark
                @click="step++, update()"
              >
                {{ $t('buttons.next') }}
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div>
              <FinalReportSelectionBox @return-step="step--" />
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>

    <v-container
      v-else-if="test.testType == 'User'"
      fluid
      fill-height
      class="mt-10"
    >
      <v-row>
        <v-col class="text-center">
          <v-icon size="100" color="primary" class="mb-4">
            mdi-tools
          </v-icon>
          <h1 class="display-1">
            {{ $t('pages.finalReport.ContructionHeading') }}
          </h1>
          <p class="subtitle-1">
            {{ $t('pages.finalReport.ContructionParagraph') }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TextControls from '@/components/atoms/FinalReportControls.vue'
import FinalReportSelectionBox from '@/components/atoms/FinalReportSelectionBox.vue'
import ShowInfo from '@/components/organisms/ShowInfo.vue'

export default {
  components: {
    TextControls,
    FinalReportSelectionBox,
    ShowInfo,
  },

  data: () => ({
    title: 'Final report',
    object: {},
    step: 1,
  }),

  computed: {
    test() {
      return this.$store.getters.test
    },
  },

  mounted() {
    this.setInnerHtml()
  },

  methods: {
    setInnerHtml() {
      const textarea = document.getElementById('myTextarea')
      if (textarea) {
        textarea.innerHTML = this.test.finalReport
      }
    },
    async update() {
      const contenteditable = document.getElementById('myTextarea'),
        text = contenteditable.innerHTML

      this.object.finalReport = text
      const auxT = Object.assign(this.test, this.object)
      this.$store.dispatch('updateTest', auxT)
    },
  },
}
</script>

<style scoped>
.teste {
  position: fixed;
  right: 8%;
  bottom: 10%;
}

.final-report-box {
  background-color: whitesmoke;
  width: 100%;
  padding: 0;
}

.form-control {
  background-color: white;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12) !important;
  width: 100%;
  height: 55vh;
  resize: none;
  padding: 20px;
  border-radius: 12px;
  overflow: auto;
  font-size: small;
}
</style>
