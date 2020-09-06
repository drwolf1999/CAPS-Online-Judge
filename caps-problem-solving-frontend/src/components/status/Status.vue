<template>
    <v-row justify="center" v-if="isLogined">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>채점 현황</v-card-title>
                <v-data-table
                    :headers="stateHeaders"
                    :items="Status"
                    :loading="fetchingStatus"
                    item-key="number"
                    loading-text="fetching....."
                >
                    <template v-slot:[`item.problem`]="{ item }">
                        <a href="javascript:void(0);" @click="GoProblem(item.problem.number)">{{ item.problem.number }}</a>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        {{ item.user.username }}
                    </template>
                    <template v-slot:[`item.judge_result`]="{ item }">
                        <div :style="`vertical-align: middle;color:` + Result[item.judge_result].color">
                            {{ Result[item.judge_result].name }}
                            <v-progress-circular
                                v-if="item.judge_result === 6"
                                :size="20"
                                :width="1"
                                :color="Result[item.judge_result].color"
                                indeterminate
                            ></v-progress-circular>
                        </div>
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
    created() {
        this.$socket.on('result', (data) => {
            // if (!data.success) this.$notify({
            //     title: '에러 발생',
            //     text: '관리자에게 연락 바랍니다.',
            //     type: 'error',
            // });
            // else
            console.log(data.Status.judge_result);
            this.Status.splice(0, 1, data.Status);
            if (data.Status.judge_result >= 6) setTimeout(this.$socket.emit('getStatus', {statusNumber: data.statusNumber, judge_result: data.Status.judge_result}), 1000);
        });
        this.UpdateStatus();
    },
    mounted() {
        this.FetchStatus();
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
            updateTimer: null,
        };
    },
    methods: {
        FetchStatus() {
            this.Status.splice(0, this.Status.length);
            StatusService.GetAllStatus(this.page)
                .then(response => {
                    this.Status = response.data.Status;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        UpdateStatus() {
            if (this.Status.length > 0) {
                const f = this.Status[0];
                this.$socket.emit('joinStatus', {statusNumber: f.number});

                this.$socket.emit('getStatus', {statusNumber: f.number, judge_result: f.judge_result});
            }
            // for (let i = 0; i < this.Status.length; i++) {
            //     const f = this.Status[i];
            //     let type = true;
            //     if (f.judge_result >= 6) {
            //         console.log(f.number);
            //         this.$socket.emit('joinStatus', {statusNumber: f.number});
            //
            //         this.$socket.emit('getStatus', {statusNumber: f.number});
            //
            //         this.$socket.on('result', (data) => {
            //             type = data.success;
            //             if (!type) this.$notify({
            //                 title: '에러 발생',
            //                 text: '관리자에게 연락 바랍니다.',
            //                 type: 'error',
            //             });
            //             else this.Status.splice(i, 1, data.Status);
            //         });
            //     }
            // }
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
    watch: {
        Status(n, o) {
            if (n !== o) this.UpdateStatus();
        },
    },
}
</script>