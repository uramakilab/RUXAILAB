<template>
  <v-row justify="center" justify-md="space-around">
    <v-col v-for="(item, n) in cards" :key="n" cols="12" :md="12 / perRow">
      <v-card
        class="rounded-xl cards-animation"
        height="270px"
        :style="item.cardStyle"
        :ripple="false"
        color="#F2F3F4"
        @click="$emit('click', item.path)"
      >
        <v-row style="height: 200px" justify="center" align="center">
          <v-img
            max-height="150"
            :style="item.imageStyle"
            contain
            :src="require('../../assets/manager/' + item.image)"
          />
        </v-row>

        <div
          class="white--text pl-4 footer"
          :style="{ 'background-color': item.bottom }"
        >
          <h2>{{ $t(`titles.${item.title}`) }}</h2>

          <div>
            {{ $t(`descriptions.${item.description}`) }}
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      default: () => ([]),
      require: true,
    },

    perRow: {
      type: Number,
      default: 0,
      require: true,
    },
  },
}
</script>

<style>
.footer {
  height: 90px;
  position: absolute;
  bottom: 0;
  width: 100%;
  /* background-color: item.bottom; */
  padding-top: 10px;
  border-top: .3px solid #505050;
}

.cards-animation {
  box-shadow: 0;
  transition: box-shadow 0.5s;
}

.cards-animation:hover {
  box-shadow: 0px 0px 35px 2px rgba(0, 0, 0, 0.7) !important;
}
</style>