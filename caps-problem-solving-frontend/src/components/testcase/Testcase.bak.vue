<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card :loading="isLoading" class="mx-auto">
                <v-toolbar class="grey lighten-2" flat dense>
                    <v-icon>mdi-folder</v-icon>
                    <v-toolbar-title>problem {{ problemNumber }} testcase</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <Button v-on:click.native="OpenSelector" class="grey lighten-2" v-bind:text-btn="true" v-bind:content="``" v-bind:icon="`mdi-file-document-multiple-outline`"></Button>
                    <input ref="uploader" multiple type="file" accept=".in, .out" class="d-none" @change="SelectFile">
                </v-toolbar>

                <v-row>
                    <v-col cols="3">
                        <v-card-text>
                            <v-treeview
                                :search="Filter"
                                :items="fileInfos"
                                class="text-left"
                                selected-color="indigo"
                                return-object
                                expand-icon="mdi-chevron-down"
                                on-icon="mdi-bookmark"
                                off-icon="mdi-bookmark-outline"
                                indeterminate-icon="mdi-bookmark-minus"
                            >
                                <template slot="label" slot-scope="{ item }">
                                    <a style="color: #2c3e50" @click="path = ('children' in item) ? item : path">{{ item.name }}</a>
                                </template>
                            </v-treeview>
                        </v-card-text>
                    </v-col>

                    <v-divider vertical></v-divider>

                    <v-col cols="8" class="text-left">
                        <v-card-text>
                            <div
                                v-if="fileInfos.length === 0"
                                key="title"
                                class="title font-weight-light grey--text pa-4 text-center"
                            >
                                Select your favorite breweries
                            </div>
                            <!--                            <v-scroll-x-transition group hide-on-leave>-->
                            <v-list two-line subheader>
                                <v-subheader inset>Folders</v-subheader>

                                <v-list-item
                                    v-for="fileInfo in GetDir"
                                    :key="fileInfo.name"
                                    @click="path = fileInfo"
                                >
                                    <v-list-item-avatar>
                                        <v-icon>{{ FileIcon(fileInfo) }}</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="fileInfo.name"></v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-divider inset></v-divider>

                                <v-subheader inset>Files</v-subheader>

                                <v-list-item
                                    v-for="fileInfo in GetFiles"
                                    :key="fileInfo.name"

                                >
                                    <!--                                    @click="ShowFile"-->
                                    <v-list-item-avatar>
                                        <v-icon>{{ FileIcon(fileInfo) }}</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="fileInfo.name"></v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn icon>
                                            <v-icon color="grey lighten-1">mdi-do-not-disturb</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>

                                <v-divider inset></v-divider>

                                <v-subheader inset>Upload Files</v-subheader>

                                {{ COUNTER }} / {{ UCOUNTER }}
                                <v-list-item
                                    v-for="(uploadFile, i) in uploadFiles"
                                    :key="i"
                                >
                                    {{ JSON.stringify(uploadFile) }}
                                    <v-list-item-avatar>
                                        <v-icon>mdi-file</v-icon>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="uploadFile.name"></v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <Button v-on:click="DeleteFileFromUploads(uploadFile)" v-bind:content="``" v-bind:icon="`mdi-do-not-disturb`"></Button>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>

                            <!--                            </v-scroll-x-transition>-->
                        </v-card-text>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn text @click="true">
                        Reset
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text" color="green darken-1" depressed @click="EnableUpload">
                        Upload
                        <v-icon right>mdi-cloud-upload</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import FileManager from "@/service/fileManager";
import Button from "@/components/form/Button";

export default {
    components: {Button},
    data() {
        return {
            isLoading: false,
            isUploading: false,
            currentFile: undefined,
            progress: 0,
            message: "",
            Filter: null,
            path: null,
            fileInfos: [{
                id: 1,
                name: 'root',
                children: [
                    {
                        id: 2,
                        name: 'child1',
                        children: [
                            {
                                id: 5,
                                name: 'child11',
                            },
                            {
                                id: 6,
                                name: 'child12',
                            },
                            {
                                id: 7,
                                name: 'child13',
                            },
                        ]
                    },
                    {
                        id: 3,
                        name: 'child2',
                    },
                    {
                        id: 4,
                        name: 'child3',
                    },
                ]
            }],
            uploadFiles: [],
            chunks: [],
            COUNTER: 0,
            UCOUNTER: 0,
        }
    },
    computed: {
        GetDir() {
            let path = this.path;
            if (this.path === undefined || this.path === null) path = this.fileInfos[0];
            if ('children' in path) return path.children.filter(f => 'children' in f);
            return [];
        },
        GetFiles() {
            let path = this.path;
            if (this.path === undefined || this.path === null) path = this.fileInfos[0];
            if ('children' in path) return path.children.filter(f => !('children' in f));
            return [];
        },
        formData() {
            let formData = new FormData;

            formData.set('is_last', this.chunks[0].length === 1);
            formData.set('file', this.chunks[0][0], `${this.uploadFiles[0].name}.part`);

            return formData;
        },
    },
    props: ['problemNumber'],
    methods: {
        EnableUpload() {
            this.isUploading = true;
            this.createChunks();
        },
        DoUpload() {
            if (this.chunks.length === 0) {
                this.$notify({
                    title: '경고!!!!',
                    text: '적어도 1개의 파일을 선택해주세요.',
                    type: 'warn',
                });
                return;
            }
            FileManager.Upload(this.problemNumber, this.formData, (event) => {
                this.progress = Math.round((100 * event.loaded) / event.total);
            })
                .then((response) => {
                    this.chunks[0].shift();
                    if (this.chunks[0].length === 0) {
                        this.chunks.shift();
                        this.uploadFiles.shift();
                    }
                    this.message = response.data.message;
                    if (this.chunks.length === 0) return FileManager.GetFiles();
                    this.UCOUNTER++;
                })
                .then((files) => {
                    this.fileInfos = files.data;
                })
                .catch();

        },
        SelectFile(event) {
            this.progress = 0;
            this.uploadFiles = Array.from(event.target.files);
        },
        FileIcon(F) {
            if ('children' in F) {
                return 'mdi-folder-network';
            }
            return 'mdi-file';
        },
        DeleteFileFromUploads(e) {
            this.uploadFiles = this.uploadFiles.filter(f => f !== e);
        },
        async createChunks() {
            let size = 2048;
            for (let f = 0; f < this.uploadFiles.length; f++) {
                let chunks = Math.ceil(this.uploadFiles[f].size / size);
                this.chunks.push([]);
                await console.log(this.uploadFiles[f].name + '&&' + this.uploadFiles[f].type + '**' + this.uploadFiles[f].size);
                for (let i = 0; i < chunks; i++) {
                    console.log(this.uploadFiles[f].size);
                    this.chunks[f].push(this.uploadFiles[f].slice(
                        i * size, Math.min(i * size + size, this.uploadFiles[f].size), 'text/plain'//this.uploadFiles[f].type
                    ));
                    this.COUNTER++;
                }
            }
        },
        OpenSelector() {
            this.$refs.uploader.click();
        },
    },
    mounted() {
        FileManager.GetFiles().then(response => {
            this.fileInfos = response.data;
        });
    },
    watch: {
        chunks(n, o) {
            if (n === o) return;
            if (!this.isUploading) return;
            if (n.length > 0) {
                this.DoUpload();
            }
        },
        progress(n, o) {
            if (n === o) return;
            if (n === 100) this.isUploading = false;
        }
    },
};
</script>