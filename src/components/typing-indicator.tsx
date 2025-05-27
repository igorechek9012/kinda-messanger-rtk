import { useEffect, useMemo, type FC } from 'react'
import { Typography } from '@mui/material'
import { useNotificationContext } from '~/hooks'
import { socket } from '~/services/socket'
import { useGetCurrentUser } from '~/services/user'
import { useParams } from 'react-router-dom'
import { useGetChatById } from '~/services/chat'

export const TypingIndicator: FC = () => {
    const { id: currentChatId } = useParams()
    const { chat: currentChat } = useGetChatById(currentChatId)

    const { currentUser } = useGetCurrentUser()
    const { typingUsers: allTypingUsers, addTypingUser, removeTypingUser } = useNotificationContext()

    const typingUsers = useMemo(
        () =>
            allTypingUsers
                .filter((user) => currentChat?.users.includes(user))
                .filter((user) => user !== currentUser?.name),
        [allTypingUsers, currentUser, currentChat],
    )

    useEffect(() => {
        socket.on('typing', addTypingUser)
        socket.on('stopTyping', removeTypingUser)

        return () => {
            socket.off('typing', addTypingUser)
            socket.off('stopTyping', removeTypingUser)
        }
    }, [addTypingUser, removeTypingUser])

    return (
        typingUsers.length > 0 && (
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'печатает...' : 'печатают...'}
            </Typography>
        )
    )
}
