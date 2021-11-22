import firebase from '@/api/firebase'
import {setItem} from '@/helpers/persistanceStorage'
import validation from '@/helpers/validation'
import codeCounter from '@/helpers/codeCounter'

let confirmationResult

const state = {
  isLoading: false,
  stage: 'EntranceForm',
  errorMessage: '',
  email: null,
  userUid: null,
  phone: null,
  codeTimer: null,
}

export const mutationTypes = {
  entranceStart: '[auth] entranceStart',
  entranceNewEmail: '[auth] entranceNewEmail',
  entranceExistEmail: '[auth] entranceExistEmail',
  entrancePhone: '[auth] entrancePhone',
  entranceFailur: '[auth] entranceFailur',

  emailLoginStart: '[auth] emailLoginStart',
  emailLoginSuccess: '[auth] emailLoginSuccess',
  emailLoginFailur: '[auth] emailLoginFailur',
  emailForgotPassword: '[auth] emailForgotPassword',

  phoneLoginStart: '[auth] phoneLoginStart',
  phoneLoginSuccess: '[auth] phoneLoginSuccess',
  phoneLoginFailur: '[auth] phoneLoginFailur',

  emailRegistrationStart: '[auth] emailRegistrationStart',
  emailRegistrationSuccess: '[auth] emailRegistrationSuccess',
  emailRegistrationFailur: '[auth] emailRegistrationFailur',

  emailResetPasswordStart: '[auth] emailResetPasswordStart',
  emailResetPasswordSuccess: '[auth] emailResetPasswordSuccess',
  emailResetPasswordFailur: '[auth] emailResetPasswordFailur',

  changeError: '[auth] changeError',
  changeStage: '[auth] changeStage',
  setUserUid: '[auth] setUserUid',
  setCodeTimer: '[auth] setCodeTimer',
}

export const actionTypes = {
  entranceFindEmail: '[auth] entranceFindEmail',
  entranceCheckPhone: '[auth] entranceCheckPhone',
  emailLogin: '[auth] emailLogin',
  emailRegistration: '[auth] emailRegistration',
  emailResetPassword: '[auth] emailResetPassword',
  phoneLogin: '[auth] phoneLogin',
  codeTimerInit: '[auth] codeTimerInit',
}

const mutations = {
  //ENTRANCE
  [mutationTypes.entranceStart](state) {
    state.isLoading = true
  },
  [mutationTypes.entranceNewEmail](state, payload) {
    state.isLoading = false
    state.stage = 'RegistrationForm'
    state.email = payload
  },
  [mutationTypes.entranceExistEmail](state, payload) {
    state.isLoading = false
    state.stage = 'LoginForm'
    state.email = payload
  },
  [mutationTypes.entrancePhone](state, payload) {
    state.isLoading = false
    state.stage = 'PhoneCodeForm'
    state.phone = payload
  },
  [mutationTypes.entranceFailur](state) {
    state.isLoading = false
  },

  //EMAIL LOGIN
  [mutationTypes.emailLoginStart](state) {
    state.isLoading = true
  },
  [mutationTypes.emailLoginSuccess](state, payload) {
    state.isLoading = false
    state.userUid = payload
  },
  [mutationTypes.emailLoginFailur](state) {
    state.isLoading = false
  },
  [mutationTypes.emailForgotPassword](state) {
    state.stage = 'ForgotPasswordForm'
  },

  //EMAIL REGISTRATION
  [mutationTypes.emailRegistrationStart](state) {
    state.isLoading = true
  },
  [mutationTypes.emailRegistrationSuccess](state, payload) {
    state.isLoading = false
    state.userUid = payload
  },
  [mutationTypes.emailRegistrationFailur](state) {
    state.isLoading = false
  },

  //EMAIL PASSWORD RESET
  [mutationTypes.emailResetPasswordStart](state) {
    state.isLoading = true
  },
  [mutationTypes.emailResetPasswordSuccess](state) {
    state.isLoading = false
    state.stage = 'PasswordResetForm'
  },
  [mutationTypes.emailResetPasswordFailur](state) {
    state.isLoading = false
  },

  //PHONE LOGIN
  [mutationTypes.phoneLoginStart](state) {
    state.isLoading = true
  },
  [mutationTypes.phoneLoginSuccess](state, payload) {
    state.isLoading = false
    state.userUid = payload
  },
  [mutationTypes.phoneLoginFailur](state) {
    state.isLoading = false
  },

  [mutationTypes.changeError](state, payload) {
    state.errorMessage = payload
  },
  [mutationTypes.changeStage](state, payload) {
    state.stage = payload
  },
  [mutationTypes.setUserUid](state, payload) {
    state.userUid = payload
  },
  [mutationTypes.setCodeTimer](state, payload) {
    state.codeTimer = payload
  },
}

