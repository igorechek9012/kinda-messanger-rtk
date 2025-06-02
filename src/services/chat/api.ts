import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Chat } from './model'
import { BACKEND_URL } from '~/lib'
import { socket } from '~/services/socket'

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
    tagTypes: ['Chats'],
    endpoints: (build) => ({
        getChats: build.query<Chat[], string | void>({
            query: (username) => ({
                url: `chats`,
                method: 'GET',
                params: { username }
            }),
            providesTags: (result) =>
                result ? [...result.map(({ id }) => ({ type: 'Chats' as const, id })), 'Chats'] : ['Chats'],
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const handleNewChatEmit = (newChat: Chat) => {
                    updateCachedData((draft) => {
                        const newDraft = [...draft]
                        newDraft.push(newChat)
                        return newDraft
                    })
                }

                try {
                    await cacheDataLoaded

                    socket.on('newChat', handleNewChatEmit)
                } catch {
                    console.error('failed to update chats cache')
                }
                await cacheEntryRemoved
                socket.off('newChat', handleNewChatEmit)
            },
        }),
        createChat: build.mutation<Chat, Partial<Chat> & {sender: string}>({
            query: (newChat) => ({
                url: `chats`,
                method: 'POST',
                body: newChat,
            }),
            invalidatesTags: ['Chats'],
        }),
    }),
})

export const { useGetChatsQuery, useCreateChatMutation } = chatApi
