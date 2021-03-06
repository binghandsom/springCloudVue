/**
 * Created by wton on 2016/10/6.
 */
import axios from "axios"
import {initWebsocket} from "../websocket/websocketManager"
import {INIT_WEBSOCKET, MDZZ, REGISTER, URL, LOGIN} from "./types"

const actions = {
    [INIT_WEBSOCKET]: ({commit}, websocketClient) => {
        initWebsocket(websocketClient, commit)
        commit("INIT_WEBSOCKET", websocketClient)
    },
    [MDZZ]: ({commit}, mdzz) => {
        axios.get(mdzz).then(response => {
            //console.log(response)
            commit("MDZZ", response.data)
        }).catch(error => console.log(error))
    },
    [REGISTER]: ({}, userInfo) => {
        axios.post(URL + '/userService/register', userInfo).then(response => {
            console.log(response.data)
        }).catch(error => console.log(error))
    },
    [LOGIN]: ({commit}, userInfo) => {
        axios.post(URL + '/userService/login', userInfo).then(response => {
            console.log(response.data)
            commit("SET_JWT", response.data)
        }).catch(error => console.log(error))
    },
    test: ({state}, data) => {

        axios.get(URL + '/userService/test', {
            headers: {
                'Authorization': state.jwt
            }
        }).then(response => {
            console.log(response.data)
        }).catch(error => console.log(error))
    }
}

export default actions