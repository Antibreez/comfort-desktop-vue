import firebase from '@/api/firebase'
import {setItem} from '@/helpers/persistanceStorage'
import validation from '@/helpers/validation'

let confirmationResult

const state = {
  isLoading: false,
  stage: 'EntranceForm',
  errorMessage: '',
  email: null,
  userUid: null,
  phone: null,
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

  phoneLoginStart: '[auth] phoneLoginStart',
  phoneLoginSuccess: '[auth] phoneLoginSuccess',
  phoneLoginFailur: '[auth] phoneLoginFailur',

  emailRegistrationStart: '[auth] emailRegistrationStart',
  emailRegistrationSuccess: '[auth] emailRegistrationSuccess',
  emailRegistrationFailur: '[auth] emailRegistrationFailur',

  changeError: '[auth] changeError',
  changeStage: '[auth] changeStage',
  setUserUid: '[auth] setUserUid',
}

export const actionTypes = {
  entranceFindEmail: '[auth] entranceFindEmail',
  entranceCheckPhone: '[auth] entranceCheckPhone',
  emailLogin: '[auth] emailLogin',
  emailRegistration: '[auth] emailRegistration',
  phoneLogin: '[auth] phoneLogin',
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
    state.errorMessage = 'Произошла ошибка запроса'
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

  [mutationTypes.changeError](state, payload) {
    state.errorMessage = payload
  },
  [mutationTypes.changeStage](state, payload) {
    state.stage = payload
  },
  [mutationTypes.setUserUid](state, payload) {
    state.userUid = payload
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
}

const actions = {
  [actionTypes.entranceFindEmail](context, email) {
    return new Promise(() => {
      context.commit(mutationTypes.entranceStart)

      // ПРОВЕРЯЕМ СУЩЕСТВУЕТ ЛИ ПОЛЬЗОВАТЕЛЬ. В ЗАВИСИМОСТИ ОТ РЕЗУЛЬАТА ПОЛУЧАЕМ СЛЕДУЮЩИЙ ЭТАП
      firebase
        .fetchSignInMethodsForEmail(email)
        .then(response => {
          response.length > 0
            ? context.commit(mutationTypes.entranceExistEmail, email)
            : context.commit(mutationTypes.entranceNewEmail, email)
        })
        .catch(() => {
          context.commit(mutationTypes.entranceFailur)
        })
    })
  },
  [actionTypes.emailLogin](context, {email, password}) {
    return new Promise(resolve => {
      context.commit(mutationTypes.emailLoginStart)

      firebase
        .signWithEmail(email, password)
        .then(response => {
          const uid = response.user.uid
          context.commit(mutationTypes.emailLoginSuccess)
          context.commit(mutationTypes.setUserUid, uid)
          setItem('userUid', uid)
          resolve()
        })
        .catch(error => {
          console.log(error)
          context.commit(mutationTypes.emailLoginFailur)
        })
    })
  },
  [actionTypes.emailRegistration](context, {email, password}) {
    console.log(email, password)
    return new Promise(resolve => {
      context.commit(mutationTypes.emailRegistrationStart)

      firebase
        .signUpWithEmail(email, password)
        .then(response => {
          const uid = response.user.uid
          context.commit(mutationTypes.emailRegistrationSuccess)
          context.commit(mutationTypes.setUserUid, uid)
          setItem('userUid', uid)
          resolve()
        })
        .catch(error => {
          console.log(error)
          context.commit(mutationTypes.emailRegistrationFailur)
        })
    })
  },
  [actionTypes.entranceCheckPhone](context, phone) {
    return new Promise(() => {
      context.commit(mutationTypes.entranceStart)

      const appVerifier = firebase.getRecaptcha()
      const properPhoneValue = validation.phone.getProperValue(phone)

      firebase.auth
        .signInWithPhoneNumber(properPhoneValue, appVerifier)
        .then(confRes => {
          console.log(confRes)
          confirmationResult = confRes
          context.commit(mutationTypes.entrancePhone)
        })
        .catch(error => {
          console.log(error)
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
          context.commit(mutationTypes.phoneLoginFailur)
        })
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
