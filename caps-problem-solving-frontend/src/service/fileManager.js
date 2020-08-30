import axios from "axios";
import RestAPI from "@/constants/RestAPI";

export default {
    // Post
    Upload(problemNumber, file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        return axios.post(RestAPI.SERVER_DOMAIN + 'problem/testcase/upload/' + problemNumber, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
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