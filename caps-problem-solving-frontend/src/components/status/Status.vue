<template>
    <v-row justify="center" v-if="isLogined">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>채점 현황</v-card-title>
                <v-data-table
                    :headers="stateHeaders"
                    :items="Status"
                    :loading="fetchingStatus"
                    :items-per-page="20"
                    hide-default-footer
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
                        <div v-if="item.judge_result === 1">{{ item.memory / 1024 }} <span class="red--text">KB</span></div>
                    </template>
                    <template v-slot:[`item.time`]="{ item }">
                        <div v-if="item.judge_result === 1">{{ item.time }} <span class="red--text">ms</span></div>
                    </template>
                    <template v-slot:[`item.language`]="{ item }">
                        <div v-if="item.user.username === GetUserName"><a href="javascript:void(0);" @click="ViewCode(item.number)">{{ Language[item.language].langName }}</a></div>
                        <div v-else>{{ Language[item.language].langName }}</div>
                    </template>
                    <template v-slot:[`item.submit_time`]="{ item }">
                        {{ item.submit_time | dateToString }}
                    </template>
                </v-data-table>
                <v-divider></v-divider>
                <div class="pt-10">
                    <v-btn @click="PrevPage" v-if="!IsFirst" icon color="teal" tile class="ma-2" outlined large>
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="NextPage" v-if="!IsLast" icon color="teal" tile class="ma-2" outlined large>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </div>
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
        this.$statusSocket.emit('connect');
        this.$statusSocket.on('result', (data) => {
            for (let i = this.Status.length - 1; i >= 0; i--) {
                if (this.Status[i].number === data.statusNumber) {
                    this.Status[i].judge_result = data.judge_result;
                    break;
                }
            }
        });
    },
    mounted() {
        this.FetchStatusSize();
        this.FetchStatus(0);
    },
    data() {
        return {
            stateHeaders: [
                {text: '채점 번호', align: 'center', sortable: false, value: 'number',},
                {text: '아이디', value: 'user', align: 'center', sortable: false,},
                {text: '문제 번호', value: 'problem', align: 'center', sortable: false,},
                {text: '결과', value: 'judge_result', align: 'center', sortable: false,},
                {text: '메모리', value: 'memory', align: 'center', sortable: false,},
                {text: '시간', value: 'time', align: 'center', sortable: false,},
                {text: '언어', value: 'language', align: 'center', sortable: false,},
                {text: '제출한 시간', value: 'submit_time', align: 'center', sortable: false,},
            ],
            fetchingStatus: false,
            stateLastNumber: 0,
            Status: [],
            nextState: null,
            updateTimer: null,
        };
    },
    methods: {
        FetchStatus(top) {
            this.Status.splice(0, this.Status.length);
            StatusService.GetAllStatus(top)
                .then(response => {
                    this.Status = response.data.Status;
                    this.nextState = response.data.nextState;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        FetchStatusSize() {
            StatusService.GetMaxNumber()
                .then(response => {
                    this.stateLastNumber = response.data.maxNumber;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        PrevPage() {
            if (this.IsFirst) return;
            this.FetchStatus(this.LastSubmitNumber + 20);
        },
        NextPage() {
            if (this.IsLast) return;
            this.FetchStatus(this.LastSubmitNumber - 20);
        },
        ViewCode(stateNumber) {
            this.$router.push({name: 'SubmitCodeView', params: {submitNumber: stateNumber}});
        },
        GoProblem(problemNumber) {
            this.$router.push({name: 'ProblemView', params: {problemNumber: problemNumber}});
        },
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
        LastSubmitNumber() {
            let ret = 0;
            for (let i = this.Status.length - 1; i >= 0; i--) {
                ret = Utility.Max(ret, this.Status[i].number);
            }
            return ret;
        },
        IsFirst() {
            return this.LastSubmitNumber === this.stateLastNumber;
        },
        IsLast() {
            return this.nextState === undefined || this.nextState === null;
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
    watch: {},
    destroyed() {
        this.$statusSocket.emit('disconnect');
        this.$statusSocket.removeAllListeners();
    },
};
</script>