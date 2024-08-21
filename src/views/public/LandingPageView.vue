<template>
  <div>
    <Snackbar />
    <Intro />
    <About />
    <Footer />
  </div>
</template>

<script>
import Intro from '@/components/atoms/Introduction'
import About from '@/components/organisms/LandingAbout'
import Footer from '@/components/organisms/Footer'
import Snackbar from '@/components/atoms/Snackbar'

export default {
  components: {
    Intro,
    About,
    Footer,
    Snackbar,
  },
  data: () => ({}),
}
</script>
