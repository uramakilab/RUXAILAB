<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12">
        <!-- <h1>{{ $t('titles.drawer.' + title) }}</h1> -->
        <h1>{{ title }}</h1>
        <v-divider />
      </v-col>
      <slot name="top" />
    </v-row>
    <slot name="warning" />
    <v-row justify="center" class="ma-0">
      <v-col cols="12">
        <v-card flat rounded="xl" class="dataCard ma-0 pa-0">
          <slot name="content" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
h1 {
  font-style: normal;
  font-weight: 300;
  display: flex;
  align-items: center;
  color: #000000;
}
.subtitleView {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}
.dataCard {
  background: #f5f7ff;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}
</style>
