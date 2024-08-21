<template>
  <div>
    <IntroComp
      :colors="['#d128c9', '#9a1aab']"
      :title="'Edit Test'"
      :image="'IntroEdit.svg'"
      :main="$t('descriptions.intro.edit')"
      :link="$t('descriptions.intro.start')"
      :items="items"
      @linkClicked="closeIntro()"
      @callFunc="callFunc"
    />
  </div>
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
          iconColor: '#D128C9',
          icon: 'mdi-file-document',
          title: i18n.t('pages.intros.docTitle'),
          subtitle: i18n.t('pages.intros.docSubtitle') + i18n.t('titles.test'),
          func: 'goToDoc',
        },

        {
          iconColor: '#D128C9',
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
      this.$router.push('/edit/documentation').catch(() => {})
    },
    goToDisc() {
      window.open('https://discord.gg/MFWNpwTq9q')
    },
    closeIntro() {
      this.$emit('closeIntro')
    },
    callFunc(func) {
      this[func]() //call item function
    },
  },
}
</script>
