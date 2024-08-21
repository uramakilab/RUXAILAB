/**
 * Reports store module
 * @module Reports
 */

export default {
  state: {
    reports: null,
  },
  getters: {
    reports(state) {
      return state.reports
    },
  },
  mutations: {
    setReports(state, payload) {
      state.reports = payload
    },
  },
  actions: {
    /**
     * This action creates a new report, using the generic action "createObject", passing the report data
     *
     * @action createReport
     * @param {object} payload - data to create a report
     * @param {object} payload.data - reports data
     * @param {object} payload.data.test - header with test data to which the report belongs
     * @param {string} payload.data.test.id - the test identification
     * @param {string} payload.data.test.title - the test title
     * @param {string} payload.data.test.type - the test type
     * @param {string} payload.data.test.answers - the answers' document  identification in collection
     * @param {object[]} payload.data.reports - logs issued by test evaluators
     * @returns {string} docRef - the report's identification in the database
     */
    createReport({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'reports' })

      const docRef = dispatch('createObject', payload)
        .then((doc) => {
          return doc.id
        })
        .catch((err) =>
          commit('setError', { errorCode: 'reportError', message: err }),
        )

      return docRef
    },
    /**
     * This action deletes a report, using the generic action "deleteObject" and passing the report data
     *
     * @action deleteReport
     * @param {object} payload - data to delete a report
     * @param {string} payload.id - report identification
     * @returns {void}
     */
    deleteReport({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'reports' })

      dispatch('deleteObject', payload).catch((err) =>
        commit('setError', { errorCode: 'reportError', message: err }),
      )
    },
    /**
     * This action obtains the complete report document,
     * using the generic action "getObject", passing the report data
     *
     * @action getReports=setReports
     * @param {object} payload - data to get a report
     * @param {string} payload.id - report identification
     * @returns {void}
     */
    async getReports({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'reports' })

      const reps = await dispatch('getObject', payload).catch((err) =>
        commit('setError', { errorCode: 'reportError', message: err }),
      )
      commit('setReports', reps)
    },
    /**
     * This action adds a new log to the report, using the generic action
     * "pushObject", passing the log data
     *
     * @action pushLog
     * @param {object} payload - data to put a log in report
     * @param {string} payload.docId - report identification
     * @param {object} payload.element -data to generate log
     * @param {string} payload.element.uid - evaluator identification
     * @param {string} payload.element.email - evaluator email
     * @param {object} payload.element.log - evaluator's process data in the test
     * @param {Date} payload.element.log.date - last update date
     * @param {number} payload.element.log.progress - percentage of test progress
     * @param {string} payload.element.log.status - test status
     * @returns {void}
     */
    pushLog({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, {
        collection: 'reports',
        param: 'reports',
      })

      dispatch('pushObject', payload).catch((err) =>
        commit('setError', { errorCode: 'logError', message: err }),
      )
    },
    /**
     *
     * This action updates the log in the report,
     *  using the generic action "updateArrayElement", passing the log data
     *
     * @action updateLog
     * @param {object} payload - data to update a log in report
     * @param {string} payload.docId - report identification
     * @param {string} payload.elementId - evaluator identification
     * @param {object} payload.element -  evaluator's process data in the test updated
     * @param {Date} payload.element.date - last update date
     * @param {number} payload.element.progress - percentage of test progress
     * @param {string} payload.element.status - test status
     * @returns {void}
     */
    updateLog({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, {
        collection: 'reports',
        field: 'reports',
        param: 'log',
        identifier: 'uid',
      })

      dispatch('updateArrayElement', payload).catch((err) =>
        commit('setError', { errorCode: 'logError', message: err }),
      )
    },
    /**
     * This action updates a report, using the generic action "updateObject",
     * passing the updated report data
     *
     * @action updateTestReport
     * @param {object} payload - data to update a report
     * @param {string} payload.docId - report identification
     * @param {object} payload.data - reports data
     * @param {object} payload.data.test - header with test data to which the report belongs
     * @param {string} payload.data.test.id - the test identification
     * @param {string} payload.data.test.title - the test title
     * @param {string} payload.data.test.type - the test type
     * @param {string} payload.data.test.answers - the answers' document  identification in collection
     * @param {object[]} payload.data.reports - logs issued by test evaluators
     * @param {string} payload.data.reports[].uid - evaluator identification
     * @param {string} payload.data.reports[].email - evaluator email
     * @param {object} payload.data.reports[].log - evaluator's process data in the test
     * @param {Date} payload.data.reports[].log.date - last update date
     * @param {number} payload.data.reports[].log.progress - percentage of test progress
     * @param {string} payload.data.reports[].log.status - test status
     */
    updateTestReport({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'reports' })

      dispatch('updateObject', payload).catch((err) =>
        commit('setError', {
          errorCode: 'reportError',
          message: err,
        }),
      )
    },
    /**
     *
     * this action removes an evaluator log in the report,
     * using the generic action "removeObject", passing the report data
     *
     * @action removeReport
     * @param {object} payload - data to remove a report log
     * @param {string} payload.docId - report identification
     * @param {object} payload.element -  evaluator data
     * @param {string} payload.element.id - evaluator identification
     * @param {string} payload.param - field where to find the evaluator log
     * @returns {void}
     */
    removeReport({ dispatch, commit }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, { collection: 'reports' })

      dispatch('removeObject', payload).catch((err) =>
        commit('setError', { errorCode: 'reportError', message: err }),
      )
    },
  },
}
