import type { Message } from '~/services/message'

export type Chat = {
    id: string
    name: string
    users: string[]
    messages: Message[]
    unread?: boolean
}
