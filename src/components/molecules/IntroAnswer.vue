<template>
  <IntroComp
    :colors="['#9ac94f', '#7eb543']"
    :title="'Answers'"
    :image="'IntroAnswer.svg'"
    :main="
      $t('descriptions.intro.answers')
    "
    :link="$t('descriptions.intro.invite')"
    :items="items"
    @linkClicked="goToCoops()"
    @callFunc="callFunc"
  />
</template>

<script>
import IntroComp from '@/components/atoms/IntrosComponent'
import i18n from '@/i18n'

export default {
  components: {
    IntroComp,
  },
  data: () => ({}),
  computed: {
    items() {
      return [
        {
          iconColor: '#4bbdaf',
          icon: 'mdi-file-document',
          title: i18n.t('pages.intros.docTitle'),
          subtitle:
          i18n.t('pages.intros.docSubtitle')  + i18n.t('titles.answers'),
          func: 'goToDoc',
        },

        {
          iconColor: '#4bbdaf',
          icon: 'mdi-emoticon-happy',
          title: i18n.t('pages.intros.discTitle'),
          subtitle: i18n.t('pages.intros.discSubtitle'),
          func: 'goToDisc',
        },
      ]
    },
  },
  methods: {
    goToCoops() {
      this.$emit('goToCoops')
    },
    goToDoc() {
      this.$router.push('/answers/documentation').catch(() => {})
    },
    goToDisc() {
      window.open('https://discord.gg/MFWNpwTq9q')
    },
    callFunc(func) {
      this[func]()
    },
  },
}
</script>
