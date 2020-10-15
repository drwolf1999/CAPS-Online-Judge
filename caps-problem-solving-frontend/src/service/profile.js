import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// auth 에 대한 Action 정의
export default {
    ProfileImageUrl: (username) => {
        return axios.get(RestAPI.SERVER_DOMAIN + 'profile/' + username + '/image')
            .catch(error => {
                console.log(error);
            });
        // return RestAPI.SERVER_DOMAIN + 'profile/' + username + '/image';
    },
    // Get
    GetProfile(username) {
        return axios.get(RestAPI.SERVER_DOMAIN + 'profile/' + username)
            .catch(error => {
                console.log(error);
            });
    },
    // Post
    UpdateProfile: async (username, data) => {
        return await axios.post(RestAPI.SERVER_DOMAIN + 'profile/update', data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
            .catch(error => {
                console.log(error);
            });
    },
};