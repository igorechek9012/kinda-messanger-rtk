import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Notification, NotificationState } from '~/types'

const initialState: NotificationState = {
    current: null,
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action: PayloadAction<Notification | null>) => {
            state.current = action.payload
        },
    },
})

export const { setNotification } = notificationSlice.actions
export default notificationSlice.reducer