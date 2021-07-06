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
                                    <router-link style="text-decoration:none;" :to="{name: 'ProblemView', params: {problemNumber: problem.number}}">{{ index + 1 | numberToAlphabet }}</router-link>
                                </th>
                            </template>
                            <template v-else>
                                <th class="text-center">상태 메시지</th>
                            </template>
                            <th class="text-center">점수{{ IsContestMOD ? '(+penalty)' : '' }}</th>
                            <template v-if="!IsContestMOD">
                                <th class="text-center">정답 수</th>
                                <th class="text-center">제출 수</th>
                            </template>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(standing, index) in Standings" v-bind:key="standing.user.username">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <v-avatar v-if="!IsContestMOD" size="30" color="white">
                                    <v-img v-if="standing.user.profileImage" v-bind:src="`data:image/png;base64,` + standing.user.profileImage"></v-img>
                                    <v-icon v-else>mdi-account-circle</v-icon>
                                </v-avatar>
                                <router-link
                                    :to="{name: 'Profile', params: {username: standing.user.username}}">
                                    <username v-if="!IsContestMOD" v-bind:username="standing.user.username" v-bind:rank="index"></username>
                                    <template v-else>{{ standing.user.username }}</template>
                                </router-link>
                            </td>
                            <template v-if="IsContestMOD">
                                <td v-for="problem in Problems" v-bind:key="problem.number" :class="GetColor(standing.problem, problem.number)">
                                    {{ GetAttempt(standing.problem, problem.number) }}
                                </td>
                            </template>
                            <template v-else>
                                <td>{{ standing.user.statusMessage }}</td>
                            </template>
                            <td>{{ standing.score | realNumber }}</td>
                            <template v-if="!IsContestMOD">
                                <td class="text-center">{{ standing.answers }}</td>
                                <td class="text-center">{{ standing.submits }}</td>
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
import ProfileService from '@/service/profile';
import Username from "@/components/form/Username";

export default {
    name: 'Ranking',
    components: {Username},
    mounted() {
        this.fetchProblems();
        this.fetchStanding();
    },
    data: () => {
        return {
            Query: '',
            Problems: [],
            Standings: [],
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
                .then(async (response) => {
                    for (let i = response.data.Users.length - 1; i >= 0; i--) {
                        const imageD = await ProfileService.ProfileImageUrl(response.data.Users[i].user.username);
                        response.data.Users[i].user.profileImage = imageD.data;
                    }
                    this.Standings = response.data.Users;
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