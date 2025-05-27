import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Message } from './model'
import { BACKEND_URL } from '~/lib'
import { socket } from '~/services/socket'

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
    tagTypes: ['Messages'],
    endpoints: (build) => ({
        getMessages: build.query<Message[], string | number | undefined>({
            query: (chatId) => `messages${chatId ? `/${chatId}` : ''}`,
            providesTags: (result) =>
                result ? [...result.map(({ id }) => ({ type: 'Messages' as const, id })), 'Messages'] : ['Messages'],
            async onCacheEntryAdded(chatId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const handleNewMessageEmit = (newMessage: Message) => {
                    if (newMessage.chatId === chatId) {
                        updateCachedData((draft) => {
                            const newDraft = [...draft]
                            newDraft.push(newMessage)
                            return newDraft
                        })
                    }
                }

                try {
                    await cacheDataLoaded

                    socket.on('newMessage', handleNewMessageEmit)
                } catch {
                    console.error('failed to update users cache')
                }
                await cacheEntryRemoved
                socket.off('newMessage', handleNewMessageEmit)
            },
        }),
        sendMessage: build.mutation<Message, Partial<Message>>({
            query: (newMessage) => ({
                url: `messages`,
                method: 'POST',
                body: newMessage,
            }),
            invalidatesTags: ['Messages'],
        }),
    }),
})

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi
