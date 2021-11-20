<template>
  <div class="formBlock">
    <form>
      <h2 class="formBlock__title">Вход по номеру телефона</h2>
      <p class="formBlock__desc">Мы отправили код подтверждения на номер</p>
      <div>
        <div class="controls">
          <app-input
            label="Код подтверждения"
            inputType="password"
            :onInput="onInput"
            :hasErrorMessage="true"
          />
          <app-button :onClick="onClick" text="Войти"></app-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import appButton from '@/components/Button'
import appInput from '@/components/Input'
import {mapState, mapMutations, mapActions} from 'vuex'
import {mutationTypes, actionTypes} from '@/store/modules/auth'

export default {
  component: 'PhoneCondeForm',
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
    }),
  },
  methods: {
    ...mapMutations({
      changeError: mutationTypes.changeError,
    }),
    ...mapActions({
      phoneLogin: actionTypes.phoneLogin,
    }),
    onClick() {
      this.phoneLogin(this.password).then(() => {
        this.$router.push({name: 'Home'})
      })
    },
    onInput(e) {
      this.password = e.target.value

      this.errorMessage && this.changeError('')
    },
  },
}
</script>
