import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// auth 에 대한 Action 정의
export default {
    // Get
    GetMaxNumber() {
        return axios.get(RestAPI.SERVER_DOMAIN + 'status/maxNumber')
            .catch(error => {
                console.log(error);
            });
    },
    GetAllStatus(Top) {
        return axios.get(RestAPI.SERVER_DOMAIN + 'status/all/' + Top)
            .catch(error => {
                console.log(error);
            });
    },
    GetStatus(StatusNumber) {
        return axios.get(RestAPI.SERVER_DOMAIN + 'status/get/' + StatusNumber)
            .catch(error => {
                console.log(error);
            });
    },
    // Post
    DoSubmit(data) {
        return new Promise((resolve, reject) => {
            axios.post(RestAPI.SERVER_DOMAIN + 'status/create', data)
                .then(response => {
                    resolve(response.data.Status)
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    Rejudge(data) {
        return new Promise((resolve, reject) => {
            axios.post(RestAPI.SERVER_DOMAIN + 'status/rejudge', data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
};