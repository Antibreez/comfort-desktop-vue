<template>
  <div class="formBlock">
    <form>
      <h2 class="formBlock__title">Вход по номеру телефона</h2>
      <p class="formBlock__desc">
        Мы отправили код подтверждения на номер {{ phone }}
      </p>
      <div>
        <div class="controls">
          <app-input
            label="Код подтверждения"
            inputType="password"
            :onInput="onInput"
            :hasErrorMessage="true"
          />
          <app-button
            :onClick="onClick"
            text="Войти"
            :disabled="password.trim() === '' || errorMessage.length > 0"
          ></app-button>

          <button
            class="controls__repeateBtn"
            @click.prevent="onRepeatClick"
            :disabled="!!codeTimer"
          >
            Получить код повторно
          </button>

          <span class="controls__repeateCodeValue" v-if="codeTimer">
            (через {{ codeTimer }} сек.)
          </span>
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
import codeCounter from '@/helpers/codeCounter'

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
      phone: state => state.auth.phone,
      codeTimer: state => state.auth.codeTimer,
    }),
  },
  methods: {
    ...mapMutations({
      changeError: mutationTypes.changeError,
    }),
    ...mapActions({
      phoneLogin: actionTypes.phoneLogin,
      entranceCheckPhone: actionTypes.entranceCheckPhone,
      codeTimerInit: actionTypes.codeTimerInit,
    }),
    onClick() {
      this.phoneLogin(this.password).then(() => {
        this.$router.push({name: 'Home'})
      })
    },
    onRepeatClick() {
      this.entranceCheckPhone(this.phone).then(() => {
        codeCounter.start()
        this.codeTimerInit()
      })
    },
    onInput(e) {
      this.password = e.target.value

      this.errorMessage && this.changeError('')
    },
  },
}
</script>
