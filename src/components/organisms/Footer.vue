<template>
  <v-footer dark padless>
    <v-card
      flat
      tile
      class="gray lighten-3 white--text text-center"
      style="width:100%"
    >
      <v-card-text class="white--text py-1">
        {{ $t('pages.landing.footer') }}
        <a @click="sendTo('mailto:ruxailab@gmail.com')">ruxailab@gmail.com</a>
      </v-card-text>

      <v-divider />

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} —
        <strong>RUXAILAB</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      { icon: 'mdi-facebook', linkTo: 'https://www.facebook.com' },
      { icon: 'mdi-twitter', linkTo: 'https://www.twitter.com' },
      { icon: 'mdi-instagram', linkTo: 'https://www.instagram.com/lgfacens/' },
    ],
  }),
  methods: {
    sendTo(link) {
      window.open(link)
    },
  },
}
</script>
