<template>
  <div class="formBlock">
    <form>
      <h2 class="formBlock__title">Вход через Email</h2>
      <p class="formBlock__desc">Введите пароль вашей учётной записи</p>
      <div>
        <div class="controls">
          <app-input
            label="Пароль"
            inputType="password"
            :onInput="onPasswordInput"
            :hasErrorMessage="true"
          />
          <app-button
            :onClick="onClick"
            text="Войти"
            :disabled="password.trim() === '' || errorMessage.length > 0"
          ></app-button>
          <button
            class="controls__repeateBtn"
            @click.prevent="onForgotPassword"
          >
            Забыли пароль?
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import validation from '@/helpers/validation'
import appButton from '@/components/Button'
import appInput from '@/components/Input'
import {mutationTypes, actionTypes} from '@/store/modules/auth'
import {mapActions, mapMutations, mapState} from 'vuex'

export default {
  name: 'RegistrationForm',
  components: {
    appButton,
    appInput,
  },
  data() {
    return {
      password: '',
    }
  },
  computed: {
    ...mapState({
      errorMessage: state => state.auth.errorMessage,
      email: state => state.auth.email,
    }),
  },
  methods: {
    ...mapMutations({
      changeError: mutationTypes.changeError,
    }),
    ...mapActions({
      emailLogin: actionTypes.emailLogin,
      emailResetPassword: actionTypes.emailResetPassword,
    }),
    onClick() {
      if (!validation.password.isValid(this.password)) {
        this.changeError(validation.password.notValidMessage)
        return
      }
      this.emailLogin({email: this.email, password: this.password}).then(() => {
        this.$router.push({name: 'Home'})
      })
    },
    onPasswordInput(e) {
      this.password = e.target.value

      this.errorMessage && this.changeError('')
    },
    onForgotPassword() {
      this.emailResetPassword(this.email)
    },
  },
}
</script>
