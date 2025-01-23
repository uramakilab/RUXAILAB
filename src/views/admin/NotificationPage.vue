<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline">
            {{ $t('common.notifications') }}
            <v-spacer></v-spacer>
            <v-btn color="primary" v-if="activeTab=='unread'" @click="markAllAsRead" :disabled="allRead">
              Mark all as read
            </v-btn>
          </v-card-title>

          <v-tabs v-model="activeTab" background-color="#f3a426" dark>
            <v-tab href="#unread">{{ $t('common.unread') }}</v-tab>
            <v-tab href="#inbox">{{ $t('common.inbox') }}</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item value="unread">
              <v-card-text v-if="unreadNotifications.length > 0">
                <notification-list
                  :notifications="unreadNotifications"
                  @mark-as-read="markAsRead"
                  @go-to-redirect="goToNotificationRedirect"
                />
              </v-card-text>
              <v-card-text v-else>
                <v-alert type="info" outlined>
                    {{ $t('common.noNotifications') }}
                </v-alert>
              </v-card-text>
            </v-tab-item>

            <v-tab-item value="inbox">
              <v-card-text
                v-if="user.inbox && user.inbox.length > 0"
              >
                <notification-list
                  :notifications="user.inbox"
                  @mark-as-read="markAsRead"
                  @go-to-redirect="goToNotificationRedirect"
                />
              </v-card-text>
              <v-card-text v-else>
                <v-alert type="info" outlined>
                    {{ $t('common.noNotifications') }}
                </v-alert>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text @click="goBack">
                {{ $t('buttons.back') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NotificationList from '@/components/molecules/NotificationList.vue'

export default {
  name: 'NotificationPage',
  components: {
    NotificationList,
  },
  data() {
    return {
      activeTab: 'unread',
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    allRead() {
      return this.user.notifications.every((notification) => notification.read)
    },
    unreadNotifications() {
      return this.user.notifications.filter(
        (notification) => !notification.read,
      )
    },
  },
  methods: {
    async goToNotificationRedirect(notification) {
      if (!notification.read) {
        await this.markAsRead(notification)
      }
      window.open(`/${notification.redirectsTo}`)
    },
    async markAsRead(notification) {
      await this.$store.dispatch('markNotificationAsRead', {
        notification: notification,
        user: this.user,
      })
    },
    async markAllAsRead() {
      const unreadNotifications = this.user.notifications.filter((n) => !n.read)
      for (const notification of unreadNotifications) {
        await this.markAsRead(notification)
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    conall(){
        console.log(this.user.inbox[0])

    },
  },
}
</script>
