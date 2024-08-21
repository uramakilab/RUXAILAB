<template>
  <IntroComp
    :colors="['#32bde7', '#2488e0']"
    :title="'Analytics'"
    :image="'IntroAnalytics.svg'"
    :main="$t('descriptions.intro.analytics')"
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
          iconColor: '#59b9d4',
          icon: 'mdi-file-document',
          title: i18n.t('pages.intros.docTitle'),
          subtitle:
          i18n.t('pages.intros.docSubtitle') + i18n.t('titles.analytics'),
          func: 'goToDoc',
        },

        {
          iconColor: '#59b9d4',
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
      this.$router.push('/analytics/documentation').catch(() => {})
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
