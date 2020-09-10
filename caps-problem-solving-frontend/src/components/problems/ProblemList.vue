<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>
                    문제 목록 ({{ Problems.length }})
                    <v-spacer></v-spacer>
                    <Input v-bind:data="Query" v-on:input="onChangeQuery"/>
                </v-card-title>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-left" style="width: 20%;">문제 번호</th>
                            <th class="text-left" style="width: 40%;">제목</th>
                            <th class="text-left" style="width: 20%;">정보</th>
                            <th class="text-center" style="width: 10%;">맞은 사람</th>
                            <th class="text-center" style="width: 10%;">제출 수</th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr v-if="fetchingProblems">
                            <td colspan="5">
                                <v-progress-linear indeterminate></v-progress-linear>
                            </td>
                        </tr>
                        <tr v-else v-for="(problem) in Problems" v-bind:key="problem.number">
                            <td class="text-left">{{ problem.number }}</td>
                            <td class="text-left"><a href="javascript:void(0)" @click="ProblemClick(problem.number)">{{ problem.name }}</a></td>
                            <td class="align-center">
                                <v-chip-group>
                                    <v-chip
                                        v-if="problem.number in userJudgeResult && userJudgeResult[problem.number] !== -1"
                                        text-color="white"
                                        :color="Color(userJudgeResult[problem.number])"
                                    >{{ Text(userJudgeResult[problem.number]) }}
                                    </v-chip>
                                </v-chip-group>
                            </td>
                            <td>{{ problem.answers }}</td>
                            <td>{{ problem.submits }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
        <v-col cols="11">
            <router-link v-if="isAdmin" :to="'/problem/create'">
                <Button v-bind:color="`primary`" v-bind:block="true" v-bind:content="`Add Problem`"></Button>
            </router-link>
        </v-col>
    </v-row>
</template>

<script>
import Input from '@/components/form/Input.vue';
import Button from '@/components/form/Button';
import ProblemService from '@/service/problem.js';
import SubmitConstants from '@/helper/SubmitConstants';

export default {
    name: 'ProblemList',
    mounted() {
        this.fetchProblems();
        this.fetchProblemsCount();
    },
    data() {
        return {
            Query: '',
            fetchingProblems: false,
            fetchingProblemsCount: false,
            ProblemCount: 0,
            Problems: [],
            userJudgeResult: {},
        };
    },
    methods: {
        fetchProblems() {
            this.fetchingProblems = true;
            ProblemService.GetAllProblems()
                .then(response => {
                    this.Problems = response.data.Problems;
                    this.userJudgeResult = response.data.userJudgeResult;
                    this.fetchingProblems = false;
                })
                .catch(error => {
                    this.$notify({
                        title: '서버 오류 발생',
                        text: '문제를 읽어들이는 과정에서 오류가 발생하였습니다.',
                        type: 'error',
                    });
                    console.log(error);
                })
        },
        fetchProblemsCount() {
            this.fetchingProblems = true;
            ProblemService.GetCountOfProblems()
                .then(response => {
                    this.fetchingProblemsCount = false;
                    this.ProblemCount = response.data.count;
                })
        },
        onChangeQuery(value) {
            this.Query = value;
        },
        ProblemClick(problemId) {
            this.$router.push({name: 'ProblemView', params: {problemNumber: problemId}});
        },
        Color(i) {
            return SubmitConstants.Result[i].color;
        },
        Text(i) {
            return SubmitConstants.Result[i].name;
        }
    },
    watch: {
        '$route.query'() {
            this.fetchProblems();
        }
    },
    computed: {
        isAdmin() {
            return this.$store.getters.getUserData.permission >= 1;
        },
    },
    components: {
        Input,
        Button,
    },
};
</script>