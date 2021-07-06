<template>
    <v-row justify="center">
        <v-col :cols="isCreate ? 11 : 12">
            <v-card md-with-hover>
                <v-card-title v-if="isCreate">문제 추가</v-card-title>
                <v-card-title v-else>문제 수정</v-card-title>
                <v-form>
                    <v-row justify="center">
                        <v-col cols="11">
                            <Input v-bind:label="`제목`" v-bind:model="Problem.name" v-on:input="onChangeName"/>
                        </v-col>
                        <v-col cols="11">
                            <v-row>
                                <v-col cols="4">
                                    <Input v-bind:label="`메모리 제한`" v-bind:model="Problem.memory_limit.toString()" v-on:input="onChangeMemory"/>
                                </v-col>
                                <v-col cols="4">
                                    <Input v-bind:label="`시간 제한`" v-bind:model="Problem.time_limit.toString()" v-on:input="onChangeTime"/>
                                </v-col>
                                <v-col cols="4">
                                    <Input v-bind:label="`score`" v-bind:model="Problem.score.toString()" v-on:input="onChangeScore"/>
                                </v-col>

                            </v-row>
                        </v-col>
                        <v-col cols="11" class="text-left">
                            <v-btn
                                absolute
                                dark
                                fab
                                top
                                right
                                icon
                                color="black"
                            >
                                <a target="_blank" style="color: inherit;" href="https://katex.org/" title="본 COJ는 katex문법을 통해 수식을 생성합니다. 이 링크를 통해 수식을 추가하는 법을 읽어보세요.">
                                    <v-icon>mdi-progress-question</v-icon>
                                </a>
                            </v-btn>
                        </v-col>
                        <v-col cols="11">
                            <Editor v-bind:label="`문제`" v-bind:content="Problem.description" v-on:input="onChangeDescription"/>
                        </v-col>
                        <v-col cols="11">
                            <Editor v-bind:label="`입력`" v-bind:content="Problem.input" v-on:input="onChangeInput"/>
                        </v-col>
                        <v-col cols="11">
                            <Editor v-bind:label="`출력`" v-bind:content="Problem.output" v-on:input="onChangeOutput"/>
                        </v-col>
                        <v-col cols="11">
                            <v-row v-for="(example, index) in Problem.examples" v-bind:key="index">
                                <v-col cols="6">
                                    <v-textarea v-bind:label="`예제 입력 ` + (index + 1)" v-model="example.input"></v-textarea>
                                </v-col>
                                <v-col cols="6">
                                    <v-textarea v-bind:label="`예제 출력 ` + (index + 1)" v-model="example.output"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-col>
        <v-col :cols="isCreate ? 11 : 12">
            <Button v-if="isCreate" v-bind:color="`primary`" v-bind:block="true" v-bind:content="`Add Problem`" v-on:click.native="DoCreateProblem"></Button>
            <Button v-else v-bind:color="`primary`" v-bind:block="true" v-bind:content="`Update Problem`" v-on:click.native="DoUpdateProblem"></Button>
        </v-col>
    </v-row>
</template>

<script>
import Input from '@/components/form/Input.vue';
import Button from '@/components/form/Button';
import Editor from '@/components/form/Editor';
import ProblemService from '@/service/problem.js';

export default {
    name: 'ProblemForm',
    data() {
        return {
            isCreate: this.initialProblem === undefined || this.initialProblem === null,
            Problem: this.initialProblem !== undefined && this.initialProblem !== null ? this.initialProblem : {
                name: '',
                memory_limit: '128',
                time_limit: '1',
                score: '0',
                description: {},
                input: {},
                output: {},
                examples: [{input: '', output: ''}],
            },
        };
    },
    props: {
        initialProblem: {
            type: Object,
            default: null,
        },
    },
    methods: {
        onChangeName(value) {
            this.Problem.name = value;
        },
        onChangeMemory(value) {
            this.Problem.memory_limit = value;
        },
        onChangeTime(value) {
            this.Problem.time_limit = value;
        },
        onChangeScore(value) {
            this.Problem.score = value;
        },
        onChangeDescription(value) {
            this.Problem.description = value;
        },
        onChangeInput(value) {
            this.Problem.input = value;
        },
        onChangeOutput(value) {
            this.Problem.output = value;
        },
        isOKProblem() {
            const regexp = /^[0-9]*$/;
            if (this.Problem.name === '') {
                this.$notify({
                    title: '제목은 필수입니다',
                    text: '제목을 입력해 주세요',
                    type: 'warn',
                });
                return false;
            }
            if (this.Problem.description === '') {
                this.$notify({
                    title: '문제 설명은 필수입니다',
                    text: '설명을 입력해 주세요',
                    type: 'warn',
                });
                return false;
            }
            if (!regexp.test(this.Problem.time_limit) || !regexp.test(this.Problem.memory_limit) || !regexp.test(this.Problem.score)) {
                this.$notify({
                    title: 'time, memory score must be integer 입니다',
                    text: '설명을 입력해 주세요',
                    type: 'warn',
                });
                return false;
            }
            return true;
        },
        DoCreateProblem() {
            if (!this.isOKProblem()) return;
            ProblemService.CreateProblem({
                name: this.Problem.name,
                memory_limit: this.Problem.memory_limit,
                time_limit: this.Problem.time_limit,
                score: this.Problem.score,
                description: JSON.stringify(this.Problem.description),
                input: JSON.stringify(this.Problem.input),
                output: JSON.stringify(this.Problem.output),
                examples: JSON.stringify(this.Problem.examples),
            })
                .then((response) => {
                    this.$notify({
                        title: '문제 등록이 완료되었습니다.',
                        text: '문제 페이지로 이동합니다.',
                        type: 'success',
                    });
                    this.$router.push({name: 'ProblemView', params: {problemNumber: response.Problem.number}});
                })
                .catch(error => {
                    console.log(error);
                })
        },
        DoUpdateProblem() {
            if (!this.isOKProblem()) return;
            console.log(this.Problem.description);
            ProblemService.UpdateProblem(this.Problem.number, {
                name: this.Problem.name,
                memory_limit: this.Problem.memory_limit,
                time_limit: this.Problem.time_limit,
                score: this.Problem.score,
                description: JSON.stringify(this.Problem.description),
                input: JSON.stringify(this.Problem.input),
                output: JSON.stringify(this.Problem.output),
                examples: JSON.stringify(this.Problem.examples),
            })
                .then((response) => { // eslint-disable-line
                    this.$notify({
                        title: '문제 수정이 완료되었습니다.',
                        type: 'success',
                    });
                    this.$emit('finished');
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
    components: {
        Input,
        Button,
        Editor,
    },
};
</script>