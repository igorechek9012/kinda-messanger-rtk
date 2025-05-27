import { useState } from 'react'
import type { Notification } from '~/types'
import { useTypingUsers, type useTypingUsersReturn } from '~/hooks/use-typing-users.tsx'

export type useAppNotificationReturn = {
    current: Notification | null
    showNotification: (notification: Notification) => void
    hideNotification: () => void
    unreadChats: string[]
    markChatAsUnread: (chat: string) => void
    markChatAsRead: (chat: string) => void
} & useTypingUsersReturn

export const useAppNotification = (): useAppNotificationReturn => {
    const [current, setCurrent] = useState<Notification | null>(null)
    const [unreadChats, setUnreadChats] = useState<string[]>([])

    const typingUserProps = useTypingUsers()

    const markChatAsUnread = (chatId: string) => {
        setUnreadChats((chats) => [...chats, chatId])
    }

    const markChatAsRead = (chatId: string) => {
        setUnreadChats((chats) => chats.filter((id) => id !== chatId))
    }

    const showNotification = (notification: Notification) => {
        setCurrent(notification)
    }

    const hideNotification = () => {
        setCurrent(null)
    }

    return {
        current,
        showNotification,
        hideNotification,
        unreadChats,
        markChatAsUnread,
        markChatAsRead,
        ...typingUserProps,
    }
}
