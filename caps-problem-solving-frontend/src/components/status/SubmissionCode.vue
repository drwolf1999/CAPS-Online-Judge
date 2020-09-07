<template>
    <v-row justify="center">
        <v-col cols="11" v-if="!fetchingStatus && Status !== undefined && Status !== null">
            <v-card md-with-hover>
                <v-card-title>내 코드</v-card-title>
                <CodeEditor v-bind:language="Status.language" v-bind:initial-code="Status.code" v-bind:addOption="{readOnly: true}"></CodeEditor>
            </v-card>
        </v-col>
        <v-col cols="11" v-else>
            <v-skeleton-loader class="mx-auto" max-width="500" type="card"></v-skeleton-loader>
        </v-col>
    </v-row>
</template>

<script>
import SubmitConstants from '@/helper/SubmitConstants';
import StatusService from '@/service/status';
import LanguageConstants from '@/helper/Language';
import Utility from '@/helper/Utility';
import CodeEditor from "@/components/form/CodeEditor";

export default {
    name: 'SubmitCodeView',
    components: {CodeEditor},
    mounted() {
        this.fetchStatus();
    },
    props: ['submitNumber'],
    data() {
        return {
            fetchingStatus: false,
            Status: null,
        };
    },
    methods: {
        fetchStatus() {
            this.fetchingStatus = true;
            StatusService.GetStatus(this.submitNumber)
                .then(response => {
                    this.Status = response.data.Status;
                    this.fetchingStatus = false;
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
    computed: {
        Result() {
            return SubmitConstants.Result;
        },
        Language() {
            return LanguageConstants.Language;
        },
    },
    filters: {
        dateToString: function (value) {
            return Utility.convertDateToString(value);
        },
        doubleDigit: function (value) {
            return Utility.TimeDigit1To2(value);
        },
    },
};
</script>