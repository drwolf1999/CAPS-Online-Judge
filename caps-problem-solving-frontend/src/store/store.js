import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import RestAPI from '../constants/RestAPI';

Vue.use(Vuex);

/* 화면 갱신 시 로컬 스토리지에 저장된 토큰을 axios 헤더에 설정 */
const enhanceAccessToken = () => {
    const accessToken = localStorage.accessToken;
    if (!accessToken) {
        return;
    }

    /* expired이면 제거 */
    var current_time = Date.now() / 1000;
    if (jwt.decode(accessToken).exp < current_time) {
        delete localStorage.accessToken;
        return;
    }

    axios.defaults.headers.common['Access-Token'] = accessToken;
};
enhanceAccessToken();

export default new Vuex.Store({
    state: {
        /* 로그인 정보 */
        accessToken: axios.defaults.headers.common['Access-Token'],
        /* 로그인 후 넘어갈 url */
        nextDestination: '/',
        // 선생님들
        teachers: [],
        // 학생들
        students: [],
        // 수업들
        lessons: [],
    },
    getters: {
        // state 값 가져오기
        isLogined(state) {
            return true || state.accessToken != null;
            // return state.accessToken != null || state.accessToken != undefined;
        },
        getNextDestination(state) {
            return state.nextDestination;
        },
    },
    mutations: {
        // state 의 값 변경
        LOGIN(state, accessToken) {
            state.accessToken = accessToken;

            // 모든 HTTP 요청 헤더에 Authorization 을 추가한다.
            axios.defaults.headers.common['Access-Token'] = accessToken;

            // 토큰을 로컬 스토리지에 저장
            localStorage.accessToken = accessToken;
        },
        LOGOUT(state) {
            // 토큰 정보 삭제
            state.accessToken = null;
            delete localStorage.accessToken;
        },
        setNextDestination(state, url) {
            state.nextDestination = url;
        },
    },
    actions: {
        // state 값 변경 비동기
        LOGIN(state, loginData) {
            return axios.post(RestAPI.SERVER_DOMAIN + 'auth/login', loginData)
                .then((response) => {
                    state.commit('LOGIN', response.headers['access-token']);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        LOGOUT(state) {
            axios.defaults.headers.common['Access-Token'] = undefined;

            state.commit('LOGOUT');
        },
        setNextDestination(state, url) {
            state.commit('setNextDestination', url);
        },
    }
});