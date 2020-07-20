import axios from 'axios';
import RestAPI from '../constants/RestAPI.js';

// auth 에 대한 Action 정의
export default {
    // Get
    GetAllStatus(Page) {
        return axios.get(RestAPI.SERVER_DOMAIN + 'status/all/' + Page)
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
};

/*
router.get('/all/:page', controller.All);
router.get('/get/:statusNumber', controller.Get);
router.post('/create', controller.Create);
* */