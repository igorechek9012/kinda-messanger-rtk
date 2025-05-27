import { type FC, useMemo } from 'react'
import { Avatar, Badge, Box, Skeleton, Tooltip, Typography } from '@mui/material'
import { useNotificationContext } from '~/hooks'
import MarkunreadIcon from '@mui/icons-material/Markunread'
import { useGetCurrentUser, useGetUsersQuery, type User } from '~/services/user'
import type { Chat } from '~/services/chat'
import type { Message } from '~/services/message'

type PropTypes = {
    chat: Chat
}

export const ChatBadge: FC<PropTypes> = ({ chat }: PropTypes) => {
    const { unreadChats, typingUsers } = useNotificationContext()

    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery()
    const { currentUser, isLoading: isLoadingCurrentUser } = useGetCurrentUser()

    const isLoading = isLoadingUsers || isLoadingCurrentUser

    const chatIsUnread = useMemo<boolean>(() => {
        return unreadChats.some((chatId) => chatId === chat.id)
    }, [unreadChats, chat.id])

    const respondent = useMemo<string | null>(() => {
        if (!chat.users) return null

        const user = chat.users.find((username) => username !== currentUser?.name)
        return user ?? null
    }, [chat, currentUser])

    const lastMessage = useMemo<Message | null>(() => {
        if (!chat.messages) return null

        const sortedMessages = [...chat.messages].sort((a, b) => b.timestamp - a.timestamp)
        return sortedMessages[0] ?? null
    }, [chat.messages])

    const respondentUser = useMemo<User | null>(() => {
        if (!respondent) return null

        return users?.find((user) => user.name === respondent) ?? null
    }, [respondent, users])

    const respondentIsTyping = useMemo<boolean>(
        () => typingUsers.some((u) => u === respondent),
        [respondent, typingUsers],
    )

    const avatarComponent = <Avatar>{respondent?.at(0)?.toUpperCase()}</Avatar>

    const chatInner = (
        <Box display={'flex'} alignItems={'center'}>
            <Typography fontSize={'15px'}>{respondent ?? 'Чат с неизвестным пользователем'}</Typography>
            {respondentUser && (
                <Box
                    marginLeft={'5px'}
                    width={'10px'}
                    height={'10px'}
                    borderRadius={'50%'}
                    sx={{ backgroundColor: respondentUser.isOnline ? 'green' : 'gray' }}
                />
            )}
        </Box>
    )

    return (
        <Badge
            badgeContent={
                <Tooltip title={'Новые сообщения в этом чате'}>
                    <MarkunreadIcon sx={{ position: 'relative', top: '15px', color: 'primary.main' }} />
                </Tooltip>
            }
            sx={{ width: '90%' }}
            invisible={!chatIsUnread}
        >
            <Box display={'flex'} width={'100%'} padding={'5px 10px'}>
                {isLoading ? <Skeleton variant="circular">avatarComponent</Skeleton> : avatarComponent}
                <Box display={'flex'} flexDirection={'column'} pl={'10px'}>
                    {isLoading ? <Skeleton variant="text">chatInner</Skeleton> : chatInner}
                    <Typography fontSize={'12px'} noWrap maxWidth={'220px'}>
                        {respondentIsTyping ? 'печатает...' : (lastMessage?.text ?? 'Сообщений еще не было')}
                    </Typography>
                </Box>
            </Box>
        </Badge>
    )
}
