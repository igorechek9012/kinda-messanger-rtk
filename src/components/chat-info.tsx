import { type FC, useMemo } from 'react'
import { Box, Skeleton } from '@mui/material'
import { UserBadge } from '~/components'
import { useGetCurrentUser, useGetUsersQuery, type User } from '~/services/user'
import { useParams } from 'react-router-dom'
import { useGetChatById } from '~/services/chat'

export const ChatInfo: FC = () => {
    const { id: currentChatId } = useParams()
    const { chat: currentChat } = useGetChatById(currentChatId)

    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery()
    const { currentUser, isLoading: isLoadingCurrentUser } = useGetCurrentUser()

    const isLoading = isLoadingUsers || isLoadingCurrentUser

    const opponentUser = useMemo<User | null>(() => {
        if (!currentUser || !currentChat) return null

        const opponentUsername = currentChat.users.filter((username) => username !== currentUser?.name)[0]
        return users?.find((user) => user.name === opponentUsername) ?? null
    }, [currentChat, currentUser, users])

    const avatarComponent = opponentUser && <UserBadge user={opponentUser} avatarSizeInPx={30} />

    return (
        <Box
            display={'flex'}
            width={'100%'}
            height={'48px'}
            maxHeight={'48px'}
            borderBottom={'1px solid'}
            borderColor={'divider'}
            paddingLeft={'10px'}
            alignItems={'center'}
        >
            {isLoading ? <Skeleton variant="circular">{avatarComponent}</Skeleton> : avatarComponent}
        </Box>
    )
}
