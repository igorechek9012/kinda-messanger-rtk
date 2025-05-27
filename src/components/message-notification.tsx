import type { FC } from 'react'
import { Box, Typography } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import type { Message } from '~/services/message'

type PropTypes = {
    message: Message
    onMessageClick?: () => void
}

export const MessageNotification: FC<PropTypes> = ({ message, onMessageClick }: PropTypes) => {
    const { sender, text } = message

    const handleMessageClick = () => {
        if (onMessageClick) onMessageClick()
    }

    return (
        <Box
            display={'flex'}
            width={'300px'}
            alignItems={'center'}
            onClick={handleMessageClick}
            sx={{ ':hover': { cursor: 'pointer' } }}
        >
            <EmailIcon sx={{ height: '20px', width: '20px', color: 'primary.main' }} />
            <Box display={'flex'} flexDirection={'column'} ml={'20px'} width={'100%'}>
                <Typography fontSize={'12px'} textAlign={'start'}>
                    {sender}
                </Typography>
                <Typography fontSize={'15px'} noWrap maxWidth={'150px'} textAlign={'start'}>
                    {text}
                </Typography>
            </Box>
        </Box>
    )
}
