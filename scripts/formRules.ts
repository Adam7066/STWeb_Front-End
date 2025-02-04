import type { CustomValidator, FormProps } from 'tdesign-vue-next'

const passwordValidator: CustomValidator = (val) => {
  const hasUppercase = /[A-Z]/.test(val)
  const hasLowercase = /[a-z]/.test(val)
  const hasNumber = /\d/.test(val)
  const hasSpecialChar = /[!@#$%^&*()-_,.?":{}|<>]/.test(val)
  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar
}

export const userFormRules: FormProps['rules'] = {
  username: [
    { required: true, message: '此項必填', type: 'error', trigger: 'blur' },
    { min: 3, message: '長度太短', type: 'error', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '此項必填', type: 'error', trigger: 'blur' },
    { email: true, message: '格式錯誤', type: 'error', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '此項必填', type: 'error', trigger: 'blur' },
    { min: 12, message: '密碼過短', type: 'error', trigger: 'blur' },
    { max: 18, message: '密碼過長', type: 'error', trigger: 'blur' },
    { validator: passwordValidator, message: '格式錯誤', trigger: 'blur' },
  ],
}

export const memberFormRules: FormProps['rules'] = {
  name: [{ required: true, message: '此項必填', type: 'error', trigger: 'blur' }],
  description: [{ required: true, message: '此項必填', type: 'error', trigger: 'blur' }],
  urlGithub: [{ url: true, message: '格式錯誤', type: 'error', trigger: 'blur' }],
  urlBlog: [{ url: true, message: '格式錯誤', type: 'error', trigger: 'blur' }],
}