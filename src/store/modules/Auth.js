/**
 * Auth Store Module
 * @module Auth
 */

import AuthController from '@/controllers/AuthController.js'
import UserController from '@/controllers/UserController'
import i18n from '@/i18n'

const authController = new AuthController()
const userController = new UserController()

export default {
  state: {
    user: null,
  },

  getters: {
    user(state) {
      return state.user
    },

    getUserAccessLevel: (state) => (test) => {
      const { user } = state

      // Check if the user is defined
      if (!user) return 1

      // If the user is a superadmin
      if (user.accessLevel === 0) return 0

      // Check if the user is a test owner
      const isTestOwner = test.testAdmin?.userDocId === user.id
      if (isTestOwner) return 0

      // Check if the user is a cooperator and get their access level
      const coopsInfo = test.cooperators?.find((coops) => coops.userDocId === user.id)
      if (coopsInfo) return coopsInfo.accessLevel

      // Check if the test is public
      return test.isPublic ? 1 : 2
    },
  },

  mutations: {
    SET_USER(state, payload) {
      state.user = payload
    },
  },

  actions: {
    /**
     * This action register a User on the platform,
     * using the API and creates the observer for the User's metadata in the db
     * @action signup
     * @param {object} payload - Data to create a new User
     * @param {string} payload.email - the User email
     * @param {string} payload.password - the User password
     * @returns {void}
     */
    async signup({ commit }, payload) {
      commit('setLoading', true)
      try {
        const { user } = await authController.signUp(payload.email, payload.password)
        await userController.create({
          id: user.uid,
          email: user.email,
        })
        const dbUser = await userController.getById(user.uid)
        commit('SET_USER', dbUser)
      } catch (err) {
        commit('setError', { errorCode: 'FIREBASE', message: err.code })
      } finally {
        commit('setLoading', false)
      }
    },

    async signin({ commit }, payload) {
      commit('setLoading', true)
      try {
        const { user } = await authController.signIn(payload.email, payload.password)
        if (user) {
          const dbUser = await userController.getById(user.uid)
          commit('SET_USER', dbUser)
        }
      } catch (err) {
        if (err.code === 'auth/invalid-email') {
          commit('setError', {
            errorCode: 'auth',
            message: i18n.t('errors.userNotExist'),
          })
        } else if (err.code === 'auth/wrong-password') {
          commit('setError', {
            errorCode: 'auth',
            message: i18n.t('errors.incorrectPassword'),
          })
        } else {
          commit('setError', {
            errorCode: 'auth',
            message: i18n.t('errors.incorrectCredential'),
          })
        }
      } finally {
        commit('setLoading', false)
      }
    },

    async logout({ commit }) {
      try {
        await authController.signOut()
        commit('SET_USER', null)
      } catch (err) {
        console.error(err)
      } finally {
        commit('setLoading', false)
      }
    },

    async autoSignIn({ commit }) {
      try {
        const user = await authController.autoSignIn()
        if (!user) return

        const dbUser = await userController.getById(user.uid)
        commit('SET_USER', dbUser)
      } catch (e) {
        console.error(err)
      }
    },
  },
}
