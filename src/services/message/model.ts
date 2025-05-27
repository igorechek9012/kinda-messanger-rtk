export type Message = {
    id: string | number
    chatId: string
    sender: string
    text: string
    timestamp: number
    isSystem?: boolean
}
