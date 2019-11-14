import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    error: null,
  },
  mutations: {
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: {
    setError ({commit}, payload) {
      commit('setError', payload)
    }
  },
}