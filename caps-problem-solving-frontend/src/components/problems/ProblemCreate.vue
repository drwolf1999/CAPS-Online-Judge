<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card md-with-hover>
                <v-card-title>문제 추가</v-card-title>
                <v-form>
                    <v-row justify="center">
                        <v-col cols="11">
                            <Input v-bind:label="`제목`" v-bind:v_model="Problem.name" v-on:input="onChangeName"/>
                        </v-col>
                        <v-col cols="11">
                            <v-row>
                                <v-col cols="6">
                                    <Input v-bind:label="`메모리 제한`" v-bind:v_model="Problem.memory_limit" v-on:input="onChangeMemory"/>
                                </v-col>
                                <v-col cols="6">
                                    <Input v-bind:label="`시간 제한`" v-bind:v_model="Problem.time_limit" v-on:input="onChangeTime"/>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="11">
                            <Input v-bind:label="`문제 설명`" v-bind:v_model="Problem.description"
                                   v-on:input="onChangeDescription"/>
                        </v-col>
                        <v-col cols="11">
                            <Input v-bind:label="`문제 입력`" v-bind:v_model="Problem.input" v-on:input="onChangeInput"/>
                        </v-col>
                        <v-col cols="11">
                            <Input v-bind:label="`문제 출력`" v-bind:v_model="Problem.output" v-on:input="onChangeOutput"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card>
        </v-col>
        <v-col cols="11">
            <Button v-bind:color="`primary`" v-bind:block="true" v-bind:content="`Add Problem`"></Button>
        </v-col>
    </v-row>
</template>

<script>
    import Input from '@/components/form/Input.vue';
    import Button from '@/components/form/Button';
    // import ProblemService from '@/service/problem.js';

    export default {
        name: 'Create Problem',
        data() {
            return {
                Problem: {
                    name: '',
                    memory_limit: '',
                    time_limit: '',
                    description: '',
                    input: '',
                    output: '',
                    examples: [{input: '', output: ''}],
                }
            };
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
            onChangeDescription(value) {
                this.Problem.description = value;
            },
            onChangeInput(value) {
                this.Problem.input = value;
            },
            onChangeOutput(value) {
                this.Problem.output = value;
            },
        },
        components: {
            Input,
            Button,
        }
    }
</script>