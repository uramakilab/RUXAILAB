<template>
  <v-app-bar app dark dense>
    <v-btn
      v-if="user"
      icon
      dark
      class="hidden-md-and-up"
      @click.stop="drawer = !drawer"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-icon left class="hidden-sm-and-down" @click="goTo('/testslist')">
      mdi-alpha-r-circle
    </v-icon>

    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      app
      absolute
      temporary
      class="hidden-md-and-up"
    >
      <v-row align="center" class="ma-0" justify="center">
        <v-list-item-avatar>
          <v-icon large dark>
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>

        <v-col>
          <v-list-item-content v-if="user">
            <v-list-item-title>{{ $t('buttons.username') }}</v-list-item-title>
            <div class="caption">
              {{ user.email }}
            </div>
          </v-list-item-content>
        </v-col>
      </v-row>

      <v-divider />

      <!-- Landing Page Options -->
      <v-list v-if="this.$route.path === '/' && user" dense dark>
        <v-list-item link @click="goTo('/testslist')">
          <v-list-item-icon>
            <v-icon>mdi-console</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t('buttons.goToConsole') }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Manager Options -->
      <v-list v-if="isManager && test" dense dark>
        <v-list-item-group v-model="item">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            link
            @click="goTo(item.path)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <div class="footer">
        <v-btn
          dark
          text
          style="text-transform: none !important; font: Roboto; font-size: 17px"
          @click.stop="signOut()"
        >
          {{ $t('buttons.signout') }}
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-toolbar-title
      v-if="this.$route.path != '/help'"
      style="cursor: pointer"
      @click="goTo('/testslist')"
    >
      Remote Testing Lab
    </v-toolbar-title>
    <v-toolbar-title v-else style="cursor: pointer" @click="goTo('/testslist')">
      Help Center
    </v-toolbar-title>

    <v-spacer />

    <locale-changer />

    <!-- Go to console Desktop -->
    <v-btn
      v-if="this.$route.path === '/' && user"
      text
      color="#f9a826"
      class="console-button mx-1 hidden-sm-and-down"
      @click="goTo('/testslist')"
    >
      {{ $t('buttons.goToConsole') }}
    </v-btn>

    <v-btn
      v-if="
        this.$route.path == '/testslist' ||
          this.$route.path == '/signin' ||
          this.$route.path == '/signup'
      "
      text
      color="#f9a826"
      class="console-button mx-1 hidden-sm-and-down"
      @click="goTo('/')"
    >
      {{ $t('AccessNotAllowed.goHome') }}
    </v-btn>

    <v-btn
      v-if="
        this.$route.path !== '/' &&
          this.$route.path !== '/testslist' &&
          this.$route.path !== '/signin' &&
          this.$route.path !== '/signup'
      "
      text
      color="#f9a826"
      class="console-button mx-1 hidden-sm-and-down"
      @click="goTo('/testslist')"
    >
      {{ $t('buttons.returnToConsole') }}
    </v-btn>

    <HelpButton class="mx-2" />
    <NotificationBtn v-if="user" class="mx-2" />

    <!-- Sign-in Desktop -->
    <v-btn
      v-if="!user"
      text
      class="hidden-sm-and-down"
      @click="goTo('/signin')"
    >
      <v-icon left>
        mdi-lock
      </v-icon>
      {{ $t('SIGNIN.sign-in') }}
    </v-btn>

    <!-- Sign-in Mobile -->
    <v-btn v-if="!user" icon class="hidden-md-and-up" @click="goTo('/signin')">
      <v-icon size="20">
        mdi-lock
      </v-icon>
    </v-btn>

    <!-- Profile Button Desktop -->
    <div class="hidden-sm-and-down">
      <v-menu
        v-if="user"
        v-model="menu"
        offset-y
        min-width="200"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            class="pa-0 btn-fix"
            v-on="on"
            @click="menu = !menu"
          >
            <v-icon class="mr-1" dark>
              mdi-account-circle
            </v-icon>
            <v-icon small>
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <v-list dense class="ma-0 py-1" style="border-radius: 0px !important">
          <v-list-item dense style="font-size: 14px; font: Roboto" class="px-2">
            <v-list-item-content>
              <v-list-item-title style="font-weight: bold">
                {{ $t('buttons.username') }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <div class="divider" />

          <v-list-item
            dense
            style="font-size: 14px; font: Roboto"
            class="px-2"
            @click="signOut(), (menu = false)"
          >
            {{ $t('buttons.signout') }}
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import LocaleChanger from '@/components/atoms/LocaleChanger.vue'
import NotificationBtn from '../atoms/NotificationButton.vue'
import HelpButton from '../atoms/HelpButton.vue'

export default {
  components: {
    NotificationBtn,
    LocaleChanger,
    HelpButton,
  },
  data: () => ({
    drawer: false,
    menu: false,
    item: 0,
    isManager: false,
  }),
  computed: {
    user() {
      return this.$store.getters.user
    },
    test() {
      return this.$store.state.Tests.Test
    },
    items() {
      let items
      if (this.test) {
        items = [
          {
            title: 'Manager',
            icon: 'mdi-home',
            path: `/managerview/${this.test.id}`,
            id: 0,
          },
        ]

        if (this.accessLevel <= 2) {
          if (this.accessLevel == 0) {
            items.push(
              {
                title: 'Test',
                icon: 'mdi-file-document-edit',
                path: `/edittest/${this.test.id}`,
                id: 1,
              },
              {
                title: 'Preview',
                icon: 'mdi-file-eye',
                path: `/testview/${this.test.id}`,
                id: 2,
              },
            )
          } else if (this.accessLevel == 1) {
            items.push({
              title: 'Answer Test',
              icon: 'mdi-file-document',
              path: `/testview/${this.test.id}`,
              id: 1,
            })
          }
        }
        if (this.accessLevel == 0) {
          items.push(
            {
              title: 'Reports',
              icon: 'mdi-book-multiple',
              path: `/reportview/${this.test.id}`,
              id: 3,
            },
            {
              title: 'Answers',
              icon: 'mdi-order-bool-ascending-variant',
              path: `/answerview/${this.test.id}`,
              id: 4,
            },
          )
        } else if (this.accessLevel == 1) {
          items.push(
            {
              title: 'Reports',
              icon: 'mdi-book-multiple',
              path: `/reportview/${this.test.id}`,
              id: 2,
            },
            {
              title: 'Answers',
              icon: 'mdi-order-bool-ascending-variant',
              path: `/answerview/${this.test.id}`,
              id: 3,
            },
          )
        }
        if (this.accessLevel == 0) {
          items.push(
            {
              title: 'Final Report',
              icon: 'mdi-file-document',
              path: `/finalreportview/${this.test.id}`,
              id: 5,
            },
            {
              title: 'Cooperators',
              icon: 'mdi-account-group',
              path: `/cooperators/${this.test.id}`,
              id: 6,
            },
          )
        }

        if (this.test.template) {
          items.push({
            title: 'Template',
            icon: 'mdi-file-compare',
            path: `/templateview/${this.test.template.id}`,
            id: 7,
          })
        }
      }

      return items
    },
    accessLevel() {
      // If the user is a superadmin
      if (this.user) {
        if (this.user.accessLevel == 0) return 0
        // Check if the user is a collaborator or owner
        const isTestOwner = this.test.testAdmin?.userDocId === this.user.id
        if (isTestOwner) return 0

        const answers = []
        const answersEntries = Object.entries(this.user.myAnswers)
        answersEntries.forEach((answer) => {
          answers.push(answer[1])
        })
        if (this.test.cooperators) {
          const coopsInfo = this.test.cooperators.find(
            (coops) => coops.userDocId === this.user.id,
          )
          if (coopsInfo) {
            return coopsInfo.accessLevel
          }
        }
        if (this.test.isPublic) return 1
        else return 2
      }
      return 1
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        const parentRoute = to.matched[0]
        if (parentRoute) {
          if (parentRoute.name === 'ManagerView') this.isManager = true
          else this.isManager = false
        }
      },
    },
  },
  methods: {
    goTo(route) {
      if (route.includes('/testview')) window.open(route)
      else {
        this.$router
          .push(route)
          .catch(() => {})
          .catch(() => {})
      }
    },
    async signOut() {
      this.$store.dispatch('logout').then(() => {
        this.$router
          .push('/')
          .catch(() => {})
          .catch(() => {})
      })
    },
  },
}
</script>

<style scoped>
.console-button {
  font-size: 13px;
  font: Roboto;
  text-transform: none !important;
  padding: 7px !important;
}
.footer {
  background-color: transparent;
  height: 8%;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;

  position: absolute;
  bottom: 0px;
}
.divider {
  background: #c4c4c4 !important;
  height: 1.5px;
}
.btn-fix:focus::before {
  opacity: 0 !important;
}
</style>
