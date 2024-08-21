<template>
  <v-app>
    <Toolbar />
    <GlobalErrorHandler />
    <v-main>
      <v-container fluid class="pa-0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Toolbar from './components/molecules/Toolbar'
import GlobalErrorHandler from './components/atoms/GlobalErrorHandler'

export default {
  name: 'RUXAILAB',
  components: {
    Toolbar,
    GlobalErrorHandler,
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = 'RUXAILAB ' + (to.name ? '| ' + to.name : '')
      },
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif !important;
}
.v-application .display-3 {
  font-size: 3.75rem !important;
  font-weight: 300;
  line-height: 3.75rem;
  letter-spacing: -0.0083333333em !important;
  font-family: 'Poppins', sans-serif !important;
}
.v-application .display-2 {
  font-size: 3rem !important;
  font-weight: 400;
  line-height: 3.125rem;
  letter-spacing: normal !important;
  font-family: 'Poppins', sans-serif !important;
}
.v-application .display-1 {
  font-size: 2.125rem !important;
  font-weight: 400;
  line-height: 2.5rem;
  letter-spacing: 0.0073529412em !important;
  font-family: 'Poppins', sans-serif !important;
}
.ProseMirror:focus {
  outline: none;
}
.ProseMirror {
  height: 100%;
}
</style>
