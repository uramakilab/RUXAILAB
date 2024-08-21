<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-overlay
      v-if="this.$route.path.includes('manager')"
      v-model="loading"
      class="text-center"
    >
      <v-progress-circular indeterminate color="#fca326" size="50" />
      <div class="white-text mt-3">
        {{ $t('common.loading') }}
      </div>
    </v-overlay>

    <v-dialog :value="flagToken && flagUser && !logined" width="500" persistent>
      <v-card v-if="user">
        <v-row class="ma-0 pa-0 pt-5" justify="center">
          <v-avatar class="justify-center" color="orange lighten-4" size="150">
            <v-icon size="120" dark>
              mdi-account
            </v-icon>
          </v-avatar>
        </v-row>
        <v-card-actions class="justify-center mt-4">
          <v-btn color="#F9A826" class="white--text" @click="setTest()">
            {{ $t('common.continueAs') }} {{ user.email }}
          </v-btn>
        </v-card-actions>
        <v-card-actions class="justify-center mt-4">
          <p>
            {{ $t('common.notUser', { userEmail: user.email }) }}
            <a style="color: #f9a826" @click="signOut()">{{
              $t('common.changeAccount')
            }}</a>
          </p>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row v-if="test" class="nav pa-0 ma-0" dense>
      <Drawer :items="navigator" />

      <!-- View -->
      <v-col class="background pa-0 ma-0">
        <div v-if="this.$route.path.includes('manager')">
          <div class="back-gradient">
            <v-row align="center" justify="center" style="height: 100%">
              <v-col class="text-div">
                <div v-if="accessLevel == 0" class="white--text">
                  <p
                    class="mobile-center"
                    style="font-size: 58px; font-weight: 500"
                  >
                    {{ $t('titles.manager') }}
                  </p>
                  <p
                    style="font-size: 22px"
                    class="mobile-center"
                  >
                    {{ test.testTitle }}
                  </p>
                </div>
                <div
                  v-else
                  class="white--text mobile-center"
                  style="font-size: 58px; font-weight: 500"
                >
                  {{ test.testTitle }}
                </div>
                <v-img
                  class="hidden-md-and-up"
                  style="max-height: 40vh"
                  contain
                  src="@/assets/manager/IntroManager.svg"
                />
              </v-col>
              <v-img
                class="hidden-sm-and-down"
                contain
                max-width="40%"
                max-height="85%"
                src="@/assets/manager/IntroManager.svg"
              />
            </v-row>
          </div>
          <div>
            <v-container class="card-container">
              <div v-if="accessLevel == 0" class="presentation-text">
                {{ $t('common.editAndInvite') }}
              </div>

              <!-- Top Cards -->
              <v-row
                v-if="accessLevel == 0"
                justify="center"
                justify-md="space-around"
              >
                <v-col v-for="(item, n) in topCards" :key="n" cols="12" md="6">
                  <v-card
                    class="rounded-xl cards-animation"
                    height="270px"
                    :style="item.cardStyle"
                    :ripple="false"
                    color="#F2F3F4"
                    @click="go(item.path)"
                  >
                    <v-row
                      style="height: 200px"
                      justify="center"
                      align="center"
                    >
                      <v-img
                        max-height="150"
                        :style="item.imageStyle"
                        contain
                        :src="require('../../assets/manager/' + item.image)"
                      />
                    </v-row>

                    <div
                      class="white--text pl-4"
                      :style="{
                        height: '90px',
                        position: 'absolute',
                        bottom: '0',
                        width: '100%',
                        'background-color': item.bottom,
                        'padding-top': '10px',
                        'border-top': '.3px solid #505050',
                      }"
                    >
                      <h2>{{ $t(`titles.${item.title}`) }}</h2>
                      <div>
                        {{ $t(`descriptions.${item.description}`) }}
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <div class="presentation-text mt-5">
                {{ $t('common.analyzeProject') }}
              </div>

              <!-- Bottom Cards -->
              <v-row justify="center" justify-md="space-around">
                <v-col
                  v-for="(item, i) in bottomCards"
                  :key="i"
                  cols="12"
                  md="4"
                >
                  <v-card
                    class="rounded-xl cards-animation"
                    height="270px"
                    :style="item.cardStyle"
                    hover
                    :ripple="false"
                    @click="go(item.path)"
                  >
                    <v-row
                      style="height: 200px"
                      justify="center"
                      align="center"
                      class="px-5"
                    >
                      <v-img
                        height="150"
                        contain
                        :src="require('../../assets/manager/' + item.image)"
                      />
                    </v-row>

                    <div
                      class="white--text pa-1 pl-4"
                      :style="{
                        height: '90px',
                        position: 'absolute',
                        bottom: '0',
                        width: '100%',
                        paddingTop: '2px',
                        'background-color': item.bottom,
                        'border-top': '.3px solid #505050',
                      }"
                    >
                      <h2>{{ $t(`titles.${item.title}`) }}</h2>
                      <div>
                        {{ $t(`descriptions.${item.description}`) }}
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <router-view v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Drawer from '@/components/atoms/Drawer.vue'
import { statistics } from '@/utils/statistics'
import i18n from '@/i18n'

