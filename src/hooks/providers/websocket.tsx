import { type FC, type PropsWithChildren, useCallback, useEffect } from 'react'
import { socket } from '~/services/socket'
import { NotificationType } from '~/types'
import { useNotificationContext } from '~/hooks'
import { useParams } from 'react-router-dom'
import type { Message } from '~/services/message'
import { useGetChatsQuery } from '~/services/chat'

export const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
    const { id: currentChatId } = useParams()

    const currentUserName = localStorage.getItem('username')
    const { showNotification, markChatAsUnread } = useNotificationContext()

    const { refetch } = useGetChatsQuery()

    const handleNewMessage = useCallback(
        (message: Message) => {
            refetch()

            if (message.chatId !== currentChatId) {
                markChatAsUnread(message.chatId)
                if (!document.hidden) {
                    showNotification({ message, type: NotificationType.message })
                }
            }

            if (document.hidden) {
                if (Notification.permission === 'granted') {
                    new Notification(`Новое сообщение`, {
                        body: message.text,
                    })
                }
            }
        },
        [currentChatId, markChatAsUnread, showNotification, refetch],
    )

    useEffect(() => {
        socket.connect()
        socket.emit('join', { username: currentUserName })

        return () => {
            socket.disconnect()
        }
    }, [currentUserName])

    useEffect(() => {
        socket.on('newMessage', handleNewMessage)

        if (Notification.permission !== 'granted') {
            Notification.requestPermission()
        }

        return () => {
            socket.off('newMessage', handleNewMessage)
        }
    }, [handleNewMessage])

    return <>{children}</>
}
