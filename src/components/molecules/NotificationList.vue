<template>
  <v-list two-line>
    <template v-for="(notification, index) in formattedNotifications">
      <v-list-item
        :key="notification.id"
        @click="$emit('go-to-redirect', notification)"
      >
        <v-list-item-content>
          <v-list-item-title
            :class="{ 'font-weight-bold': !notification.read }"
          >
            {{ notification.title }}
            <v-chip
              v-if="!notification.read"
              x-small
              color="success"
              class="ml-2"
              outlined
            >
              NEW!
            </v-chip>
          </v-list-item-title>
          <v-list-item-subtitle>{{
            notification.description
          }}</v-list-item-subtitle>
          <v-list-item-subtitle
            >Sent by {{ notification.author }}</v-list-item-subtitle
          >
          <v-list-item-subtitle>{{
            notification.createdDate
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click.stop="$emit('mark-as-read', notification)">
            <v-icon>{{
              notification.read ? 'mdi-email-open' : 'mdi-email'
            }}</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider
        v-if="index < notifications.length - 1"
        :key="`divider-${notification.id}`"
      ></v-divider>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'NotificationList',
  props: {
    notifications: {
      type: Array,
      required: true,
    },
  },
  computed: {
    formattedNotifications() {
      return this.notifications.map((notification) => ({
        ...notification,
        createdDate: this.formatDate(notification.createdDate), // Convert date
      }))
    },
  },
  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString()
    },
  },
}
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
