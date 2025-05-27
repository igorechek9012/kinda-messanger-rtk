import { type FC, type PropsWithChildren } from 'react'
import type { useThemeReturn } from '~/services/auth'
import { AppThemeContext } from '../use-theme-context'

export const AppThemeProvider: FC<PropsWithChildren<useThemeReturn>> = (props: PropsWithChildren<useThemeReturn>) => {
    const { children, ...data } = props
    return <AppThemeContext.Provider value={data as useThemeReturn}>{children}</AppThemeContext.Provider>
}
