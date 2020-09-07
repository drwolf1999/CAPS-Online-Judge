<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card>
                <v-card-title>재채점</v-card-title>
                <v-card-text>
                    <v-radio-group row v-model="selectRejudge">
                        <v-radio v-for="(l, i) in label" :value="i" :label="l" :key="i"></v-radio>
                    </v-radio-group>
                    <Input :label="`번호`" v-bind:model="problemNumber" v-on:input="onChangeNumber"/>
                </v-card-text>
                <v-card-actions>
                    <Button v-bind:text-btn="true" v-bind:content="`재채점`" v-on:click.native="DoRejudge"></Button>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import StatusService from '@/service/status';

export default {
    name: 'Rejudge',
    components: {Input, Button},
    data() {
        return {
            selectRejudge: 0,
            label: [`문제 재채점`, '전체 재채점 (WARNING!!!!!)'],
            problemNumber: '',
        };
    },
    methods: {
        onChangeNumber(value) {
            this.problemNumber = value;
        },
        DoRejudge() {
            StatusService.Rejudge({
                problemNumber: this.problemNumber,
                type: this.selectRejudge,
            })
                .then(response => {
                    if (response.result) {
                        this.$notify({
                            title: '재채점 시작',
                            text: '',
                            type: 'success',
                        });
                        this.$router.push({name: 'Status'});
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
};
</script>