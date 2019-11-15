import axios from 'axios'

export default {
  namespaced: true,

  state: {
    user: null
  },

  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },

  actions: {
    getUser ({ commit, dispatch }, payload) {
      axios
      .get(`https://api.github.com/users/${payload}`)
      .then(res => {
        commit('setUser', res.data)
        dispatch('error/setError', null, { root: true })
      })
      .catch(error => {
        dispatch('repos/setRepos', null, { root: true })
        commit('setUser', null)
        error.code == 404 ? dispatch('error/setError', 'Cant find this user', { root:true })
         : dispatch('error/setError', error, { root:true })
      })
      .finally (() => dispatch('loading/setLoading', false, { root: true }))
    }
  },

}
