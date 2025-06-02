import { isRejectedWithValue, type Middleware, type PayloadAction } from '@reduxjs/toolkit'
import { NotificationType } from '~/types'
import { setNotification } from '~/store'

type ErrorActionPayload = {
    data?: string
    originalStatus?: number
    error?: unknown
}

export const rtkQueryErrorLogger: Middleware = ({ dispatch}) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!
    if (isRejectedWithValue(action)) {
        const { payload } = action as PayloadAction<ErrorActionPayload>
        // const statusCode = payload?.originalStatus ?? 500
        const errorText = payload?.data ?? ''

        if (dispatch) {
            dispatch(setNotification({text: errorText, type: NotificationType.error}))
        }
    }

    return next(action)
}