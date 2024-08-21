<template>
  <v-container class="mt-8">
    <Snackbar />

    <!-- CREATE TEST BTN -->
    <v-tooltip left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          data-testid="create-test-btn"
          large
          dark
          fab
          fixed
          bottom
          right
          color="#F9A826"
          v-bind="attrs"
          @click="goToCreateTestRoute()"
          v-on="on"
        >
          <v-icon large>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('Dashboard.createNewTest') }}</span>
    </v-tooltip>

    <!-- LOADING -->
    <v-overlay v-model="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <div>
      <v-row justify="center" class="fill-height">
        <v-col cols="10">
          <!-- Mobile search button -->
          <v-row v-if="!searching" align="center">
            <span class="titleText ml-3 mb-2">{{ $t('Dashboard.tests') }}</span>
            <v-spacer />
            <v-btn class="mr-3 hidden-md-and-up" icon @click="searching = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-row>
          <v-text-field
            v-else
            v-model="search"
            :autofocus="searching"
            dense
            :label="$t('Dashboard.search')"
            prepend-inner-icon="mdi-magnify"
            outlined
            color="grey darken-2"
            @blur="searching = false"
          />
          <v-divider class="mb-1" />

          <!-- Desktop Main Tabs -->
          <v-tabs
            v-model="mainIndex"
            background-color="transparent"
            color="black"
            class="hidden-sm-and-down mt-4"
          >
            <v-tab>{{ $t('Dashboard.tests') }}</v-tab>
            <!-- <v-tab>Answers</v-tab>-->
            <v-tab>{{ $t('Dashboard.templates') }}</v-tab>

            <v-spacer />

            <v-text-field
              v-model="search"
              dense
              class="mt-1"
              :label="$t('Dashboard.search')"
              prepend-inner-icon="mdi-magnify"
              :disabled="mainIndex == 2 && subIndex == 1 ? true : false"
              outlined
              color="grey darken-2"
            />
          </v-tabs>
          <v-divider class="hidden-sm-and-down" />

          <!-- Desktop Tests/Answers Sub tabs -->
          <v-tabs
            v-if="mainIndex === 0"
            v-model="subIndex"
            background-color="transparent"
            color="black"
            class="hidden-sm-and-down"
          >
            <v-tab>{{ $t('Dashboard.myTests') }}</v-tab>
            <v-tab>{{ $t('Dashboard.sharedWithMe') }}</v-tab>
            <v-tab>{{ $t('Dashboard.publicTests') }}</v-tab>
            <v-tab>Sessions</v-tab>

            <v-spacer />
          </v-tabs>
          <v-divider class="hidden-sm-and-down" />

          <!-- Desktop Templates Sub tabs -->
          <v-tabs
            v-if="mainIndex == 1"
            v-model="subIndex"
            background-color="transparent"
            color="black"
            class="hidden-sm-and-down"
          >
            <v-tab>{{ $t('Dashboard.personal') }}</v-tab>
            <v-tab>{{ $t('Dashboard.explore') }}</v-tab>

            <v-spacer />
          </v-tabs>
          <v-divider class="hidden-sm-and-down" />
          <!-- Mobile Main Button -->
          <v-select
            v-model="mainIndex"
            dense
            outlined
            class="hidden-md-and-up mx-2 mt-4"
            :items="buttonItems"
          />

          <!-- Mobile Sub Buttons -->
          <v-select
            v-if="mainIndex == 1"
            v-model="subIndex"
            dense
            outlined
            class="hidden-md-and-up mx-2"
            :items="templateButtonItems"
          />
          <v-select
            v-else
            v-model="subIndex"
            dense
            outlined
            class="hidden-md-and-up mx-2"
            :items="testButtonItems"
          />

          <!-- Tests -> Personal  -->
          <List
            v-if="mainIndex == 0 && subIndex == 0"
            :items="filteredTests"
            type="myTests"
            @clicked="goTo"
          />

          <!-- Tests -> Others  -->
          <List
            v-if="mainIndex == 0 && subIndex == 1"
            :items="filteredTests"
            type="sharedWithMe"
            @clicked="goTo"
          />

          <!-- Tests -> Public Tests -->
          <List
            v-if="filteredTests != null && mainIndex == 0 && subIndex == 2"
            :items="filteredTests"
            type="publicTests"
            @clicked="goTo"
          />

          <!-- Tests -> Sessions -->
          <List
            v-if="
              filteredModeratedSessions.length > 0 &&
                mainIndex == 0 &&
                subIndex == 3
            "
            :items="filteredModeratedSessions"
            type="sessions"
            @clicked="goTo"
          />
          <v-col
            v-if="
              filteredModeratedSessions.length == 0 &&
                mainIndex == 0 &&
                subIndex == 3
            "
            align="center"
            class="my-5"
          >
            <span style="color: #575757; font-size: 1.25rem !important;">
              You don't have active sessions
            </span>
            <br>
            <v-icon style="color: #575757;" class="mt-2" large>
              mdi-clock-remove-outline
            </v-icon>
          </v-col>

          <!-- Templates -> Personal -->
          <List
            v-if="mainIndex == 1 && subIndex == 0"
            :items="filteredTemplates"
            type="myTemplates"
            @clicked="setupTempDialog"
          />

          <!-- Templates -> Public Templates -->
          <List
            v-if="mainIndex == 1 && subIndex == 1"
            :items="filteredTemplates"
            type="publicTemplates"
            @clicked="setupTempDialog"
          />
        </v-col>
      </v-row>

      <TempDialog
        :dialog="tempDialog"
        :template="temp"
        :allow-create="true"
        @close="tempDialog = false"
      />
    </div>
  </v-container>
