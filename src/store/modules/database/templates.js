
export default {
    state: {
        template: null,
        templates: null,
    },
    mutations: {
        setTemplate(state, payload) {
            state.template = payload
        },
        setTemplates(state, payload) {
            state.templates = payload
        }
    },
    getters: {
        templates(state) {
            return state.templates
        },
        template(state) {
            return state.template
        }
    },
    actions: {
        createTemplate({ dispatch }, payload) {
            payload = Object.assign(payload, { collection: 'templates' })
            let docRef = dispatch('createObject', payload)
                .then((doc) => {
                    return doc.id;
                })
                .catch((err) => {
                    console.error("Error to create template", err)
                })
            return docRef;
        },
        async getTemplates({ commit, dispatch }, payload) {
            payload = Object.assign(payload, { collection: 'templates' })
            let templates = await dispatch("getAllObjects", payload)
            commit('setTemplates', templates)
        },
        async getTemplate({ commit, dispatch }, payload) {
            payload = Object.assign(payload, { collection: 'templates' })
            let template = await dispatch("getObject", payload)
            commit('setTemplate', template)
        },
    }
}