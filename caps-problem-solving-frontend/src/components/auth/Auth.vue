<template>
    <v-container>
        <v-form v-if="LoginMode">
            <v-card flat>
                <v-progress-linear indeterminate color="primary" v-if="sending"/>
                <v-card-title primary-title>Login</v-card-title>

                <v-card-text>
                    <v-text-field label="username" v-model="Login.username" :rules="usernameRules" :disabled="sending"></v-text-field>
                    <v-text-field type="password" label="password" v-model="Login.password" :rules="passwordRules" :disabled="sending" v-on:keyup.enter="LoginUser"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-bind:content="`Login`" v-bind:text="true" :disabled="sending" v-on:click.native="LoginUser"></Button>
                    <Button v-bind:content="`RegisterMode`" v-bind:text="true" v-on:click.native="Mode"></Button>
                </v-card-actions>
            </v-card>
        </v-form>
        <v-form v-else>
            <v-card flat>
                <v-progress-linear indeterminate color="primary" v-if="sending"/>
                <v-card-title>
                    <div class="md-title">Register</div>
                </v-card-title>

                <v-card-text>
                    <v-text-field label="username" v-model="Register.username" :disabled="sending"></v-text-field>
                    <v-text-field type="password" label="password" v-model="Register.password" :disabled="sending" v-on:keyup.enter="RegisterUser"></v-text-field>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <Button v-bind:content="`Register`" v-bind:text="true" :disabled="sending" v-on:click.native="RegisterUser"></Button>
                    <Button v-bind:content="`LoginMode`" v-bind:text="true" v-on:click.native="Mode"></Button>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script>
import Auth from '../../service/auth.js';
import Button from '../form/Button.vue';

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
    methods: {
        Mode() {
            this.LoginMode = !this.LoginMode;
        },
        LoginUser() {
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
            this.sending = true;
            // Instead of this timeout, here you can call your API
            Auth.DoRegister({
                username: this.Register.username,
                password: this.Register.password,
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