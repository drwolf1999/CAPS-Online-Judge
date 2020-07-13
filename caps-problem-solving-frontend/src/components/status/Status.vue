<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>채점 현황</v-card-title>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-center">채점 번호</th>
                            <th class="text-center">아이디</th>
                            <th class="text-center">문제 번호</th>
                            <th class="text-center">결과</th>
                            <th class="text-center">메모리</th>
                            <th class="text-center">시간</th>
                            <th class="text-center">언어</th>
                            <th class="text-center">코드 길이</th>
                            <th class="text-center">제출한 시간</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-if="fetchingStatus">
                            <td colspan="4">
                                <v-progress-linear indeterminate></v-progress-linear>
                            </td>
                        </tr>
                        <tr v-else v-for="(state) in Status" v-bind:key="state.number">
                            <td>{{ state.number }}</td>
                            <td>{{ state.user.username }}</td>
                            <td>{{ state.problem.number }}</td>
                            <td v-bind:style="{color: Result[state.judge_result].color}">{{ Result[state.judge_result].name }}</td>
                            <td>{{ state.memory }}</td>
                            <td>{{ state.time }}</td>
                            <td>{{ Language[state.language] }}</td>
                            <td>{{ state.code_length }}</td>
                            <td>{{ state.submit_time | dateToString }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
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
                fetchingStatus: false,
                page: 1,
                Status: [
                ],
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
    }
</script>