<template>
  <v-container>
    <!-- Create Dialog -->
    <CreateVariable 
      :dialog="dialog"
      :title="$t('UserTestTable.buttons.createNewVariable')"
      @close="dialog = false"
      @save="saveNewItem"
    />

    <v-row justify="center">
      <v-col cols="10">
        <v-expansion-panels
          v-if="items.length > 0"
          style="z-index: auto; border-radius: 20px; border: 1px solid rgba(249, 152, 38, 0.49);"
        >
          <v-expansion-panel
            v-for="(item, i) of items"
            :key="i"
            class="mb-1"
            style="border-radius: 20px;"
          >
            <v-expansion-panel-header>
              {{ item.title }}
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-form>
                <v-text-field
                  v-model="item.description"
                  label="Description"
                />

                <div>
                  <v-text-field
                    v-for="(field, index) of item.selectionFields"
                    :key="index"
                    v-model="item.selectionFields[index]"
                    :label="$t('UserTestTable.inputs.selection')"
                  >
                    <template v-slot:append>
                      <v-icon @click="deleteSelection(item, index)">
                        mdi-trash-can
                      </v-icon>
                    </template>
                  </v-text-field>
                  
                  <div v-if="item.selectionField">
                    <p>
                      Add Option
                      <v-icon
                        class="ml-1"
                        @click="newSelection(i)"
                      >
                        mdi-plus
                      </v-icon>
                    </p>
                  </div>
                </div>
              </v-form>

              <v-row>
                <v-col cols="6">
                  <v-checkbox
                    v-model="item.selectionField"
                    :label="$t('UserTestTable.checkboxes.selectionField')"
                    @click="selectField(item)"
                  />
                </v-col>

                <v-col cols="6">
                  <v-btn class="mt-4" icon @click="deleteItem(i)">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <CardButton
          icon="mdi-plus-circle"
          :text="$t('UserTestTable.buttons.createNewVariable')"
          @click=";dialog = true, $store.commit('SET_LOCAL_CHANGES', true)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CardButton from '@/components/atoms/CardButton'
import CreateVariable from '@/components/dialogs/CreateVariable'

export default {
  components: {
    CardButton,
    CreateVariable,
  },

  data: () => ({
    items: [],
    dialog: false,
  }),

  methods: {
    saveNewItem(item) {
      this.dialog = false
      
      this.items.push({
        answer: '',
        title: item.title,
        description: item.description,
        selectionFields: [],
        selectionField: false,
        textField: true,
      })
    },

    selectField(item) {
      item.textField = !item.selectionField
      if (item.textField) item.selectionFields = []
    },

    deleteItem(i) {
      this.items.splice(i, 1)
    },

    newSelection(index) {
      this.$set(this.items, index, {
        ...this.items[index],
        selectionFields: [...this.items[index].selectionFields, ''],
      })
    },

    deleteSelection(item, selectionIndex) {
      item.selectionFields.splice(selectionIndex, 1)
    },
  },
}
</script>