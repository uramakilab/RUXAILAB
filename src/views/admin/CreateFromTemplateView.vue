<template>
  <div>
    <v-row justify="center">
      <v-col cols="10" class="pt-16">
        <v-row v-if="!searching" align="center">
          <span class="titleText ml-3 mb-2">{{
            $t('pages.createTest.templateTitle')
          }}</span>
          <v-text-field
            v-model="search"
            full-width
            dense
            class="ml-4 mt-6 hidden-sm-and-down"
            :label="$t('Dashboard.search')"
            prepend-inner-icon="mdi-magnify"
            outlined
            color="grey darken-2"
          />
          <v-spacer class="hidden-md-and-up" />
          <v-btn class="mr-3 hidden-md-and-up" icon @click="searching = true">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-row>
        <v-text-field
          v-else
          v-model="search"
          :autofocus="searching"
          dense
          :label="$t('Dashboard.search')"
          prepend-inner-icon="mdi-magnify"
          outlined
          color="grey darken-2"
          @blur="searching = false"
        />
        <v-divider class="mb-1" />
        <List
          type="publicTemplates"
          :items="filteredTemplates"
          @clicked="openTemp"
        />
      </v-col>
    </v-row>
    <TempDialog
      v-if="temp"
      :dialog="dialog"
      :template="temp"
      :allow-create="true"
      @close="dialog = false"
    />
  </div>
</template>

<script>
import List from '@/components/atoms/ListComponent'
import TempDialog from '@/components/molecules/TemplateInfoDialog'

export default {
  components: {
    List,
    TempDialog,
  },

  data: () => ({
    temp: {},
    dialog: false,
    searching: false,
    search: '',
  }),

  computed: {
    templates() {
      return this.$store.state.Templates.templates
    },

    filteredTemplates() {
      if (this.templates !== null) {
        return this.templates.filter((temp) => {
          return temp.header.templateTitle
            .toLowerCase()
            .includes(this.search.toLowerCase())
        })
      }

      return []
    },

    user() {
      return this.$store.getters.user
    },
  },

  watch: {
    dialog() {
      if (!this.dialog) {
        this.temp = {}
        this.selectTemplate = null
      }
    },
  },

  async created() {
    await this.$store.dispatch('getCurrentUserAndPublicTemplates')
  },

  methods: {
    openTemp(item) {
      this.temp = JSON.parse(JSON.stringify(item)) //deep copy
      this.dialog = true
    },
  },
}
</script>

<style scoped>
.titleText {
  font-size: 40px;
  font-weight: 300;
}
.dialog-title {
  font-style: normal;
  font-weight: 300;
  font-size: 34px;
  color: #000000;
}
.card {
  border: 1px solid rgb(201, 201, 201);
  padding: 30px;
  height: 250px;
}
.card-title {
  font-size: 25px;
  color: #f9a826;
  margin: 0px 0px 10px 0px;
}
.card-text-box {
  margin: 0px 0px 0px 30px;
}
.dialog-scroll::-webkit-scrollbar {
  width: 9px;
}
/* Track */
.dialog-scroll::-webkit-scrollbar-track {
  background: none;
}
/* Handle */
.dialog-scroll::-webkit-scrollbar-thumb {
  background: #ffcd86;
  border-radius: 2px;
}
/* Handle on hover */
.dialog-scroll::-webkit-scrollbar-thumb:hover {
  background: #fca326;
}

@media screen and (max-width: 960px) {
  .dialog-title {
    display: flex;
    text-align: center;
    justify-content: center;
  }
  .card-text-box {
    margin: 20px 0px 0px 0px;
  }
  .card {
    height: auto;
  }
}
</style>
