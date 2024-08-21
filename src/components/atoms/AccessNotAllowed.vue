<template>
  <div style="height: 100%">
    <v-row justify="center" align="center" style="height:100%">
      <v-col cols="12" md="5">
        <v-img
          src="@/assets/accessNotAllowed.svg"
          contain
          max-height="250"
        />
        <div class="text-center" style="font-size: 50px; color: grey">
          {{ $t('AccessNotAllowed.notAllowed') }}
        </div>
        <div class="text-center" style="font-size: 15px; color: grey">
          {{ $t('AccessNotAllowed.noAccess') }}
        </div>
        <v-row justify="center" class="mt-4">
          <v-btn style="color: #f9a826" outlined rounded @click="goBack()">
            {{ $t('AccessNotAllowed.goHome') }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/testslist')
    },
  },
}
</script>