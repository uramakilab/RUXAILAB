<template>
  <IntroComp
    :colors="['#eff31a', '#eecf22']"
    :title="'Cooperators'"
    :image="'IntroCoops.svg'"
    :main="$t('descriptions.intro.cooperators')"
    :link="$t('descriptions.intro.start')"
    :items="items"
    @linkClicked="closeIntro()"
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
          iconColor: '#daf01a',
          icon: 'mdi-file-document',
          title: i18n.t('pages.intros.docTitle'),
          subtitle:
            i18n.t('pages.intros.docSubtitle') + i18n.t('titles.cooperators'),
          func: 'goToDoc',
        },

        {
          iconColor: '#daf01a',
          icon: 'mdi-emoticon-happy',
          title: i18n.t('pages.intros.discTitle'),
          subtitle: i18n.t('pages.intros.discSubtitle'),
          func: 'goToDisc',
        },
      ]
    },
  },
  methods: {
    goToDoc() {
      this.$router.push('/cooperators/documentation').catch(() => {})
    },
    goToDisc() {
      window.open('https://discord.gg/MFWNpwTq9q')
    },
    closeIntro() {
      this.$emit('closeIntro')
    },
    callFunc(func) {
      this[func]()
    },
  },
}
</script>
