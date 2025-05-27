import type { FC, PropsWithChildren } from 'react'
import { getTheme } from '~/theme.ts'
import { ThemeProvider } from '@emotion/react'
import { useTheme } from '~/services/auth'
import { AppThemeProvider } from '~/hooks'

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const { mode, setMode } = useTheme()

    return (
        <ThemeProvider theme={getTheme(mode)}>
            <AppThemeProvider mode={mode} setMode={setMode}>
                {children}
            </AppThemeProvider>
        </ThemeProvider>
    )
}
