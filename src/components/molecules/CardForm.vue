<template>
  <v-card class="cards">
    <v-col cols="12">
      <p class="cardsTitle ml-3">{{ title }}</p>
      <p class="cardsSubtitle ml-3">{{ subtitle }}</p>
      <slot></slot>
    </v-col>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      defualt: '',
      require: true,
    },

    subtitle: {
      type: String,
      defualt: '',
      require: false ,
    },
  },
}
</script>

<style scoped>
.cards {
  border-radius: 20px;
}

.cardsTitle {
  font-size: 18px;
  font-weight: 600;
}

.cardsSubtitle {
  color: #455a64;
  font-size: 15px;
  font-weight: 400;
}
</style>