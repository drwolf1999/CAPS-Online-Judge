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
                            <template v-if="IsContestMOD">
                                <th class="text-center" v-for="(problem, index) in Problems" v-bind:key="problem.number">
                                    <a style="text-decoration:none;" href="javascript:void(0);" @click="goProblem(problem.number)">{{ index + 1 | numberToAlphabet }}</a>
                                </th>
                            </template>
                            <th class="text-center">점수{{ IsContestMOD ? '(+penalty)' : '' }}</th>
                            <template v-if="!IsContestMOD">
                                <th class="text-center">정답 수</th>
                                <th class="text-center">제출 수</th>
                            </template>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(user, index) in Users" v-bind:key="user.username">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <router-link
                                    :to="{name: 'Profile', params: {username: user.username}}">
                                    {{ user.username }}
                                </router-link>
                            </td>
                            <template v-if="IsContestMOD">
                                <td v-for="problem in Problems" v-bind:key="problem.number" :class="GetColor(user.problem, problem.number)">
                                    {{ GetAttempt(user.problem, problem.number) }}
                                </td>
                            </template>
                            <td>{{ user.score | realNumber }}</td>
                            <template v-if="!IsContestMOD">
                                <td class="text-center">{{ user.answers }}</td>
                                <td class="text-center">{{ user.submits }}</td>
                            </template>
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
    computed: {
        IsContestMOD() {
            return process.env.VUE_APP_CONTEST_MOD === 'true';
        },
    },
    methods: {
        getUserProblem(userProblems, problemNumber) {
            for (let i = userProblems.length - 1; i >= 0; i--) {
                if (userProblems[i].number === problemNumber) {
                    return userProblems[i];
                }
            }
            return null;
        },
        GetColor(userProblems, problemNumber) {
            const userProblem = this.getUserProblem(userProblems, problemNumber);
            if (userProblem === undefined || userProblem === null) return null;
            const res = userProblem.judge_result;
            return SubmitConstants.Result[res].class;
        },
        GetAttempt(userProblems, problemNumber) {
            const userProblem = this.getUserProblem(userProblems, problemNumber);
            if (userProblem === undefined || userProblem === null) return '';
            return -(userProblem.submit_count - 1);
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