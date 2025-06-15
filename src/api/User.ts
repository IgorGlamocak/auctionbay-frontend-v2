import { apiRequest } from './Api'
import { apiRoutes } from '../constants/apiConstants'
import type {LoginUserFields} from '../hooks/react-hook-form/useLogin'
import type {UserType} from '../models/auth'
import type {RegisterUserFields} from '../hooks/react-hook-form/useRegister'
import axios from 'axios'
import Cookies from 'js-cookie'

const getJwtTokenFromCookie = () => {
    const jwtToken = Cookies.get('token')
    if (!jwtToken) {
        throw new Error('JWT token not found or expired')
    }
    return jwtToken
}

export const fetchMe = async () => {
    const jwtToken = getJwtTokenFromCookie()
    const response = await axios.get(apiRoutes.FETCH_ME, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const updateUser = async (userData: { first_name: string; last_name: string; email: string; }, userId: string) => {
    const jwtToken = getJwtTokenFromCookie()
    const url = `${process.env.REACT_APP_API_URL}/users/${userId}`

    try {
        const response = await axios.put(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error updating user:', error)
        throw new Error('Failed to update user. Please try again.')
    }
}

export const changePassword = async (userData: { oldPassword: string; newPassword: string; email: string; }) => {
    const jwtToken = getJwtTokenFromCookie()
    const url = `${process.env.REACT_APP_API_URL}${apiRoutes.CHANGE_PASSWORD}`

    try {
        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error updating password:', error)
        throw new Error('Failed to change password. Please try again.')
    }
}

export const login = async (data: LoginUserFields) =>
    apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const register = async (data: RegisterUserFields) =>
    apiRequest<RegisterUserFields, void>('post', apiRoutes.SIGNUP, data)

export const uploadAvatar = async (formData: FormData, userId: string) => {
    const jwtToken = getJwtTokenFromCookie()
    const url = `${process.env.REACT_APP_API_URL}${apiRoutes.UPLOAD_AVATAR_IMAGE}`

    try {
        const response = await axios.put(url, formData, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error uploading avatar:', error)
        throw new Error('Failed to upload avatar. Please try again.')
    }
}

export const getAvatar = async () =>
    apiRequest<undefined, void>('get', apiRoutes.GET_AVATAR_IMAGE)

export const refreshTokens = async () =>
    apiRequest<undefined, UserType>('get', apiRoutes.REFRESH_TOKENS)