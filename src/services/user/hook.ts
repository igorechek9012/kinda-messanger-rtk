import { useGetUsersQuery } from '~/services/user/api.ts'
import { useMemo } from 'react'

export const useGetCurrentUser = () => {
    const { data: users, isLoading, isError } = useGetUsersQuery()
    const currentUserName = localStorage.getItem('username')

    const currentUser = useMemo(
        () => users?.find((user) => user.name === currentUserName) ?? null,
        [currentUserName, users],
    )

    return { currentUser, isLoading, isError }
}
