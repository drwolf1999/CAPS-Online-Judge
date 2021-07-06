import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// auth 에 대한 Action 정의
export default {
    // Post
    DoRegister(data) {
        return axios.post(RestAPI.SERVER_DOMAIN + 'user/register', data)
            .catch(error => {
                console.log(error);
            });
    },
};