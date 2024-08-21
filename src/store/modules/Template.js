/**
 * Template Store Module
 * @module Template
 */

//import TemplateController
import TemplateController from '@/controllers/TemplateController.js'

const templateController = new TemplateController()

const TemplateCont = new TemplateController()

export default {
  state: {
    templates: null,
    module: 'Templates',
  },
  getters: {},
  mutations: {
    SET_TEMPLATES(state, payload) {
      state.templates = payload
    },
  },
  actions: {
    async createTemplate({ commit }, payload) {
      try {
        commit('setLoading', true)
        await templateController.createTemplate(payload)
      } catch (e) {
        commit('setError', {
          errorCode: 'Error',
          message: 'createTemplate failed',
        })
      } finally {
        commit('setLoading', false)
      }
    },
    async getPublicTemplates({ commit }) {
      try {
        commit('setLoading', true)
        const res = await templateController.getPublicTemplates()
        commit('SET_TEMPLATES', res)
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    },
    async getTemplatesOfUser({ commit, rootState }) {
      try {
        commit('setLoading', true)
        const res = await templateController.getTemplatesOfUser(
          rootState.Auth.user.id,
        )
        commit('SET_TEMPLATES', res)
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    },
    async deleteTemplate({ commit }, payload) {
      try {
        commit('setLoading', true)
        await templateController.deleteTemplate(payload)
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    },

    async getCurrentUserAndPublicTemplates({ commit, rootState }) {
      try {
        commit('setLoading', true)
        const publicTemps =
          (await templateController.getPublicTemplates()) ?? []
        const userOwnedTemps =
          (await templateController.getTemplatesOfUser(
            rootState.Auth.user.id,
          )) ?? []

        const res = [
          ...publicTemps,
          ...userOwnedTemps.filter(
            (temp) => !publicTemps.some((i) => i.id === temp.id),
          ),
        ]
        commit('SET_TEMPLATES', res)
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    },
  },
}
