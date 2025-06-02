import { type FC, useCallback } from 'react'
import { Typography, Box } from '@mui/material'
import { ChatWindow, Sidebar } from '~/components'
import { useGetCurrentUser, useGetUsersQuery } from '~/services/user'
import { useGetChatsQuery, type Chat, useCreateChatMutation } from '~/services/chat'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotificationContext } from '~/hooks'
import { skipToken } from '@reduxjs/toolkit/query'

export const ChatPage: FC = () => {
    const { id: currentChatId } = useParams()
    const navigate = useNavigate()


    const { currentUser } = useGetCurrentUser()

    const { data: chats, isLoading: chatsLoading } = useGetChatsQuery(currentUser?.name ?? skipToken)
    const [createChat, { isLoading: creatingChat }] = useCreateChatMutation()

    const { data: users, isLoading: usersLoading } = useGetUsersQuery()

    const { markChatAsRead } = useNotificationContext()

    const findChatWithUser = useCallback(
        (userId: string | number): Chat | null => {
            return (
                chats?.find(
                    (chat) =>
                        chat.users.some((username) => username === currentUser?.name) &&
                        chat.users.some((username) => username === String(userId)),
                ) ?? null
            )
        },
        [chats, currentUser?.name],
    )

    const handleUserSelect = async (userId: string | number) => {
        if (!currentUser) return
        if (currentUser?.name == userId) return

        const chat = findChatWithUser(userId)
        if (chat) {
            navigate(`/chat/${chat.id}`)
        } else {
            await createChat({ users: [String(userId), currentUser.name], sender: currentUser.name })
                .unwrap()
                .then((createdChat) => navigate(`/chat/${createdChat.id}`))
        }
    }

    return (
        <Box display={'flex'} width={'100%'} height={'100vh'}>
            <Sidebar
                isLoading={usersLoading || chatsLoading || creatingChat}
                chats={chats ?? []}
                users={users ?? []}
                onSelectChat={(id) => {
                    markChatAsRead(id)
                    navigate(`/chat/${id}`)
                }}
                onSelectUser={handleUserSelect}
            />
            {!currentChatId && (
                <Box width={'calc(100% - 350px)'} height={'100vh'} display={'flex'} alignItems={'center'}>
                    <Typography width={'100%'} textAlign={'center'}>
                        Выберите чат или пользователя
                    </Typography>
                </Box>
            )}
            <ChatWindow />
        </Box>
    )
}
