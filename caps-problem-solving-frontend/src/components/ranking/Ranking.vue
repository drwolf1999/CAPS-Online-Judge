<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>
                    랭킹
                    <v-spacer></v-spacer>
                    <Input v-bind:data="Query" v-on:input="onChangeQuery"/>
                </v-card-title>
                <v-simple-table :loading="fetchingRanking !== 2">
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-center">등수</th>
                            <th class="text-center">아이디</th>
                            <th class="text-center" v-for="(problem, index) in Problems" v-bind:key="problem.number">
                                <a style="text-decoration:none;" href="javascript:void(0);" @click="goProblem(problem.number)">{{ index + 1 | numberToAlphabet }}</a>
                            </th>
                            <th class="text-center">점수(+penalty)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(user, index) in Users" v-bind:key="user.username">
                            <td>{{ index + 1 }}</td>
                            <td>{{ user.username }}</td>
                            <td v-for="problem in Problems" v-bind:key="problem.number" :class="GetColor(user.username, problem.number)">
                                {{ GetAttempt(user.username, problem.number) }}
                            </td>
                            <td>{{ user.score | realNumber }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import ProblemService from '@/service/problem';
import StandingService from '@/service/standing';
import SubmitConstants from '@/helper/SubmitConstants';
import Utility from "@/helper/Utility";

export default {
    name: 'Ranking',
    mounted() {
        this.fetchProblems();
        this.fetchStanding();
    },
    data: () => {
        return {
            Query: '',
            Users: [],
            Problems: [],
            Standing: [],
            fetchingRanking: 2,
        };
    },
    computed: {},
    methods: {
        isIn(username, problemNumber) {
            if (!(username in this.Standing)) return false;
            if (!(problemNumber in this.Standing[username])) return false;
            return true;
        },
        GetColor(username, problemNumber) {
            if (!this.isIn(username, problemNumber)) return null;
            const res = this.Standing[username][problemNumber].judge_result;
            return SubmitConstants.Result[res].class;
        },
        GetAttempt(username, problemNumber) {
            if (!this.isIn(username, problemNumber)) return '';
            const s = this.Standing[username][problemNumber];
            return -(s.submit_count - 1);
        },
        onChangeQuery(value) {
            this.Query = value;
        },
        goProblem(problemNumber) {
            this.$router.push({name: 'ProblemView', params: {problemNumber: problemNumber}});
        },
        fetchProblems() {
            this.fetchingRanking--;
            ProblemService.GetAllProblems()
                .then(response => {
                    this.Problems = response.data.Problems;
                    this.fetchingRanking++;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        fetchStanding() {
            this.fetchingRanking--;
            StandingService.GetAll()
                .then(response => {
                    this.Standing = response.data.Standing;
                    this.Users = response.data.Users;
                    this.fetchingRanking++;
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
    filters: {
        numberToAlphabet(number) {
            return Utility.numberToAlphabet(number);
        },
        realNumber(number) {
            return Utility.realNumber(number);
        },
    },
};
</script>