import { useState } from 'react'

export type useTypingUsersReturn = {
    typingUsers: string[]
    addTypingUser: (userName: string) => void
    removeTypingUser: (userName: string) => void
}

export const useTypingUsers = (): useTypingUsersReturn => {
    const [typingUsers, setTypingUsers] = useState<string[]>([])

    const addTypingUser = (userName: string) => {
        if (!typingUsers.includes(userName)) {
            setTypingUsers(([...users]) => [...users, userName])
        }
    }

    const removeTypingUser = (userName: string) => {
        setTypingUsers((users) => users.filter((u) => u !== userName))
    }

    return { typingUsers, addTypingUser, removeTypingUser }
}
