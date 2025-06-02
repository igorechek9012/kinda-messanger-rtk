import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from '~/services/user'
import { authApi } from '~/services/auth'
import { chatApi } from '~/services/chat'
import { messageApi } from '~/services/message'
import { rtkQueryErrorLogger } from '~/store/middlewares'
import notificationReducer from './slices/notification'

export const store = configureStore({
    reducer: {
        [messageApi.reducerPath]: messageApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        notifications: notificationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            usersApi.middleware,
            authApi.middleware,
            chatApi.middleware,
            messageApi.middleware,
            rtkQueryErrorLogger,
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
