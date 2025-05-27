import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, NotificationProvider, WebSocketProvider } from '~/hooks'
import { ChatPage, LoginPage } from '~/pages'

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <NotificationProvider>
                <Outlet />
            </NotificationProvider>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="chat" />,
            },
            {
                path: 'chat',
                element: (
                    <AuthProvider>
                        <WebSocketProvider>
                            <Outlet />
                        </WebSocketProvider>
                    </AuthProvider>
                ),
                children: [
                    {
                        index: true,
                        element: <ChatPage />,
                    },
                    {
                        path: ':id',
                        element: <ChatPage />,
                    },
                ],
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    },
])
