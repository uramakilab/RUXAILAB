<template>
  <v-container>
    <Snackbar />
    <!-- Leave Alert Dialog -->
    <v-dialog v-model="dialog" width="600" persistent>
      <v-card>
        <v-card-title class="headline error accent-4 white--text" primary-title>
          Are you sure you want to leave?
        </v-card-title>

        <v-card-text>All your changes will be discarded</v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn class="grey lighten-3" text @click="dialog = false">
            Stay
          </v-btn>
          <v-btn
            class="error accent-4 white--text ml-1"
            text
            @click=";(change = false), $router.push(go)"
          >
            Leave
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Save button -->
    <v-tooltip v-if="accessLevel === 0" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          large
          dark
          fab
          fixed
          bottom
          right
          color="#F9A826"
          v-bind="attrs"
          style="z-index: 100"
          :disabled="testAnswerDocLength > 0 ? true : false"
          :class="{
            disabledBtnBackground: testAnswerDocLength > 0,
            disabledBtn: testAnswerDocLength > 0,
          }"
          @click="validateAll()"
          v-on="on"
        >
          <v-icon
            large
            :class="{
              disabledBtn: testAnswerDocLength > 0,
            }"
          >
            mdi-content-save
          </v-icon>
        </v-btn>
      </template>
      <span>Save</span>
    </v-tooltip>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="text-center">
      <v-progress-circular indeterminate color="#fca326" size="50" />
      <div class="white-text mt-3">
        Loading Test
      </div>
    </v-overlay>

    <v-row>
      <v-col cols="12" class="pb-0">
        <!-- Heuristic Tests -->
        <EditHeuristicsTest
          v-if="test.testType === 'HEURISTICS'"
          slot="content"
          type="content"
          :object="object"
          :index="index"
          @tabClicked="setIndex"
          @change="change=true"
        />

        <!-- Unmoderated User tests -->
        <EditUserTest
          v-if="test.testType === 'User' && test.userTestType === 'unmoderated'"
          slot="top"
          type="tabs"
          @tabClicked="setIndex"
        />

        <EditUserTest
          v-if="test.testType === 'User' && test.userTestType === 'unmoderated'"
          slot="content"
          :object="object"
          :index="index"
          type="content"
          @valForm="validate"
        />

        <!-- Moderated User tests -->
        <EditModeratedUserTest
          v-if="test.testType === 'User' && test.userTestType === 'moderated'"
          slot="top"
          type="tabs"
          @tabClicked="setIndex"
          @change="change = true"
        />

        <EditModeratedUserTest
          v-if="test.testType === 'User' && test.userTestType === 'moderated'"
          slot="content"
          :object="object"
          :index="index"
          type="content"
          @change="change = true"
          @valForm="validate"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Snackbar from '@/components/atoms/Snackbar'
//import ShowInfo from "@/components/organisms/ShowInfo";
//import IntroEdit from "@/components/molecules/IntroEdit.vue";
import EditHeuristicsTest from '@/components/organisms/EditHeuristicsTest'
import EditUserTest from '@/components/organisms/EditUserTest'
import EditModeratedUserTest from '@/components/organisms/EditModeratedUserTest'

export default {
  components: {
    Snackbar,
    //ShowInfo,
    // IntroEdit,
    EditHeuristicsTest,
    EditUserTest,
    EditModeratedUserTest,
  },

  props: ['id'],

  data: () => ({
    index: 0,
    object: {},
    valids: [true, true],
    change: false,
    dialog: false,
    intro: false,
  }),

  computed: {
    accessLevel() {
      // Check if the user is defined
      if (!this.user) return 1

      // If the user is a superadmin
      if (this.user.accessLevel === 0) return 0

      // Check if the user is a collaborator or owner
      const isTestOwner = this.test.testAdmin?.userDocId === this.user.id
      if (isTestOwner) return 0

      // Check if the user is a cooperator and get their access level
      const coopsInfo = this.test.cooperators?.find((coops) => coops.userDocId === this.user.id)
      if (coopsInfo) return coopsInfo.accessLevel
      return 1
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

    loading() {
      return this.$store.getters.loading
    },

    user() {
      return this.$store.getters.user
    },

    test() {
      return this.$store.getters.test
    },

    answers() {
      return this.$store.getters.answers || []
    },

    totalQuestions() {
      let result = 0
      if (this.object?.heuristics) {
        this.object?.heuristics.forEach((h) => {
          result += h.total
        })
      } else if (this.object?.tasks) {
        this.object?.tasks.forEach((h) => {
          result += h.total
        })
      }

      return result
    },
  },

  watch: {
    test: async function() {
      if (this.test !== null && this.test !== undefined) {
        this.setIntro()
      }
    },
  },

  async created() {
    await this.$store.dispatch('getTest', { id: this.id })
    await this.$store.dispatch('getCurrentTestAnswerDoc')
  },

  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav)
  },

  methods: {
    async submit() {
      this.object.testStructure = this.$store.state.Tests.Test.testStructure
      if (this.test.testType == 'User') {
        this.object.testStructure = {
          welcomeMessage: this.$store.getters.welcomeMessage,
          landingPage: this.$store.getters.landingPage,
          participantCamera: this.$store.getters.participantCamera,
          consent: this.$store.getters.consent,
          userTasks: this.$store.getters.tasks,
          preTest: this.$store.getters.preTest,
          postTest: this.$store.getters.postTest,
          finalMessage: this.$store.getters.finalMessage,
        }
      }
      const auxT = Object.assign(this.test, this.object)
      this.$store.dispatch('updateTest', auxT)
    },

    validate(valid, index) {
      this.valids[index] = valid
    },

    validateAll() {
      this.submit()
      this.change=false
    },

    preventNav(event) {
      if (!this.change) return
      event.preventDefault()
      event.returnValue = ''
    },

    async setIntro() {
      this.object = await Object.assign(this.object, this.test)
    },

    setIndex(ind) {
      this.index = ind
    },
  },

  beforeRouteLeave(to, from, next) {
    if (this.change) {
      this.dialog = true
      this.go = to.path
    } else {
      next()
    }
  },
}
</script>

<style>
.disabledBtn {
  color: rgba(134, 125, 125, 0.438) !important;
}
.disabledBtnBackground {
  background-color: rgba(185, 185, 185, 0.308) !important;
}
</style>
