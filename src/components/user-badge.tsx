import type { FC } from 'react'
import type { User } from '~/services/user'
import { Avatar, Box, Typography } from '@mui/material'

type PropTypes = {
    user: User
    avatarSizeInPx?: number
}

export const UserBadge: FC<PropTypes> = ({ user, avatarSizeInPx }: PropTypes) => {
    return (
        <Box display={'flex'} width={'100%'} padding={'5px 10px'} alignItems={'center'}>
            <Avatar sx={{ ...(avatarSizeInPx ? { height: `${avatarSizeInPx}px`, width: `${avatarSizeInPx}px` } : {}) }}>
                {user.name[0].toUpperCase()}
            </Avatar>
            <Box display={'flex'} flexDirection={'column'} pl={'10px'}>
                <Typography fontSize={'15px'}>{user.name}</Typography>
                <Typography fontSize={'12px'} color={user.isOnline ? 'green' : 'gray'}>
                    {user.isOnline ? 'В сети' : 'Оффлайн'}
                </Typography>
            </Box>
        </Box>
    )
}
