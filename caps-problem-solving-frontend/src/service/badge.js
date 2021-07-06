import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// problem 에 대한 Action 정의
export default {
    // Get
    GetAll() {
        return axios.get(RestAPI.SERVER_DOMAIN + 'badge/all')
            .catch(error => {
                // console.log(error);
            });
    },
    GetByUser(username) {
        return axios.get(RestAPI.SERVER_DOMAIN + 'badge/user/get/' + username)
            .catch(error => {
                // console.log(error);
            });
    },
    // Post
    async Create(data) {
        return await axios.post(RestAPI.SERVER_DOMAIN + 'badge/create', data)
            .catch(error => {
                console.log(error);
            });
    },
    async Add(data) {
        return await axios.post(RestAPI.SERVER_DOMAIN + 'badge/user/add', data)
            .catch(error => {
                console.log(error);
            });
    },
};