</template>

<script>
import Snackbar from '@/components/atoms/Snackbar'
import List from '@/components/atoms/ListComponent'
import TempDialog from '@/components/molecules/TemplateInfoDialog'

export default {
  components: {
    Snackbar,
    List,
    TempDialog,
  },

  data: () => ({
    search: '',
    mainIndex: 0,
    subIndex: 0,
    searching: false,
    buttonItems: [
      { text: 'Tests', value: 0 },
      { text: 'Templates', value: 1 },
    ],
    testButtonItems: [
      { text: 'My Tests', value: 0 },
      { text: 'Shared With Me', value: 1 },
      { text: 'Public Tests', value: 2 },
    ],
    templateButtonItems: [
      { text: 'Personal', value: 0 },
      { text: 'Explore', value: 1 },
    ],
    page: 1,
    lastPage: 1,
    itemsPerPage: 4,
    exploreTemplates: [],
    disableNext: false,
    disablePrevious: true,
    tempDialog: false,
    temp: {},
    filteredModeratedSessions: [],
  }),

  computed: {
    user() {
      return this.$store.getters.user
    },
    test() {
      return this.$store.getters.test
    },
    tests() {
      return this.$store.state.Tests.tests
    },

    filteredTests() {
      return this.tests?.filter(test => {
        return test.testTitle.toLowerCase().includes(this.search.toLowerCase())
      }) ?? this.tests
    },

    templates() {
      return this.$store.state.Templates.templates || []
    },

    filteredTemplates() {
      return this.templates.filter(temp => {
        return temp.header.templateTitle.toLowerCase().includes(this.search.toLowerCase())
      })
    },

    loading() {
      return this.$store.getters.loading
    },

    showTempDetails() {
      return !(this.mainIndex == 2 && this.subIndex == 0) //dont show on this tab
    },
  },
  watch: {
    async mainIndex(val) {
      this.subIndex = 0 //reset subIndex when main index change

      // If it is on tab tests
      if (val == 0) await this.getMyPersonalTests()

      // If it is on tab templates
      if (val == 1) await this.getMyTemplates()
    },

    async subIndex(val) {
      if (this.mainIndex == 0) {
        // If it is on tab tests
        if (val == 0) await this.getMyPersonalTests()

        // If it is on tab templates
        if (val == 1) await this.getSharedWithMeTests()

        if (val == 2) await this.getPublicTests()
      } else if (this.mainIndex == 1) {
        if (val == 0) await this.getMyTemplates()
        if (val == 1) await this.getPublicTemplates()
      }
    },
  },
  mounted() {
    this.filterModeratedSessions()
  },

  async created() {
    await this.getMyPersonalTests()
    await this.cleanTestStore()
  },

  methods: {
    async cleanTestStore() {
      await this.$store.dispatch('cleanTest')
    },
    
    async getMyPersonalTests() {
      await this.$store.dispatch('getTestsAdminByUser')
    },

    async getPublicTests() {
      await this.$store.dispatch('getPublicTests')
    },

    async getPublicTemplates() {
      await this.$store.dispatch('getPublicTemplates')
    },

    async getMyTemplates() {
      await this.$store.dispatch('getTemplatesOfUser')
    },

    async getSharedWithMeTests() {
      await this.$store.dispatch('getSharedWithMeTests', this.user.id)
    },

    async filterModeratedSessions() {
      const userModeratedTests = Object.values(this.user.myAnswers).filter(
        (answer) => answer.userTestType === 'moderated',
      )

      const cooperatorArray = []

      for (let i = 0; i < userModeratedTests.length; i++) {
        const testId = userModeratedTests[i].testDocId
        const testObj = await this.$store.dispatch('getTest', { id: testId })

        if (testObj) {
          const cooperatorObj = testObj.cooperators.find(
            (coop) => coop.userDocId == this.user.id,
          )
          cooperatorObj.testTitle = testObj.testTitle
          cooperatorObj.testAdmin = testObj.testAdmin
          cooperatorObj.id = testObj.id

          const today = new Date()
          const testDate = new Date(cooperatorObj.testDate)

          if (cooperatorObj && testDate.getDate() === today.getDate()) {
            cooperatorArray.push(cooperatorObj)
          }
        }
      }
      this.filteredModeratedSessions = cooperatorArray
      return cooperatorArray
    },

    goToCreateTestRoute() {
      this.$router.push('/createtest')
    },

    goTo(test) {
      if (this.mainIndex === 0) {
        if (this.subIndex === 0) {
          this.$router.push({
            name: 'ManagerView',
            params: { id: test.testDocId },
          })
        }
        // if it is the shared with me tests
        else if (this.subIndex === 1) {
          if (test.accessLevel >= 2) {
            this.$router.push({
              name: 'TestView',
              params: { id: test.testDocId },
            })
          } else {
            this.$router.push({
              name: 'ManagerView',
              params: { id: test.testDocId },
            })
          }
        } else if (this.subIndex === 2) {
          this.$router.push({
            name: 'ManagerView',
            params: { id: test.id },
          })
        } else if (this.subIndex === 3) {
          this.$router.push(`testview/${test.id}/${this.user.id}`)
        }
      }
    },

    setupTempDialog(temp) {
      this.temp = Object.assign({}, temp)
      this.tempDialog = true
    },
  },
}
</script>

<style scoped>
.titleText {
  font-size: 40px;
  font-weight: 300;
}
</style>
