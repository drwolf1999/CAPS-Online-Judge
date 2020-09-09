<template>
    <MonacoEditor
            class="text-left"
            height="500"
            theme="vs-dark"
            :language="Language[language].langType.toLowerCase()"
            :value="code"
            :options="Options"
            @change="onCodeChange"
    ></MonacoEditor>
</template>

<script>
    import MonacoEditor from 'monaco-editor-vue';
    import LanguageConstants from "@/helper/Language";

    // use in component
    export default {
        components: {
            MonacoEditor,
        },
        data() {
            return {
                code: this.initialCode,
                options: {
                    vertical: 'hidden',
                    horizontal: 'hidden',
                    scrollBeyondLastLine: 0,
                    alwaysConsumeMouseWheel: false,
                    handleMouseWheel: false,
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                },
            }
        },
        props: {
            initialCode: {
                type: String,
                default: '',
            },
            language: {
                type: Number,
                default: 0,
            },
            addOption: {
                type: Object,
                default: null,
            },
        },
        methods: {
            onCodeChange(value) {
                if (this.Options.readOnly !== undefined && this.Options.readOnly !== null && this.Options.readOnly === true) return;
                this.$emit('input', value);
            },
        },
        computed: {
            Language() {
                console.log(LanguageConstants.Language[this.language].langType);
                return LanguageConstants.Language;
            },
            Options() {
                let ret = this.options;
                for (let key in this.addOption) {
                    ret[key] = this.addOption[key];
                }
                return ret;
            }
        },
    };
</script>