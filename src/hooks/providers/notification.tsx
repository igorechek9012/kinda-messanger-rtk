import { type FC, type PropsWithChildren, useCallback, useEffect } from 'react'
import { type SnackbarAction, type SnackbarKey, useSnackbar } from 'notistack'
import { NotificationType } from '~/types'
import { MessageNotification } from '~/components'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { AppNotificationProvider, useAppNotification } from '~/hooks'

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const { current, ...notificationProviderProps } = useAppNotification()

    const closeAction: SnackbarAction = useCallback(
        (key: SnackbarKey) => (
            <IconButton onClick={() => closeSnackbar(key)}>
                <CloseIcon sx={{ height: '15px', width: '15px', color: 'white', cursor: 'pointer' }} />
            </IconButton>
        ),
        [closeSnackbar],
    )

    useEffect(() => {
        if (current) {
            if (current.type === NotificationType.message) {
                enqueueSnackbar(current.message ? <MessageNotification message={current.message} /> : current.text, {
                    action: closeAction,
                })
            } else {
                enqueueSnackbar(current.text, { variant: current.type, action: closeAction })
            }
        } else {
            closeSnackbar()
        }
    }, [current, enqueueSnackbar, closeSnackbar, closeAction])

    return (
        <AppNotificationProvider current={current} {...notificationProviderProps}>
            {children}
        </AppNotificationProvider>
    )
}
