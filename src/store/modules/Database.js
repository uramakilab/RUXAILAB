import Controller from '@/controllers/BaseController'

/**
 * Database store module, API calls
 * @module database
 */

export default {
  state: {
    loading: false,
  },
  getters: {
    loading(state) {
      return state.loading
    },
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
  },
  actions: {
    async getPaginationArray({ commit }, payload) {
      try {
        var objects = []
        await new Controller().read('users', 'id', payload).then((response) => {
          response.forEach((doc) => {
            objects.push(doc.data())
          })
        })
      } catch (err) {
        commit('setError', {
          errorCode: 'dbError',
          message: 'paginated array from db failed',
        })
      } finally {
        commit('setLoading', false)
      }
    },
    async getObject({ commit }, payload) {
      try {
        const x = await new Controller().readOne(
          payload.collection,
          'id',
          payload.id,
        )
        return x.data()
      } catch (err) {
        commit('setError', {
          errorCode: 'dbError',
          message: 'object retrievel failed',
        })
      } finally {
        commit('setLoading', false)
      }
    },
  },
}
