<template>
  <v-container class="pa-0 ma-0" fluid>
    <Snackbar />

    <v-overlay v-model="loading" class="text-center">
      <v-progress-circular indeterminate color="#fca326" size="50" />
      <div class="white-text mt-3">
        {{ $t('common.loading') }}
      </div>
    </v-overlay>

    <v-row v-if="test" class="nav pa-0 ma-0" dense>
      <Drawer :items="navigator" />

      <!-- View -->
      <v-col class="background pa-0 ma-0">
        <div v-if="this.$route.path.includes('manager')">
          <div class="back-gradient">
            <v-row align="center" justify="center" style="height: 100%">
              <v-col class="text-div">
                <div v-if="accessLevel == 0" class="white--text">
                  <p class="mobile-center" style="font-size: 58px; font-weight: 500">
                    {{ $t('titles.manager') }}
                  </p>

                  <p style="font-size: 22px" class="mobile-center">
                    {{ test.testTitle }}
                  </p>
                </div>

                <div v-else class="white--text mobile-center" style="font-size: 58px; font-weight: 500">
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
              <div v-if="accessLevel == 0 && topCards.length">
                <div class="presentation-text">
                  {{ $t('common.editAndInvite') }}
                </div>

                <!-- Top Cards -->
                <CardsManager :cards="topCards" :per-row="2" @click="go" />
              </div>

              <div v-if="bottomCards.length">
                <div class="presentation-text mt-5">
                  {{ $t('common.analyzeProject') }}
                </div>

                <!-- Bottom Cards -->
                <CardsManager :cards="bottomCards" :per-row="3" @click="go" />
              </div>
            </v-container>
          </div>
        </div>

        <router-view v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Snackbar from '@/components/atoms/Snackbar'
import Drawer from '@/components/atoms/Drawer'
// import { statistics } from '@/utils/statistics'
import CardsManager from '@/components/atoms/CardsManager'

export default {
  components: {
    Snackbar,
    Drawer,
    CardsManager,
  },

  computed: {
    user() {
      return this.$store.getters.user
    },

    test() {
      // this.$store.dispatch('processStatistics', {
      //   resultEvaluator: statistics(),
      //   percentage: this.percentage,
      //   answers: this.$store.getters.testAnswerDocument,
      // })
      return this.$store.getters.test
    },

    accessLevel() {
      return this.$store.getters.getUserAccessLevel(this.test)
    },

    loading() {
      return this.$store.getters.loading
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
          path: `/cardSorting/edittest/${this.test.id}`,
        },
        // {
        //   image: 'IntroCoops.svg',
        //   title: 'cooperators',
        //   imageStyle: '',
        //   bottom: '#000',
        //   description: 'cooperators',
        //   cardStyle:
        //     'background-image: radial-gradient(circle at top right, #eff31a, #eecf22); overflow: hidden',
        //   path: `/cooperators/${this.test.cooperators}`,
        // },
      ]
    },

    bottomCards() {
      const bottomCards = [
        // {
        //   image: 'IntroReports.svg',
        //   title: 'reports',
        //   imageStyle: 'height: 250px',
        //   bottom: '#000',
        //   description: 'reports',
        //   cardStyle:
        //     'background-image: radial-gradient(circle at top right, #FF3C00, #FF0000); overflow: hidden',
        //   path: `/reportview/${this.test.answersDocId}`,
        // },
        // {
        //   image: 'IntroAnswer.svg',
        //   title: 'answers',
        //   imageStyle: 'height: 250px',
        //   bottom: '#000',
        //   description: 'answers',
        //   cardStyle:
        //     'background-image: radial-gradient(circle at top right, #9ac94f, #7eb543); overflow: hidden',
        //   path: `/answerview/${this.test.answersDocId}`,
        // },
      ]

      // if (this.accessLevel == 0) {
      //   bottomCards.push({
      //     image: 'FinalReport.png',
      //     title: 'finalReport',
      //     imageStyle: 'height: 250px',
      //     bottom: '#000',
      //     description: 'finalReport',
      //     cardStyle:
      //       'background-image: radial-gradient(circle at top left,  #ec6618, #f54e42); overflow: hidden',
      //     path: `/finalreportview/${this.test.id}`,
      //   })
      // }

      return bottomCards
    },

    navigator() {
      const items = []

      if (this.test) {
        items.push({ title: 'Manager', icon: 'mdi-home', path: `/cardSorting/managerview/${this.test.id}` })
      }

      if (this.test.template) {
        // items.push({ title: 'Template', icon: 'mdi-file-compare', path: `/templateview/${this.test.template.id}` })
      }

      if (this.accessLevel == 0) {
        items.push(
          { title: 'Test', icon: 'mdi-file-document-edit', path: `/cardSorting/edittest/${this.test.id}` },
          { title: 'Preview', icon: 'mdi-file-eye', path: `/cardSorting/testview/${this.test.id}` },
          // { title: 'Reports', icon: 'mdi-book-multiple', path: `/reportview/${this.test.id}` },
          // { title: 'Answers', icon: 'mdi-order-bool-ascending-variant', path: `/answerview/${this.test.id}` },
          // { title: 'Final Report', icon: 'mdi-file-document', path: `/finalreportview/${this.test.id}` },
          // { title: 'Cooperators', icon: 'mdi-account-group', path: `/cooperators/${this.test.id}` },
          { title: 'Settings', icon: 'mdi-cog', path: `/cardSorting/settingsview/${this.test.id}` },
        )
      }

      if (this.accessLevel == 1) {
        items.push(
          // { title: 'Answer Test', icon: 'mdi-file-document', path: `/testview/${this.test.id}` },
          // { title: 'Reports', icon: 'mdi-book-multiple', path: `/reportview/${this.test.id}` },
          // { title: 'Answers', icon: 'mdi-order-bool-ascending-variant', path: `/answerview/${this.test.id}` },
        )
      }

      return items
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
      if (!item.id) return this.$router.push(item).catch(() => { })
      if (item.id === 2) return window.open(item.path)
      return this.$router.push(item.path).catch(() => { })
    },
  },
}
</script>

<style scoped>
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
</style>