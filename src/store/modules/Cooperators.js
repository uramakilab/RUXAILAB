/**
 * Cooperators store module
 * @module cooperators
 */

import template from '@/assets/template.js'
import { FirebaseFunctionsController } from '@/controllers/FirebaseFunctionsController'

export default {
  state: {
    cooperators: null,
  },
  getters: {
    cooperators(state) {
      return state.cooperators
    },
  },
  mutations: {
    setCooperators(state, payload) {
      state.cooperators = payload
    },
  },
  actions: {
    /**
     *
     * This action creates a new cooperator document, using the generic action   createObject,
     * passing the cooperator's data
     *
     * @action createCooperators
     * @param {object} payload - cooperator document data
     * @param {object} payload.data - cooperator object data
     * @param {object} payload.data.test - header with test data to which the report belongs
     * @param {string} payload.data.test.id - the test identification
     * @param {string} payload.data.test.title - the test title
     * @param {string} payload.data.test.type - the test type
     * @param {object[]} payload.data.cooperators - cooperators list
     * @returns {string} docId - cooperator document Identification
     */
    createCooperators({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'cooperators' })

      const docId = dispatch('createObject', payload)
        .then((doc) => {
          return doc.id
        })
        .catch((err) =>
          commit('setError', {
            errorCode: 'cooperatorsError',
            message: err,
          }),
        )

      return docId
    },
    /**
     * This action invite a new cooperator to document,
     * using the generic action   pushObject, passing the cooperator data
     *
     * @action pushCooperator
     * @param {object} payload - cooperator data
     * @param {string} payload.docId - cooperator document identification
     * @param {object} payload.element - cooperator invitation data
     * @param {?boolean} payload.element.accepted - signal when the cooperator accepts an invitation
     * @param {object} payload.element.accessLevel - access level object
     * @param {string} payload.element.accessLevel.text - access level name
     * @param {number} payload.element.accessLevel.value - access level value
     * @param {string} payload.element.email - guest cooperator email
     * @param {string} payload.element.id - guest cooperator identification
     * @param {string} payload.element.invitation - invitation identification
     * @param {boolean} payload.element.invited - flag when the invitation is sent
     * @param {string} payload.element.token - token to identify the email invitation
     * @returns {void}
     */
    pushCooperator({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, {
        collection: 'cooperators',
        param: 'cooperators',
      })

      dispatch('pushObject', payload).catch((err) =>
        commit('setError', { errorCode: 'cooperatorsError', message: err }),
      )
    },
    /**
     * This action updates a param in a existent cooperator,
     * using the generic action   updateArrayElement,
     * passing the cooperator's data
     *
     * @action updateCooperator
     * @param {object} payload - date to update
     * @param {string} payload.docId - cooperator document identification
     * @param {string} payload.elementId - cooperator identification
     * @param {string} payload.element - updated data
     * @param {string} payload.param -field to be updated
     * @returns {void}
     */
    updateCooperator({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, {
        collection: 'cooperators',
        field: 'cooperators',
      })

      if (!payload.identifier) Object.assign(payload, { identifier: 'id' })

      dispatch('updateArrayElement', payload).catch((err) =>
        commit('setError', {
          errorCode: 'cooperatorsError',
          message: err,
        }),
      )
    },
    /**
     * This action updates  an existing cooperator,
     * using the generic action   updateArrayElementObject,
     * passing the cooperator's data
     *
     * @action updateCooperatorObject
     * @param {object} payload - updated data
     * @param {string} payload.docId -  cooperator document identification
     * @param {string} payload.elementId - field for identification
     * @param {string} payload.identifier - Identification code
     * @param {object} payload.element - updated object
     * @returns {void}
     */
    updateCooperatorObject({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, {
        collection: 'cooperators',
        field: 'cooperators',
      })

      if (!payload.identifier) Object.assign(payload, { identifier: 'id' })

      dispatch('updateArrayElementObject', payload).catch((err) =>
        commit('setError', {
          errorCode: 'cooperatorsError',
          message: err,
        }),
      )
    },
    /**
     * This action removes an existing cooperator,
     * using the generic action   removeObject,
     * passing the cooperator's data
     *
     * @action removeCooperator
     * @param {object} payload - data cooperator
     * @param {string} payload.docId -  cooperator document identification
     * @param {object} payload.element - data cooperator to remove
     * @param {string} payload.element.id - cooperator identification
     * @returns {void}
     */
    removeCooperator({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, {
        collection: 'cooperators',
        param: 'cooperators',
      })

      dispatch('removeObject', payload).catch((err) =>
        commit('setError', {
          errorCode: 'cooperatorsError',
          message: err,
        }),
      )
    },
    /**
     * This action deletes the cooperator document,
     * using the generic action   deleteObject,
     * passing the cooperator's data
     *
     * @action deleteCooperators
     * @param {object} payload - data cooperator document
     * @param {String} payload.id - cooperator document identification
     * @returns {void}
     */
    deleteCooperators({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'cooperators' })

      dispatch('deleteObject', payload).catch((err) =>
        commit('setError', {
          errorCode: 'cooperatorsError',
          message: err,
        }),
      )
    },
    /**
     * This action updates the cooperator document,
     * using the generic action   updateObject,
     * passing the cooperator's data
     *
     * @action updateTestCooperators
     * @param {object} payload - data cooperator document
     * @param {string} payload.docId -cooperator document identification
     * @param {object} payload.data - data cooperator document
     * @param {object} payload.data.test - header with test data to which the report belongs
     * @param {string} payload.data.test.id - the test identification
     * @param {string} payload.data.test.title - the test title
     * @param {string} payload.data.test.type - the test type
     * @param {object[]} payload.data.cooperators - cooperators list
     * @returns {void}
     */
    updateTestCooperators({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'cooperators' })

      dispatch('updateObject', payload).catch((err) =>
        commit('setError', {
          errorCode: 'cooperatorsError',
          message: err,
        }),
      )
    },
    /**
     * This action send a email,
     * using the generic action   callFunction,
     * passing the cooperator's data
     *
     * @action sendEmailInvitation
     * @param {object} payload - email invitation data
     * @param {string} payload.testId - teste identification
     * @param {string} payload.from - email to send the invitation
     * @param {string} payload.testTitle - test title
     * @param {object} payload.guest: - cooperator data
     * @param {string} payload. domain - site domain
     * @param {string} payload.path - destination route
     * @param {string} payload.token - token to identify the email invitation
     * @returns {void}
     */
    async sendEmailInvitation({ commit }, payload) {
      commit('setLoading', true)

      try {
        payload.link = `${payload.domain}/${payload.path}/${payload.testId}/${payload.token}`

        await FirebaseFunctionsController.callHttpsCallableFunction(
          'sendEmail',
          Object.assign(payload, { template: template.getTemplate(payload) }),
        )
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    },

    async sendModeratedEmailInvitation({ commit }, payload) {
      commit('setLoading', true)

      try {
        payload.link = `${payload.domain}/${payload.path}/${payload.testId}/${payload.token}`

        const testDate = new Date(payload.guest.testDate)

        payload.testDate = testDate.toLocaleDateString()
        payload.testTime = testDate.toLocaleTimeString()
        const dtStamp = testDate
          .toISOString()
          .replace(/[-:]/g, '')
          .split('.')[0]
        const dtStart = dtStamp
        const dtEnd = new Date(testDate.getTime() + 60 * 60 * 1000)
          .toISOString()
          .replace(/[-:]/g, '')
          .split('.')[0]

        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Your Organization//Your Product//EN
BEGIN:VEVENT
UID:${payload.testId}@yourdomain.com
DTSTAMP:${dtStamp}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:Your Test Event
DESCRIPTION:This is a test event for your usability test.
LOCATION:Online
END:VEVENT
END:VCALENDAR
    `.trim()

        // Adiciona o anexo ao payload
        let attachments = [
          {
            filename: 'moderatedTest.ics',
            content: Buffer.from(icsContent).toString('base64'),
            encoding: 'base64',
            contentType: 'text/calendar; charset=utf-8; method=REQUEST',
          },
        ]

        console.error(payload) // Verifique a estrutura do payload no console

        await FirebaseFunctionsController.callHttpsCallableFunction(
          'sendEmail',
          Object.assign(payload, {
            template: template.getModeratedTemplate(payload),
            attachments,
          }),
        )
      } catch (e) {
        console.error(e)
      } finally {
        commit('setLoading', false)
      }
    },
  },
}