export default {
  components: {
    Drawer,
  },

  data: () => ({
    flagUser: false,
    flagToken: false,
    flagNewUser: false,
    logined: false,
  }),

  computed: {
    test() {
      this.$store.dispatch('processStatistics', {
        resultEvaluator: statistics(),
        percentage: this.percentage,
        answers: this.$store.getters.testAnswerDocument,
      })
      return this.$store.getters.test
    },

    topCards() {
      return [
        {
          image: 'IntroEdit.svg',
          title: 'test',
          imageStyle: 'transform: rotateY(180deg);',
          bottom: '#000',
          description: 'edit',
          cardStyle:
            'background-image: radial-gradient(circle at top right, #d128c9, #9a1aab); overflow: hidden',
          path: `/edittest/${this.test.id}`,
        },
        {
          image: 'IntroCoops.svg',
          title: 'cooperators',
          imageStyle: '',
          bottom: '#000',
          description: 'cooperators',
          cardStyle:
            'background-image: radial-gradient(circle at top right, #eff31a, #eecf22); overflow: hidden',
          path: `/cooperators/${this.test.cooperators}`,
        },
      ]
    },

    bottomCards() {
      const bottomCards = [
        {
          image: 'IntroReports.svg',
          title: 'reports',
          imageStyle: 'height: 250px',
          bottom: '#000',
          description: 'reports',
          cardStyle:
            'background-image: radial-gradient(circle at top right, #FF3C00, #FF0000); overflow: hidden',
          path: `/reportview/${this.test.answersDocId}`,
        },
        {
          image: 'IntroAnswer.svg',
          title: 'answers',
          imageStyle: 'height: 250px',
          bottom: '#000',
          description: 'answers',
          cardStyle:
            'background-image: radial-gradient(circle at top right, #9ac94f, #7eb543); overflow: hidden',
          path: `/answerview/${this.test.answersDocId}`,
        },
      ]
      if (this.accessLevel == 0) {
        bottomCards.push({
          image: 'FinalReport.png',
          title: 'finalReport',
          imageStyle: 'height: 250px',
          bottom: '#000',
          description: 'finalReport',
          cardStyle:
            'background-image: radial-gradient(circle at top left,  #ec6618, #f54e42); overflow: hidden',
          path: `/finalreportview/${this.test.id}`,
        })
      }
      return bottomCards
    },

    user() {
      if (this.$store.getters.user) this.setFlag('flagUser', true)
      return this.$store.getters.user
    },

    cooperators() {
      return this.$store.getters.cooperators
    },

    loading() {
      return this.$store.getters.loading
    },

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

      // Check if the test is public
      return this.test.isPublic ? 1 : 2
    },

    navigator() {
      if (!this.test) return []

      const items = [
        { title: 'Manager', icon: 'mdi-home', path: `/managerview/${this.test.id}` }, 
      ]

      if (this.test.template) {
        items.push({ title: 'Template', icon: 'mdi-file-compare', path: `/templateview/${this.test.template.id}` })
      }

      if (this.accessLevel == 0) {
        items.push(
          { title: 'Test', icon: 'mdi-file-document-edit', path: `/edittest/${this.test.id}` },
          { title: 'Preview', icon: 'mdi-file-eye', path: `/testview/${this.test.id}` },
          { title: 'Reports', icon: 'mdi-book-multiple', path: `/reportview/${this.test.id}` },
          { title: 'Answers', icon: 'mdi-order-bool-ascending-variant', path: `/answerview/${this.test.id}` },
          { title: 'Final Report', icon: 'mdi-file-document', path: `/finalreportview/${this.test.id}` },
          { title: 'Cooperators', icon: 'mdi-account-group', path: `/cooperators/${this.test.id}` },
          { title: 'Settings', icon: 'mdi-cog', path: `/settingsview/${this.test.id}` },
        )
      }
      
      if (this.accessLevel == 1) {
        items.push(
          { title: 'Answer Test', icon: 'mdi-file-document', path: `/testview/${this.test.id}` },
          { title: 'Reports', icon: 'mdi-book-multiple', path: `/reportview/${this.test.id}` },
          { title: 'Answers', icon: 'mdi-order-bool-ascending-variant', path: `/answerview/${this.test.id}` },
        )
      }

      return items
    },
  },

  watch: {
    user() {
      if (this.user) {
        this.setFlag('flagUser', true)
      }
      if (this.user.myCoops && this.flagNewUser) {
        this.setTest()
        this.flagNewUser = false
      }
    },
  },

  async created() {
    await this.$store.dispatch('getTest', { id: this.$route.params.id })
    await this.$store.dispatch('getCurrentTestAnswerDoc')
    if (this.accessLevel == 2) {
      this.$toast.warning('You don\'t have permission to access this test!')
      this.$router.push('/testslist')
    }
  },

  methods: {
    go(item) {
      if (item.id === undefined) return this.$router.push(item).catch(() => {})
      if (item.id === 2) return window.open(item.path)
      return this.$router.push(item.path).catch(() => {})
    },

    setFlag(flag, value) {
      this[flag] = value
    },

    signOut() {
      this.$store.dispatch('logout').then(() => {
        this.setFlag('flagUser', false)
      })
    },

    async setTest() {
      if (this.user.myAnswers && this.test) {
        const answers = []
        const answersEntries = Object.entries(this.user.myAnswers)
        answersEntries.forEach((a) => {
          answers.push(a[1])
        })
        // Check if test has already been accepted by the user
        const alreadyAccepted = answers.find(
          (a) => a.testDocId === this.test.id,
        )
        if (!alreadyAccepted) {
          console.log('Caiu como !alreadyAccepted')
          // Get invitation
          const invitation = this.test.cooperators.find(
            (coop) => coop.token === this.token,
          )
          if (invitation) {
            // User invited, and they have an account
            if (this.user.email === invitation.email) {
              // Accept Collaboration
              await this.$store.dispatch('acceptTestCollaboration', {
                test: this.test,
                cooperator: this.user,
              })
              this.flagToken = false
            }
            // User invited, but they don't have an account
            else {
              this.$store.commit('setError', {
                errorCode: 'inviteError',
                message: i18n.t('errors.signupWithInvitationEmail'),
              })
              await this.$store.dispatch('logout')
              this.$router.push({ path: '/' })
            }
          } else {
            this.$store.commit('setError', {
              errorCode: 'inviteError',
              message: i18n.t('errors.invalidInvitation'),
            })
            this.$router.push({ path: '/' })
          }
        } else {
          this.flagToken = false
        }
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    if (to.params.token)
      next((vm) => {
        vm.setFlag('flagToken', true)
        vm.token = to.params.token
      })
    next()
  },
}
</script>
<style>
.background {
  background-color: #e8eaf2;
  height: 94%;
  overflow: scroll;
}
.nav {
  position: fixed;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background::-webkit-scrollbar {
  display: none;
}
.testTitle {
  font-style: normal;
  font-weight: bold;
  font-size: 45px;
  display: flex;
  align-items: center;
  text-align: center;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.presentation-text {
  color: rgb(87, 84, 100);
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 20px;
}

.back-gradient {
  height: 60vh;
  background-image: radial-gradient(circle at top right, #f6cd3d, #fca326);
}

.text-div {
  max-width: 45%;
}

.card-container {
  width: 70%;
}
@media screen and (max-width: 960px) {
  .presentation-text {
    display: flex;
    text-align: center;
    justify-content: center;
  }
  .text-div {
    max-width: 100%;
    margin: 0px 10px;
    text-justify: center;
  }
  .image-back {
    height: 300px;
  }
  .mobile-center {
    display: flex;
    text-align: center;
    justify-content: center;
  }
  .card-container {
    width: 85%;
  }
  .back-gradient {
    height: 100%;
  }
}

.cards-animation {
  box-shadow: 0;
  transition: box-shadow 0.5s;
}

.cards-animation:hover {
  box-shadow: 0px 0px 35px 2px rgba(0, 0, 0, 0.7) !important;
}
</style>
