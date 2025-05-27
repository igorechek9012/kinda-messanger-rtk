import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from '~/lib'
import type { AuthResponse } from '~/services/auth'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
    endpoints: (build) => ({
        auth: build.mutation<AuthResponse, string>({
            query: (username) => ({
                url: `login`,
                method: 'POST',
                body: { username },
            }),
        }),
    }),
})

export const { useAuthMutation } = authApi
