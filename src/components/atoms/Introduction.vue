<template>
  <section>
    <!-- Desktop -->
    <v-container
      style="display:contents; background-color:#f4b700; height:300px"
      class="hidden-sm-and-down"
    >
      <v-img
        v-if="desktopImagePreloaded"
        src="@/assets/landing/introductionDesktop.svg"
      >
        <v-container>
          <v-row align="center" class="mb-10">
            <v-col class="text-left" cols="12" md="6">
              <h1 class="display-3 font-weight-regular mb-4 mt-16 white--text">
                {{ $t('Introduction.title') }}
              </h1>
              <h4 class="display-1 white--text mb-4">
                {{ $t('Introduction.subtitle') }}
              </h4>
              <p class="white--text mb-4" style="width: 80%" align="justify">
                {{ $t('Introduction.description') }}
              </p>
              <v-btn
                color="white"
                outlined
                rounded
                class="mb-2"
                @click="goTo('/signup')"
              >
                {{ $t('Introduction.cta') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-container>

    <!-- Mobile -->
    <v-container class="hidden-md-and-up ma-0 pa-0">
      <div style="background-color: #f4b700">
        <div style="background-color: #f4b700">
          <v-col>
            <h1
              class="display-3 font-weight-regular white--text text-center mt-5"
            >
              {{ $t('Introduction.title') }}
            </h1>
          </v-col>
        </div>
        <v-img
          v-if="mobileImagePreloaded"
          src="@/assets/landing/introductionMobile.svg"
          class="mb-4"
          max-height="350"
          contain
        />
        <div style="background-color: #f4b700" class="mx-1">
          <h4 class="display-1 white--text mb-4 text-center">
            {{ $t('Introduction.subtitle') }}
          </h4>
        </div>
        <div style="background-color: #f4b700" class="mx-3">
          <v-row justify="center">
            <p class="white--text mb-4 mx-4 text-center">
              {{ $t('Introduction.description') }}
            </p>
            <v-btn
              color="white"
              outlined
              rounded
              class="mb-2"
              @click="goTo('/signup')"
            >
              {{ $t('Introduction.cta') }}
            </v-btn>
          </v-row>
        </div>
        <!-- div for margin at bottom -->
        <div style="background-color: #f4b700; height: 40px" />
      </div>

      <div style="height: 10px" />
    </v-container>

    <!-- SVG Waves -->
    <div class="svg-border-waves text-white">
      <svg
        class="wave"
        style="pointer-events: none"
        fill="white"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1920 75"
      >
        <defs>
          <clipPath id="a">
            <rect class="a" width="1920" height="75" />
          </clipPath>
        </defs>
        <title>wave</title>
        <g class="b">
          <path
            class="c"
            d="M1963,327H-105V65A2647.49,2647.49,0,0,1,431,19c217.7,3.5,239.6,30.8,470,36,297.3,6.7,367.5-36.2,642-28a2511.41,2511.41,0,0,1,420,48"
          />
        </g>
        <g class="b">
          <path
            class="d"
            d="M-127,404H1963V44c-140.1-28-343.3-46.7-566,22-75.5,23.3-118.5,45.9-162,64-48.6,20.2-404.7,128-784,0C355.2,97.7,341.6,78.3,235,50,86.6,10.6-41.8,6.9-127,10"
          />
        </g>
        <g class="b">
          <path
            class="d"
            d="M1979,462-155,446V106C251.8,20.2,576.6,15.9,805,30c167.4,10.3,322.3,32.9,680,56,207,13.4,378,20.3,494,24"
          />
        </g>
        <g class="b hidden-sm-and-down">
          <path
            class="d"
            d="M1998,484H-243V100c445.8,26.8,794.2-4.1,1035-39,141-20.4,231.1-40.1,378-45,349.6-11.6,636.7,73.8,828,150"
          />
        </g>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.a {
  fill: none;
}
.b {
  clip-path: url(#a);
}
.d {
  opacity: 0.5;
  isolation: isolate;
}
.svg-border-waves svg {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3rem;
  width: 100%;
}
svg {
  overflow: hidden;
}
section {
  position: relative;
}
</style>

<script>
export default {
  components: {},
  data() {
    return {
      desktopImagePreloaded: false,
      mobileImagePreloaded: false,
    }
  },
  computed: {
    test() {
      return this.$store.getters.test
    },
    user() {
      return this.$store.getters.user
    },
    csvHeuristics() {
      return this.$store.state.Tests.currentTest
    },
  },
  mounted() {
    this.preloadImages()
  },
  methods: {
    preloadImages() {
      const desktopImage = new Image()
      desktopImage.onload = () => {
        this.desktopImagePreloaded = true
      }
      desktopImage.onerror = () => {
        console.error('Error loading desktop image')
      }
      desktopImage.src = require('@/assets/landing/introductionDesktop.svg')

      const mobileImage = new Image()
      mobileImage.onload = () => {
        this.mobileImagePreloaded = true
      }
      mobileImage.onerror = () => {
        console.error('Error loading mobile image')
      }
      mobileImage.src = require('@/assets/landing/introductionMobile.svg')
    },
    goTo(path) {
      this.$router.push(path).catch(() => {})
    },
  },
}
</script>