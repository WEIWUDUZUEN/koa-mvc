import Vue from 'vue'
import Vuex from 'vuex'
import { version } from '../../package.json'

Vue.use(Vuex)

export function createStore () {
    return new Vuex.Store({
        state() {
            return {
                user: null
            }
        },
        getters: {
            user (state) {
                return state.user
            }
        },
        actions: {
            async login ({commit, dispatch}, {username, password}) {
                if (username === 'admin' && password === 'admin') {
                    commit('SET_USER', {
                        username: 'ds.w',
                        info: {
                            sex: '男',
                            age: 23
                        }
                    })
                }
            }
        },
        mutations: {
            SET_USER (state, data) {
                state.user = data
            },
            SET_INFO (state, data) {
                state.info.a = data
            }
        },
        modules: {
            app: {
              state: {
                version: version,
                readChangelog: false
              }
            }
        }
    })
}