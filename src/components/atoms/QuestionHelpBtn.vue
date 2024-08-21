<template>
  <div>
    <v-tooltip v-if="question.descriptions.length > 0" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon>
          <v-icon v-bind="attrs" v-on="on" @click="dialog = true">
            mdi-help-circle-outline
          </v-icon>
        </v-btn>
      </template>
      <span>{{ $t('buttons.help') }}</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="85%">
      <v-card>
        <div style="display: flex; justify-content: flex-end">
          <v-btn small icon class="ma-1" @click="dialog = false">
            <v-icon color="error">
              mdi-close
            </v-icon>
          </v-btn>
        </div>
        <div class="titleView pl-2 pb-2">
          {{ question.title }}
        </div>

        <div v-for="(description, i) in question.descriptions" :key="i">
          <div class="subtitleView mx-4 mb-1 mt-5">
            {{ description.title }}
          </div>
          <TextBox
            class="mx-4"
            :text="description.text"
            :editable="false"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TextBox from '@/components/atoms/TextBox'

export default {
  components: {
    TextBox,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {},
}
</script>

<style scoped>
.titleView {
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 1.3em;
}
.subtitleView {
  font-style: normal;
  font-size: 18.1818px;
  line-height: 1.3em;
  color: rgb(133, 133, 133);
}
</style>