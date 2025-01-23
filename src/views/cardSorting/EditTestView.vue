<template>
  <v-container>
    <ButtonSave :visible="change" @click="save" />
    
    <v-row>
      <v-tabs
        v-model="tabIndex"
        background-color="transparent"
        color="#FCA326"
        class="pb-0 mb-0"
      >
        <v-tab>PRE-TEST</v-tab>
        <v-tab>CATEGORIES</v-tab>
        <v-tab>CARDS</v-tab>
        <v-tab>POST-TEST</v-tab>
        <!-- <v-tab>SETTINGS</v-tab> -->
      </v-tabs>

      <v-col cols="12">
        <!-- PRE-TEST -->
        <PreTestEditCardSorting v-if="tabIndex === 0" />

        <!-- CATEGORIES -->
        <CategoriesEditCardSorting v-else-if="tabIndex === 1" />

        <!-- CARDS -->
        <CardsEditCardSorting v-else-if="tabIndex === 2" />

        <!-- POST-TEST -->
        <PostTestEditCardSorting v-else-if="tabIndex === 3" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ButtonSave from '@/components/atoms/ButtonSave'
import PreTestEditCardSorting from '@/components/organisms/PreTestEditCardSorting'
import CardsEditCardSorting from '@/components/organisms/CardsEditCardSorting'
import CategoriesEditCardSorting from '@/components/organisms/CategoriesEditCardSorting'
import PostTestEditCardSorting from '@/components/organisms/PostTestEditCardSorting'

export default {
  components: {
    ButtonSave,
    PreTestEditCardSorting,
    CardsEditCardSorting,
    CategoriesEditCardSorting,
    PostTestEditCardSorting,
  },

  data: () => ({
    tabIndex: 0,
  }),

  computed: {
    change() {
      return this.$store.state.localChanges
    },

    test() {
      return this.$store.getters.test
    },

    testStructure() {
      return this.$store.getters.testStructure
    },
  },

  methods: {
    async save() {
      this.$store.commit('SET_LOCAL_CHANGES', false)
      const newTest = Object.assign(this.test, { testStructure: this.testStructure })
      await this.$store.dispatch('updateTest', newTest)
    },
  },
}
</script>