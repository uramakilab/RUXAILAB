<template>
  <div>
    <!-- Create Dialog -->
    <CreateVariable 
      :dialog="dialog"
      title="Card"
      @close="dialog = false"
      @save="save"
    />

    <CardForm
      v-if="cards.length === 0"
      title="Cards"
      subtitle="Cards are items that represent ideas or information in a categorization exercise. Each card must be clear and concise, allowing the person being evaluated to organize them logically within the categories."
    >
      <v-row justify="center">
        <v-col cols="8">
          <CardButton
            icon="mdi-plus-circle"
            text="Add your first Card"
            @click="dialog = true"
          />
        </v-col>
      </v-row>
    </CardForm>

    <Draggable
      v-model="cards"
      class="list-group"
      @start="dragging = true"
      @end="dragging = false"
    >
      <v-card
        v-for="(card, i) in cards"
        :key="i"
        class="cards mb-5"
      >
        <v-col cols="12" class="pb-0 px-5">
          <v-icon style="cursor: pointer;">
            mdi-drag
          </v-icon>
          
          <span class="cardsTitle ml-3">{{ card.title }}</span>
          <br />
          <span class="cardsSubtitle ml-9">{{ card.description }}</span>
          
          <v-icon class="delete-icon" @click="deleteCategory(i)">
            mdi-delete
          </v-icon>
        </v-col>
      </v-card>
    </Draggable>

    <v-row justify="center" v-if="cards.length > 0">
      <v-btn
        fab
        depressed
        dark
        color="rgb(249, 168, 38)"
        @click="dialog = true"
      >
        <v-icon size="35">
          mdi-plus
        </v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import CardButton from '@/components/atoms/CardButton'
import CardForm from '@/components/molecules/CardForm'
import CreateVariable from '@/components/dialogs/CreateVariable'
import Draggable from 'vuedraggable'

export default {
  components: {
    CardButton,
    CardForm,
    CreateVariable,
    Draggable,
  },

  data: () => ({
    cards: [],
    dialog: false,
    dragging: false,
  }),

  computed: {
    test() {
      return this.$store.getters.test
    },

    testStructure() {
      return this.$store.getters.testStructure
    },
  },

  watch: {
    cards (newValue) {
      this.$store.commit('SET_CARD_TEST_STRUCTURE', this.cards)
      this.$store.commit('SET_LOCAL_CHANGES', true)
    },
  },

  created() {
    if (!this.testStructure) {
      this.$store.commit('SET_TEST_STRUCTURE', this.test.testStructure)
    }

    const { cards = [] } = this.testStructure?.cardSorting || {}
    this.cards = cards
  },

  methods: {
    save(item) {
      this.dialog = false
      this.cards.push(item)
    },

    deleteCategory(i) {
      this.cards.splice(i, 1)
    }
  },
}
</script>

<style scoped>
.cards {
  border-radius: 20px;
}

.cardsTitle {
  color: #455a64;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.cardsSubtitle {
  color: #455a64;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.delete-icon {
  position: absolute;
  top: 20px;
  right: 25px;
  cursor: pointer;
}

.v-text-field--outlined >>> fieldset {
  border-radius: 25px;
  border: 1px solid #ffceb2;
}
</style>