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
        return new Promise((resolve, reject) => {
            axios.post(RestAPI.SERVER_DOMAIN + 'problem/create', Data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async UpdateProblem(problemNumber, data) {
        return await axios.post(RestAPI.SERVER_DOMAIN + 'problem/update/' + problemNumber, data)
            .catch(error => {
                console.log(error);
            });
    },
};