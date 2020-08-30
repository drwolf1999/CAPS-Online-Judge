<template>
    <v-row justify="center">
        <v-col cols="11" v-if="Problem && Problem.number === ProblemNumber">
            <v-card md-with-hover>
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
                                        <th class="text-center">맞은 수</th>
                                        <th class="text-center">제출 수</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{{ Problem.memory_limit }} MB</td>
                                        <td>{{ Problem.time_limit }} 초</td>
                                        <td>{{ Problem.answers }}</td>
                                        <td>{{ Problem.submits }}</td>
                                    </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-col>
                        <v-col cols="11">
                            <v-subheader>문제</v-subheader>
                            <EditorView v-bind:label="`문제`" v-bind:content="Problem.description"/>
                        </v-col>
                        <v-col cols="11">
                            <v-subheader>입력</v-subheader>
                            <EditorView v-bind:label="`입력`" v-bind:content="Problem.input"/>
                        </v-col>
                        <v-col cols="11">
                            <v-subheader>출력</v-subheader>
                            <EditorView v-bind:label="`출력`" v-bind:content="Problem.output"/>
                        </v-col>
                        <v-col cols="11">
                            <v-row v-for="(example, index) in Problem.examples" v-bind:key="index" no-gutters>
                                <v-col cols="6">
                                    <v-card class="pa-2" outlined tile>
                                        <v-card-subtitle class="text-left">예제 입력 {{ index + 1 }}</v-card-subtitle>
                                        <p class="text-left">
                                            {{ example.input }}
                                        </p>
                                    </v-card>
                                </v-col>
                                <v-col cols="6">
                                    <v-card class="pa-2" outlined tile>
                                        <v-card-subtitle class="text-left">예제 출력 {{ index + 1 }}</v-card-subtitle>
                                        <p class="text-left">
                                            {{ example.output }}
                                        </p>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
            <v-col></v-col>
            <v-divider></v-divider>
            <ProblemSubmit v-bind:problem-id="Problem._id"></ProblemSubmit>
            <v-col></v-col>
            <v-spacer></v-spacer>
            <router-link :to="'/problem/testcase/modify/' + Problem.number">
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
import EditorView from '@/components/form/EditorView';
import ProblemSubmit from '@/components/problems/ProblemSubmit';
import Button from "@/components/form/Button";

export default {
    name: 'ProblemView',
    data() {
        return {
            ProblemNumber: parseInt(this.problemNumber),
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
    },
    methods: {},
    components: {
        Button,
        ProblemSubmit,
        EditorView,
    }
}
</script>