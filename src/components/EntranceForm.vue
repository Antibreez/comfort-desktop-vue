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
import codeCounter from '@/helpers/codeCounter'

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
      phone: state => state.auth.phone,
    }),
  },
  methods: {
    ...mapMutations({
      changeError: mutationTypes.changeError,
      entrancePhone: mutationTypes.entrancePhone,
    }),
    ...mapActions({
      entranceFindEmail: actionTypes.entranceFindEmail,
      entranceCheckPhone: actionTypes.entranceCheckPhone,
      codeTimerInit: actionTypes.codeTimerInit,
    }),
    onClick() {
      if (validation.email.isValid(this.entranceValue)) {
        this.entranceFindEmail(this.entranceValue)
      } else if (validation.phone.isValid(this.entranceValue)) {
        console.log(this.entranceValue, this.phone)

        if (!codeCounter.get()) {
          this.entranceCheckPhone(this.entranceValue).then(() => {
            codeCounter.start()
            this.codeTimerInit()
          })
        } else if (
          codeCounter.get() &&
          validation.phone.getProperValue(this.entranceValue) !== this.phone
        ) {
          this.entranceCheckPhone(this.entranceValue).then(() => {
            clearInterval(codeCounter.timer)
            codeCounter.start()
            this.codeTimerInit()
          })
        } else if (
          codeCounter.get() &&
          validation.phone.getProperValue(this.entranceValue) === this.phone
        ) {
          this.entrancePhone(this.entranceValue)
        }

        // this.entranceCheckPhone(this.entranceValue)

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
