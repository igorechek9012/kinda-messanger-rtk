import { type FC } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { themeModes } from '~/theme.ts'
import { UserBadge } from '~/components'
import LogoutIcon from '@mui/icons-material/Logout'
import { useLogout } from '~/services/auth'
import { useGetCurrentUser } from '~/services/user'
import { useAppThemeContext } from '~/hooks'

export const UserStatus: FC = () => {
    const { mode, setMode } = useAppThemeContext()
    const { currentUser } = useGetCurrentUser()
    const { logout } = useLogout()

    return (
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderTop={'1px solid'}
            borderColor={'divider'}
            height={'60px'}
        >
            {currentUser && (
                <Box display={'flex'}>
                    <UserBadge user={currentUser} avatarSizeInPx={30} />
                    <Tooltip title={'Выйти из аккаунта'}>
                        <IconButton onClick={() => logout()}>
                            <LogoutIcon sx={{ height: '20px', width: '20px' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            <Box display={'flex'} alignItems={'center'} paddingRight={'10px'}>
                <Typography fontSize={'14px'} color={'textSecondary'} mr={'5px'}>
                    Тема
                </Typography>
                <IconButton onClick={() => setMode(mode === themeModes.light ? themeModes.dark : themeModes.light)}>
                    {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>
        </Box>
    )
}
