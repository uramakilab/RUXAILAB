<template>
  <div>
    <Snackbar />

    <!-- Delete Alert Dialog -->
    <v-dialog v-model="dialog" width="600" persistent>
      <v-card>
        <v-card-title class="headline error white--text" primary-title>
          <!-- Are you sure you want to delete this report? -->
          {{ $t('HeuristicsReport.messages.confirm_delete_report') }}
        </v-card-title>

        <v-card-text>{{ dialogText }}</v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn class="grey lighten-3" text @click="dialog = false">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            class="red white--text ml-1"
            :loading="loadingBtn"
            text
            @click="removeReport(report), (loadingBtn = true)"
          >
            {{ $t('buttons.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay v-model="loading" class="text-center">
      <v-progress-circular indeterminate color="#fca326" size="50" />
      <div class="white-text mt-3">
        {{ $t('HeuristicsReport.messages.reports_loading') }}
      </div>
    </v-overlay>

    <Intro v-if="reports.length == 0 && !loading" @goToCoops="goToCoops()" />
    <ShowInfo v-else :title="$t('HeuristicsReport.titles.reports')">
      <v-row slot="top" justify="end" dense class="mr-3">
        <p class="subtitleView">
          {{ $t('HeuristicsReport.titles.last_updated') }}:
          {{ new Date().toLocaleString('en') }}
        </p>
      </v-row>

      <div slot="content" class="ma-0 pa-0">
        <v-data-table
          style="background: #f5f7ff"
          :headers="headers"
          :items="reports"
          :items-per-page="10"
          height="420px"
          dense
        >
          <template v-slot:item.more="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list v-if="test.testAdmin.email == user.email">
                <v-list-item @click=";(dialog = true), (report = item)">
                  <v-list-item-title>
                    {{ $t('HeuristicsReport.messages.remove_report') }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-slot:item.userDocId="{ item, index }">
            <!-- <div>{{ getCooperatorEmail(item.userDocId) }}</div> -->
            {{ `Ev${index + 1}` }}
          </template>
          <template v-slot:item.progress="{ item }">
            <div>{{ item.progress }}</div>
          </template>
          <template v-slot:item.submitted="{ item }">
            <div>{{ item.submitted }}</div>
          </template>
          <template v-slot:item.lastUpdate="{ item }">
            <div>{{ formatDate(item.lastUpdate) }}</div>
          </template>
        </v-data-table>
      </div>
    </ShowInfo>
  </div>
</template>

<script>
import ShowInfo from '@/components/organisms/ShowInfo'
import Intro from '@/components/molecules/IntroReports'
import Snackbar from '@/components/atoms/Snackbar'
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  components: {
    ShowInfo,
    Intro,
    Snackbar,
  },

  props: { id: { type: String, default: '' } },

  data: () => ({
    // headers: [
    //   // { text: 'Evaluator', value: 'userDocId' },
    //   {
    //     text: 'evaluator',// key used in the translation file
    //     value: 'userDocId',
    //   },
    //   { text: 'Last Update', value: 'lastUpdate' },
    //   { text: 'Progress', value: 'progress', justify: 'center' },
    //   { text: 'Status', value: 'submitted' },
    //   { text: 'More', value: 'more', justify: 'end' },
    // ],
    loading: true,
    dialog: false,
    loadingBtn: false,
    report: null,
  }),

  computed: {
    headers() {
      return [
        {
          text: this.$t('HeuristicsReport.headers.evaluator'),
          value: 'userDocId',
        },
        {
          text: this.$t('HeuristicsReport.headers.last_update'),
          value: 'lastUpdate',
        },
        {
          text: this.$t('HeuristicsReport.headers.progress'),
          value: 'progress',
          justify: 'center',
        },
        {
          text: this.$t('HeuristicsReport.headers.status'),
          value: 'submitted',
        },
        {
          text: this.$t('HeuristicsReport.headers.more'),
          value: 'more',
          justify: 'end',
        },
      ]
    },
    reports() {
      const testAnswerDocument = this.$store.getters.testAnswerDocument

      // Verifica se testAnswerDocument é null ou undefined
      if (!testAnswerDocument) {
        return []
      }

      const type = testAnswerDocument.type

      const rawReports =
        type === 'User'
          ? testAnswerDocument.taskAnswers || {}
          : testAnswerDocument.heuristicAnswers || {}

      const processedReports = []

      for (const userId in rawReports) {
        const report = rawReports[userId]
        const processedReport = {
          userDocId: report.userDocId,
          total: report.total,
          submitted: this.checkIfIsSubmitted(report.submitted),
          progress: parseFloat(report.progress).toFixed(2) + '%',
          lastUpdate: report.lastUpdate,
        }

        processedReports.push(processedReport)
      }

      return processedReports
    },
    // ... outros métodos

    user() {
      return this.$store.getters.user
    },

    test() {
      return this.$store.getters.test
    },

    dialogText() {
      return this.$t('HeuristicsReport.messages.sure_to_delete', {
        user: this.report !== null ? this.report.email : '',
      })
    },
    answers() {
      return this.$store.getters.answers || {}
    },
  },

  watch: {
    reports() {
      if (Object.values(this.reports)) this.loading = false
    },
  },

  async created() {
    await this.$store.dispatch('getCurrentTestAnswerDoc')
  },

  methods: {
    checkIfIsSubmitted(status) {
      return status
        ? this.$t('HeuristicsReport.status.submitted')
        : this.$t('HeuristicsReport.status.in_progress')
    },

    async getCurrentAnswer() {
      await this.$store.dispatch('getCurrentTestAnswerDoc')
    },

    async removeReport(report) {
      const answerId = this.test.answersDocId
      const userToRemoveId = report.userDocId
      let testType = this.test.testType
      const testId = this.test.id

      if (testType === 'HEURISTIC') testType = 'heuristicAnswers'
      if (testType === 'User') testType = 'taskAnswers'

      try {
        const userDocRef = doc(db, 'users', userToRemoveId)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const updateObject = {}
          updateObject[`myAnswers.${testId}`] = deleteField()
          await updateDoc(userDocRef, updateObject)
        }

        const answerDocRef = doc(db, 'answers', answerId)
        const answerDoc = await getDoc(answerDocRef)

        if (answerDoc.exists()) {
          const updateObject = {}
          updateObject[`${testType}.${userToRemoveId}`] = deleteField()
          await updateDoc(answerDocRef, updateObject)
        }
      } catch (e) {
        this.$store.commit('setError', {
          errorCode: 'RemoveReportError',
          message: e,
        })
      }

      await this.getCurrentAnswer()
      this.loadingBtn = false
      this.dialog = false
      this.$toast.success(this.$t('HeuristicsReport.messages.report_deleted'))
    },

    formatDate(timestamp) {
      const currentDate = new Date()
      const startDate = new Date(timestamp)

      const yearDiff = currentDate.getFullYear() - startDate.getFullYear()
      const monthDiff = currentDate.getMonth() - startDate.getMonth()
      const dayDiff = currentDate.getDate() - startDate.getDate()
      const hourDiff = currentDate.getHours() - startDate.getHours()
      const minuteDiff = currentDate.getMinutes() - startDate.getMinutes()

      if (yearDiff > 0) {
        return this.formatTimeAgo(yearDiff, 'years')
      } else if (monthDiff > 0) {
        return this.formatTimeAgo(monthDiff, 'months')
      } else if (dayDiff > 0) {
        return this.formatTimeAgo(dayDiff, 'days')
      } else if (hourDiff > 0) {
        return this.formatTimeAgo(hourDiff, 'hours')
      } else if (minuteDiff > 0) {
        return this.formatTimeAgo(minuteDiff, 'minutes')
      } else {
        return this.$t('common.timeAgo.now')
      }
    },

    goToCoops() {
      this.$emit('goToCoops')
    },

    getCooperatorEmail(userDocId) {
      if (userDocId == this.user.id) return 'You'
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
    formatTimeAgo(timeDiff, unit) {
      const translationKey = `common.timeAgo.${unit}`
      const translatedText = this.$t(translationKey, { count: timeDiff })

      return translatedText
    },
  },
}
</script>

<style scoped>
.subtitleView {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  line-height: 21px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
