<template>
    <v-row justify="center">
        <v-col cols="11">
            <file-browser :storages="'local'" :default-path="problemNumber" :axiosConfig="{baseURL: BASEURL}"/>
        </v-col>
    </v-row>
</template>

<script>
import FileBrowser from "@/components/testcase/FileBrowser";
import RestAPI from "@/constants/RestAPI";

export default {
    components: {
        FileBrowser
    },
    props: ['problemNumber'],
    computed: {
        BASEURL() {
            return RestAPI.SERVER_DOMAIN;
        },
    },
};
</script>