import type { Message } from '~/services/message'

export type NotificationState = {
    current: Notification | null
}

export type Notification = {
    text?: string
    message?: Message
    type?: NotificationTypes
}

export const NotificationType = {
    success: 'success',
    warning: 'warning',
    info: 'info',
    error: 'error',
    message: 'message',
} as const

export type NotificationTypes = keyof typeof NotificationType
