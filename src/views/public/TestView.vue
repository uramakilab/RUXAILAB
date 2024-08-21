<template>
  <div v-if="test">
    <div v-if="test.testType == 'HEURISTICS'">
      <Snackbar />

      <!-- Submit Alert Dialog -->
      <v-dialog v-model="dialog" width="600" persistent>
        <v-card>
          <v-card-title class="headline error white--text" primary-title>
            {{ $t('HeuristicsTestView.messages.submitTest') }}
          </v-card-title>

          <v-card-text>
            {{ $t('HeuristicsTestView.messages.submitOnce') }}
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn class="grey lighten-3" text @click="dialog = false">
              {{ $t('HeuristicsTestView.actions.cancel') }}
            </v-btn>
            <v-btn
              class="red white--text ml-1"
              text
              @click="submitAnswer(), (dialog = false)"
            >
              {{ $t('HeuristicsTestView.actions.submit') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-overlay v-model="loading">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>

      <v-dialog
        :value="fromlink && !noExistUser && !logined"
        width="500"
        persistent
      >
        <v-card v-if="user">
          <v-row class="ma-0 pa-0 pt-5" justify="center">
            <v-avatar
              class="justify-center"
              color="orange lighten-4"
              size="150"
            >
              <v-icon size="120" dark>
                mdi-account
              </v-icon>
            </v-avatar>
          </v-row>
          <v-card-actions class="justify-center mt-4">
            <v-btn color="#F9A826" class="white--text" @click="setTest()">
              {{
                $t('HeuristicsTestView.actions.continueAs', {
                  userMail: user.email,
                })
              }}
            </v-btn>
          </v-card-actions>
          <v-card-actions class="justify-center mt-4">
            <p>
              <!-- Not {{ user.email }}? -->
              {{
                $t('HeuristicsTestView.actions.notMail', {
                  userEmail: user.email,
                })
              }}
              <a style="color: #f9a826" @click="signOut()">{{
                $t('HeuristicsTestView.actions.changeAccount')
              }}</a>
            </p>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Start Screen -->
      <v-row
        v-if="test && start"
        class="background background-img pa-0 ma-0"
        align="center"
      >
        <v-col cols="6" class="ml-5">
          <h1 class="titleView pb-1">
            {{ test.testTitle }}
          </h1>
          <p align="justify" class="description">
            {{ test.testDescription }}
          </p>
          <v-row justify="center" class>
            <v-btn color="white" outlined rounded @click="startTest()">
              {{ $t('HeuristicsTestView.actions.startTest') }}
            </v-btn>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-else class="nav pa-0 ma-0" dense>
        <v-speed-dial
          v-if="showSaveBtn"
          v-model="fab"
          fixed
          class="mr-3"
          bottom
          right
          open-on-hover
        >
          <template v-slot:activator>
            <v-btn v-model="fab" large color="#F9A826" dark fab class="btn-fix">
              <v-icon v-if="fab">
                mdi-close
              </v-icon>
              <v-icon v-else large>
                mdi-hammer-screwdriver
              </v-icon>
            </v-btn>
          </template>

          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                dark
                small
                color="#F9A826"
                v-bind="attrs"
                @click="saveAnswer()"
                v-on="on"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('HeuristicsTestView.actions.save') }}</span>
          </v-tooltip>

          <v-tooltip v-if="currentUserTestAnswer" left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="calculatedProgress < 100"
                class="white--text"
                fab
                small
                color="#F9A826"
                v-bind="attrs"
                @click="dialog = true"
                v-on="on"
              >
                <v-icon>mdi-file-move</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('HeuristicsTestView.actions.submit') }}</span>
          </v-tooltip>

          <v-tooltip v-else left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="white--text"
                fab
                small
                color="#F9A826"
                v-bind="attrs"
                @click="dialog = true"
                v-on="on"
              >
                <v-icon>mdi-file-move</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('HeuristicsTestView.actions.submit') }}</span>
          </v-tooltip>
        </v-speed-dial>

        <v-navigation-drawer
          v-model="drawer"
          clipped
          :mini-variant="mini"
          permanent
          color="#3F3D56"
        >
          <div v-if="!mini" class="header">
            <v-list-item>
              <v-row dense align="center" justify="space-around">
                <v-col class="pa-0 ma-0" cols="8">
                  <v-clamp class="titleText" autoresize :max-lines="2">
                    {{ test.testTitle }}
                  </v-clamp>
                </v-col>
                <v-col>
                  <v-progress-circular
                    rotate="-90"
                    :value="calculatedProgress"
                    color="#fca326"
                    :size="50"
                    class="mt-2"
                  >
                    {{ calculatedProgress }}
                  </v-progress-circular>
                </v-col>
              </v-row>
            </v-list-item>
          </div>

          <v-list
            class="nav-list"
            flat
            dense
            max-height="85%"
            style="overflow-y: auto; overflow-x: hidden; padding-bottom: 100px"
          >
            <div v-for="(item, n) in items" :key="n">
              <!--Heuris-->
              <v-list
                v-if="item.id == 1"
                :value="index == 1 ? true : false"
                @click="index = item.id"
              >
                <div v-if="mini">
                  <v-tooltip v-for="(heuris, i) in item.value" :key="i" right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item
                        link
                        v-bind="attrs"
                        @click="heurisIndex = i"
                        v-on="on"
                      >
                        <v-list-item-icon>
                          <v-progress-circular
                            v-if="
                              perHeuristicProgress(
                                currentUserTestAnswer.heuristicQuestions[i],
                              ) != 100
                            "
                            rotate="-90"
                            :value="
                              perHeuristicProgress(
                                currentUserTestAnswer.heuristicQuestions[i],
                              )
                            "
                            :size="24"
                            :width="3"
                            :color="heurisIndex == i ? '#ffffff' : '#fca326'"
                          />
                          <v-icon
                            v-else
                            :color="heurisIndex == i ? '#ffffff' : '#fca326'"
                          >
                            {{ heuris.icon }}
                          </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title
                            :style="
                              heurisIndex == i
                                ? 'color: white'
                                : 'color:#fca326'
                            "
                          >
                            {{ heuris.title }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span>{{ heuris.title }}</span>
                  </v-tooltip>
                </div>

                <div v-else>
                  <v-list-item
                    v-for="(heuris, i) in item.value"
                    :key="i"
                    link
                    @click="
                      heurisIndex = i
                      setReviewTrue()
                    "
                  >
                    <v-list-item-icon>
                      <v-progress-circular
                        v-if="
                          perHeuristicProgress(
                            currentUserTestAnswer.heuristicQuestions[i],
                          ) != 100
                        "
                        rotate="-90"
                        :value="
                          perHeuristicProgress(
                            currentUserTestAnswer.heuristicQuestions[i],
                          )
                        "
                        :size="24"
                        :width="3"
                        :color="heurisIndex == i ? '#ffffff' : '#fca326'"
                      />
                      <v-icon
                        v-else
                        :color="heurisIndex == i ? '#ffffff' : '#fca326'"
                      >
                        {{ heuris.icon }}
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title
                        :style="
                          heurisIndex == i ? 'color: white' : 'color:#fca326'
                        "
                      >
                        {{ heuris.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item style="cursor:pointer" v-if="review==true && calculatedProgress==100" @click="review=false" >
                    <v-list-item-icon>
                      <v-icon color="#fca326">
                        mdi-send-circle-outline
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        <div style="color: #fca326;">Submit</div>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </v-list>

              <v-list-item v-else-if="item.id == 2" @click="index = item.id">
                <v-list-item-icon>
                  <v-icon :color="index == item.id ? '#ffffff' : '#fca326'">
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    :style="index == item.id ? 'color: white' : 'color:#fca326'"
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-list>

          <div class="footer">
            <v-spacer />
            <v-btn icon class="mr-2" @click.stop="mini = !mini">
              <v-icon v-if="mini" color="white">
                mdi-chevron-right
              </v-icon>
              <v-icon v-else color="white">
                mdi-chevron-left
              </v-icon>
            </v-btn>
          </div>
        </v-navigation-drawer>

        <v-col
          ref="rightView"
          :class="{ mini: !mini }"
          class="backgroundTest pa-0 ma-0 right-view"
        >
          <!-- Heuristics -->
          <ShowInfo
            v-if="index == 1 && review == true"
            :title="test.testStructure[heurisIndex].title"
          >
            <div slot="content" class="ma-0 pa-0">
              <v-card-title class="subtitleView">
                {{ test.testStructure[heurisIndex].title }}
              </v-card-title>
              <v-divider class="mb-5" />
              <v-row
                v-for="(question, i) in test.testStructure[heurisIndex]
                  .questions"
                :key="i"
                justify="center"
              >
                <v-col cols="10">
                  <v-row class="questions">
                    <v-col cols="11">
                      <p class="subtitleView">
                        {{ i + 1 }}) {{ question.title }}
                      </p>
                    </v-col>
                    <v-col cols="1">
                      <HelpBtn :question="question" />
                    </v-col>
                  </v-row>
                  <AddCommentBtn
                    :heuris-index="heurisIndex"
                    :answer-heu="
                      currentUserTestAnswer.heuristicQuestions[heurisIndex]
                        .heuristicQuestions[i]
                    "
                    @updateComment="
                      (comment) => updateComment(comment, heurisIndex, i)
                    "
                  >
                    <v-select
                      v-if="currentUserTestAnswer !== undefined"
                      slot="answer"
                      v-model="
                        currentUserTestAnswer.heuristicQuestions[heurisIndex]
                          .heuristicQuestions[i].heuristicAnswer
                      "
                      class="optionSelect"
                      return-object
                      :items="test.testOptions"
                      item-text="text"
                      item-value=""
                      label="Respuestas/Answers"
                      outlined
                      dense
                      @change="calculateProgress()"
                    />
                  </AddCommentBtn>
                </v-col>
              </v-row>
            </div>
          </ShowInfo>
          <div v-if="calculatedProgress == 100 && review == false">
            <ShowInfo title="Finish Test">
              <div slot="content" class="ma-0 pa-0">
                <v-row justify="center" class="ma-4">
                  <v-col cols="11" class="mt-3">
                    <span class="cardsTitle">Final Message!</span>
                    <br />
                    <span class="cardsSubtitle">
                      Congratulations you finished this test, now you can submit
                      your answer.
                    </span>
                    <v-row justify="center" class="mt-3">
                      <v-col cols="4">
                        <img
                          draggable="false"
                          src="../../../public/finalMessage.svg"
                          alt="Final test svg"
                        />
                      </v-col>
                      <v-col cols="4" class="pt-2 my-8">
                        <span class="cardsSubtitle"
                          >Click here to submit your answer, when submitted your
                          answer can't be changed!</span
                        >
                        <v-col class="mt-2">
                          <v-btn
                            @click="dialog = true"
                            color="orange"
                            depressed
                            dark
                            ><v-icon class="ma-2">mdi-send</v-icon>Submit</v-btn
                          >
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </ShowInfo>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-if="test.testType == 'User' && test.userTestType === 'unmoderated'">
      <UserTestView />
    </div>
    <div v-if="test.testType === 'User' && test.userTestType === 'moderated'">
      <ModeratedTestView ref="ModeratedTestView" :token="token" />
    </div>
  </div>
</template>

<script>
import ShowInfo from '@/components/organisms/ShowInfo.vue'
import AddCommentBtn from '@/components/atoms/AddCommentBtn'
import HelpBtn from '@/components/atoms/QuestionHelpBtn'
import VClamp from 'vue-clamp'
import Snackbar from '@/components/atoms/Snackbar'
import HeuristicQuestionAnswer from '@/models/HeuristicQuestionAnswer'
import Heuristic from '@/models/Heuristic'
import UserTestView from './UserTestView.vue'
import ModeratedTestView from './ModeratedTestView.vue'
export default {
  components: {
    ShowInfo,
    AddCommentBtn,
    HelpBtn,
    VClamp,
    Snackbar,
    UserTestView,
    ModeratedTestView,
  },
  props: {
    id: { type: String, default: '' },
    token: { type: String, default: null },
  },
  data: () => ({
    logined: null,
    selected: true,
    fromlink: null,
    drawer: true,
    start: true, //change to true
    mini: false,
    index: null,
    noExistUser: true,
    heurisIndex: 0,
    preTestIndex: null,
    items: [],
    idx: 0,
    fab: false,
    res: 0,
    dialog: false,
    calculatedProgress: 0,
    review: true,
  }),
  computed: {
    test() {
      return this.$store.getters.test
    },
    user() {
      if (this.$store.getters.user) this.setExistUser()
      return this.$store.getters.user
    },
    currentUserTestAnswer() {
      if (this.test.testType === 'HEURISTICS') {
        return this.$store.getters.currentUserTestAnswer
      }
      return {}
    },
    showSaveBtn() {
      if (this.currentUserTestAnswer.submitted) return false
      return true
    },
    cooperators() {
      return this.$store.getters.cooperators
    },
    loading() {
      return this.$store.getters.loading
    },
    currentImageUrl() {
      return this.$store.state.Tests.currentImageUrl
    },
  },
  watch: {
    test: async function() {
      this.mappingSteps()
    },
    items() {
      if (this.items.length) {
        this.index = this.items[0].id
        if (this.items.find((obj) => obj.id == 0)) {
          //se tiver preTest mexe no preTestIndex
          this.preTestIndex = this.items[0].value[0].id
        }
      }
    },
    heurisIndex() {
      this.$refs.rightView.scrollTop = 0 //faz scroll pra cima qnd muda a heuristica
      this.$forceUpdate()
    },
    async user() {
      if (this.user) {
        this.noExistUser = false
        if (this.logined) this.setTest()
      }
    },
    calculatedProgress(newVal) {
      if (newVal == 100) {
        this.review = false
      }
    },
  },

  async created() {
    await this.$store.dispatch('getTest', { id: this.id })
    await this.$store.dispatch('getCurrentTestAnswerDoc')
    this.populateWithHeuristicQuestions()
    this.calculateProgress()
  },
  beforeRouteLeave(to, from, next) {
    if (this.test && this.test.userTestType === 'moderated') {
      let isSaved = this.$refs.ModeratedTestView.isSaved()
      let isTestNotStarted = this.$refs.ModeratedTestView.isTestNotStarted()
      if (!isSaved && !isTestNotStarted) {
        if (!window.confirm('Leave without saving?')) {
          return
        }
        next()
      } else next()
    }
    next()
  },
  methods: {
    startTest() {
      if (this.test.testStructure.length == 0) {
        this.$store.commit('setError', {
          errorCode: 400,
          message: this.$t('HeuristicsTestView.messages.noHeuristics'),
        })
        this.$router.push('/managerview/' + this.test.id)
      }
      this.start = !this.start
    },
    updateComment(comment, heurisIndex, answerIndex) {
      if (comment != '' && comment != undefined) {
        this.currentUserTestAnswer.heuristicQuestions[
          heurisIndex
        ].heuristicQuestions[answerIndex].heuristicComment = comment
      } else {
        this.currentUserTestAnswer.heuristicQuestions[
          heurisIndex
        ].heuristicQuestions[answerIndex].answerImageUrl = this.currentImageUrl
      }
    },
    mappingSteps() {
      //Heuristics
      if (
        this.validate(this.test.testStructure) &&
        this.test.testStructure.length !== 0 &&
        this.test.testType == 'HEURISTICS'
      )
        this.items.push({
          title: 'HEURISTICS',
          icon: 'mdi-checkbox-marked-circle-outline',
          value: this.test.testStructure.map((option) => {
            return {
              title: option.title,
              icon: 'mdi-checkbox-marked-circle-outline',
              done: false,
              total: option.total,
              id: option.id,
            }
          }),
          id: 1,
        })
    },
    validate(object) {
      return object !== null && object !== undefined && object !== ''
    },
    calculateProgress() {
      if (this.test.testType === 'HEURISTICS') {
        const total = this.currentUserTestAnswer.total
        let x = 0
        this.currentUserTestAnswer.heuristicQuestions.forEach((heuQ) => {
          heuQ.heuristicQuestions.forEach((question) => {
            if (
              question.heuristicAnswer !== '' &&
              Object.values(question.heuristicAnswer).length > 0
            ) {
              x++
            }
          })
        })
        const percent = ((100 * x) / total).toFixed(1)
        this.calculatedProgress = percent
        if (isNaN(this.calculatedProgress)) {
          this.calculatedProgress = 0
        }
      }
      this.$forceUpdate()
    },
    perHeuristicProgress(item) {
      const value =
        (item.heuristicQuestions.filter(
          (q) =>
            q.heuristicAnswer !== '' &&
            Object.values(q.heuristicAnswer).length > 0,
        ).length *
          100) /
        item.heuristicTotal
      return value.toFixed(1)
    },
    async saveAnswer() {
      this.currentUserTestAnswer.progress = this.calculatedProgress
      await this.$store.dispatch('saveTestAnswer', {
        data: this.currentUserTestAnswer,
        answerDocId: this.test.answersDocId,
        testType: this.test.testType,
      })
    },
    async submitAnswer() {
      this.currentUserTestAnswer.submitted = true
      await this.saveAnswer()
      this.$toast.success('Your response has been Recorded')
      this.$router.push('/testslist')
    },
    setExistUser() {
      this.noExistUser = false
    },
    signOut() {
      this.$store.dispatch('logout').then(() => {
        this.noExistUser = true
      })
    },
    populateWithHeuristicQuestions() {
      if (this.test.testType === 'HEURISTICS') {
        let totalQuestions = 0
        if (this.currentUserTestAnswer.heuristicQuestions.length <= 0) {
          this.test.testStructure.forEach((heu) => {
            this.currentUserTestAnswer.heuristicQuestions.push(
              new Heuristic({
                heuristicTitle: heu.title,
                heuristicId: heu.id,
                heuristicQuestions: heu.questions.map(
                  (h) =>
                    new HeuristicQuestionAnswer({
                      heuristicId: h.id,
                      heuristicAnswer: null,
                      heuristicComment: '',
                      answerImageUrl: '',
                    }),
                ),
                heuristicTotal: heu.total,
              }),
            )
            totalQuestions += heu.questions.length ?? 0
          })
          this.currentUserTestAnswer.total = totalQuestions
        }
      }
    },
    async setTest() {
      this.logined = true
      await this.$store.dispatch('getCurrentTestAnswerDoc')
      this.populateWithHeuristicQuestions()
    },
    setReviewTrue() {
      console.log('click done')
      this.review = true
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.token)
      next((vm) => {
        vm.fromlink = true
      })
    next()
  },
}
</script>
<style scoped>
body {
  overflow-y: 100vh; /* Adiciona uma barra de rolagem vertical quando necessário */
}
.background {
  background: linear-gradient(134.16deg, #ffab25 -13.6%, #dd8800 117.67%);
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.backgroundTest {
  background-color: #e8eaf2;
  height: 94%;
  overflow: scroll;
}
.background:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(../../assets/BackgroundTestView.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right 0px top -20px;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.titleView {
  font-style: normal;
  font-weight: 300;
  font-size: 60px;
  line-height: 70px;
  display: flex;
  align-items: center;
  color: #ffffff;
}
.description {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  line-height: 21px;
  align-items: flex-end;
  color: #ffffff;
}
.nav {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.questions {
  display: flex;
  justify-content: space-around;
  align-items: center;
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
.btn-fix:focus::before {
  opacity: 0 !important;
}
.titleText {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin-left: 15px;
  padding: 10px;
  padding-left: 0px;
  padding-top: 0px;
  /*
  height: 2.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; */
}
/* Right side scroll bar */
/* width */
.right-view {
  transition: filter 0.3s ease; /* Smooth transition for the blur effect */
}
.right-view::-webkit-scrollbar {
  width: 9px;
}
/* Track */
.right-view::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.right-view::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 2px;
}
/* Handle on hover */
.right-view::-webkit-scrollbar-thumb:hover {
  background: #fca326;
}
/* Nav bar list scroll bar */
/* width */
.nav-list::-webkit-scrollbar {
  width: 7px;
}
/* Track */
.nav-list::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.nav-list::-webkit-scrollbar-thumb {
  background: #777596;
  border-radius: 4px;
}
/* Handle on hover */
.nav-list::-webkit-scrollbar-thumb:hover {
  background: #64618a;
  /* background: #515069; */
}
.card-title {
  font-style: normal;
  font-weight: 300;
  font-size: 48px;
  line-height: 56px;
  margin-left: 12px;
  margin-bottom: 20px;
}
@media (max-width: 600px) {
  .subtitleView {
    font-size: 14px;
  }
  .optionSelect {
    transform: scale(0.875);
  }
  .right-view.mini {
    filter: blur(15px); /* Apply blur effect */
    width: 100%;
    z-index: -100;
  }
}
</style>
