import axios from 'axios'

export default {
  namespaced: true,
  state: {
    repos: null,
  },
  mutations: {
    setRepos (state, payload) {
     state.repos = payload
    }
  },
  actions: {
    getRepos ({ commit, dispatch }, payload,) {
      dispatch('loading/setLoading', true, { root: true })
      axios
        .get(`https://api.github.com/users/${payload}/repos`)
        .then(res => {
          commit('setRepos', res.data)
          dispatch('error/setError', null, { root: true })
          })
        .catch(error => {
          dispatch('error/setError', 'Cant find this user', { root: true })
          })
    }
  },
}