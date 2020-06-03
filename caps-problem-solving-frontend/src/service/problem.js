import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// problem 에 대한 Action 정의
export default {
    // Get
    GetAllProblems() {
        return axios.get(RestAPI.SERVER_DOMAIN + 'problem/all')
            .catch(error => {
                console.log(error);
            });
    },
    GetCountOfProblems() {
        return axios.get(RestAPI.SERVER_DOMAIN + 'problem/count')
            .catch(error => {
                console.log(error);
            });
    },
    CreateProblem(Data) {
        return axios.post(RestAPI.SERVER_DOMAIN, Data)
            .catch(error => {
                console.log(error);
            });
    },
    // DoLogin(data) {
    //     return axios.post(RestAPI.SERVER_DOMAIN + 'auth/login', data)
    //         .catch(error => {
    //             console.log(error);
    //         });
    // },
};