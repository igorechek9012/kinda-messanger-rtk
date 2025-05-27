import type { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

export const AuthProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const isAuthenticated = !!localStorage.getItem('token')
    return isAuthenticated ? children : <Navigate to="/login" />
}
