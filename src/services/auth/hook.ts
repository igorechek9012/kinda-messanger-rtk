import { useAuthMutation } from '~/services/auth/api.ts'
import type { AuthResponse } from '~/services/auth/model.ts'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { themeModes, type ThemeModesType } from '~/theme.ts'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
    const [trigger, { isLoading, isError }] = useAuthMutation()

    const login = async (username: string, onSuccess?: (authData: AuthResponse) => void) => {
        return trigger(username)
            .unwrap()
            .then((response: AuthResponse) => {
                localStorage.setItem('token', response.token)
                localStorage.setItem('username', response.username)

                if (onSuccess) onSuccess(response)
            })
    }

    return { login, isLoading, isError }
}

export const useLogout = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')

        navigate('/login')
    }

    return { logout }
}

export type useThemeReturn = { mode: ThemeModesType; setMode: Dispatch<SetStateAction<ThemeModesType>> }

export const useTheme = (): useThemeReturn => {
    const [mode, setMode] = useState<ThemeModesType>(
        (localStorage.getItem('theme') as ThemeModesType) ?? themeModes.light,
    )

    useEffect(() => {
        localStorage.setItem('theme', mode)
    }, [mode])

    return { mode, setMode }
}
