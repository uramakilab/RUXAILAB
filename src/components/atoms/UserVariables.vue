<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <v-expansion-panels
          v-if="items.length > 0"
          style="z-index: auto; border-radius: 20px; border: 1px solid rgba(249, 152, 38, 0.49);"
        >
          <v-expansion-panel
            v-for="(item, i) in items"
            :key="i"
            style="border-radius: 20px;"
          >
            <v-expansion-panel-header>
              {{ items[i].title }}
            </v-expansion-panel-header>
            
            <v-expansion-panel-content>
              <v-form>
                <v-text-field
                  v-model="items[i].description"
                  label="Description"
                  @click:append="log"
                />
                <div>
                  <v-text-field
                    v-for="(field, index) in items[i].selectionFields"
                    :key="index"
                    v-model="items[i].selectionFields[index]"
                    :label="$t('UserTestTable.inputs.selection')"
                    @change="saveState()"
                  >
                    <template v-slot:append>
                      <v-icon @click="newSelection(i)">
                        mdi-plus
                      </v-icon>
                      <v-icon @click="deleteSelection(i)">
                        mdi-trash-can
                      </v-icon>
                    </template>
                  </v-text-field>
                  <div
                    v-if="
                      items[i].selectionField &&
                        items[i].selectionFields.length === 0
                    "
                  >
                    <p>
                      Add first option<v-icon
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
                    v-model="items[i].selectionField"
                    :label="$t('UserTestTable.checkboxes.selectionField')"
                    @change="saveState"
                    @click="selectField(i)"
                  />
                </v-col>
                <v-col cols="5">
                  <v-checkbox
                    v-model="items[i].textField"
                    :label="$t('UserTestTable.checkboxes.textField')"
                    @click="selectText(i)"
                  />
                </v-col>
                <v-col>
                  <v-btn class="mt-5" icon @click="deleteItem(i)">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        
        <v-card
          class="mt-2"
          rounded="xl"
          outlined
          elevation="0"
          color="grey lighten-2"
          @click="showModal"
        >
          <p class="text-subtitle-1 text-center ma-2">
            <v-icon>mdi-plus-circle</v-icon>
            {{ $t('UserTestTable.buttons.createNewVariable') }}
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="show" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h6 mb-2">
          {{
            $t('UserTestTable.buttons.createNewVariable')
          }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newItem"
              filled
              :rules="[(newItem) => !!newItem || 'This Name field is required']"
              color="orange"
              :label="$t('UserTestTable.inputs.variableName')"
              @change="saveState"
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-btn color="red" class="ml-auto" dark @click="closeModal">
            <v-icon class="mr-1">
              mdi-close
            </v-icon>
            {{ $t('buttons.close') }}
          </v-btn>
          <v-btn color="orange" dark @click="saveNewItem(), saveState()">
            <v-icon class="mr-1">
              mdi-content-save
            </v-icon>
            {{ $t('buttons.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    newItem: '',
    items: [],
    show: false,
    valid: false,
  }),
  computed: {
    test() {
      return this.$store.getters.test
    },
    preTest() {
      return this.$store.getters.preTest
    },
  },
  mounted() {
    this.getVariables()
  },
  methods: {
    log() {
      console.log('adicionar + 1')
    },
    showModal() {
      this.show = true
    },
    closeModal() {
      this.show = false
      this.$refs.form.resetValidation()
    },
    selectField(i) {
      if (
        this.items[i].selectionFields.length == 0 &&
        this.items[i].selectionField
      ) {
        this.items[i].selectionFields.push('')
      }
      if (this.items[i].selectionField == false) {
        this.items[i].selectionFields = []
      }
      this.items[i].textField = false
    },
    selectText(i) {
      if (this.items[i].selectionFields.length > 0) {
        this.items[i].selectionFields = []
      }
      this.items[i].selectionField = false
    },
    deleteItem(i) {
      this.items.splice(i, 1)
    },
    saveNewItem() {
      if (this.newItem.trim() !== '') {
        this.items.push({
          answer: '',
          title: this.newItem,
          description: '',
          selectionFields: [],
          selectionField: false,
          textField: true,
        })
        this.newItem = ''
        this.show = false
        this.$refs.form.resetValidation()
      } else {
        this.$refs.form.validate()
      }
    },
    newSelection(index) {
      this.$set(this.items, index, {
        ...this.items[index],
        selectionFields: [...this.items[index].selectionFields, ''],
      })
    },
    deleteSelection(index) {
      this.items[index].selectionFields.splice(
        this.items[index].selectionFields.length - 1,
        1,
      )
    },
    saveState() {
      this.$store.dispatch('setPreTest', this.items)
    },
    getVariables() {
      if (this.test.testStructure.preTest) {
        this.items = this.test.testStructure.preTest
      } else if (this.preTest) {
        this.items = this.preTest
      }
    },
  },
}
</script>

<style>
</style>
