import {setItem, getItem, removeItem} from '@/helpers/persistanceStorage'

const COUNTER_MAX = 40
let timer

const start = () => {
  setItem('codeCounter', COUNTER_MAX)
}

const set = value => {
  setItem('codeCounter', value)
}

const get = () => {
  return +getItem('codeCounter')
}

const remove = () => {
  removeItem('codeCounter')
}

// const init = changeTimer => {
//   timer = setInterval(() => {
//     let current = +getItem('codeCounter')
//     if (current < 0) {
//       clearInterval(timer)
//       removeItem('codeCounter')
//       changeTimer(null)
//     }
//   }, 1000)
// }

export default {
  timer,
  start,
  set,
  get,
  remove,
}
