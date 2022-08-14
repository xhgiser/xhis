import * as Vue from 'vue'
import * as Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'

const store = Vuex.createStore({
  modules: {
    app,
    settings,
    user,
    permission,
  },
  getters,
})

export default store
