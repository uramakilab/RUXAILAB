<template>
  <v-tabs
    v-if="type == 'tabs'"
    background-color="transparent"
    color="#FCA326"
    class="pb-0 mb-0"
  >
    <v-tab @click="tabClicked(0)">
      PRE-TEST
    </v-tab>
    <v-tab @click="tabClicked(1)">
      TASKS
    </v-tab>
    <v-tab @click="tabClicked(2)">
      POST-TEST
    </v-tab>
  </v-tabs>

  <v-col v-else-if="type == 'content'" cols="12">
    <v-row>
      <!-- PRE-TEST -->
      <v-col v-if="index == 0" cols="8">
        <v-card style="background: #f5f7ff" flat class="cards">
          <v-col cols="12" class="pb-0 px-5 pt-4">
            <span class="cardsTitle ml-3"> Consent Form</span>
            <br />
            <span class="cardsSubtitle ml-3"
              >This is a Consent Checkbox with a text for confirm the
              consentiment</span
            >
          </v-col>
          <UserConsent />
        </v-card>
      </v-col>
      <v-col v-if="index == 0" cols="4" class="pl-0" style="height: 19vh;">
        <v-card flat style="background: #f5f7ff" class="cards">
          <v-col cols="12" class="pb-0 pt-4 px-8">
            <span class="cardsTitle mt-4">Welcome message</span>
            <br />
            <span class="cardsSubtitle"
              >This message will be the first thing participants see before the
              session is started.</span
            >
          </v-col>
          <v-textarea
            v-model="welcomeMessage"
            outlined
            color="orange"
            class="mx-6 mt-3"
            placeholder="Thank you for participating..."
            @change="saveWelcomeState()"
          />
          <v-col cols="12" class="pb-0 px-8">
            <span class="cardsTitle">Landing Page</span>
            <br />
            <span class="cardsSubtitle"
              >This URL will automatically load when participants starts
              session.</span
            >
            <v-text-field
              v-model="landingPage"
              class="mt-3"
              style="border-radius: 20px;"
              placeholder="https://www.ruxailab.com"
              outlined
              color="orange"
              @change="saveLandingPage()"
            />
          </v-col>
          <v-col cols="12" class="pb-1 px-8 pb-0">
            <span class="cardsTitle">Participant camera</span>
            <v-radio-group
              v-model="participantCamera"
              class="pt-0"
              @change="saveParticipantCamera()"
            >
              <v-radio label="Optional" color="orange" value="optional" />
              <v-radio label="Required" color="orange" value="required" />
              <v-radio label="Disabled" color="orange" value="disabled" />
            </v-radio-group>
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="index == 0" cols="8" class="pt-0 pb-0">
        <v-card
          style="background: #f5f7ff; min-height: 420px;"
          flat
          class="cards"
        >
          <v-col cols="12">
            <span class="cardsTitle ml-3">Pre-Form</span>
            <br />
            <span class="cardsSubtitle ml-3"
              >This is a pre-questions you make to get participants data</span
            >
            <UserVariables @input="updateData" />
          </v-col>
        </v-card>
      </v-col>

      <!-- Tasks -->

      <v-col v-if="index == 1" cols="12">
        <ModeratedTasks />
      </v-col>

      <!-- Post Test -->

      <v-col v-if="index == 2" cols="12">
        <v-card
          style="background: #f5f7ff; min-height: 410px;"
          flat
          class="cards"
        >
          <v-col cols="12" class="pb-0 px-5 pt-4">
            <span class="cardsTitle ml-3">Post Form</span>
            <br />
            <span class="cardsSubtitle ml-3"
              >This is a post-questions you make to get participants data</span
            >
            <FormPostTest @input="updateData" />
          </v-col>
        </v-card>
      </v-col>
      <v-col v-if="index == 2" cols="12" class="pt-0">
        <v-card style="background: #f5f7ff" flat class="cards">
          <v-col cols="12" class="pb-0 px-5 pt-4 pb-0">
            <span class="cardsTitle ml-3">Final message</span>
            <br />
            <span class="cardsSubtitle ml-3"
              >This is a Final message you leave to the participant on finish
              test.</span
            >
          </v-col>
          <v-textarea
            v-model="finalMessage"
            rows="3"
            outlined
            color="orange"
            class="mx-6 mt-3"
            placeholder="Thank you for participating..."
            @change="saveFinalMessage()"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import FormPostTest from '../atoms/FormPostTest.vue'
