<template>
    <v-card>
        <v-card-title>코드</v-card-title>
        <v-row justify="center">
            <v-col cols="11">
                <v-autocomplete v-model="selectedLanguage" :items="Language" item-value="id" item-text="language.langName"></v-autocomplete>
            </v-col>
        </v-row>
        <CodeEditor :language="selectedLanguage" v-bind:initial-code="code" v-on:input="onChangeCode"></CodeEditor>
        <v-breadcrumbs></v-breadcrumbs>
        <Button v-if="isWriteCode" v-bind:content="`제출`" v-bind:color="`primary`" v-on:click.native="onSubmit"></Button>
        <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
    </v-card>
</template>

<script>
import CodeEditor from '@/components/form/CodeEditor';
import Button from '@/components/form/Button';
import StatusService from '@/service/status';
import Language from '@/helper/Language';

export default {
    components: {
        Button,
        CodeEditor,
    },
    data() {
        return {
            isWriteCode: true,
            code: '',
            languageQuery: '',
            selectedLanguage: this.$store.getters.getLastSubmitLanguage || 0,
        }
    },
    props: {
        problemId: Number,
    },
    methods: {
        onChangeCode(value) {
            this.code = value;
        },
        onSubmit() {
            if (this.getUserId === undefined || this.getUserId === null) {
                this.$notify({
                    title: '로그인을 먼저 해주세요',
                    text: '',
                    type: 'warn',
                });
                return;
            }
            if (this.problemId === undefined || this.problemId === '') {
                this.$notify({
                    title: '올바른 접근이 아닙니다.',
                    text: '',
                    type: 'warn',
                });
                return;
            }
            this.$store.dispatch('setLastSubmitLanguage', this.selectedLanguage);
            this.isWriteCode = !this.isWriteCode;
            StatusService.DoSubmit({
                username: this.getUserId,
                problem: this.problemId,
                code: this.code,
                language: this.selectedLanguage,
            })
                .then(() => {
                    this.$notify({
                        title: '제출 완료',
                        text: '제출 페이지로 이동합니다.',
                        type: 'success',
                    });
                    this.$router.push('/status');
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
    computed: {
        getUserId() {
            return this.$store.getters.getUserData.username;
        },
        Language() {
            let ret = [];
            for (let i = 0; i < Language.Language.length; i++) {
                ret.push({id: i, language: Language.Language[i]});
            }
            return ret;
        },
    },
};
</script>