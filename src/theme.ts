import { createTheme } from '@mui/material/styles'

export const themeModes = {
    light: 'light',
    dark: 'dark',
} as const

export type ThemeModesType = keyof typeof themeModes

export const getTheme = (mode: ThemeModesType) =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'dark'
                ? {
                      background: {
                          default: '#121212',
                          paper: '#1d1d1d',
                      },
                  }
                : {}),
        },
    })
