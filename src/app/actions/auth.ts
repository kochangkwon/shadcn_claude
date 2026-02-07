'use server'

import { z } from 'zod'
import { signIn } from 'next-auth/react'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

const signupSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

export type FormState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
  }
}

export async function loginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Parse and validate form data
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validated = loginSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: '입력값을 확인해주세요',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  // 2. Perform authentication
  try {
    // TODO: Implement actual authentication with NextAuth
    // const result = await signIn('credentials', {
    //   redirect: false,
    //   email: validated.data.email,
    //   password: validated.data.password,
    // })

    return {
      success: true,
      message: '로그인 성공',
    }
  } catch (error) {
    return {
      success: false,
      message: '로그인에 실패했습니다',
    }
  }
}

export async function signupUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Parse and validate form data
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validated = signupSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: '입력값을 확인해주세요',
      errors: validated.error.flatten().fieldErrors,
    }
  }

  // 2. Create user account
  try {
    // TODO: Implement actual user creation
    // This would typically involve:
    // - Hashing the password
    // - Creating user in database
    // - Sending verification email

    return {
      success: true,
      message: '회원가입 성공',
    }
  } catch (error) {
    return {
      success: false,
      message: '회원가입에 실패했습니다',
    }
  }
}
