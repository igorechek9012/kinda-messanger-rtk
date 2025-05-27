import { createContext, useContext } from 'react'
import type { useAppNotificationReturn } from '~/hooks/use-app-notification.tsx'

export const NotificationContext = createContext<useAppNotificationReturn | null>(null)

export const useNotificationContext = (): useAppNotificationReturn =>
    useContext(NotificationContext) as useAppNotificationReturn
