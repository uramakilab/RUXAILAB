<template>
  <v-container>
    <!-- Delete Alert Dialog -->
    <v-dialog v-model="dialogDel" width="80%">
      <v-card>
        <v-card-title class="headline error white--text" primary-title>
          {{ $t('alerts.deleteTest') }}
        </v-card-title>

        <v-card-text>{{ dialogText }}</v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn class="grey lighten-3" text @click="dialogDel = false">
            {{ $t('buttons.cancel') }}
          </v-btn>

          <v-btn
            class="red white--text ml-1"
            :loading="loading"
            @click="deleteTest(object)"
          >
            {{ $t('buttons.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Template Dialog -->
    <v-dialog v-model="tempDialog" max-width="80%">
      <v-card>
        <p class="pa-2">
          Create Template
        </p>

        <v-divider />

        <v-form ref="tempform" class="px-5">
          <v-row justify="space-around" class="pa-2">
            <v-col cols="12">
              <v-text-field
                v-model="template.title"
                autofocus
                label="Title"
                :rules="titleRequired"
                counter="200"
                outlined
                dense
                @input="$emit('change')"
              />

              <v-textarea
                v-model="template.description"
                label="Description"
                outlined
                dense
                @input="$emit('change')"
              />

              <v-checkbox
                v-model="template.isPublic"
                label="Make template public to all users"
                color="#F9A826"
              />
            </v-col>
          </v-row>

          <v-divider />

          <v-card-actions>
            <v-spacer />

            <v-btn class="error" @click="closeTemplateDialog">
              {{ $t('buttons.cancel') }}
            </v-btn>

            <v-btn
              :disabled="hasTemplate ? true : false"
              class="success"
              @click="createTemplate"
            >
              {{ $t('buttons.create') }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <ShowInfo :title="$t('pages.settings.title')">
      <div slot="content">
        <v-card>
          <v-col class="mb-1 pa-4 pb-1">
            <p class="mb-0">
              {{ $t('pages.settings.currentTest') }}
            </p>
          </v-col>

          <v-divider />

          <FormTestDescription
            v-if="object"
            :test="object"
            :lock="true"
            @valForm="validate"
            @change="change = true"
          />

          <v-row justify="space-around" class="mx-4 mb-3">
            <v-spacer />

            <v-btn
              style="margin-right: 25px"
              outlined
              color="green"
              :disabled="hasTemplate"
              @click="tempDialog = true"
            >
              {{ $t('pages.settings.createTemplate') }}
            </v-btn>

            <v-btn class="mr-5" outlined color="green" @click="duplicateTest">
              Duplicate test
            </v-btn>
          </v-row>

          <v-divider class="my-3 mx-2" />

          <v-row justify="center" class="mt-3">
            <v-btn
              color="#f26363"
              class="white--text mb-4"
              style="justify-self: center"
              @click="dialogDel = true"
            >
              <v-icon left>
                mdi-trash-can-outline
              </v-icon>
              {{ $t('pages.settings.deleteTest') }}
            </v-btn>
          </v-row>
        </v-card>

        <ButtonSave
          :visible="change"
          @click="save"
        />
      </div>
    </ShowInfo>
  </v-container>
</template>

<script>
import ButtonSave from '@/components/atoms/ButtonSave'
import ShowInfo from '@/components/organisms/ShowInfo'
import FormTestDescription from '@/components/atoms/FormTestDescription'
import Test from '@/models/Test'
import TemplateHeader from '@/models/TemplateHeader'
import TemplateAuthor from '@/models/TemplateAuthor'
import TemplateBody from '@/models/TemplateBody'
import Template from '@/models/Template'
import i18n from '@/i18n'

export default {
  components: {
    ButtonSave,
    ShowInfo,
    FormTestDescription,
  },

  data: () => ({
    template: {
      title: '',
      description: '',
      isPublic: false,
    },
    loading: false,
    object: null,
    valids: [false, true, true],
    dialogDel: false,
    tempDialog: false,
    titleRequired: [
      (v) => !!v.trim() || i18n.t('errors.fieldRequired'),
      (v) => v.length <= 200 || 'Max 200 characters',
    ],
  }),

  computed: {
    change() {
      return this.$store.state.localChanges
    },

    user() {
      return this.$store.getters.user
    },

    test() {
      return this.$store.getters.test
    },

    testAnswerDocument() {
      return this.$store.state.Answer.testAnswerDocument
    },

    hasTemplate() {
      return this.object?.template !== null
    },

    dialogText() {
      if (this.test) return `Are you sure you want to delete your test "${this.test.testTitle}"? This action can't be undone.`
      return 'Are you sure you want to delete this test? This action can\'t be undone' //in case object isnt loaded
    },
  },

  created() {
    this.object = { ...this.test }
  },

  methods: {
    validate(valid, index) {
      this.valids[index] = valid
    },

    async createTemplate() {
      const templateHeader = new TemplateHeader({
        creationDate: Date.now(),
        updateDate: Date.now(),
        isTemplatePublic: this.template.isPublic,
        templateDescription: this.template.description,
        templateTitle: this.template.title,
        templateType: this.test.testType,
        templateVersion: '1.0.0',
        templateAuthor: new TemplateAuthor({
          userEmail: this.test.testAdmin.email,
          userDocId: this.test.testAdmin.userDocId,
        }),
      })

      const template = new Template({
        id: null,
        header: templateHeader,
        body: new TemplateBody(this.test),
      })

      await this.$store.dispatch('createTemplate', template)
      this.closeTemplateDialog()
    },

    async duplicateTest() {
      const test = new Test({
        ...this.test,
        id: null,
        testTitle: 'Copy of ' + this.test.testTitle,
        userTestStatus: {},
        id: null,
        creationDate: Date.now(),
        updateDate: Date.now(),
      })

      await this.$store.dispatch('duplicateTest', {
        test: test,
        answer: this.testAnswerDocument,
      })

      this.$router.push('/testslist')
    },

    async deleteTest(item) {
      const auxUser = { ...this.user } // Create a copy of user object
      delete auxUser.myTests[item.id] // Remove the test with the given ID from auxUser.myTests

      await this.$store.dispatch('deleteTest', { ...item, auxUser })
      this.$router.push('/testslist')
    },

    async save() {
      const element = this.object.testTitle
      if (element.length >= 200) return this.$toast.warning('Title must not exceed 200 characters.')
      if (element.length < 0) return this.$toast.warning('Test must contain a title.')

      await this.$store.dispatch('updateTest', new Test(this.object))
      this.$store.commit('SET_LOCAL_CHANGES', false)
      this.$toast.success('Changes Saved')
    },

    closeTemplateDialog() {
      this.tempDialog = false
      this.$refs.tempform.resetValidation()
      this.template.title = ''
      this.template.description = ''
    },
  },

  beforeRouteLeave(to, from, next) {
    if (!this.$store.getters.localChanges) return next()

    this.$store.commit('SET_DIALOG_LEAVE', true)
    this.$store.commit('SET_PATH_TO', to.name)
  },
}
</script>