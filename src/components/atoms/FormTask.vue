<template>
  <v-form ref="form">
    <v-row justify="space-around">
      <v-col class="mt-4" cols="5">
        <v-text-field
          v-model="task.taskName"
          :label="$t('common.name')"
          :rules="requiredRule"
          outlined
          dense
        />
        <v-textarea
          v-model="task.taskDescription"
          :label="$t('common.description')"
          :rules="requiredRule"
          outlined
          dense
        />
        <v-text-field
          v-model="task.taskTip"
          :label="$t('buttons.tip')"
          outlined
          dense
        />
      </v-col>
      <v-col cols="5">
        <v-radio-group
          v-model="task.taskType"
          :label="$t('titles.answerType')"
          :mandatory="false"
          :rules="requiredRule"
        >
          <v-radio :label="$t('switches.noAnswer')" value="null" />
          <v-radio :label="$t('switches.textArea')" value="textArea" />
          <v-radio :label="$t('switches.postTest')" value="form" />
        </v-radio-group>
        <v-text-field
          v-if="task.taskType === 'form'"
          v-model="task.postQuestion"
          :label="$t('switches.postTest')"
          outlined
          dense
        />
        <v-row align="center">
          {{ $t('switches.screenRecord') }}
          <v-switch v-model="task.hasScreenRecord" class="ml-2" />
        </v-row>
        <v-row align="center">
          {{ $t('switches.camera') }}
          <v-switch v-model="task.hasCamRecord" class="ml-2" />
        </v-row>
        <!-- <v-row align="center"> FUTURE WORK
          {{ $t('switches.eyeTracker') }}
          <v-switch v-model="task.hasEye" class="ml-2" />
        </v-row> -->
        <v-row align="center">
          {{ $t('switches.audioRecord') }}
          <v-switch v-model="task.hasAudioRecord" class="ml-2" />
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      requiredRule: [(v) => !!v || 'Field Required'],
    }
  },
  methods: {
    valida() {
      const valid = this.$refs.form.validate()
      this.$emit('validate', valid)
    },
    resetVal() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style></style>
