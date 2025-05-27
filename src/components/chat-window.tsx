import { useEffect, useRef, useState, type FC } from 'react'
import { Box, Fab } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { MessageItem, TypingIndicator, MessageInput, ChatInfo } from '~/components'
import { useParams } from 'react-router-dom'
import { useGetChatWithMessages } from '~/services/chat'

export const ChatWindow: FC = () => {
    const { id: currentChatId } = useParams()
    const { chat: currentChat } = useGetChatWithMessages(currentChatId)

    const scrollRef = useRef<HTMLDivElement | null>(null)
    const [showScroll, setShowScroll] = useState(false)

    const scrollToBottom = (behavior?: ScrollBehavior) => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: behavior ?? 'smooth' })
    }

    useEffect(() => {
        const container = scrollRef.current
        if (!container) return
        const handleScroll = () => {
            const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
            setShowScroll(!atBottom)
        }
        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [currentChat, setShowScroll])

    useEffect(() => {
        scrollToBottom('instant')
    }, [currentChat?.messages])

    return (
        currentChat && (
            <Box display="flex" flexDirection="column" height="100%" width={'calc(100% - 300px)'}>
                <ChatInfo />
                {currentChat.messages && (
                    <Box
                        flexGrow={1}
                        overflow="auto"
                        ref={scrollRef}
                        p={2}
                        flexDirection={'column-reverse'}
                        alignContent={'end'}
                    >
                        {currentChat.messages.map((msg) => (
                            <MessageItem key={msg.id} message={msg} />
                        ))}
                    </Box>
                )}
                <TypingIndicator />
                <Box p={1} borderTop="1px solid" borderColor={'divider'}>
                    <MessageInput />
                </Box>
                {showScroll && (
                    <Fab
                        size="small"
                        color="primary"
                        onClick={() => scrollToBottom()}
                        sx={{ position: 'fixed', bottom: 80, right: 20 }}
                    >
                        <ArrowDownwardIcon />
                    </Fab>
                )}
            </Box>
        )
    )
}
