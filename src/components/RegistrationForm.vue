<template>
  <div class="formBlock">
    <form>
      <h2 class="formBlock__title">Регистрация через Email</h2>
      <p class="formBlock__desc">
        Введите пароль и подтверждение пароля для регистрации
      </p>
      <div>
        <div class="controls">
          <app-input
            label="Пароль"
            inputType="password"
            :onInput="onPasswordInput"
            :hasErrorMessage="false"
          />
          <app-input
            label="Подтверждение пароля"
            inputType="password"
            :onInput="onConfirmPasswordInput"
            :hasErrorMessage="true"
          />
          <app-button
            :onClick="onClick"
            text="Зарегистрироваться"
            :disabled="
              password.trim() === '' ||
              confirmPassword.trim() === '' ||
              errorMessage.length > 0
            "
          ></app-button>
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
      confirmPassword: '',
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
      emailRegistration: actionTypes.emailRegistration,
    }),
    onClick() {
      if (!validation.password.isMatch(this.password, this.confirmPassword)) {
        this.changeError(validation.password.notMatchMessage)
        return
      }

      if (!validation.password.isValid(this.password)) {
        this.changeError(validation.password.notValidMessage)
        return
      }
      this.emailRegistration({email: this.email, password: this.password}).then(
        () => {
          this.$router.push({name: 'Home'})
        }
      )
    },
    onPasswordInput(e) {
      this.password = e.target.value

      this.errorMessage && this.changeError('')
    },
    onConfirmPasswordInput(e) {
      this.confirmPassword = e.target.value

      this.errorMessage && this.changeError('')
    },
  },
}
</script>
