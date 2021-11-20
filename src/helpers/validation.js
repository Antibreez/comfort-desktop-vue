const REG_EXP = {
  email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, // eslint-disable-line
  phone: /^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/, // eslint-disable-line
}

const PASSWORD_MIN_LENGTH = 5

const isEmailValid = email => {
  return email.match(REG_EXP.email) !== null
}

const isPhoneValid = phone => {
  return phone.match(REG_EXP.phone) !== null
}

const isPasswordValid = password => {
  return password.length >= PASSWORD_MIN_LENGTH
}

const isPasswordMatch = (password1, password2) => {
  return password1 === password2
}

const getProperPhone = value => {
  let phone = value

  phone = phone
    .split('+')
    .join('')
    .split('-')
    .join('')
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split(' ')
    .join('')

  if (phone[0] == 8) {
    phone = '+7' + phone.slice(-phone.length + 1)
  } else {
    phone = '+' + phone
  }

  return phone
}

export default {
  password: {
    isValid: isPasswordValid,
    isMatch: isPasswordMatch,
    notMatchMessage: 'Пароли не совпадают',
    notValidMessage: `Пароль должен содержать не менее ${PASSWORD_MIN_LENGTH} знаков`,
  },
  email: {
    isValid: isEmailValid,
  },
  phone: {
    isValid: isPhoneValid,
    getProperValue: getProperPhone,
  },
  entranceErrorMessage: 'Некорректный формат адреса Email или номера телефона',
}
