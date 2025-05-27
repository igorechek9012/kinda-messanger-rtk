import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Chat } from './model'
import { BACKEND_URL } from '~/lib'

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
    tagTypes: ['Chats'],
    endpoints: (build) => ({
        getChats: build.query<Chat[], void>({
            query: () => `chats`,
            providesTags: (result) =>
                result ? [...result.map(({ id }) => ({ type: 'Chats' as const, id })), 'Chats'] : ['Chats'],
        }),
        createChat: build.mutation<Chat, Partial<Chat>>({
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