const actions = {
  [actionTypes.entranceFindEmail](context, email) {
    return new Promise(() => {
      context.commit(mutationTypes.entranceStart)

      // ПРОВЕРЯЕМ СУЩЕСТВУЕТ ЛИ ПОЛЬЗОВАТЕЛЬ. В ЗАВИСИМОСТИ ОТ РЕЗУЛЬАТА ПОЛУЧАЕМ СЛЕДУЮЩИЙ ЭТАП
      firebase.auth
        .fetchSignInMethodsForEmail(email)
        .then(response => {
          response.length > 0
            ? context.commit(mutationTypes.entranceExistEmail, email)
            : context.commit(mutationTypes.entranceNewEmail, email)
        })
        .catch(error => {
          context.commit(
            mutationTypes.changeError,
            firebase.getErrorMessage(error)
          )
          context.commit(mutationTypes.entranceFailur)
        })
    })
  },
  [actionTypes.emailLogin](context, {email, password}) {
    return new Promise(resolve => {
      context.commit(mutationTypes.emailLoginStart)

      firebase.auth
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          const uid = response.user.uid
          context.commit(mutationTypes.emailLoginSuccess)
          context.commit(mutationTypes.setUserUid, uid)
          setItem('userUid', uid)
          resolve()
        })
        .catch(error => {
          console.log(error.code)
          context.commit(
            mutationTypes.changeError,
            firebase.getErrorMessage(error)
          )
          context.commit(mutationTypes.emailLoginFailur)
        })
    })
  },
  [actionTypes.emailRegistration](context, {email, password}) {
    console.log(email, password)
    return new Promise(resolve => {
      context.commit(mutationTypes.emailRegistrationStart)

      firebase.auth
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          const uid = response.user.uid
          context.commit(mutationTypes.emailRegistrationSuccess)
          context.commit(mutationTypes.setUserUid, uid)
          setItem('userUid', uid)
          resolve()
        })
        .catch(error => {
          console.log(error)
          context.commit(
            mutationTypes.changeError,
            firebase.getErrorMessage(error)
          )
          context.commit(mutationTypes.emailRegistrationFailur)
        })
    })
  },
  [actionTypes.emailResetPassword](context, email) {
    return new Promise(() => {
      context.commit(mutationTypes.emailResetPasswordStart)

      firebase.auth
        .sendPasswordResetEmail(email)
        .then(() => {
          context.commit(mutationTypes.emailResetPasswordSuccess)
        })
        .catch(error => {
          console.log(error)
          context.commit(
            mutationTypes.changeError,
            firebase.getErrorMessage(error)
          )
          context.commit(mutationTypes.emailResetPasswordFailur)
        })
    })
  },
  [actionTypes.entranceCheckPhone](context, phone) {
    return new Promise(resolve => {
      context.commit(mutationTypes.entranceStart)

      const appVerifier = firebase.getRecaptcha()
      console.log(appVerifier)
      const properPhoneValue = validation.phone.getProperValue(phone)

      firebase.auth
        .signInWithPhoneNumber(properPhoneValue, appVerifier)
        .then(confRes => {
          console.log(confRes)
          confirmationResult = confRes
          context.commit(mutationTypes.entrancePhone, properPhoneValue)
          resolve()
        })
        .catch(error => {
          console.log(error)
          context.commit(
            mutationTypes.changeError,
            firebase.getErrorMessage(error)
          )
          context.commit(mutationTypes.entranceFailur)
        })
    })
  },
  [actionTypes.phoneLogin](context, code) {
    return new Promise(resolve => {
      context.commit(mutationTypes.phoneLoginStart)

      confirmationResult
        .confirm(code)
        .then(response => {
          const uid = response.user.uid
          context.commit(mutationTypes.phoneLoginSuccess)
          context.commit(mutationTypes.setUserUid, uid)
          setItem('userUid', uid)
          resolve()
        })
        .catch(error => {
          console.log(error)
          context.commit(
            mutationTypes.changeError,
            firebase.getErrorMessage(error)
          )
          context.commit(mutationTypes.phoneLoginFailur)
        })
    })
  },
  [actionTypes.codeTimerInit](context) {
    if (!codeCounter.get()) {
      return
    }

    context.commit(mutationTypes.setCodeTimer, codeCounter.get())

    codeCounter.timer = setInterval(() => {
      console.log('timer')
      let current = codeCounter.get()
      current--

      if (current < 0) {
        clearInterval(codeCounter.timer)
        codeCounter.remove()
        context.commit(mutationTypes.setCodeTimer, null)
      } else {
        context.commit(mutationTypes.setCodeTimer, current)
        codeCounter.set(current)
      }
    }, 1000)
  },
}

export default {
  state,
  mutations,
  actions,
}
