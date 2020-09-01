<template>
    <v-row justify="center" v-if="isLogined">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>채점 현황</v-card-title>
                <v-data-table
                    :headers="stateHeaders"
                    :items="Status"
                    :loading="fetchingStatus"
                >
                    <template v-slot:[`item.problem`]="{ item }">
                        <a href="javascript:void(0);" @click="GoProblem(item.problem.number)">{{ item.problem.number }}</a>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        {{ item.user.username }}
                    </template>
                    <template v-slot:[`item.judge_result`]="{ item }">
                        <div :style="`vertical-align=center;color:` + Result[item.judge_result].color">{{ Result[item.judge_result].name }}</div>
                    </template>
                    <template v-slot:[`item.memory`]="{ item }">
                        {{ item.judge_result === 1 ? item.memory / 1024 : '' }}
                    </template>
                    <template v-slot:[`item.time`]="{ item }">
                        {{ item.judge_result === 1 ? item.time : '' }}
                    </template>
                    <template v-slot:[`item.language`]="{ item }">
                        <div v-if="item.user.username === GetUserName"><a href="javascript:void(0);" @click="ViewCode(item.number)">{{ Language[item.language] }}</a></div>
                        <div v-else>{{ Language[item.language] }}</div>
                    </template>
                    <template v-slot:[`item.submit_time`]="{ item }">
                        {{ item.submit_time | dateToString }}
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import SubmitConstants from '@/helper/SubmitConstants';
import StatusService from '@/service/status';
import LanguageConstants from '@/helper/Language';
import Utility from '@/helper/Utility';

export default {
    name: 'Status',
    mounted() {
        this.fetchStatus();
    },
    data() {
        return {
            stateHeaders: [
                {
                    text: '채점 번호',
                    align: 'center',
                    sortable: false,
                    value: 'number',
                },
                {text: '아이디', value: 'user', align: 'center',},
                {text: '문제 번호', value: 'problem', align: 'center',},
                {text: '결과', value: 'judge_result', align: 'center',},
                {text: '메모리', value: 'memory', align: 'center',},
                {text: '시간', value: 'time', align: 'center',},
                {text: '언어', value: 'language', align: 'center',},
                {text: '제출한 시간', value: 'submit_time', align: 'center',},
            ],
            fetchingStatus: false,
            page: 1,
            Status: [],
        };
    },
    methods: {
        fetchStatus() {
            this.Status.splice(0, this.Status.length);
            StatusService.GetAllStatus(this.page)
                .then(response => {
                    this.Status = response.data.Status;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        ViewCode(stateNumber) {
            this.$router.push({name: 'SubmitCodeView', params: {submitNumber: stateNumber}});
        },
        GoProblem(problemNumber) {
            this.$router.push({name: 'ProblemView', params: {problemNumber: problemNumber}});
        }
    },
    computed: {
        isLogined() {
            return this.$store.getters.isLogined;
        },
        Result() {
            return SubmitConstants.Result;
        },
        Language() {
            return LanguageConstants.Language;
        },
        GetUserName() {
            return this.$store.getters.getUserData.username;
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
}
</script>