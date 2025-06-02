import { useState, useEffect, useRef, type FC, type ChangeEvent, type KeyboardEvent } from 'react'
import { TextField, Box, IconButton } from '@mui/material'
import { socket } from '~/services/socket'
import SendIcon from '@mui/icons-material/Send'
import { useGetCurrentUser } from '~/services/user'
import { useSendMessageMutation } from '~/services/message'
import { useParams } from 'react-router-dom'

export const MessageInput: FC = () => {
    const { id: currentChatId } = useParams()
    const [text, setText] = useState('')
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [sendMessage] = useSendMessageMutation()

    const { currentUser } = useGetCurrentUser()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (currentUser) {
            setText(e.target.value)

            sendTyping(currentUser.name, true)

            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current)
            }
            typingTimeout.current = setTimeout(() => {
                sendTyping(currentUser.name, false)
            }, 1000)
        }
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
        if (e.key === 'Enter') await handleSend()
    }

    const handleSend = async () => {
        if (text.trim() === '') return

        if (currentUser && currentChatId) {
            await sendMessage({ text, chatId: currentChatId, sender: currentUser.name })
                .unwrap()
                .then(() => {
                    sendTyping(currentUser.name, false)
                    setText('')
                })
        }
    }

    const sendTyping = (username: string, isTyping: boolean) => {
        if (isTyping) {
            socket.emit('typing', username)
        } else {
            socket.emit('stopTyping', username)
        }
    }

    useEffect(() => {
        return () => {
            if (currentUser) {
                sendTyping(currentUser.name, false)
            }
        }
    }, [currentUser])

    return (
        <Box display="flex" minHeight={'43px'}>
            <TextField
                sx={{ height: '20px', maxHeight: '20px' }}
                fullWidth
                size={'small'}
                variant="outlined"
                placeholder="Введите сообщение"
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <IconButton
                onClick={handleSend}
                color={'primary'}
                sx={{ border: '1px solid', borderRadius: 2, height: '40px', ml: '10px' }}
            >
                <SendIcon />
            </IconButton>
        </Box>
    )
}
