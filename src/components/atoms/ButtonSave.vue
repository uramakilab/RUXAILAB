<template>
  <v-container>
    <!-- Leave Alert Dialog -->
    <LeaveAlert />

    <v-tooltip v-if="visible" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          large
          dark
          fab
          fixed
          bottom
          right
          color="#F9A826"
          :disabled="disabled"
          v-bind="attrs"
          @click="$emit('click')"
          v-on="on"
        >
          <v-icon large>
            mdi-content-save
          </v-icon>
        </v-btn>
      </template>

      <span>{{ $t('buttons.save') }}</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import LeaveAlert from '@/components/atoms/LeaveAlert'

export default {
  components: {
    LeaveAlert,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  beforeMount() {
    window.addEventListener('beforeunload', this.preventNav)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNav)
  },

  methods: {
    preventNav(event) {
      if (!this.visible) return
      event.preventDefault()
    },
  },
}
</script>