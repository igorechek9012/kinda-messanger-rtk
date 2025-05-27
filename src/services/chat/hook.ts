import type { Chat } from '~/services/chat/model.ts'
import { useGetChatsQuery } from '~/services/chat/api.ts'
import { useMemo } from 'react'
import { useGetMessagesQuery } from '~/services/message'
import { skipToken } from '@reduxjs/toolkit/query'

export const useGetChatById = (chatId?: string | number) => {
    const { data: chats, isLoading, isError } = useGetChatsQuery(chatId ? undefined : skipToken)

    const chat = useMemo<Chat | null>(() => {
        if (!chats || !chatId) return null

        return chats.find((chat) => chat.id === chatId) ?? null
    }, [chatId, chats])

    return { chat, isLoading, isError }
}

export const useGetChatWithMessages = (chatId?: string | number) => {
    const { chat, isLoading: isLoadingChat, isError: isErrorChat } = useGetChatById(chatId)
    const {
        data: messages,
        isLoading: isLoadingMessages,
        isError: isErrorMessages,
    } = useGetMessagesQuery(chatId ?? skipToken)

    const chatWithMessages = useMemo<Chat | null>(() => {
        if (!messages || !chat) return null

        const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp)

        return { ...chat, messages: sortedMessages }
    }, [chat, messages])

    const isLoading = isLoadingMessages || isLoadingChat
    const isError = isErrorChat || isErrorMessages

    return { chat: chatWithMessages, isLoading, isError }
}
