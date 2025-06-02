import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { type User } from './model'
import { BACKEND_URL } from '~/lib'
import { socket } from '~/services/socket'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUsers: build.query<User[], void>({
            query: () => `users`,
            providesTags: (result) =>
                result ? [...result.map(({ name }) => ({ type: 'Users' as const, name })), 'Users'] : ['Users'],
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const handleOnlineUsersEmit = (onlineUsers: string[]) => {
                    updateCachedData((draft) => {
                        const newUsers: User[] = onlineUsers.filter((username) => !draft.map(user => user.name).some(name => name === username)).map((username) => ({id: username, name: username, isOnline: true}))

                        return [...draft.map((user) => ({ ...user, isOnline: onlineUsers.includes(user.name) })), ...newUsers]
                    })
                }

                try {
                    await cacheDataLoaded

                    socket.on('onlineUsers', handleOnlineUsersEmit)
                } catch {
                    console.error('failed to update users cache')
                }
                await cacheEntryRemoved
                socket.off('onlineUsers', handleOnlineUsersEmit)
            },
        }),
    }),
})

export const { useGetUsersQuery } = usersApi
