<template>
  <div class="background-grey">
    <Snackbar />
    <v-row justify="center" style="height: 90%" align="center">
      <v-col cols="12" md="8">
        <v-card color="#f5f7ff" class="mx-2">
          <v-row>
            <v-col cols="12" md="5" align-self="center">
              <div class="card-title">
                {{ $t('SIGNIN.sign-up') }}
              </div>

              <div class="divider" />

              <v-form
                v-model="valid"
                class="mx-3"
                @keyup.native.enter="onSignUp()"
              >
                <v-text-field
                  v-model="email"
                  dense
                  outlined
                  :label="$t('SIGNIN.email')"
                  :rules="emailRules"
                  prepend-inner-icon="mdi-account-circle"
                />

                <v-text-field
                  v-model="password"
                  dense
                  outlined
                  :label="$t('SIGNIN.password')"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="passwordRules"
                  @click:append="showPassword = !showPassword"
                />

                <v-text-field
                  v-model="confirmpassword"
                  dense
                  outlined
                  :label="$t('SIGNIN.confirmPassword')"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :rules="[comparePassword]"
                  @click:append="showConfirmPassword = !showConfirmPassword"
                />
              </v-form>
              <v-card-actions class="justify-center mt-4">
                <v-btn
                  color="#F9A826"
                  rounded
                  class="white--text"
                  :loading="loading"
                  @click="onSignUp()"
                >
                  Sign-up
                </v-btn>
              </v-card-actions>
              <v-card-actions class="justify-center mt-1">
                <p>
                  <a
                    style="color: #F9A826; text-decoration: underline;"
                    @click="redirectToSignin"
                    >{{ $t('SIGNIN.alreadyHaveAnAccount') }}</a
                  >
                </p>
              </v-card-actions>
            </v-col>

            <v-col cols="7" class="hidden-sm-and-down" align-self="center">
              <v-img src="@/assets/signUp.svg" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Snackbar from '@/components/atoms/Snackbar'
import i18n from '@/i18n'

export default {
  components: {
    Snackbar,
  },
  data: () => ({
    email: '',
    password: '',

    valid: true,

    emailRules: [
      (v) => !!v || i18n.t('errors.emailIsRequired'),
      (v) => /.+@.+\..+/.test(v) || i18n.t('errors.invalidEmail'),
    ],
    passwordRules: [
      (v) => !!v || i18n.t('errors.passwordRequired'),
      (v) => v.length >= 6 || i18n.t('errors.passwordValidate'),
    ],
    confirmpassword: '',
    showPassword: false,
    showConfirmPassword: false,
  }),
  computed: {
    comparePassword() {
      return () =>
        (this.confirmpassword == this.password &&
          this.confirmpassword !== '') ||
        i18n.t('errors.differentPasswords')
    },
    user() {
      return this.$store.getters.user
    },
    loading() {
      return this.$store.getters.loading
    },
  },

  methods: {
    async onSignUp() {
      if (this.valid) {
        await this.$store.dispatch('signup', {
          email: this.email,
          password: this.password,
        })
        await this.$router.push('/')
      }
    },
    redirectToSignin() {
      this.$router.push('/signin')
    },
  },
}
</script>

<style scoped>
.background-grey {
  background-color: #e8eaf2;
  height: 100vh;
  align-content: center;
}
.card-title {
  font-style: normal;
  font-weight: 300;
  font-size: 48px;
  line-height: 56px;
  margin-left: 12px;
  margin-bottom: 20px;
}
.divider {
  margin-bottom: 40px;
  margin-left: 8px;
  background: linear-gradient(
    90deg,
    #c4c4c4,
    rgba(196, 196, 196, 0)
  ) !important;
  height: 0.5px;
}
</style>
