<template>
  <div class="formBlock">
    <form>
      <img
        class="formBlock__icon"
        src="@/assets/images/app-icon.svg"
        alt="Daichi Comfort"
      />
      <h2 class="formBlock__title">Войдите или зарегистрируйтесь</h2>
      <p class="formBlock__desc">
        Укажите E-mail или номер телефона для входа в аккаунт или регистрации в
        приложении
      </p>
      <div>
        <div id="recaptcha-container"></div>
        <div class="controls">
          <app-input
            label="Email или номер телефона"
            inputType="text"
            :onInput="onInput"
            :hasErrorMessage="true"
          />
          <app-button :onClick="onClick" text="Продолжить"></app-button>
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
  name: 'EntranceControl',
  components: {
    appButton,
    appInput,
  },
  data() {
    return {
      entranceValue: '',
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
      entranceFindEmail: actionTypes.entranceFindEmail,
      entranceCheckPhone: actionTypes.entranceCheckPhone,
    }),
    onClick() {
      if (validation.email.isValid(this.entranceValue)) {
        this.entranceFindEmail(this.entranceValue)
      } else if (validation.phone.isValid(this.entranceValue)) {
        this.entranceCheckPhone(this.entranceValue)
        console.log('this is phone')
      } else {
        console.log('error')
        this.changeError(validation.entranceErrorMessage)
      }
    },
    onInput(e) {
      this.entranceValue = e.target.value

      this.errorMessage && this.changeError('')
    },
  },
}
</script>
