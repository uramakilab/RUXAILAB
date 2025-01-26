<template>
  <v-list two-line>
    <template v-for="(notification, index) in notifications">
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
          <v-list-item-subtitle
            class="text-caption grey--text text--darken-1 mt-1"
          >
            At: {{ formatFrontendDate(notification.createdDate) }}
          </v-list-item-subtitle>

          <!-- Notification read date (conditional) -->
          <v-list-item-subtitle
            v-if="notification.readAt"
            class="text-caption success--text mt-1"
          >
            Seen: {{ formatFrontendDate(notification.readAt) }}
          </v-list-item-subtitle>
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
        :key="`divider-${index}`"
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
  methods: {
    formatFrontendDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString() // Format the date in a human-readable way
    },
  },
}
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
