<template>
    <v-row justify="center">
        <v-col cols="11">
            <v-card :loading="isLoading" class="mx-auto">
                <v-toolbar class="grey lighten-2" flat dense>
                    <v-icon>mdi-folder</v-icon>
                    <v-toolbar-title>problem {{ problemNumber }} testcase</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <Button v-on:click.native="SelectOrUploadFile" class="grey lighten-2" v-bind:text-btn="true" v-bind:content="``" v-bind:icon="`mdi-cloud-upload`"></Button>
                    <Button v-on:click.native="currentFile = null;" v-if=" currentFile !== undefined && currentFile !== null" x-small v-bind:text-btn="true">
                        reset
                    </Button>
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
                                open-on-click
                                selectable
                                return-object
                                expand-icon="mdi-chevron-down"
                                on-icon="mdi-bookmark"
                                off-icon="mdi-bookmark-outline"
                                indeterminate-icon="mdi-bookmark-minus"
                            >
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
                                    @click="ShowFile"
                                >
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
                            </v-list>

                            <!--                            </v-scroll-x-transition>-->
                        </v-card-text>
                    </v-col>
                </v-row>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-btn text @click="fileInfos = []">
                        Reset
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text" color="green darken-1" depressed>
                        Save
                        <v-icon right>mdi-content-save</v-icon>
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
    },
    props: ['problemNumber'],
    methods: {
        SelectOrUploadFile() {
            this.$refs.uploader.click();
        },
        DoUpload() {
            FileManager.Upload(this.problemNumber, this.currentFile, (event) => {
                this.progress = Math.round((100 * event.loaded) / event.total);
            })
                .then((response) => {
                    this.message = response.data.message;
                    return FileManager.GetFiles();
                })
                .then((files) => {
                    this.fileInfos = files.data;
                })
                .catch();
        },
        SelectFile(file) {
            this.progress = 0;
            this.currentFile = file;
        },
        FileIcon(F) {
            if ('children' in F) {
                return 'mdi-folder-network';
            }
            return 'mdi-file';
        },
    },
    mounted() {
        FileManager.GetFiles().then(response => {
            this.fileInfos = response.data;
        });
    }
};
</script>