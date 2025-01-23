<template>
  <div>
    <!-- Create Dialog -->
    <CreateVariable 
      :dialog="dialog"
      title="Category"
      @close="dialog = false"
      @save="save"
    />

    <CardForm
      v-if="categories.length === 0"
      title="Categories"
      subtitle="Categories are groups or themes used to organize items during card sorting. They must be clear, separated and aligned with the objective of the exercise, helping those evaluated to classify the items in a logical and intuitive way."
    >
      <v-row justify="center">
        <v-col cols="8">
          <CardButton
            icon="mdi-plus-circle"
            text="Add your first Category"
            @click="dialog = true"
          />
        </v-col>
      </v-row>
    </CardForm>

    <Draggable
      v-model="categories"
      class="list-group"
      @start="dragging = true"
      @end="dragging = false"
    >
      <v-card
        v-for="(category, i) in categories"
        :key="i"
        class="cards mb-5"
      >
        <v-col cols="12" class="pb-0 px-5">
          <v-icon style="cursor: pointer;">
            mdi-drag
          </v-icon>
          
          <span class="cardsTitle ml-3">{{ category.title }}</span>
          <br />
          <span class="cardsSubtitle ml-9">{{ category.description }}</span>
          
          <v-icon class="delete-icon" @click="deleteCategory(i)">
            mdi-delete
          </v-icon>
        </v-col>
      </v-card>
    </Draggable>

    <v-row justify="center" v-if="categories.length > 0">
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
    categories: [],
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
    categories (newValue) {
      this.$store.commit('SET_CATEGORIES_TEST_STRUCTURE', this.categories)
      this.$store.commit('SET_LOCAL_CHANGES', true)
    }
  },

  created() {
    if (!this.testStructure) {
      this.$store.commit('SET_TEST_STRUCTURE', this.test.testStructure)
    }

    const { categories = [] } = this.testStructure?.cardSorting || {}
    this.categories = categories
  },

  methods: {
    save(item) {
      this.dialog = false
      this.categories.push(item)
    },

    deleteCategory(i) {
      this.categories.splice(i, 1)
    },

    onChange() {
      this.$store.commit('SET_CATEGORIES_TEST_STRUCTURE', this.categories)
      this.$store.commit('SET_LOCAL_CHANGES', true)
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
</style>