import UserVariables from '../atoms/UserVariables.vue'
import ModeratedTasks from '../atoms/ModeratedTasks.vue'
import UserConsent from '../atoms/UserConsent.vue'
export default {
  components: { UserVariables, FormPostTest, ModeratedTasks, UserConsent },
  props: {
    type: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    object: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formData: {
        preTest: [],
        postTest: [],
      },
      welcomeMessage: '',
      landingPage: '',
      participantCamera: '',
      finalMessage: '',
    }
  },
  computed: {
    consentStore() {
      return this.$store.getters.consent
    },
    test() {
      return this.$store.getters.test
    },
    testStructure() {
      return this.$store.state.Tests.Test.testStructure
    },
    welcomeMessageStore() {
      return this.$store.getters.welcomeMessage
    },
    landingPageStore() {
      return this.$store.getters.landingPage
    },
    participantCameraStore() {
      return this.$store.getters.participantCamera
    },
    finalMessageStore() {
      return this.$store.getters.finalMessage
    },
  },

  mounted() {
    this.getWelcome()
    this.getLandingPage()
    this.getParticipantCamera()
    this.getFinalMessage()

    if (this.type !== 'content' && this.type != 'tabs') {
      console.error(this.type + ' type in EditUserTest.vue is not valid.')
    }
    if (this.testStructure.postTest) {
      this.$store.dispatch('setPostTest', this.testStructure.postTest)
    }
    if (this.testStructure.preTest) {
      this.$store.dispatch('setPreTest', this.testStructure.preTest)
    }
    if (this.testStructure.consent) {
      this.$store.dispatch('setConsent', this.testStructure.consent)
    }
  },

  methods: {
    updateData(data) {
      if (this.index == 0) {
        this.$store.dispatch('setPreTest', data)
      }
      if (this.index == 2) {
        this.$store.dispatch('setPostTest', data)
      }
    },
    tabClicked(index) {
      this.$emit('tabClicked', index)
    },
    getWelcome() {
      if (this.testStructure.welcomeMessage) {
        this.$store.dispatch(
          'setWelcomeMessage',
          this.testStructure.welcomeMessage,
        )
        this.welcomeMessage = this.testStructure.welcomeMessage
      } else if (this.welcomeMessageStore) {
        this.welcomeMessage = this.welcomeMessageStore
      }
    },

    getLandingPage() {
      if (this.testStructure.landingPage) {
        this.$store.dispatch('setLandingPage', this.testStructure.landingPage)
        this.landingPage = this.testStructure.landingPage
      } else if (this.landingPageStore) {
        this.landingPage = this.landingPageStore
      }
    },

    getParticipantCamera() {
      if (this.testStructure.participantCamera) {
        this.$store.dispatch(
          'setParticipantCamera',
          this.testStructure.participantCamera,
        )
        this.participantCamera = this.testStructure.participantCamera
      } else if (this.participantCameraStore) {
        this.participantCamera = this.participantCameraStore
      }
    },

    getFinalMessage() {
      if (this.testStructure.finalMessage) {
        this.$store.dispatch('setFinalMessage', this.testStructure.finalMessage)
        this.finalMessage = this.testStructure.finalMessage
      } else if (this.finalMessageStore) {
        this.finalMessage = this.finalMessageStore
      }
    },

    saveWelcomeState() {
      this.$store.dispatch('setWelcomeMessage', this.welcomeMessage)
      this.test.testStructure.welcomeMessage = this.welcomeMessage
    },
    saveLandingPage() {
      this.$store.dispatch('setLandingPage', this.landingPage)
      this.test.testStructure.landingPage = this.landingPage
    },
    saveParticipantCamera() {
      this.$store.dispatch('setParticipantCamera', this.participantCamera)
      this.test.testStructure.participantCamera = this.participantCamera
    },
    saveFinalMessage() {
      this.$store.dispatch('setFinalMessage', this.finalMessage)
      this.test.testStructure.finalMessage = this.finalMessage
    },
  },
}
</script>

<style scoped>
.cards {
  border-radius: 20px;
}
.cardsTitle {
  color: #455a64;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.cardsSubtitle {
  color: #455a64;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.v-text-field--outlined >>> fieldset {
  border-radius: 25px;
  border: 1px solid #ffceb2;
}
</style>
