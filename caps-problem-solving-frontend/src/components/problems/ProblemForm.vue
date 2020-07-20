<template>
    <v-row justify="center">
        <v-col cols="11">
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
                                <v-col cols="6">
                                    <Input v-bind:label="`메모리 제한`" v-bind:model="Problem.memory_limit" v-on:input="onChangeMemory"/>
                                </v-col>
                                <v-col cols="6">
                                    <Input v-bind:label="`시간 제한`" v-bind:model="Problem.time_limit" v-on:input="onChangeTime"/>
                                </v-col>
                            </v-row>
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
        <v-col cols="11">
            <Button v-if="isCreate" v-bind:color="`primary`" v-bind:block="true" v-bind:content="`Add Problem`" v-on:click.native="DoCreateProblem"></Button>
            <Button v-else v-bind:color="`primary`" v-bind:block="true" v-bind:content="`Modify Problem`" v-on:click.native="DoCreateProblem"></Button>
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
                    description: {},
                    input: {},
                    output: {},
                    examples: [{input: '', output: ''}],
                },
            };
        },
        props: ['initialProblem'],
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
            onChangeDescription(value) {
                this.Problem.description = value;
            },
            onChangeInput(value) {
                this.Problem.input = value;
            },
            onChangeOutput(value) {
                this.Problem.output = value;
            },
            DoCreateProblem() {
                if (this.Problem.name === '') {
                    this.$notify({
                        title: '제목은 필수입니다',
                        text: '제목을 입력해 주세요',
                        type: 'warn',
                    });
                    return;
                }
                if (this.Problem.description === '') {
                    this.$notify({
                        title: '문제 설명은 필수입니다',
                        text: '설명을 입력해 주세요',
                        type: 'warn',
                    });
                    return;
                }
                ProblemService.CreateProblem({
                    name: this.Problem.name,
                    memory_limit: this.Problem.memory_limit,
                    time_limit: this.Problem.time_limit,
                    description: JSON.stringify(this.Problem.description),
                    input: JSON.stringify(this.Problem.input),
                    output: JSON.stringify(this.Problem.output),
                    examples: JSON.stringify(this.Problem.examples),
                })
                    .then(response => {
                        this.$notify({
                            title: '문제 등록이 완료되었습니다.',
                            text: '문제 페이지로 이동합니다.',
                            type: 'success',
                        });
                        this.$router.push('/problem/view/' + response.data.Problem.number);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
        },
        components: {
            Input,
            Button,
            Editor,
        }
    }
</script>