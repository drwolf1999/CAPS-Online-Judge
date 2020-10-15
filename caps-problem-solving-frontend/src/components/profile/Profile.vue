<template>
    <v-row justify="center">
        <v-col cols="11" v-if="IsLoaded">
            <v-row>
                <v-col cols="4">
                    <v-card :loading="IsUpdating">
                        <v-list-item three-line>
                            <input v-if="IsLoginedUser" accept="image/*" type="file" style="display: none;" ref="profileImage" v-on:change="SetProfileImage"/>
                            <v-list-item-avatar
                                size="80"
                                color="white"
                                v-if="ProfileImage"
                            >
                                <v-img v-bind:src="`data:image/png;base64,` + ProfileImage"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-avatar
                                size="80"
                                color="grey"
                                v-else-if="!ModifyMod"
                            ></v-list-item-avatar>
                            <v-list-item-avatar size="80" color="grey" v-else @click="$refs.profileImage.click()"></v-list-item-avatar>
                            <v-list-item-content class="text-left">
                                <blockquote>
                                    <Username v-bind:username="Profile.username" v-bind:rank="Standing.rank"></Username>
                                </blockquote>
                                <v-list-item-title class="headline mb-1">{{ Profile.realName }}</v-list-item-title>
                                <v-list-item-subtitle v-if="!ModifyMod">{{ Profile.statusMessage }}</v-list-item-subtitle>
                                <v-list-item-subtitle v-else>
                                    <v-text-field :disabled="IsUpdating" v-model="Profile.statusMessage"></v-text-field>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-card-text>
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                    <tr>
                                        <th class="text-center">랭킹</th>
                                        <th class="text-center">포인트</th>
                                        <th class="text-center">정답 수</th>
                                        <th class="text-center">제출 수</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{{ Standing.rank + 1 }}</td>
                                        <td>{{ Standing.score }}</td>
                                        <td>{{ Standing.answers }}</td>
                                        <td>{{ Standing.submits }}</td>
                                    </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card-text>

                        <v-card-actions v-if="IsLoginedUser">
                            <v-spacer></v-spacer>
                            <Button v-bind:content="`프로필 수정`" v-bind:text-btn="true" v-if="!ModifyMod" v-on:click.native="SetModifyMod"></Button>
                            <Button v-bind:content="`수정 완료`" v-bind:text-btn="false" v-else v-on:click.native="UpdateProfile"></Button>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col cols="7">
                    <v-card>
                        <v-card-title>업적</v-card-title>
                        <v-card-text>
                            <v-row justify="start">
                                <v-col class="text-left">
                                    <v-skeleton-loader v-if="!Badge" type="chip"></v-skeleton-loader>
                                    <v-chip-group v-else-if="Badge.length > 0" column>
                                        <v-chip v-for="badge in Badge" color="#00E676" text-color="white">{{ badge.name }}</v-chip>
                                    </v-chip-group>
                                    <div v-else>업적이 없습니다.</div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-card>
                        <v-card-title>제출 기록</v-card-title>
                        <v-card-text>
                            <v-row justify="start">
                                <v-col class="text-left">
                                    <router-link
                                        :class="`pa-1 `"
                                        :style="GetMyResult(problem.number) !== -1 ? `color: ` + Result[GetMyResult(problem.number)].color : ``"
                                        v-for="problem in Standing.problems"
                                        :key="problem.number" :to="`/problem/view/` + problem.number"
                                    >{{ problem.number }}
                                    </router-link>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="11" v-else>
            <v-sheet :color="`lighten-4`" class="px-10 pt-10 pb-10">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-sheet>
        </v-col>
    </v-row>
</template>
<script>
import ProfileService from '@/service/profile';
import BadgeService from '@/service/badge';
import StandingService from '@/service/standing';
import Button from "@/components/form/Button";
import SubmitConstants from '@/helper/SubmitConstants';
import Username from "@/components/form/Username";

export default {
    name: 'Profile',
    components: {Button, Username},
    props: ['username'],
    mounted() {
        this.$store.dispatch('fetchStanding', this.$store.getters.getUserData.username);
        this.FetchProfile();
        this.FetchStanding();
        this.FetchProfileImage();
        this.FetchBadge();
    },
    data() {
        return {
            IsUpdating: false,
            ModifyMod: false,
            Profile: null,
            ProfileImage: null,
            Standing: null,
            Badge: [],
        };
    },
    computed: {
        IsLoginedUser() {
            if (this.Profile === null || this.$store.getters.getUserData === null || this.$store.getters.getUserData.username === null) return false;
            return this.$store.getters.getUserData.username === this.Profile.username;
        },
        IsLoaded() {
            return this.Profile !== null && this.Standing !== null;
        },
        Result() {
            return SubmitConstants.Result;
        },
        MyStanding() {
            return this.$store.getters.getStanding;
        }
    },
    methods: {
        GetMyResult(problemNumber) {
            if (problemNumber in this.MyStanding.problems) return this.MyStanding.problems[problemNumber];
            return -1;
        },
        SetProfileImage() {
            this.Profile.profileImage = this.$refs.profileImage.files[0];
        },
        SetModifyMod() {
            this.ModifyMod = true;
        },
        FetchProfile() {
            ProfileService.GetProfile(this.username)
                .then(response => {
                    this.Profile = response.data.Profile;
                })
                .catch(error => {
                });
        },
        FetchProfileImage() {
            ProfileService.ProfileImageUrl(this.username).then(response => {
                this.ProfileImage = response.data;
            });
        },
        FetchStanding() {
            StandingService.GetUser(this.username)
                .then(response => {
                    this.Standing = response.data.Standing;
                })
                .catch(() => {
                });
        },
        FetchBadge() {
            BadgeService.GetByUser(this.username)
                .then(response => {
                    this.Badge = response.data.Badge;
                })
                .catch(() => {
                });
        },
        UpdateProfile() {
            this.IsUpdating = true;
            let formData = new FormData();
            formData.append('image', this.Profile.profileImage);
            formData.append('statusMessage', this.Profile.statusMessage);
            formData.append('permission', this.Profile.permission);
            ProfileService.UpdateProfile(this.username, formData)
                .then(response => {
                    console.log(response.data.Profile);
                    this.Profile = response.data.Profile;
                    this.IsUpdating = false;
                    this.ModifyMod = false;
                    this.$notify({
                        text: '프로필 수정이 완료되었습니다.',
                        type: 'success',
                    });
                })
                .catch(error => {
                });
        },
    },
    watch: {
        username() {
            this.FetchProfile();
            this.FetchStanding();
            this.FetchProfileImage();
            this.FetchBadge();
        },
    }
};
</script>

<style>
.v-data-table
/deep/
tbody
/deep/
tr:hover:not(.v-data-table__expanded__content) {
    background: #ffffff !important;
}
</style>