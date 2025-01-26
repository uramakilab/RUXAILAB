<template>
  <div v-if="user.notifications">
    <v-menu :position-x="x" :position-y="y" absolute offset-y min-width="300">
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          color="red"
          bottom
          overlap
          :content="checkIfHasNewNotifications()"
          :value="checkIfHasNewNotifications()"
        >
          <v-btn
            v-if="checkIfHasNewNotifications() === 0"
            small
            icon
            class="mr-1"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20">
              mdi-bell-outline
            </v-icon>
          </v-btn>

          <v-btn v-else small icon v-bind="attrs" class="mr-1" v-on="on">
            <v-icon size="20">
              mdi-bell-ring
            </v-icon>
          </v-btn>
        </v-badge>
      </template>
      
      <!--  navigation bar -->
      <v-card>
        <v-app-bar
          color="primary"
          dark
          dense
        >
          <v-toolbar-title> {{ $t('common.notifications') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="goToNotificationPage"
          >
            View All
          </v-btn>
        </v-app-bar>

        <v-card-text>
          <div
            v-if="user.notifications.length > 0"
            style="max-height: 50vh; overflow-y: auto;"
          >
            <v-list
              v-for="(notification, i) in user.notifications"
              :key="i"
              dense
              class="ma-0 py-1"
            >
              <v-list-item
                dense
                style="font-size: 14px; font-family: Roboto;"
                class="px-2"
                :disabled="notification.read"
                @click="goToNotificationRedirect(notification)"
              >
                <v-list-item-content>
                  <v-list-item-title style="font-weight: bold">
                    {{ notification.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ notification.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Sent by {{ notification.author }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon v-if="!notification.read">
                  <v-chip x-small color="success" outlined label>
                    NEW!
                  </v-chip>
                </v-list-item-icon>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
          </div>
          <v-list v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-center grey--text">
                  <strong>{{ $t('common.noNotifications') }}</strong>
                </v-list-item-title>
                <v-list-item-subtitle class="text-center">
                  <v-icon class="mt-2 mb-3">
                    mdi-bell-off
                  </v-icon>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    x: 0,
    y: 50,
  }),
  computed: {
    user() {
      return this.$store.getters.user
    },
    test() {
      return this.$store.getters.test
    },
  },
  methods: {
    async goToNotificationRedirect(notification) {
      await this.$store.dispatch('markNotificationAsRead', {
        notification: notification,
        user: this.user,
      })
      window.open(`/${notification.redirectsTo}`)
    },
    checkIfHasNewNotifications() {
      const newNot = this.user.notifications.filter((n) => n.read === false)
      return newNot.length ?? 0
    },
    goToNotificationPage() {
      this.$router.push('/notifications')
      console.log("Navigating to notifications page")
    },
  },
}
</script>

<style scoped>
/* You can remove this style block as we're using Vuetify's built-in dividers now */
</style>