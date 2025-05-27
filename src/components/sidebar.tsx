import { type FC, type ReactNode, useState } from 'react'
import { Box, List, ListItem, Typography } from '@mui/material'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { UserBadge, UserStatus, ChatBadge, LoadingSpinner } from '~/components'
import { useGetCurrentUser, type User } from '~/services/user'
import { useParams } from 'react-router-dom'
import type { Chat } from '~/services/chat'

interface TabPanelProps {
    children?: ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

type SidebarProps = {
    chats: Chat[]
    users: User[]
    isLoading?: boolean
    onSelectChat?: (id: string) => void
    onSelectUser?: (id: string) => void
}

export const Sidebar: FC<SidebarProps> = ({ chats, users, isLoading = false, onSelectChat, onSelectUser }) => {
    const { id: currentChatId } = useParams()

    const [activeTabIndex, setActiveTabIndex] = useState<number>(0)
    const { currentUser } = useGetCurrentUser()

    return (
        <Box
            width={'300px'}
            bgcolor={'background.paper'}
            height={'100vh'}
            borderRight={'2px solid'}
            borderColor={'divider'}
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <Box width={'100%'} height={'calc(100% - 60px)'} overflow={'auto'}>
                        <Tabs
                            value={activeTabIndex}
                            onChange={(_, index) => setActiveTabIndex(index)}
                            aria-label="chat-tabs"
                            sx={{ width: '100%' }}
                        >
                            <Tab
                                label="Чаты"
                                sx={{
                                    width: '40%',
                                    ':focus': {
                                        outline: 'none',
                                    },
                                }}
                            />
                            <Tab
                                label="Пользователи"
                                sx={{
                                    width: '60%',
                                    ':focus': {
                                        outline: 'none',
                                    },
                                }}
                            />
                        </Tabs>
                        <TabPanel value={activeTabIndex} index={0}>
                            <List>
                                {chats.map((chat) => (
                                    <ListItem
                                        key={chat.id}
                                        onClick={() => onSelectChat && onSelectChat(chat.id)}
                                        sx={{
                                            padding: '10px 5px',
                                            backgroundColor:
                                                chat.id === currentChatId ? 'action.selected' : 'background.paper',
                                            ':hover': {
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <ChatBadge chat={chat} />
                                    </ListItem>
                                ))}
                            </List>
                        </TabPanel>
                        <TabPanel value={activeTabIndex} index={1}>
                            <Typography fontSize={'12px'} color={'textSecondary'} paddingTop={'10px'}>
                                Выбери пользователя чтобы начать общение
                            </Typography>
                            <List>
                                {users
                                    .filter((user) => user.name !== currentUser?.name)
                                    .map((user) => (
                                        <ListItem
                                            key={user.name}
                                            onClick={() => {
                                                setActiveTabIndex(0)
                                                if (onSelectUser) onSelectUser(user.name)
                                            }}
                                            sx={{
                                                padding: '10px 5px',
                                                ':hover': {
                                                    cursor: 'pointer',
                                                },
                                            }}
                                        >
                                            <UserBadge user={user} />
                                        </ListItem>
                                    ))}
                            </List>
                        </TabPanel>
                    </Box>
                    <UserStatus />
                </>
            )}
        </Box>
    )
}
