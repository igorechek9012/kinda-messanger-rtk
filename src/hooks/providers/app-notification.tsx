import type { FC, PropsWithChildren } from 'react'
import { NotificationContext, type useAppNotificationReturn } from '~/hooks'

export const AppNotificationProvider: FC<PropsWithChildren<useAppNotificationReturn>> = (
    props: PropsWithChildren<useAppNotificationReturn>,
) => {
    const { children, ...data } = props
    return (
        <NotificationContext.Provider value={data as useAppNotificationReturn}>{children}</NotificationContext.Provider>
    )
}
