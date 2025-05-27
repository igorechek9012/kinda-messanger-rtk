import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from '~/services/user'
import { authApi } from '~/services/auth'
import { chatApi } from '~/services/chat'
import { messageApi } from '~/services/message'

export const store = configureStore({
    reducer: {
        [messageApi.reducerPath]: messageApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            usersApi.middleware,
            authApi.middleware,
            chatApi.middleware,
            messageApi.middleware,
        ),
})
