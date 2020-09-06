import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// auth 에 대한 Action 정의
export default {
    // Post
    GetAll() {
        return axios.get(RestAPI.SERVER_DOMAIN + 'standing/all')
            .catch(error => {
                console.log(error);
            });
    },
};