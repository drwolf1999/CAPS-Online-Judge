import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import RestAPI from '../constants/RestAPI';
import StandingService from '../service/standing';

Vue.use(Vuex);

// 화면 갱신 시 로컬 스토리지에 저장된 토큰을 axios 헤더에 설정
const enhanceAccessToken = () => {
    const accessToken = localStorage.accessToken;
    if (!accessToken) {
        return;
    }

    // expired이면 제거
    const current_time = Date.now() / 1000;
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
        // 문제
        problem: null,
        standing: null,
        /* 로그인 후 넘어갈 url */
        nextDestination: '/',
        lastSubmitLanguage: 0,
    },
    getters: {
        getProblem(state) {
            return state.problem;
        },
        // state 값 가져오기
        isLogined(state) {
            return state.accessToken !== undefined && state.accessToken !== null;
        },
        getUserData(state) {
            return jwt.decode(state.accessToken);
        },
        getStanding(state) {
            return state.standing;
        },
        getNextDestination(state) {
            return state.nextDestination;
        },
        getLastSubmitLanguage(state) {
            return state.lastSubmitLanguage;
        },
    },
    mutations: {
        fetchProblem(state, problemData) {
            state.problem = problemData;
        },
        fetchStanding(state, standingData) {
            let problems = {};
            for (let i = standingData.problems.length - 1; i >= 0; i--) {
                problems[standingData.problems[i].number] = standingData.problems[i].judge_result;
            }
            standingData.problems = problems;
            state.standing = standingData;
        },
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
        setLastSubmitLanguage(state, value) {
            state.lastSubmitLanguage = value;
        },
    },
    actions: {
        fetchProblem(state, problemNumber) {
            return axios.get(RestAPI.SERVER_DOMAIN + 'problem/get/' + problemNumber)
                .then(response => {
                    state.commit('fetchProblem', response.data.Problem);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        fetchStanding(state, username) {
            return StandingService.GetUser(username)
                .then(response => {
                    state.commit('fetchStanding', response.data.Standing);
                })
                .catch(error => {
                    console.log(error);
                })
        },
        // state 값 변경 비동기
        LOGIN(state, loginData) {
            return axios.post(RestAPI.SERVER_DOMAIN + 'user/login', loginData)
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
        setLastSubmitLanguage(state, value) {
            state.commit('setLastSubmitLanguage', value);
        },
    },
});