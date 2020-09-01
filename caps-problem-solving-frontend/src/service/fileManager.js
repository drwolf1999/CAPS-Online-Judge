import axios from "axios";
import RestAPI from "@/constants/RestAPI";

export default {
    // Post
    Upload(problemNumber, data, onUploadProgress) {
        return axios.post(RestAPI.SERVER_DOMAIN + 'problem/testcase/upload/' + problemNumber, data, {
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            onUploadProgress
        });
    },
    GetFiles(ProblemNumber) {
        return axios.get(RestAPI.SERVER_DOMAIN + 'problem/testcase/get/' + ProblemNumber)
            .catch(error => {
                console.log(error);
            });
    },
};