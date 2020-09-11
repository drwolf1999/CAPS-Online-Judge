<template>
    <v-row justify="center">
        <v-col cols="11" v-if="Problem && Problem.number === ProblemNumber">
            <v-card md-with-hover v-if="!isModifying">
                <v-card-title>{{ Problem.number }}. {{ Problem.name }}</v-card-title>
                <v-form>
                    <v-row justify="center">
                        <v-col cols="11">
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                    <tr>
                                        <th class="text-center">메모리 제한</th>
                                        <th class="text-center">시간 제한</th>
                                        <th class="text-center">점수</th>
                                        <th class="text-center">맞은 수</th>
                                        <th class="text-center">제출 수</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{{ Problem.memory_limit }} MB</td>
                                        <td>{{ Problem.time_limit }} 초</td>
                                        <td>{{ Problem.score }}</td>
                                        <td>{{ Problem.answers }}</td>
                                        <td>{{ Problem.submits }}</td>
                                    </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-col>
                        <v-col cols="11">
<!--                            {{ // Problem }}-->
                            <Editor v-bind:label="`문제`" v-bind:content="Problem.description" v-bind:read-only="true"/>
                        </v-col>
                        <v-col cols="11">
                            <Editor v-bind:label="`입력`" v-bind:content="Problem.input" v-bind:read-only="true"/>
                        </v-col>
                        <v-col cols="11">
                            <Editor v-bind:label="`출력`" v-bind:content="Problem.output" v-bind:read-only="true"/>
                        </v-col>
                        <v-col cols="11">
                            <v-row v-for="(example, index) in Problem.examples" v-bind:key="index" no-gutters>
                                <v-col cols="6">
                                    <v-card class="pa-2" outlined tile>
                                        <v-card-subtitle class="text-left">예제 입력 {{ index + 1 }}</v-card-subtitle>
                                        <p class="text-left" :inner-html.prop="example.input | newline"></p>
                                    </v-card>
                                </v-col>
                                <v-col cols="6">
                                    <v-card class="pa-2" outlined tile>
                                        <v-card-subtitle class="text-left">예제 출력 {{ index + 1 }}</v-card-subtitle>
                                        <div class="text-left" :inner-html.prop="example.output | newline"></div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-if="isAdmin" class="blue--text lighten-2" v-bind:content="`문제 수정`" v-bind:text-btn="true" v-on:click.native="UpdateMod"></Button>
                </v-card-actions>
            </v-card>
            <ProblemForm v-else :initial-problem="Problem" v-on:finished="FinishUpdateMod"></ProblemForm>
            <v-col></v-col>
            <v-divider></v-divider>
            <ProblemSubmit v-bind:problem-id="Problem.number"></ProblemSubmit>
            <v-col></v-col>
            <v-spacer></v-spacer>
            <router-link v-if="isAdmin" :to="'/problem/testcase/modify/' + Problem.number">
                <Button v-bind:content="`testcase`" v-bind:color="`primary`" v-bind:block="true"></Button>
            </router-link>
        </v-col>
        <v-col v-else>
            <v-sheet :color="`lighten-4`" class="px-10 pt-10 pb-10">
                <v-skeleton-loader class="mx-auto" max-width="500" type="card"></v-skeleton-loader>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import Editor from '@/components/form/Editor';
import ProblemSubmit from '@/components/problems/ProblemSubmit';
import Button from "@/components/form/Button";
import ProblemForm from "@/components/problems/ProblemForm";

export default {
    name: 'ProblemView',
    data() {
        return {
            ProblemNumber: parseInt(this.problemNumber),
            isModifying: false,
        };
    },
    props: ['problemNumber'],
    mounted() {
        this.$store.dispatch('fetchProblem', this.problemNumber);
    },
    computed: {
        Problem() {
            return this.$store.getters.getProblem;
        },
        isAdmin() {
            return this.$store.getters.getUserData.permission >= 1;
        },
    },
    methods: {
        UpdateMod() {
            this.isModifying = true;
        },
        FinishUpdateMod() {
            this.isModifying = false;
            this.$store.dispatch('fetchProblem', this.ProblemNumber);
        },
    },
    filters: {
        newline(text) {
            return text.replace(/\n/g, '<br>');
        }
    },
    components: {
        ProblemForm,
        Button,
        ProblemSubmit,
        Editor,
    },
};
</script>