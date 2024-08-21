<template>
  <IntroComp
    :colors="['#ec6618', '#f54e42']"
    :title="'Reports'"
    :image="'IntroReports.svg'"
    :main="$t('descriptions.intro.reports')"
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
          iconColor: '#ff6224',
          icon: 'mdi-file-document',
          title: i18n.t('pages.intros.docTitle'),
          subtitle: i18n.t('pages.intros.docSubtitle') + i18n.t('titles.reports'),
          func: 'goToDoc',
        },
      ]
    },
  },
  methods: {
    goToDoc() {
      this.$router.push('/reports/documentation').catch(() => {})
    },
    goToCoops() {
      this.$emit('goToCoops')
    },
    callFunc(func) {
      this[func]() //call item function
    },
  },
}
</script>