<template>
    <v-container>
        <v-form v-if="LoginMode">
            <v-card flat>
                <v-progress-linear indeterminate color="primary" v-if="sending"/>
                <v-card-title primary-title>로그인</v-card-title>

                <v-card-text>
                    <v-text-field label="아이디" v-model="Login.username" :rules="usernameRules" :disabled="sending"></v-text-field>
                    <v-text-field type="password" label="비밀번호" v-model="Login.password" :rules="passwordRules" :disabled="sending" v-on:keyup.enter="LoginUser"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-bind:content="`로그인`" v-bind:text="true" :disabled="sending" v-on:click.native="LoginUser"></Button>
                    <Button v-bind:content="`회원가입으로`" v-bind:text="true" v-on:click.native="Mode"></Button>
                </v-card-actions>
            </v-card>
        </v-form>
        <v-form v-else>
            <v-card flat>
                <v-progress-linear indeterminate color="primary" v-if="sending"/>
                <v-card-title>
                    <div class="md-title">회원가입</div>
                </v-card-title>

                <v-card-text>
                    <v-text-field label="아이디" v-model="Register.username" :disabled="sending"></v-text-field>
                    <v-text-field type="password" label="비밀번호" v-model="Register.password" :error="EqualPassword" :disabled="sending"></v-text-field>
                    <v-text-field type="password" label="비밀번호 확인" v-model="Register.passwordChecker" :error="EqualPassword" :disabled="sending"></v-text-field>
                    <v-text-field label="이름" v-model="Register.realName" :disabled="sending"></v-text-field>
                    <v-select label="기수" class="text-left" v-model="Register.grade" :items="Grade" item-text="text" item-value="value"></v-select>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-bind:content="`회원가입`" v-bind:text="true" :disabled="sending" v-on:click.native="RegisterUser"></Button>
                    <Button v-bind:content="`로그인으로`" v-bind:text="true" v-on:click.native="Mode"></Button>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script>
import Auth from '../../service/auth.js';
import Button from '../form/Button.vue';
import Utility from "@/helper/Utility";

export default {
    name: 'Auth',
    data: () => ({
        Login: {
            username: null,
            password: null,
        },
        Register: {
            username: null,
            password: null,
            passwordChecker: null,
            realName: '',
            grade: 1,
        },
        usernameRules: [
            v => !!v || 'username is required!',
            v => (v && 4 <= v.length && v.length <= 12) || 'username is too short or long!',
        ],
        passwordRules: [
            v => !!v || 'password is required!',
            v => (v && 4 <= v.length && v.length <= 12) || 'password is too short or long!',
        ],
        userSaved: false,
        sending: false,
        LoginMode: true,
    }),
    computed: {
        Grade() {
            const baseYear = 1986;
            const year = Utility.getNowDateTime().year;
            let ret = [];
            for (let i = 1; i <= year - baseYear; i++) {
                ret.push({
                    value: i,
                    text: i + ' 기',
                });
            }
            return ret;
        },
        EqualPassword() {
            if (this.Register.password === '') {
                return false;
            } else if (this.Register.passwordChecker === '') {
                return false;
            } else if (this.Register.password === this.Register.passwordChecker) {
                return false;
            }
            return true;
        },
    },
    methods: {
        IsEmpty(val) {
            return val === undefined || val === null || val === '';
        },
        Mode() {
            this.LoginMode = !this.LoginMode;
        },
        LoginUser() {
            if (this.IsEmpty(this.Login.username) || this.IsEmpty(this.Login.password)) {
                this.$notify({
                    title: '회원가입을 위한 정보가 부족합니다.',
                    text: '다시 확인해 주세요.',
                    type: 'warn',
                });
                return;
            }
            this.sending = true;
            this.$store.dispatch('LOGIN', {
                username: this.Login.username,
                password: this.Login.password,
            })
                .then(() => {
                    this.sending = false;
                    if (this.$store.getters.isLogined) {
                        this.$notify({
                            title: '로그인 성공!',
                            text: '로그인에 성공하였습니다.',
                            type: 'success',
                        });
                        this.$router.push(this.$store.getters.getNextDestination);
                    } else {
                        this.$notify({
                            title: '로그인 실패..',
                            text: '정보를 다시 입력해주세요',
                            type: 'error',
                        });
                    }
                })
                .catch(() => {
                    this.sending = false;
                    this.$notify({
                        title: '처리중 에러가 발생하였습니다.',
                        text: '문제가 발생한것 같습니다.',
                        type: 'error',
                    });
                });
        },
        RegisterUser() {
            if (this.IsEmpty(this.Register.username) || this.IsEmpty(this.Register.password) || this.IsEmpty(this.Register.realName)) {
                this.$notify({
                    title: '로그인을 위한 정보가 부족합니다.',
                    text: '다시 확인해 주세요.',
                    type: 'warn',
                });
                return;
            }
            if (this.Register.password !== this.Register.passwordChecker) {
                this.$notify({
                    title: '비밀번호가 틀립니다.',
                    text: '다시 확인해 주세요.',
                    type: 'warn',
                });
                return;
            }
            this.sending = true;
            // Instead of this timeout, here you can call your API
            Auth.DoRegister({
                username: this.Register.username,
                password: this.Register.password,
                realName: this.Register.realName,
                grade: this.Register.grade,
            })
                .then(() => {
                    this.sending = false;
                    this.LoginMode = true;
                    this.$notify({
                        title: '성공!',
                        text: '회원가입이 성공적으로 이루어졌습니다.',
                        type: 'success',
                    });
                })
                .catch(() => {
                    this.sending = false;
                    this.$notify({
                        title: '실패...',
                        text: '회원가입에 실패하였습니다.',
                        type: 'error',
                    });
                });
        },
    },
    components: {
        Button,
    },
};
</script>