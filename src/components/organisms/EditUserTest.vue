<template>
  <v-tabs
    v-if="type == 'tabs'"
    background-color="transparent"
    color="#FCA326"
    class="pb-0 mb-0"
  >
    <v-tab @click="tabClicked(0)">
      Consent
    </v-tab>
    <v-tab @click="tabClicked(1)">
      Pre Form
    </v-tab>
    <v-tab @click="tabClicked(2)">
      Tasks
    </v-tab>
    <v-tab @click="tabClicked(3)">
      Post Form
    </v-tab>
  </v-tabs>

  <v-col v-else-if="type == 'content'" cols="12">
    <v-card rounded="xxl" v-if="index == 0" style="background: #f5f7ff">
      <v-card-title class="subtitleView">
        {{ $t('UserTestTable.titles.consentForm') }}
      </v-card-title>

      <v-divider />
      <v-row justify="space-around">
        <v-col cols="8">
          <UserConsent @input="updateData" />
        </v-col>
      </v-row>
    </v-card>

    <v-card rounded="xxl" v-if="index == 1" style="background: #f5f7ff">
      <v-card-title class="subtitleView">
        {{ $t('UserTestTable.titles.userVariables') }}
      </v-card-title>

      <v-divider />
      <v-row justify="space-around">
        <v-col cols="12">
          <UserVariables @input="updateData" />
        </v-col>
      </v-row>
    </v-card>

    <ListTasks
      v-if="index == 2"
      :tasks="object.itemsTasks"
      @input="updateData"
    />

    <v-card rounded="xxl" v-if="index == 3" style="background: #f5f7ff">
      <v-card-title class="subtitleView">
        {{ $t('UserTestTable.titles.postForm') }}
      </v-card-title>

      <v-divider />
      <v-row justify="space-around">
        <v-col cols="12">
          <FormPostTest @input="updateData" />
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import ListTasks from '@/components/molecules/ListTasks'
import FormPostTest from '@/components/atoms/FormPostTest'
import UserVariables from '@/components/atoms/UserVariables'
import UserConsent from '@/components/atoms/UserConsent'

export default {
  components: {
    ListTasks,
    UserVariables,
    UserConsent,
    FormPostTest,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    object: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formData: {
        preTest: [],
        postTest: [],
      },
    }
  },
  computed: {
    testStructure() {
      return this.$store.state.Tests.Test.testStructure
    },
  },
  mounted() {
    if (this.type !== 'content' && this.type != 'tabs') {
      console.error(this.type + ' type in EditUserTest.vue is not valid.')
    }
    if (this.testStructure.postTest) {
      this.$store.dispatch('setPostTest', this.testStructure.postTest)
    }
    if (this.testStructure.preTest) {
      this.$store.dispatch('setPreTest', this.testStructure.preTest)
    }
    if (this.testStructure.consent) {
      this.$store.dispatch('setConsent', this.testStructure.consent)
    }
  },

  methods: {
    tabClicked(index) {
      this.$emit('tabClicked', index)
    },
    updateData(data) {
      if (this.index == 0) {
        this.$store.dispatch('setPreTest', data)
      }
      if (this.index == 2) {
        this.$store.dispatch('setPostTest', data)
      }
    },
  },
}
</script>

<style scoped>
.subtitleView {
  font-style: normal;
  font-weight: 200;
  font-size: 18.1818px;
  align-items: flex-end;
  color: #000000;
  margin-bottom: 4px;
  padding-bottom: 2px;
}
.v-text-field--outlined >>> fieldset {
  border-radius: 25px;
  border: 1px solid #ffceb2;
}
</style>
