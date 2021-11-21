import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const APP_API_KEY = process.env.VUE_APP_API_KEY

const firebaseConfig = {
  apiKey: APP_API_KEY,
  authDomain: 'daichi-comfort-b7429.firebaseapp.com',
  databaseURL: 'https://daichi-comfort-b7429-default-rtdb.firebaseio.com',
  projectId: 'daichi-comfort-b7429',
  storageBucket: 'daichi-comfort-b7429.appspot.com',
  messagingSenderId: '170712659704',
  appId: '1:170712659704:web:3275e5a3585e636797ad0d',
  measurementId: 'G-4L22161E8M',
}

const commonError = 'Произошла ошибка запроса'

const errorCodes = {
  'auth/invalid-email': 'Неправильный e-mail адрес',
  'auth/email-already-in-use': 'Этот e-mail адрес уже используется',
  'auth/user-disabled': 'Пользователь заблокирован',
  'auth/operation-not-allowed':
    'Этот e-mail адрес неактивен. Обратитесь к администратору',
  'auth/user-not-found': 'Пользователь не найден',
  'auth/wrong-password': 'Неверный пароль',
  'auth/weak-password': 'Введите более надежный пароль',
  'auth/invalid-verification-code': 'Неверный код',
}

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().settings.appVerificationDisabledForTesting = true

    this.auth = firebase.auth()
    this.database = firebase.database()

    // this.userUid = null
    // this.registrationErrorMessage = ''
    // this.loginErrorMessage = ''
  }

  getErrorMessage(error) {
    return errorCodes[error.code] || commonError
  }

  // setUserUid = uid => (this.userUid = uid)
  // getEmail = () => this.auth.currentUser.email

  // getRegistrationErrorMessage = () => {
  //   return this.registrationErrorMessage
  // }

  // getLoginErrorMessage = () => {
  //   return this.loginErrorMessage
  // }

  // signWithEmail = (email, password) =>
  //   this.auth.signInWithEmailAndPassword(email, password).catch(error => {
  //     this.loginErrorMessage = error.message
  //   })

  // signUpWithEmail = (email, password) =>
  //   this.auth.createUserWithEmailAndPassword(email, password).catch(error => {
  //     this.registrationErrorMessage = error.message
  //   })

  // fetchSignInMethodsForEmail = email => {
  //   return this.auth.fetchSignInMethodsForEmail(email)
  // }

  // getUserCardsRef = () => this.database.ref(`/cards/${this.userUid}`);

  //signOut = () => this.auth.signOut()

  getRecaptcha = () => {
    return new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {
        submitPhoneNumberAuth() // eslint-disable-line
      },
    })
  }
}

export default new Firebase()
