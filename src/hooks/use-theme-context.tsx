import type { useThemeReturn } from '~/services/auth'
import { createContext, useContext } from 'react'

export const AppThemeContext = createContext<useThemeReturn | null>(null)

export const useAppThemeContext = (): useThemeReturn => useContext(AppThemeContext) as useThemeReturn
