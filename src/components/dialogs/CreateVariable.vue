<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-card-title class="text-h6 mb-2">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <InputTextEditTest 
          v-model="item.title"
          type="textField"
          :label="$t('UserTestTable.inputs.variableName')"
        />

        <InputTextEditTest 
          v-model="item.description"
          :rows="3"
          label="Variable Description"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn color="red" class="ml-auto" dark @click="$emit('close')">
          <v-icon class="mr-1">
            mdi-close
          </v-icon>
          {{ $t('buttons.close') }}
        </v-btn>
        <v-btn color="orange" dark @click="saveItem">
          <v-icon class="mr-1">
            mdi-content-save
          </v-icon>
          {{ $t('buttons.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import InputTextEditTest from '@/components/atoms/InputTextEditTest'

export default {
  components: {
    InputTextEditTest,
  },

  data: () => ({
    item: {
      title: '',
      description: '',
    },
  }),

  props: {
    title: {
      type: String,
      defualt: false,
      require: true,
    },

    dialog: {
      type: Boolean,
      default: false,
      require: true,
    },
  },

  methods: {
    saveItem() {
      if (this.item.title.trim() === '') return
      this.$emit('save', this.item)
      this.item = { title: '', description: '' }
    },
  },
}
</script>